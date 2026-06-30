---
title: 02. 安装教程
description:
published: true
date: 2025-12-01T04:41:00.192Z
tags: [ 安装, ]
editor: markdown
dateCreated: 2024-09-29T14:32:58.877Z
---

<div style="margin: 20px 0; padding: 16px 20px; background: #f0f9ff; border: 1px solid #b3d8ff; border-radius: 8px; text-align: center;">
<div style="font-size: 16px; font-weight: 600; color: #303133; margin-bottom: 4px;">🔧 快速生成 docker-compose.yml</div>
<div style="font-size: 13px; color: #909399; margin-bottom: 12px;">填写表单，自动生成适配你环境的配置文件</div>
<a href="/收割机/compose.html" style="display: inline-block; padding: 8px 24px; background: #409eff; color: #fff; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">前往生成器 →</a>
</div>

# 安装教程

> 鉴于原Harvest项目Docker内存占用较大，先以使用go重新实现了Docker服务端，特此更新教程

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

推荐使用 Docker 镜像运行。镜像内包含：

- Go Harvest 主程序。
- Redis，可在未配置外置 Redis 时由容器内部启动。
- 内置站点配置和 WebUI 静态文件。

### 2.1 SQLite 单容器部署

SQLite 是最简单的部署方式，只需要一个 Go Harvest 容器。建议在项目目录下创建 `docker-compose.yml` 和 `.env`，然后通过 `.env`
管理敏感配置和端口。

完整 `docker-compose.yml` 示例：

```yaml
services:
  harvest:
    image: newptools/go-harvest:latest
    container_name: go-harvest
    restart: unless-stopped
#    env_file: # 使用.env管理环境变量的将这三行打开
#      - path: ./db/.env
#        required: false
    environment:
      TZ: ${TZ:-Asia/Shanghai}
      LOGGER_LEVEL: ${LOGGER_LEVEL:-info}

      # 启动授权校验必填。EMAIL 也可写成 DJANGO_SUPERUSER_EMAIL。
      EMAIL: ${EMAIL}
      TOKEN: ${TOKEN}

      # 对外访问端口（WebUI / API / Swagger 均通过此端口）。
      GO_WEB_PORT: ${GO_WEB_PORT:-5173}

      # 运行资源和并发设置。
      HARVEST_MEMORY_LIMIT: ${HARVEST_MEMORY_LIMIT:-}
      HARVEST_GOGC: ${HARVEST_GOGC:-80}
      HARVEST_SITE_TASK_CONCURRENCY: ${HARVEST_SITE_TASK_CONCURRENCY:-5}
      HARVEST_DOWNLOADER_TASK_CONCURRENCY: ${HARVEST_DOWNLOADER_TASK_CONCURRENCY:-2}
      HARVEST_DOWNLOADER_STATUS_CONCURRENCY: ${HARVEST_DOWNLOADER_STATUS_CONCURRENCY:-3}
      HARVEST_WS_STATUS_CONCURRENCY: ${HARVEST_WS_STATUS_CONCURRENCY:-3}
      HARVEST_PUSH_DOWNLOAD_CONCURRENCY: ${HARVEST_PUSH_DOWNLOAD_CONCURRENCY:-2}
      HARVEST_DB_LOG_RETENTION_DAYS: ${HARVEST_DB_LOG_RETENTION_DAYS:-15}

      # 留空时使用容器内置 Redis；配置后使用外置 Redis。
      CACHE_REDIS_CONNECTION: ${CACHE_REDIS_CONNECTION:-}
      REDIS_SERVER_PORT: ${REDIS_SERVER_PORT:-6379}
      REDIS_MAXMEMORY: ${REDIS_MAXMEMORY:-128mb}
      REDIS_MAXMEMORY_POLICY: ${REDIS_MAXMEMORY_POLICY:-allkeys-lru}

      # GitHub 资源代理，用于站点配置、WebUI、Release 更新等。
      GIT_PROXY: ${GIT_PROXY:-https://gh-proxy.org/}
    ports:
      - "5173:${GO_WEB_PORT:-5173}"
    volumes:
      # 配置、SQLite 数据库、日志、媒体文件。
      - ./db:/app/db
      # 自定义站点配置。
      - ./sites:/app/sites
      # 下载器相关目录。
      - ./downloaders:/downloaders
      # 图标目录，供 WebUI 或接口访问站点/应用图标。
      - ./db/icons:/icons
    healthcheck:
      test: [ "CMD-SHELL", "curl -fsS http://127.0.0.1:${GO_WEB_PORT:-5173}/api.json >/dev/null" ]
      interval: 20s
      timeout: 5s
      retries: 10
      start_period: 30s
```

`.env` 示例：

```env
TZ=Asia/Shanghai
LOGGER_LEVEL=info

# 授权信息，启动时会请求远端授权接口校验。
EMAIL=your-email@example.com
TOKEN=your-auth-token

# 对外访问端口。
GO_WEB_PORT=5173

# 并发和资源控制。
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

# GitHub 资源代理。
GIT_PROXY=https://gh-proxy.org/
```

启动：

```bash
mkdir -p db/icons sites downloads downloaders
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
- `./downloaders:/downloaders`，下载器相关目录。
- `./db/icons:/icons`，图标目录。建议放在 `db/icons` 下，便于随数据目录一起备份和迁移。

SQLite 数据库初始化时固定使用：

```text
/app/db/data.sqlite3
```

### 2.2 PostgreSQL 部署

如果希望使用 PostgreSQL，可以在 SQLite 单容器 Compose 基础上增加 PostgreSQL 服务。完整示例：

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
      POSTGRES_PORT: ${POSTGRES_PORT:-5432}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U \"$${POSTGRES_USER}\" -d \"$${POSTGRES_DB}\"" ]
      interval: 2s
      timeout: 3s
      retries: 30
      start_period: 2s

  go-harvest:
    image: newptools/go-harvest:latest
    container_name: go-harvest
    restart: unless-stopped
    depends_on:
      go-harvest-postgres:
        condition: service_healthy
#    env_file: # 使用.env管理环境变量的将这三行打开
#      - path: ./db/.env
#        required: false
    environment:
      TZ: ${TZ:-Asia/Shanghai}
      LOGGER_LEVEL: ${LOGGER_LEVEL:-info}

      # 启动授权校验必填。EMAIL 也可写成 DJANGO_SUPERUSER_EMAIL。
      EMAIL: ${EMAIL}
      TOKEN: ${TOKEN}

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
      GIT_PROXY: ${GIT_PROXY:-https://gh-proxy.org/}
    ports:
      - "5173:${GO_WEB_PORT:-5173}"
    volumes:
      - ./db:/app/db
      - ./sites:/app/sites
      - ./downloaders:/downloaders
      - ./db/icons:/icons
    healthcheck:
      test: [ "CMD-SHELL", "curl -fsS http://127.0.0.1:${GO_WEB_PORT:-5173}/api.json >/dev/null" ]
      interval: 20s
      timeout: 5s
      retries: 10
      start_period: 30s
```

PostgreSQL `.env` 示例可在 SQLite `.env` 基础上追加：

```env
POSTGRES_DB=goharvest
POSTGRES_USER=goharvest
POSTGRES_PASSWORD=change-me
POSTGRES_PORT=5432
```

启动：

```bash
mkdir -p db/icons sites downloads downloaders postgres-data
docker compose -f docker-compose.pgsql.yml up -d
```

如果使用自定义 `.env` 路径：

```bash
docker compose --env-file /path/to/.env -f docker-compose.pgsql.yml up -d
```

默认 PostgreSQL 环境变量：

```env
POSTGRES_DB=goharvest
POSTGRES_USER=goharvest
POSTGRES_PASSWORD=goharvest
POSTGRES_PORT=5432
```

初始化页面中选择 PostgreSQL，并填写数据库地址、端口、库名、用户和密码。

使用上面的 Compose 时，初始化页面中 PostgreSQL 连接信息通常填写：

```text
Host: go-harvest-postgres
Port: 5432
Database: goharvest
User: goharvest
Password: .env 中的 POSTGRES_PASSWORD
```

### 2.3 常用环境变量

容器启动常用环境变量：

```env
TZ=Asia/Shanghai
LOGGER_LEVEL=info
EMAIL=your-email@example.com
TOKEN=your-auth-token
GO_WEB_PORT=5173
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
GIT_PROXY=https://gh-proxy.org/
```

说明：

- `EMAIL` / `TOKEN` 是启动授权校验所需环境变量。`EMAIL` 也兼容 `DJANGO_SUPERUSER_EMAIL`。
- `GO_WEB_PORT` 是对外访问端口（WebUI / API / Swagger 均通过此端口），默认 `5173`。
- `CACHE_REDIS_CONNECTION` 存在时使用外置 Redis，例如 `redis://192.168.1.10:6379/15`。
- `CACHE_REDIS_CONNECTION` 留空时，容器内部 Redis 会使用 `REDIS_SERVER_PORT`。
- `GIT_PROXY` 用于站点配置、WebUI、Release 等 GitHub 资源访问代理。

## 3. docker-compose 部署教程

> 本教程以群晖 Container Manager 为例，其他 NAS（如飞牛）操作类似。

### 3.1 创建 compose 项目

1. 在 File Station 的 docker 文件夹下创建 harvest 文件夹，在 harvest 下创建 db 文件夹（用于保存数据库和配置文件）

   ![img.png](/images/install/img.png)
   ![img_1.png](/images/install/img_1.png)
   ![img_2.png](/images/install/img_2.png)
   ![img_3.png](/images/install/img_3.png)
   ![img_4.png](/images/install/img_4.png)

2. 打开 Container Manager，选择「项目」，新增，输入项目名称，选择项目文件夹（harvest）

   ![img_5.png](/images/install/img_5.png)
   ![img_6.png](/images/install/img_6.png)

### 3.2 配置 compose 脚本

1. 选择创建 `docker-compose.yml`

   ![img_7.png](/images/install/img_7.png)

2. 复制配置文件内容，粘贴到输入框。粘贴不了的刷新下网页，修改填写你的端口、授权码（EMAIL / TOKEN），以及网络模式。

   > <font color="orange">重点说明</font>
   >
   > **下载器文件夹的映射规则**：冒号前面是本地文件夹，冒号后面是容器内路径。
   > 下载器种子文件映射目录固定格式为 `/downloaders/` 开头。如不需要辅种功能，下载器可以不映射。
   > <font color="yellow">QB 下载器和 TR 下载器均映射到种子文件夹的上一级</font>
   >
   > **端口映射**：所有对外访问均通过 `GO_WEB_PORT` 端口，默认 `5173`

   ![img_8.png](/images/install/img_8.png)
   ![img_9.png](/images/install/img_9.png)
   ![img_10.png](/images/install/img_10.png)

3. 修改完成之后点击下一步，点击「完成」就会自动下载镜像并生成容器。

   ![img_11.png](/images/install/img_11.png)
   ![img_12.png](/images/install/img_12.png)
   ![img_13.png](/images/install/img_13.png)
   ![img_14.png](/images/install/img_14.png)

### 3.3 错误处理

1. 如果容器启动失败，Exit Code 1，不要急，点击关闭。exit code 0 表示成功

   ![img_15.png](/images/install/img_15.png)

    1. 检查 EMAIL 和 TOKEN 是否正确

    2. 检查授权文件是否放到 db 文件夹

    3. 点击项目名称，进去之后会看到容器下面有一行红字，这里会显示缺少目录（例如 sites 文件夹）。到 harvest
       文件夹下手动创建对应文件夹，然后重新启动容器。

       ![img_16.png](/images/install/img_16.png)
       ![img_17.png](/images/install/img_17.png)
       ![img_18.png](/images/install/img_18.png)

2. 等待几分钟后，就可以通过 `http://IP:端口映射出来的端口` 访问 WebUI 了

    1. 首次访问会进入初始化页面，按提示填写信息
    2. 希望查看启动进度的可以点击容器名称，然后点右上角的操作 => 打开终端机查看实时日志

   ![img_19.png](/images/install/img_19.png)
   ![img_20.png](/images/install/img_20.png)
   ![img_21.png](/images/install/img_21.png)

