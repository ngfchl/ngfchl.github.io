---
title: 02. 安装教程
description:
published: true
date: 2026-06-13T00:00:00.000Z
tags: [ 安装, Docker, Go Harvest ]
editor: markdown
dateCreated: 2024-09-29T14:32:58.877Z
---

# 安装教程

> 鉴于原 Harvest 项目 Docker 内存占用较大，目前推荐优先使用 Go Harvest 服务端。Go Harvest 会逐渐取代原来的 Python Harvest。

Docker Compose 很方便，目前各大 NAS 系统均已支持通过项目、Compose 或堆栈方式部署。本项目不再提供手动创建容器的教程。

<font color=orange size=3>推荐使用 Docker Compose 部署。正式长期使用建议选择 PostgreSQL，轻量试用可以选择 SQLite。</font>

常用 Docker 镜像源地址：

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

## 1. Go Harvest 简介

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
- 服务器状态、实时日志和分页日志。
- 微信机器人和 QQ 机器人通知、消息接收、指令交互、文档链接。

## 2. 启动授权变量

Go Harvest 启动时会校验远端授权，必须提供：

- `EMAIL` 或 `DJANGO_SUPERUSER_EMAIL`：授权邮箱。
- `TOKEN`：授权 token。

缺少这两个值时容器会启动失败，并在日志中提示需要配置授权邮箱和 token。

## 3. PostgreSQL 推荐部署

PostgreSQL 适合正式部署。下面示例把授权和数据库配置放在 `db/.env`，数据目录统一放在当前 Compose 目录下，方便备份和迁移。

先创建 `db/.env`：

```env
EMAIL=you@example.com
TOKEN=replace-with-your-token

POSTGRES_HOST=go-harvest-postgres
POSTGRES_PORT=5432
POSTGRES_DB=goharvest
POSTGRES_USER=goharvest
POSTGRES_PASSWORD=change-me
```

创建 `docker-compose.yml`：

```yaml
services:
  go-harvest-postgres:
    image: postgres:17-alpine
    container_name: go-harvest-postgres
    restart: unless-stopped
    env_file:
      - path: ./db/.env
        required: true
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
      - path: ./db/.env
        required: true
    ports:
      - "5173:5173"
    volumes:
      - ./db:/app/db
      - ./icons:/icons
      - ./sites:/app/sites
      - ./downloads:/downloads
      - ./downloaders:/downloaders
    healthcheck:
      test: [ "CMD-SHELL", "curl -fsS http://127.0.0.1:5173/api.json >/dev/null" ]
      interval: 20s
      timeout: 5s
      retries: 10
      start_period: 30s
```

启动：

```bash
mkdir -p db sites icons downloads downloaders postgres-data
docker compose up -d
```

如果不想维护 `.env` 文件，也可以把必要变量直接写入 Compose：

```yaml
services:
  go-harvest-postgres:
    image: postgres:17-alpine
    container_name: go-harvest-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: "goharvest"
      POSTGRES_USER: "goharvest"
      POSTGRES_PASSWORD: "change-me"
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
    environment:
      EMAIL: "you@example.com"
      TOKEN: "replace-with-your-token"
      POSTGRES_HOST: "go-harvest-postgres"
      POSTGRES_PORT: "5432"
      POSTGRES_DB: "goharvest"
      POSTGRES_USER: "goharvest"
      POSTGRES_PASSWORD: "change-me"
    ports:
      - "5173:5173"
    volumes:
      - ./db:/app/db
      - ./icons:/icons
      - ./sites:/app/sites
      - ./downloads:/downloads
      - ./downloaders:/downloaders
    healthcheck:
      test: [ "CMD-SHELL", "curl -fsS http://127.0.0.1:5173/api.json >/dev/null" ]
      interval: 20s
      timeout: 5s
      retries: 10
      start_period: 30s
```

## 4. SQLite 可选部署

SQLite 只适合轻量单机、试用或临时环境。SQLite 版本不需要任何 PostgreSQL 相关环境变量。

```yaml
services:
  harvest:
    image: newptools/go-harvest:latest
    container_name: go-harvest
    restart: unless-stopped
    environment:
      EMAIL: "you@example.com"
      TOKEN: "replace-with-your-token"
    ports:
      - "5173:5173"
    volumes:
      - ./db:/app/db
      - ./sites:/app/sites
      - ./icons:/icons
      - ./downloads:/downloads
      - ./downloaders:/downloaders
    healthcheck:
      test: [ "CMD-SHELL", "curl -fsS http://127.0.0.1:5173/api.json >/dev/null" ]
      interval: 20s
      timeout: 5s
      retries: 10
      start_period: 30s
```

启动：

```bash
mkdir -p db sites icons downloads downloaders
docker compose up -d
```

如果使用 `db/.env`，只需要写授权信息，不要写 PostgreSQL 变量：

```env
EMAIL=you@example.com
TOKEN=replace-with-your-token
```

SQLite 初始化时数据库文件固定为：

```text
/app/db/data.sqlite3
```

## 5. 初始化系统

首次启动后访问：

```text
http://127.0.0.1:5173/setup
```

![选择数据库](/images/go-harvest/初始化/选择数据库.jpg)

初始化需要设置：

- 数据库类型：`sqlite` 或 `pgsql`。
- 管理员用户名、密码、邮箱。
- JWT Secret，可留空由系统自动生成。

![初始化用户](/images/go-harvest/初始化/初始化用户.jpg)

使用 PostgreSQL Compose 时，初始化页面选择 PostgreSQL，连接信息通常为：

![PostgreSQL 数据库初始化](/images/go-harvest/初始化/pgsql数据库.jpg)

```text
Host: go-harvest-postgres
Port: 5432
Database: goharvest
User: goharvest
Password: db/.env 或 Compose environment 中的 POSTGRES_PASSWORD；已配置时可留空提交
```

数据库地址、端口、库名、用户会优先从环境变量填充；如果设置了 `POSTGRES_PASSWORD`，密码也会在后端自动读取，但不会回显到初始化页面。

SQLite 部署时选择 SQLite，数据库文件固定为 `/app/db/data.sqlite3`。

![SQLite 数据库初始化](/images/go-harvest/初始化/sqlite数据库.jpg)

初始化完成后，系统会创建数据库表、创建管理员用户、写入 `/app/db/config.yaml`、初始化缓存并启动计划任务调度器。

## 6. 访问地址和目录

默认访问地址：

- WebUI: `http://127.0.0.1:5173`
- 初始化页面: `http://127.0.0.1:5173/setup`
- Swagger UI: `http://127.0.0.1:5173/swagger`
- OpenAPI JSON: `http://127.0.0.1:5173/api.json`

默认挂载目录：

- `./db:/app/db`，配置、数据库、日志、媒体文件，`db/.env` 也放在这里。
- `./sites:/app/sites`，用户自定义站点配置。
- `./downloads:/downloads`，下载目录。
- `./downloaders:/downloaders`，下载器相关目录。
- `./postgres-data:/var/lib/postgresql/data`，PostgreSQL 数据目录。
- `./icons:/icons`，自定义站点图标目录。

## 7. 常用环境变量

必需变量：

```env
EMAIL=you@example.com
TOKEN=replace-with-your-token
```

PostgreSQL 部署需要：

```env
POSTGRES_HOST=go-harvest-postgres
POSTGRES_PORT=5432
POSTGRES_DB=goharvest
POSTGRES_USER=goharvest
POSTGRES_PASSWORD=change-me
```

常用可选变量：

```env
TZ=Asia/Shanghai
GO_WEB_PORT=5173
LOGGER_LEVEL=info
LOGGER_STDOUT=true
HARVEST_CONFIG_FILE=/app/db/config.yaml
HARVEST_ICONS_DIR=/icons
HARVEST_WEBUI_DIR=/app/templates
AUTO_UPDATE=false
AUTO_UPDATE_TAG=upgrade_all
AUTO_SPEEDTEST=false
USE_CUSTOM_HOSTS=false
GIT_PROXY=https://gh-proxy.org/

HARVEST_MEMORY_LIMIT=
HARVEST_GOGC=80
HARVEST_SITE_TASK_CONCURRENCY=5
HARVEST_DOWNLOADER_TASK_CONCURRENCY=2
HARVEST_DOWNLOADER_STATUS_CONCURRENCY=3
HARVEST_WS_STATUS_CONCURRENCY=3
HARVEST_PUSH_DOWNLOAD_CONCURRENCY=2
HARVEST_SITE_HTTP_TIMEOUT=30s
HARVEST_DB_LOG_RETENTION_DAYS=15
HARVEST_CRON_RANDOM_DELAY_MAX=30m
HARVEST_SCHEDULE_RELOAD_INTERVAL=2m

CACHE_REDIS_CONNECTION=
CACHE_REDIS_DB=15
REDIS_SERVER_PORT=6379
REDIS_MAXMEMORY=128mb
REDIS_MAXMEMORY_POLICY=allkeys-lru
```

说明：

- `GO_WEB_PORT` 控制容器内 HTTP 监听端口；宿主机端口由 Compose 的 `ports` 映射决定。
- `LOGGER_LEVEL` 控制日志级别，常用 `debug`、`info`、`warning`、`error`。
- `HARVEST_CONFIG_FILE` 指定运行配置文件，未指定时优先查找 `db/config.yaml` 和 `/app/db/config.yaml`。
- `HARVEST_ICONS_DIR` 指定 `/local/icons/*` 静态图标目录，默认 `/icons`。
- `AUTO_UPDATE` 控制容器启动时是否自动执行更新，`AUTO_UPDATE_TAG` 控制更新范围。
- `AUTO_SPEEDTEST` 控制容器启动时是否自动执行 CloudFlare 测速并应用测速后的 hosts。
- `USE_CUSTOM_HOSTS` 控制容器启动时是否直接应用 `db/hosts/hosts`。
- `GIT_PROXY` 用于 GitHub 资源更新。
- `HARVEST_GOGC`、各类 `HARVEST_*_CONCURRENCY` 用于控制运行资源和并发。
- `HARVEST_CRON_RANDOM_DELAY_MAX` 控制 Cron 计划任务命中后的最大随机延后执行时间，设置 `0` 可关闭随机延后。
- `HARVEST_SCHEDULE_RELOAD_INTERVAL` 控制计划任务重载和同步间隔。
- `CACHE_REDIS_CONNECTION` 存在时使用外置 Redis，例如 `redis://192.168.1.10:6379/15`。
- `CACHE_REDIS_CONNECTION` 留空时，容器内部 Redis 会使用 `REDIS_SERVER_PORT`。

## 8. 登录、接口和 Swagger

初始化完成后访问 WebUI：

```text
http://127.0.0.1:5173
```

![登录界面](/images/go-harvest/初始化/登录界面.png)

使用初始化时创建的管理员账号登录。

API 登录接口：

```http
POST /api/token/pair
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

后续请求使用：

```http
Authorization: Bearer <access_token>
```

Swagger UI 地址：

```text
http://127.0.0.1:5173/swagger
```

在 Swagger UI 右上角 `Authorize` 中填入 access token 即可调试需要鉴权的接口。

## 9. 辅种目录说明

辅种依赖下载器配置中的 `torrent_path`。该路径必须是 Go Harvest 容器内可访问的路径，通常通过 `./downloaders:/downloaders` 这类 volume 映射下载器配置目录。

qBittorrent 路径规则：

```text
torrent_path/
  BT_backup/
    <infohash>.torrent
    <infohash>.fastresume
```

Transmission 路径规则：

```text
torrent_path/
  torrents/
    <infohash>.torrent
  resume/
    <infohash>.resume
```

如果日志提示“种子文件夹为空”，先确认 `torrent_path` 是容器内路径，而不是宿主机路径。需要排查辅种时可临时设置 `LOGGER_LEVEL=debug`，后端会输出扫描目录、命中文件数量、解析数量等诊断日志。

## 10. 通知和机器人

Go Harvest 支持企业微信、微信机器人、QQ 机器人、WxPusher、PushDeer、Bark、爱语飞飞、喵呜通知、Server 酱、PushPlus、Telegram 等通知渠道。

通知配置、通知测试、企业微信回调、微信机器人扫码登录和 QQ 机器人配置统一见 [通知配置](/收割机/notify)。

## 11. 常见问题

### 容器启动失败

检查：

- 是否配置了 `EMAIL` 或 `DJANGO_SUPERUSER_EMAIL`。
- 是否配置了 `TOKEN`。
- Docker 日志中是否提示授权校验失败。
- PostgreSQL 部署时数据库服务是否健康。

### 初始化失败

检查：

- PostgreSQL 地址、端口、库名、用户名、密码是否正确。
- 数据库用户是否有建表和写入权限。
- SQLite 部署时 `/app/db` 是否可写。
- 管理员密码是否至少 6 位。
- JWT Secret 是否为空。

### WebUI 无法访问

检查：

- Compose 是否映射了 `5173:5173`。
- 容器健康检查是否通过。
- 反向代理是否转发到正确端口。
- 浏览器访问地址是否带端口。

### 下载器连接失败

检查：

- 下载器 Web UI 是否启用。
- 协议、主机、端口、用户名、密码是否正确。
- Go Harvest 容器所在网络是否能访问下载器。
- 是否需要配置 External Host。

### 站点刷新或签到失败

检查：

- Cookie 是否过期。
- User-Agent 是否与 Cookie 来源一致。
- 站点是否需要代理。
- 站点配置 XPath 或解析规则是否失效。
- 服务端日志中的站点错误。
