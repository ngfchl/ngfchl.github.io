---
title: 00. 收割机简介
description:
published: true
date: 2026-06-13T00:00:00.000Z
tags: [ Harvest, Go Harvest ]
editor: markdown
dateCreated: 2024-09-29T13:27:05.911Z
---

# Harvest

> Harvest 本义收割机，本软件与收割机有异曲同工之妙，各位可自行安装体验。
>
> <font color="red" size=6>非免费软件，使用需要购买授权或者申请试用。</font>
>
> App：微信群、TG 群组获取。
>
> [加入群组](https://t.me/n_ptools)  [加入群聊](https://t.me/ptools_chat)

收割机致力于让 PT 站点和下载器管理更简单，目前已支持站点自动签到、站点数据统计、聚合搜索、RSS 订阅、下载器管理、辅种、种子迁移、通知、日志排查和 Docker 容器管理。

当前推荐使用 Go Harvest 服务端。正式长期部署建议使用 PostgreSQL，轻量试用可以使用 SQLite。安装步骤、Compose 示例、初始化、目录映射和环境变量以 [安装教程](/收割机/install) 为准。

## 快速开始

1. 准备授权邮箱和授权 token。
2. 按 [安装教程](/收割机/install) 使用 Docker Compose 部署 Go Harvest。
3. 首次启动后访问 `http://127.0.0.1:5173/setup` 完成初始化。
4. 使用初始化时创建的管理员账号登录 WebUI 或 APP。
5. 配置 [通知](/收割机/notify)、站点、下载器和计划任务。

常用地址：

- WebUI: `http://127.0.0.1:5173`
- 初始化页面: `http://127.0.0.1:5173/setup`
- Swagger UI: `http://127.0.0.1:5173/swagger`
- OpenAPI JSON: `http://127.0.0.1:5173/api.json`

## 功能概览

### 签到功能

![img.png](/images/收割机/简介/img.png)

- 自动查找支持并开启签到的站点进行签到。
- 记录当日签到状态和签到信息。
- 可查看历史签到信息。
- 已签到的站点不会重复进行签到。
- 支持阿里云盘、SSDForum、国语世界等签到。
- 支持 OCR 识别，需配置百度 OCR 信息。

### 获取站点数据

![img_1.png](/images/收割机/简介/img_1.png)

- 获取上传量、下载量、做种数量、下载数量、分享率、魔力、做种积分和注册时间等基础数据。
- 支持时魔、做种体积等进阶数据。
- 仪表盘集中展示站点、服务器资源和趋势图表。

### 下载器管理

![img_2.png](/images/收割机/简介/img_2.png)

![img_3.png](/images/收割机/简介/img_3.png)

![img_4.png](/images/收割机/简介/img_4.png)

- 支持 qBittorrent 和 Transmission。
- 支持种子筛选、分类、标签、站点筛选和状态管理。
- 支持添加种子、链接下载、下载器设置、限速设置和辅种。
- 支持 IYUU 辅种、Pieces-Hash 辅种和种子迁移。

![img_5.png](/images/收割机/简介/img_5.png)

![img_6.png](/images/收割机/简介/img_6.png)

![img_7.png](/images/收割机/简介/img_7.png)

### 站点导入

为了让 PT 管理更方便，收割机支持站点一键导入、网页自动同步、浏览器插件和油猴脚本。

![img_8.png](/images/收割机/简介/img_8.png)

- PTPP 备份文件导入。
- CookieCloud 同步。
- 浏览器插件添加同步。
- 油猴插件添加同步。
- 手动添加站点信息。

![img_10.png](/images/收割机/简介/img_10.png)

![img_11.png](/images/收割机/简介/img_11.png)

### 聚合搜索

![img_12.png](/images/收割机/简介/img_12.png)
![img_13.png](/images/收割机/简介/img_13.png)
![img_14.png](/images/收割机/简介/img_14.png)
![img_15.png](/images/收割机/简介/img_15.png)

- 支持 TMDB 查询。
- 支持豆瓣影视查询。
- 支持使用 IMDB ID 搜索，需站点支持。
- 支持自定义默认搜索站点。
- 可直接推送到下载器。

### RSS 订阅

![img_16.png](/images/收割机/简介/img_16.png)
![img_17.png](/images/收割机/简介/img_17.png)
![img_18.png](/images/收割机/简介/img_18.png)
![img_19.png](/images/收割机/简介/img_19.png)

- 支持 RSS 订阅功能。
- 支持自动或手动操作订阅结果。
- 支持自定义订阅标签。

### 计划任务

![img_20.png](/images/收割机/简介/img_20.png)

![img_21.png](/images/收割机/简介/img_21.png)

![img_22.png](/images/收割机/简介/img_22.png)

- 支持 Cron 表达式。
- 支持自动签到、批量抓取站点信息、RSS 订阅、下载器辅种和种子迁移。

### 通知支持

收割机支持企业微信、微信机器人、QQ 机器人、WxPusher、PushDeer、Bark、爱语飞飞、喵呜通知、Server 酱、PushPlus、Telegram 等通知渠道。

通知配置、通知测试、企业微信回调、微信机器人扫码登录和 QQ 机器人配置见 [通知配置](/收割机/notify)。

### Docker 容器管理

- 支持执行简单 SSH 命令。
- 支持一键重建容器。
- 支持复制一键重建命令。

![img_23.png](/images/收割机/简介/img_23.png)
![img_24.png](/images/收割机/简介/img_24.png)

## 文档入口

- [安装教程](/收割机/install)
- [APP 使用文档](/收割机/app)
- [使用指南](/收割机/使用指南)
- [通知配置](/收割机/notify)
- [导入站点](/收割机/import)
- [常见问题](/收割机/common)
