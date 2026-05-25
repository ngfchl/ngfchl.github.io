---
title: 02. 安装教程
description:
published: true
date: 2025-12-01T04:41:00.192Z
tags: [ 安装, ]
editor: markdown
dateCreated: 2024-09-29T14:32:58.877Z
---

# 安装教程

> 鉴于原Harvest项目Docker内存占用较大，现已经使用go重新实现了Docker服务端，特此更新教程

#### docker-compose非常方便，目前各大NAS系统均已支持使用docker-compose的方式部署，本项目也不再提供手动创建容器的教程，太繁琐
> 安装教程以群晖为例，但是各家均大差不差，参照群晖的配置安装即可
>
> <font color=orange size=3>推荐使用 docker-compose 【项目（群晖）】【Compose（飞牛）】方式安装</font>
>
> 常用 Docker 镜像源地址：

```json
{
  "registry-mirrors": [
    "https://docker.xuanyuan.me",
    "https://docker.1ms.run",
    "https://dockerhub.icu",
    "https://hub.rat.dev",
    "https://docker.wanpeng.top",
    "https://doublezonline.cloud",
    "https://docker.mrxn.net",
    "https://docker.anyhub.us.kg",
    "https://dislabaiot.xyz",
    "https://docker.fxxk.dedyn.io",
    "https://docker-mirror.aigc2d.com",
    "https://dockerproxy.net",
    "https://docker.kejilion.pro",
    "https://docker.1panel.live"
  ]
}
```

# Go Harvest 使用文档

本文档基于当前 Go Harvest 代码中的功能整理，适合用于部署、初始化、日常使用和故障排查。

## 1. 项目简介

Go Harvest 是 Harvest 的 GoFrame 重写版本，面向 PT 站点管理、签到、数据抓取、种子搜索、下载器管理、辅种、通知和自动化任务。

当前主要功能：

- WebUI 页面和 REST API。
- SQLite / PostgreSQL 初始化。
- 用户登录、JWT 鉴权、Swagger UI。
- 我的站点管理、站点配置管理、站点数据抓取、签到、搜索。
- qBittorrent / Transmission 下载器管理和种子控制。
- 种子推送、批量推送、辅种、种子迁移。
- 计划任务、手动任务、任务结果记录。
- 通知推送和消息历史。
- TMDB / 豆瓣查询。
- 旧版数据导入、数据备份导入导出。
- 主程序、站点配置、WebUI 更新。
- 服务器状态、服务状态、实时日志。

## 2. 推荐部署方式

推荐使用 Compose 部署，镜像内包含：

- Go Harvest 主程序。
- Redis，可在未配置外置 Redis 时由容器内部启动。
- 内置站点配置和 WebUI 静态文件。

### 2.1 SQLite 单容器部署

SQLite 是最简单的部署方式，只需要一个 Go Harvest 容器。可通过同目录下的 `.env` 覆盖端口、时区、并发、Redis 等配置。

当前 `docker-compose.yml`：

```yaml
services:
  harvest:
    image: newptools/go-harvest:latest
    container_name: go-harvest
    restart: unless-stopped
    env_file:
      - path: ./.env
        required: false
    environment:
      TZ: ${TZ:-Asia/Shanghai}
      LOGGER_LEVEL: ${LOGGER_LEVEL:-info}
      GO_WEB_PORT: ${GO_WEB_PORT:-5173}
      # CACHE_REDIS_CONNECTION留空时使用容器内置 Redis，与REDIS_SERVER_PORT互斥，这两个只需要设置一个；外置 Redis 示例：redis://192.168.123.5:6379/15
      CACHE_REDIS_CONNECTION: ${CACHE_REDIS_CONNECTION:-}
      REDIS_SERVER_PORT: ${REDIS_SERVER_PORT:-6379}
    ports:
      - "${WEBUI_PORT:-5173}:${GO_WEB_PORT:-5173}"
    volumes:
      - ./db:/app/db
      - ./sites:/app/sites
      - ./downloads:/downloads
      - ./downloaders:/downloaders
    healthcheck:
      test: [ "CMD-SHELL", "curl -fsS http://127.0.0.1:${GO_WEB_PORT:-8000}/api.json >/dev/null" ]
      interval: 20s
      timeout: 5s
      retries: 10
      start_period: 30s
```

`.env` 示例：

```env
TZ=Asia/Shanghai
LOGGER_LEVEL=info

# 宿主机访问端口和容器内服务端口。

GO_WEB_PORT=5173

# 资源和并发控制。
HARVEST_MEMORY_LIMIT=
HARVEST_GOGC=80
HARVEST_SITE_TASK_CONCURRENCY=5
HARVEST_DOWNLOADER_TASK_CONCURRENCY=2
HARVEST_DOWNLOADER_STATUS_CONCURRENCY=3
HARVEST_WS_STATUS_CONCURRENCY=3
HARVEST_PUSH_DOWNLOAD_CONCURRENCY=2
HARVEST_DB_LOG_RETENTION_DAYS=15

# 缓存。留空使用容器内置 Redis。
CACHE_REDIS_CONNECTION=
REDIS_SERVER_PORT=6379
REDIS_MAXMEMORY=128mb
REDIS_MAXMEMORY_POLICY=allkeys-lru
```

建议保留 `.env` 中的 `GO_WEB_PORT=5173`。当前 Compose 的端口映射和健康检查都会读取 `GO_WEB_PORT`，显式设置后可以避免健康检查使用旧的 `8000` 默认值。

启动：

```bash
mkdir -p db sites downloads downloaders
docker compose up -d
```

Compose 会自动读取当前目录下的 `.env`。如果 `.env` 不在当前目录，可以显式指定：

```bash
docker compose --env-file /path/to/.env up -d
```

默认访问地址：

- WebUI: `http://127.0.0.1:5173`
- 初始化页面: `http://127.0.0.1:5173/setup`
- Swagger UI: `http://127.0.0.1:5173/swagger`
- OpenAPI JSON: `http://127.0.0.1:5173/api.json`

默认挂载目录：

- `./db:/app/db`，配置、数据库、日志、媒体文件。
- `./sites:/app/sites`，用户自定义站点配置。
- `./downloads:/downloads`，下载目录。
- `./downloaders:/downloaders`，下载器相关目录。

SQLite 数据库初始化时固定使用：

```text
/app/db/data.sqlite3
```

### 2.2 PostgreSQL 部署

如果希望使用 PostgreSQL，可以在当前单容器 Compose 基础上增加 PostgreSQL 服务。示例：

```yaml
services:
  go-harvest-postgres:
    image: postgres:17-alpine
    container_name: go-harvest-postgres
    restart: unless-stopped
    environment:
      TZ: ${TZ:-Asia/Shanghai}
      POSTGRES_DB: ${POSTGRES_DB:-goharvest}
      POSTGRES_USER: ${POSTGRES_USER:-goharvest}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-goharvest}
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \"$${POSTGRES_USER}\" -d \"$${POSTGRES_DB}\""]
      interval: 2s
      timeout: 3s
      retries: 30
      start_period: 2s

  harvest:
    image: newptools/go-harvest:latest
    container_name: go-harvest
    restart: unless-stopped
    depends_on:
      go-harvest-postgres:
        condition: service_healthy
    env_file:
      - path: ./.env
        required: false
    environment:
      TZ: ${TZ:-Asia/Shanghai}
      LOGGER_LEVEL: ${LOGGER_LEVEL:-info}
      GO_WEB_PORT: ${GO_WEB_PORT:-5173}
      HARVEST_MEMORY_LIMIT: ${HARVEST_MEMORY_LIMIT:-}
      HARVEST_GOGC: ${HARVEST_GOGC:-80}
      HARVEST_SITE_TASK_CONCURRENCY: ${HARVEST_SITE_TASK_CONCURRENCY:-5}
      HARVEST_DOWNLOADER_TASK_CONCURRENCY: ${HARVEST_DOWNLOADER_TASK_CONCURRENCY:-2}
      HARVEST_DOWNLOADER_STATUS_CONCURRENCY: ${HARVEST_DOWNLOADER_STATUS_CONCURRENCY:-3}
      HARVEST_WS_STATUS_CONCURRENCY: ${HARVEST_WS_STATUS_CONCURRENCY:-3}
      HARVEST_PUSH_DOWNLOAD_CONCURRENCY: ${HARVEST_PUSH_DOWNLOAD_CONCURRENCY:-2}
      HARVEST_DB_LOG_RETENTION_DAYS: ${HARVEST_DB_LOG_RETENTION_DAYS:-15}
      CACHE_REDIS_CONNECTION: ${CACHE_REDIS_CONNECTION:-}
      REDIS_SERVER_PORT: ${REDIS_SERVER_PORT:-6379}
      REDIS_MAXMEMORY: ${REDIS_MAXMEMORY:-128mb}
      REDIS_MAXMEMORY_POLICY: ${REDIS_MAXMEMORY_POLICY:-allkeys-lru}
    ports:
      - "${WEBUI_PORT:-5173}:${GO_WEB_PORT:-5173}"
    volumes:
      - ./db:/app/db
      - ./sites:/app/sites
      - ./downloads:/downloads
      - ./downloaders:/downloaders
    healthcheck:
      test: [ "CMD-SHELL", "curl -fsS http://127.0.0.1:${GO_WEB_PORT:-5173}/api.json >/dev/null" ]
      interval: 20s
      timeout: 5s
      retries: 10
      start_period: 30s
```

PostgreSQL `.env` 示例可在 SQLite `.env` 基础上追加：

```env
POSTGRES_HOST=go-harvest-postgres
POSTGRES_DB=goharvest
POSTGRES_USER=goharvest
POSTGRES_PASSWORD=change-me
POSTGRES_PORT=5432
```

启动：

```bash
mkdir -p db sites downloads downloaders postgres-data
docker compose up -d
```

如果使用自定义 `.env` 路径：

```bash
docker compose --env-file /path/to/.env up -d
```

默认 PostgreSQL 环境变量：

```env
POSTGRES_HOST=go-harvest-postgres
POSTGRES_DB=goharvest
POSTGRES_USER=goharvest
POSTGRES_PASSWORD=
POSTGRES_PORT=5432
```

初始化页面中选择 PostgreSQL 时，数据库地址、端口、库名、用户会优先从环境变量填充；如果设置了 `POSTGRES_PASSWORD`，密码也会在后端自动读取，但不会回显到初始化页面。

使用上面的 Compose 时，初始化页面中 PostgreSQL 连接信息通常填写：

```text
Host: go-harvest-postgres
Port: 5432
Database: goharvest
User: goharvest
Password: .env 中的 POSTGRES_PASSWORD；已配置时可留空提交
```

### 2.3 常用环境变量

容器启动常用环境变量：

```env
TZ=Asia/Shanghai
LOGGER_LEVEL=info

GO_WEB_PORT=5173
POSTGRES_HOST=
POSTGRES_PORT=5432
POSTGRES_DB=goharvest
POSTGRES_USER=goharvest
POSTGRES_PASSWORD=
HARVEST_MEMORY_LIMIT=
HARVEST_GOGC=80
HARVEST_SITE_TASK_CONCURRENCY=5
HARVEST_DOWNLOADER_TASK_CONCURRENCY=2
HARVEST_DOWNLOADER_STATUS_CONCURRENCY=3
HARVEST_WS_STATUS_CONCURRENCY=3
HARVEST_PUSH_DOWNLOAD_CONCURRENCY=2
HARVEST_DB_LOG_RETENTION_DAYS=15
CACHE_REDIS_CONNECTION=
REDIS_SERVER_PORT=6379
REDIS_MAXMEMORY=128mb
REDIS_MAXMEMORY_POLICY=allkeys-lru
```

说明：

- `GO_WEB_PORT` 是容器内 Go Harvest 服务监听端口，默认 `5173`，通常不需要修改。
- `POSTGRES_HOST` 是 PostgreSQL 地址；留空时初始化页面仍需手动填写。
- `POSTGRES_PORT`、`POSTGRES_DB`、`POSTGRES_USER` 会作为 PostgreSQL 初始化默认值。
- `POSTGRES_PASSWORD` 设置后会作为 PostgreSQL 初始化密码默认值，但不会回显到初始化页面。
- `HARVEST_MEMORY_LIMIT` 可限制 Go 运行时内存目标；留空表示不额外设置。
- `HARVEST_GOGC` 控制 Go GC 触发比例，默认 `80`。
- `HARVEST_SITE_TASK_CONCURRENCY` 控制站点任务并发。
- `HARVEST_DOWNLOADER_TASK_CONCURRENCY` 控制下载器任务并发。
- `HARVEST_DOWNLOADER_STATUS_CONCURRENCY` 控制下载器状态刷新并发。
- `HARVEST_WS_STATUS_CONCURRENCY` 控制 WebSocket 状态推送并发。
- `HARVEST_PUSH_DOWNLOAD_CONCURRENCY` 控制推送种子时的下载并发。
- `HARVEST_DB_LOG_RETENTION_DAYS` 控制数据库日志保留天数。
- `CACHE_REDIS_CONNECTION` 存在时使用外置 Redis，例如 `redis://192.168.1.10:6379/15`。
- `CACHE_REDIS_CONNECTION` 留空时，容器内部 Redis 会使用 `REDIS_SERVER_PORT`。
- `REDIS_MAXMEMORY` 和 `REDIS_MAXMEMORY_POLICY` 仅用于内置 Redis。

## 3. 初始化系统

首次启动后访问：

```text
http://127.0.0.1:5173/setup
```

初始化需要设置：

- 数据库类型：`sqlite` 或 `pgsql`。
- 管理员用户名、密码、邮箱【非必需】。
- JWT Secret：可留空，系统会自动生成。

SQLite 初始化注意事项：

- 数据库文件名固定为 `data.sqlite3`。
- SQLite 时不需要填写数据库 host、port、user、pass。
- 时区固定为 `Asia/Shanghai`。

初始化完成后，系统会：

- 创建数据库表。
- 创建管理员用户。
- 写入 `/app/db/config.yaml`。
- 初始化缓存。
- 启动计划任务调度器。


# Python Harvest 

> <font color=orange>提示</font>

<font color=red>项目未占用五个端口，使用 HOST 模式时，如果遇到端口冲突，可以修改一下五个环境变量</font>

```
- WEBUI_PORT=5173 # WEB访问端口，使用 host 模式时如果端口冲突，请修改
- DJANGO_WEB_PORT=8000 # Django端口，使用 host 模式时如果端口冲突，请修改
- REDIS_SERVER_PORT=6379 # 队列缓存服务，使用 host 模式时如果端口冲突，请修改
- FLOWER_UI_PORT=5566 # 自动任务执行列表，使用 host 模式时如果端口冲突，请修改
- SUPERVISOR_UI_PORT=9001 # 服务管理端口，使用 host 模式时如果端口冲突，请修改
```
## Compose示例
### 默认版本
```yaml
services:
  harvest:
    image: newptools/harvest
    ports:
      - "28000:8000"
      - "25566:5566"
      - "29001:9001"
      - "25174:5173"
    volumes:
      - ./db:/app/db # 数据保存目录
      - ./sites:/app/sites # 自定义站点配置文件夹   sites 文件夹 为自定义站点配置文件夹，如果内置站点满足需求，可以不映射
      - ./icons:/icons # 自定义站点图标文件夹，图标必须为png格式，名称请点击编辑站点看站名称，自定义的与配置文件名称保持一致，群晖需要自己创建本地 icons 文件夹
      - ./downloads:/downloads #右侧为固定值，必须映射为/downloads，如有多个文件夹需要映射，请映射为/downloads的子文件夹，任意本地文件夹都可以映射
      - ./qbittorrent1:/downloaders/qbt1 #  qb下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
      - ./tr2:/downloaders/tr2  #  Tr下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
    environment:
      - TOKEN=YOUR-TOKEN # 必填项目  填写你获取到的授权码
      - DJANGO_SUPERUSER_USERNAME=admin
      - DJANGO_SUPERUSER_EMAIL=YOUR-EMAIL # 必填项目 填写你获取授权码使用的邮箱
      - DJANGO_SUPERUSER_PASSWORD=adminadmin
      - WEBUI_PORT=5173 # WEB访问端口，使用 host 模式时如果端口冲突，请修改
      - DJANGO_WEB_PORT=8000 # Django端口，使用 host 模式时如果端口冲突，请修改
      - REDIS_SERVER_PORT=6379 # 队列缓存服务，使用 host 模式时如果端口冲突，请修改
      - FLOWER_UI_PORT=5566 # 自动任务执行列表，使用 host 模式时如果端口冲突，请修改
      - SUPERVISOR_UI_PORT=9001 # 服务管理端口，使用 host 模式时如果端口冲突，请修改
      - CloudFlareSpeedTest=false # 测速开关，如果你使用默认代理，这个可以关上，测速和代理尽量二选一
      # - DEFAULT_PROXY=YOUR-PROXY # 此代理用于设置 浏览器插件/CC/PTPP 导入站点时为站点添加默认代理，已为部分不能使用代理访问的站点屏蔽，
    restart: always
    hostname: harvest
    container_name: harvest
    network_mode: bridge # 桥接模式，根据需要换成host模式（如：需要使用 IPV6的场景）
```
### REDIS 独立版本
```yaml
services:
  harvest-redis:
    image: redis:alpine
    # ports:
    #   - "6379:6379"
    networks:
       - harvest_network
    hostname: harvest-redis
    restart: always
    volumes:
      - redis-data:/data
      
  harvest-server:
    image: newptools/harvest
    depends_on:
      - harvest-redis
    ports:
      - "28000:8000"
      - "25566:5566"
      - "29001:9001"
      - "25174:5173"
    volumes:
      - ./db:/app/db # 数据保存目录
      - ./sites:/app/sites # 自定义站点配置文件夹   sites 文件夹 为自定义站点配置文件夹，如果内置站点满足需求，可以不映射
      - ./icons:/icons # 自定义站点图标文件夹，图标必须为png格式，名称请点击编辑站点看站名称，自定义的与配置文件名称保持一致，群晖需要自己创建本地 icons 文件夹
      - ./downloads:/downloads #右侧为固定值，必须映射为/downloads，如有多个文件夹需要映射，请映射为/downloads的子文件夹，任意本地文件夹都可以映射
      - ./qbittorrent1:/downloaders/qbt1 #  qb下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
      - ./tr2:/downloaders/tr2  #  Tr下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
    environment:
      - TOKEN=YOUR-TOKEN
      - DJANGO_SUPERUSER_USERNAME=admin
      - DJANGO_SUPERUSER_EMAIL=YOUR-EMAIL
      - DJANGO_SUPERUSER_PASSWORD=adminadmin
      - WEBUI_PORT=5173 # WEB访问端口
      - DJANGO_WEB_PORT=8000 # Django端口
      - REDIS_SERVER_PORT=6379 # 队列缓存服务
      - FLOWER_UI_PORT=5566 # 自动任务执行列表
      - SUPERVISOR_UI_PORT=9001 # 服务管理端口
      - CloudFlareSpeedTest=false # 测速开关
      - LOGGER_LEVEL=DEBUG
      - AUTO_UPDATE=false
      # - DEFAULT_PROXY=YOUR-PROXY # 此代理会在 CookieCLoud 同步时直接设置为同步站点的代理，已为部分不能使用代理访问的站点屏蔽，如果不打算设置代理，请删掉此项
      - CACHE_REDIS_CONNECTION=redis://harvest-redis:6379/11    # 缓存库   
      - CELERY_REDIS_CONNECTION=redis://harvest-redis:6379/9    # 任务队列
    restart: always
    hostname: harvest
    container_name: harvest
    networks:
      - harvest_network
    dns:
      - 8.8.8.8
      - 223.5.5.5
      - 223.6.6.6
      - 114.114.114.114
     
volumes:
  redis-data:
networks:
   harvest_network:
      name: harvest_network
```
### 使用Postgresql开箱即用版本
> 此版本没有写数据库详情，harvest_postgres部分的代码不可修改
```yaml
services:
   harvest_redis:
      image: redis:alpine
      # ports:
      #   - "6379:6379"
      networks:
         - harvest_network
      hostname: harvest_redis
      restart: always
      volumes:
         - redis-data:/data
         
   harvest_postgres:
      image: postgres:17-alpine   # 选择自己喜欢的版本即可
      container_name: harvest_postgres
      restart: unless-stopped
      networks:
        - harvest_network
      volumes:
         - ./postgres/data:/var/lib/postgresql/data
      environment:
         POSTGRES_DB: harvest # 数据库
         POSTGRESQL_WAL_COMPRESSION: lz4  # 压缩算法
         POSTGRESQL_MAX_CONNECTIONS: 2048 # 最大连接数
         POSTGRES_USER: harvest # 用户
         POSTGRES_PASSWORD: harvest # 密码
      
   harvest_server:
    image: newptools/harvest
    depends_on:
      - harvest_redis
      - harvest_postgres
    ports:
      - "28000:8000"
      - "25566:5566"
      - "29001:9001"
      - "25174:5173"
    volumes:
      - ./db:/app/db # 数据保存目录
      - ./sites:/app/sites # 自定义站点配置文件夹   sites 文件夹 为自定义站点配置文件夹，如果内置站点满足需求，可以不映射
      - ./icons:/icons # 自定义站点图标文件夹，图标必须为png格式，名称请点击编辑站点看站名称，自定义的与配置文件名称保持一致，群晖需要自己创建本地 icons 文件夹
      - ./downloads:/downloads #右侧为固定值，必须映射为/downloads，如有多个文件夹需要映射，请映射为/downloads的子文件夹，任意本地文件夹都可以映射
      - ./qbittorrent1:/downloaders/qbt1 #  qb下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
      - ./tr2:/downloaders/tr2  #  Tr下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
    environment:
      - TOKEN=YOUR-TOKEN
      - DJANGO_SUPERUSER_USERNAME=admin
      - DJANGO_SUPERUSER_EMAIL=YOUR-EMAIL
      - DJANGO_SUPERUSER_PASSWORD=adminadmin
      - WEBUI_PORT=5173 # WEB访问端口
      - DJANGO_WEB_PORT=8000 # Django端口
      - REDIS_SERVER_PORT=6379 # 队列缓存服务
      - FLOWER_UI_PORT=5566 # 自动任务执行列表
      - SUPERVISOR_UI_PORT=9001 # 服务管理端口
      - CloudFlareSpeedTest=false # 测速开关
      - LOGGER_LEVEL=DEBUG
      - AUTO_UPDATE=false
      # - DEFAULT_PROXY=YOUR-PROXY # 此代理会在 CookieCLoud 同步时直接设置为同步站点的代理，已为部分不能使用代理访问的站点屏蔽，如果不打算设置代理，请删掉此项
      - CACHE_REDIS_CONNECTION=redis://harvest_redis:6379/11    # 缓存库   
      - CELERY_REDIS_CONNECTION=redis://harvest_redis:6379/9    # 任务队列
      # 数据库配置，也可以在db文件夹下新建.env文件，写入数据库配置的内容
      - DB_REMOTE=true # 开启PG数据库，为false或无此选项时使用sqlite数据库，此时harvest_postgres部分的代码不可修改，如果修改了，请看下一个compose
    restart: always
    hostname: harvest_server
    container_name: harvest_server
    networks:
       - harvest_network
    dns:
     - 8.8.8.8
     - 223.5.5.5
     - 223.6.6.6
     - 114.114.114.114
     
volumes:
  redis-data:
networks:
   harvest_network:
      name: harvest_network
```
### 使用Postgresql自行修改版本
> 此版本harvest_postgres部分的代码可修改，但是需要自己在harvest_server部分同步修改
```yaml
services:
   harvest_redis:
      image: redis:alpine
      # ports:
      #   - "6379:6379"
      networks:
         - harvest_network
      hostname: harvest_redis
      restart: always
      volumes:
         - redis-data:/data
         
   harvest_postgres:
      image: postgres:17-alpine   # 选择自己喜欢的版本即可
      container_name: harvest_postgres
      restart: unless-stopped
      networks:
        - harvest_network
      volumes:
         - ./postgres/data:/var/lib/postgresql/data
      environment:
         POSTGRES_DB: harvest # 数据库
         POSTGRESQL_WAL_COMPRESSION: lz4  # 压缩算法
         POSTGRESQL_MAX_CONNECTIONS: 2048 # 最大连接数
         POSTGRES_USER: harvest # 用户
         POSTGRES_PASSWORD: harvest # 密码
      
   harvest_server:
    image: newptools/harvest
    depends_on:
      - harvest_redis
      - harvest_postgres
    ports:
      - "28000:8000"
      - "25566:5566"
      - "29001:9001"
      - "25174:5173"
    volumes:
      - ./db:/app/db # 数据保存目录
      - ./sites:/app/sites # 自定义站点配置文件夹   sites 文件夹 为自定义站点配置文件夹，如果内置站点满足需求，可以不映射
      - ./icons:/icons # 自定义站点图标文件夹，图标必须为png格式，名称请点击编辑站点看站名称，自定义的与配置文件名称保持一致，群晖需要自己创建本地 icons 文件夹
      - ./downloads:/downloads #右侧为固定值，必须映射为/downloads，如有多个文件夹需要映射，请映射为/downloads的子文件夹，任意本地文件夹都可以映射
      - ./qbittorrent1:/downloaders/qbt1 #  qb下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
      - ./tr2:/downloaders/tr2  #  Tr下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
    environment:
      - TOKEN=YOUR-TOKEN
      - DJANGO_SUPERUSER_USERNAME=admin
      - DJANGO_SUPERUSER_EMAIL=YOUR-EMAIL
      - DJANGO_SUPERUSER_PASSWORD=adminadmin
      - WEBUI_PORT=5173 # WEB访问端口
      - DJANGO_WEB_PORT=8000 # Django端口
      - REDIS_SERVER_PORT=6379 # 队列缓存服务
      - FLOWER_UI_PORT=5566 # 自动任务执行列表
      - SUPERVISOR_UI_PORT=9001 # 服务管理端口
      - CloudFlareSpeedTest=false # 测速开关
      - LOGGER_LEVEL=DEBUG
      - AUTO_UPDATE=false
      # - DEFAULT_PROXY=YOUR-PROXY # 此代理会在 CookieCLoud 同步时直接设置为同步站点的代理，已为部分不能使用代理访问的站点屏蔽，如果不打算设置代理，请删掉此项
      - CACHE_REDIS_CONNECTION=redis://harvest_redis:6379/11    # 缓存库   
      - CELERY_REDIS_CONNECTION=redis://harvest_redis:6379/9    # 任务队列
      # 数据库配置，也可以在db文件夹下新建.env文件，写入数据库配置的内容
      - DB_REMOTE=true # 开启PG数据库，为false或无此选项时使用sqlite数据库
      # 如果harvest_postgres部分的代码为修改，以下内容可以省略
      - DB_NAME=harvest # 数据库名称，默认：harvest，可省略
      - DB_USER=harvest # 数据库用户名，默认：harvest，可省略
      - DB_PASSWORD=harvest # 数据库密码，默认：harvest，可省略
      - DB_HOST=harvest_postgres # 数据库地址，外部数据库直接填ip或者域名
      - DB_PORT=5432 # 数据库端口，默认：5432，未修改可省略
      # - DB_MAX_CONNS=100 # 数据库连接数，高级配置，不清楚不要改
    restart: always
    hostname: harvest_server
    container_name: harvest_server
    networks:
       - harvest_network
    dns:
     - 8.8.8.8
     - 223.5.5.5
     - 223.6.6.6
     - 114.114.114.114
     
volumes:
  redis-data:
networks:
   harvest_network:
      name: harvest_network
```
### 使用已有Postgresql版本
> 此版本需要自己在harvest_server中或者.env文件自行填写数据库相关信息
```yaml
services:
   harvest_redis:
      image: redis:alpine
      # ports:
      #   - "6379:6379"
      networks:
         - harvest_network
      hostname: harvest_redis
      restart: always
      volumes:
         - redis-data:/data
      
   harvest_server:
    image: newptools/harvest
    depends_on:
      - harvest_redis
    ports:
      - "28000:8000"
      - "25566:5566"
      - "29001:9001"
      - "25174:5173"
    volumes:
      - ./db:/app/db # 数据保存目录
      - ./sites:/app/sites # 自定义站点配置文件夹   sites 文件夹 为自定义站点配置文件夹，如果内置站点满足需求，可以不映射
      - ./icons:/icons # 自定义站点图标文件夹，图标必须为png格式，名称请点击编辑站点看站名称，自定义的与配置文件名称保持一致，群晖需要自己创建本地 icons 文件夹
      - ./downloads:/downloads #右侧为固定值，必须映射为/downloads，如有多个文件夹需要映射，请映射为/downloads的子文件夹，任意本地文件夹都可以映射
      - ./qbittorrent1:/downloaders/qbt1 #  qb下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
      - ./tr2:/downloaders/tr2  #  Tr下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
    environment:
      - TOKEN=YOUR-TOKEN
      - DJANGO_SUPERUSER_USERNAME=admin
      - DJANGO_SUPERUSER_EMAIL=YOUR-EMAIL
      - DJANGO_SUPERUSER_PASSWORD=adminadmin
      - WEBUI_PORT=5173 # WEB访问端口
      - DJANGO_WEB_PORT=8000 # Django端口
      - REDIS_SERVER_PORT=6379 # 队列缓存服务
      - FLOWER_UI_PORT=5566 # 自动任务执行列表
      - SUPERVISOR_UI_PORT=9001 # 服务管理端口
      - CloudFlareSpeedTest=false # 测速开关
      - LOGGER_LEVEL=DEBUG
      - AUTO_UPDATE=false
      # - DEFAULT_PROXY=YOUR-PROXY # 此代理会在 CookieCLoud 同步时直接设置为同步站点的代理，已为部分不能使用代理访问的站点屏蔽，如果不打算设置代理，请删掉此项
      - CACHE_REDIS_CONNECTION=redis://harvest_redis:6379/11    # 缓存库   
      - CELERY_REDIS_CONNECTION=redis://harvest_redis:6379/9    # 任务队列
      # 数据库配置，也可以在db文件夹下新建.env文件，写入数据库配置的内容
      - DB_REMOTE=true # 开启PG数据库，为false或无此选项时使用sqlite数据库
      # 如果harvest_postgres部分的代码为修改，以下内容可以省略
      - DB_NAME=harvest # 数据库名称，默认：harvest，与默认相同可省略
      - DB_USER=harvest # 数据库用户名，默认：harvest，与默认相同可省略
      - DB_PASSWORD=harvest # 数据库密码，默认：harvest，与默认相同可省略
      - DB_HOST=harvest_postgres # 数据库地址，外部数据库直接填ip或者域名
      - DB_PORT=5432 # 数据库端口，默认：5432，与默认相同可省略
      # - DB_MAX_CONNS=100 # 数据库连接数，高级配置，不清楚不要改
    restart: always
    hostname: harvest_server
    container_name: harvest_server
    networks:
       - harvest_network
    dns:
     - 8.8.8.8
     - 223.5.5.5
     - 223.6.6.6
     - 114.114.114.114
     
volumes:
  redis-data:
networks:
   harvest_network:
      name: harvest_network
```
### .env文件格式
> 如果嫌弃写在环境变量中不够灵活，可以在db文件夹下新建.env文件，将数据库相关信息写入
```
DB_REMOTE=True # 开启PG数据库，为false/False或无此选项时使用sqlite数据库 【True，true，False,false】
# DB_ENGINE=dj_db_conn_pool.backends.postgresql # 固定内容，暂不可修改
DB_NAME=harvest # 数据库名称，默认：harvest，可省略
DB_USER=harvest # 数据库用户名，默认：harvest，可省略
DB_PASSWORD=harvest # 数据库密码，默认：harvest，可省略
DB_HOST=192.168.1.2 # 数据库地址，外部数据库直接填ip或者域名
DB_PORT=5432 # 数据库端口，默认：5432，未修改可省略
```
### 使用远程REDIS版本
```yaml
services:   
  harvest-server:
    image: newptools/harvest
    ports:
      - "28000:8000"
      - "25566:5566"
      - "29001:9001"
      - "25174:5173"
    volumes:
      - ./db:/app/db # 数据保存目录
      - ./sites:/app/sites # 自定义站点配置文件夹   sites 文件夹 为自定义站点配置文件夹，如果内置站点满足需求，可以不映射
      - ./icons:/icons # 自定义站点图标文件夹，图标必须为png格式，名称请点击编辑站点看站名称，自定义的与配置文件名称保持一致，群晖需要自己创建本地 icons 文件夹
      - ./downloads:/downloads #右侧为固定值，必须映射为/downloads，如有多个文件夹需要映射，请映射为/downloads的子文件夹，任意本地文件夹都可以映射
      - ./qbittorrent1:/downloaders/qbt1 #  qb下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
      - ./tr2:/downloaders/tr2  #  Tr下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
    environment:
      - TOKEN=YOUR-TOKEN
      - DJANGO_SUPERUSER_USERNAME=admin
      - DJANGO_SUPERUSER_EMAIL=YOUR-EMAIL
      - DJANGO_SUPERUSER_PASSWORD=adminadmin
      - WEBUI_PORT=5173 # WEB访问端口
      - DJANGO_WEB_PORT=8000 # Django端口
      - REDIS_SERVER_PORT=6379 # 队列缓存服务
      - FLOWER_UI_PORT=5566 # 自动任务执行列表
      - SUPERVISOR_UI_PORT=9001 # 服务管理端口
      - CloudFlareSpeedTest=false # 测速开关
      - LOGGER_LEVEL=DEBUG
      - AUTO_UPDATE=false
      # - DEFAULT_PROXY=YOUR-PROXY # 此代理会在 CookieCLoud 同步时直接设置为同步站点的代理，已为部分不能使用代理访问的站点屏蔽，如果不打算设置代理，请删掉此项
      - CACHE_REDIS_CONNECTION=redis://192.168.1.2:6379/11    # 缓存库   
      - CELERY_REDIS_CONNECTION=redis://192.168.1.2:6379/9    # 任务队列
    restart: always
    hostname: harvest
    container_name: harvest
    network_mode: bridge # 桥接模式，根据需要换成host模式
    dns:
     - 8.8.8.8
     - 223.5.5.5
     - 223.6.6.6
     - 114.114.114.114

```
## docker-compose部署
### 创建compose项目
1. 在 docker 文件夹下创建 harvest，在 harvest 下创建 db 文件夹

   ![img.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img.png)
   ![img_1.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_1.png)
   ![img_2.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_2.png)
   ![img_3.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_3.png)
   ![img_4.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_4.png)

2. 打开 Container Manager ，选择项目，新增，输入项目名称，选择项目文件夹（harvest）

   ![img_5.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_5.png)
   ![img_6.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_6.png)

### 配置compose脚本
1. 选择创建 docker-compose.yml

   ![img_7.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_7.png)

2. 复制配置文件内容，粘贴到输入框，粘贴不了的刷新下网页，修改填写你的端口，授权码，邮箱，以及网络模式，这里有两个重点：

   > <font color="orange">下载器文件夹的映射规则，</font>
   > 冒号前面是本地文件夹，
   > 下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式
   如不需要辅种功能，下载器可以不映射映射，<font color="yellow">此处有调整，QB 下载器和 TR
   下载器均映射到种子文件夹的上一级</font>
   > 右面是容器内文件夹：
   > <font color="red">固定格式，必须是/downloaders/开头</font>
   > <font color="orange">DEFAULT_PROXY</font>
   > 这个环境变量是用来给站点自动添加代理的，主要可以在 CC 同步和 PTPP 导入时自动为站点添加代理
   > 格式为 http://192.168.1.99:7890
   > <font color="orange">WEBUI_PORT</font>
   > 这个环境变量重新启用，并作为对外服务端口，包括 WEB 界面和 APP 访问地址端口均为此端口或此端口对应的映射端口，现默认值为
   5173

   ![img_8.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_8.png)
   ![img_9.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_9.png)
   ![img_10.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_10.png)

3. 修改完成之后就可以下一步，下一步，点击完成就会自动下载镜像，并生成容器。

   ![img_11.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_11.png)
   ![img_12.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_12.png)
   ![img_13.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_13.png)
   ![img_14.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_14.png)
### 错误处理
1. 如果这个报失败，Exit Code 1，不要急，点击关闭。exit code 0 表示成功

   ![img_15.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_15.png)

    1. 检查 token 和邮箱是否正确

    2. 检查授权文件是否放到 db 文件夹

    3. 点击项目名称，进去之后会看到 harvest 下面有一行红字，这里就是显示我们没有创建 sites 文件夹，到 harvest 下手动穿件
       sites
       文件夹，重新启动，
       ![img_16.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_16.png)
       ![img_17.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_17.png)
       ![img_18.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_18.png)

2. 此时你只要等几分钟，就可以访问 5173 映射出来的端口了

    1. 因为默认打开了自动更新和自动测速，需要等待启动完成

    2. 希望看到进度的可以点击容器名称，然后点右上角的操作=>打开终端机查看实时日志

   ![img_19.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_19.png)
   ![img_20.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_20.png)
   ![img_21.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_21.png)
