---
title: 01. 收割机简介
description: 
published: true
date: 2025-12-01T04:40:51.831Z
tags: 
editor: markdown
dateCreated: 2024-09-29T13:27:05.911Z
---

# <img src="https://img.ptools.fun/blog/launch_image.png" width="50" />Harvest


> harvest 本义收割机，本软件与收割机有异曲同工之妙，各位可自行安装体验。
>
> <font color="red" size=6>非免费软件，使用需要购买授权 或者申请试用</font>
>
>
> App：微信群、TG 群组获取
>
> [加入群组](https://t.me/n_ptools)  [加入群聊](https://t.me/ptools_chat)

收割机一直致力于让小伙伴儿们更简单的管理 PT 站点和下载器，目前已支持站点自动签到、站点数据统计、聚合搜索、RSS 订阅、下载器管理以及简单的 Docker 容器管理功能。

当前，收割机 APP 支持多平台，目前已在Win，Mac，iOS[TestFlight]，Android 以及 Web 页面上使用。

## 安装 Installation

配置文件如下

> <font color="red">目前辅种需要映射种子文件，所有种子文件夹均需要映射至`/downloaders/文件夹下`</font>
>
>    > <font color="yellow">此处有调整，QB 下载器和 TR 下载器均映射到 <font color="orange"> `种子文件夹上一级`</font> 一级</font>  
>
>    ><font color="red">QB：你的QB 种子文件夹所在，映射到 <font color="orange"> `种子文件夹上一级`</font>`</font>  右面是容器内文件夹：
>    ><font color="red">固定格式，必须是/downloaders/开头</font>
>
> <font color="orange">远程下载器可以使用同步工具同步config文件夹到安装 Harvest 的设备上，实现辅种效果</font>

> 添加下载器时需要填写映射到容器内的对应的文件夹

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
      - ./sites:/app/sites # 自定义站点配置文件夹
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
      # - DEFAULT_PROXY=YOUR-PROXY # 此代理会在 CookieCLoud 同步时直接设置为同步站点的代理，已为部分不能使用代理访问的站点屏蔽，如果不打算设置代理，请删掉此项
    restart: always
    hostname: harvest
    container_name: harvest
    network_mode: bridge # 桥接模式，根据需要换成host模式（如：需要使用 IPV6的场景）
```

## 签到功能

​	![image-20250129194831630](https://img.ptools.fun/blog/image-20250129194831630.png)

- 自动查找支持并开启签到的站点进行签到
- 记录当日签到状态和签到信息
- 可查看历史签到信息
- 已签到的站点不会重复进行签到
- 支持阿里云盘、ssdforum、国语世界签到
- 支持 OCR 识别（需配置百度 OCR 信息）

## 获取站点数据

![image-20250129194940385](https://img.ptools.fun/blog/image-20250129194940385.png)

- 获取用户基本数据
  - 上传量
  - 下载量
  - 做种数量
  - 下载数量
  - 分享率
  - 魔力
  - 做种积分
  - 注册时间
- 进阶数据
  - 时魔
  - 做种体积

## 下载器管理

![image-20250129194957291](https://img.ptools.fun/blog/image-20250129194957291.png)

![image-20250129195028099](https://img.ptools.fun/blog/image-20250129195028099.png)

- 种子管理

- 种子筛选

  - 分类
  - 状态
  - 标签
  - 站点

- 添加种子

  - 支持链接下载

  ![image-20250129195154404](https://img.ptools.fun/blog/image-20250129195154404.png)

- 下载器设置

  - 基本复原官方设置界面
  - 支持切换限速模式
  - 支持 EMBY 播放开启下载限速
  - 支持辅种（同时支持 IYUU 辅种、Pieces-Hash 辅种）

  ![image-20250129195101510](https://img.ptools.fun/blog/image-20250129195101510.png)

  ![image-20250129195114929](https://img.ptools.fun/blog/image-20250129195114929.png)

## 站点导入

为了让 PT 管理更方便，我们开发了站点一键导入、网页自动同步等功能来自动添加站点，同时油猴脚本还支持了类似于 PTPP 推送种子的功能，同时也支持了查看当前种子的可辅种信息

![image-20250129201016424](https://img.ptools.fun/blog/image-20250129201016424.png)

![image-20250129201044255](https://img.ptools.fun/blog/image-20250129201044255.png)

- PTPP 备份文件导入

- CookieCloud 同步

- 油猴插件添加同步

- 手动添加站点信息

  ![image-20250129200957800](https://img.ptools.fun/blog/image-20250129200957800.png)

## 聚合搜索

![image-20250129195238124](https://img.ptools.fun/blog/image-20250129195238124.png)

![image-20250129195318865](https://img.ptools.fun/blog/image-20250129195318865.png)

![image-20250129195720607](https://img.ptools.fun/blog/image-20250129195720607.png)

![image-20250129195743779](https://img.ptools.fun/blog/image-20250129195743779.png)

- 支持 TMDB 查询
- 支持豆瓣影视查询
- 支持使用 IMDB id 进行搜索（需站点支持）
- 支持自定义默认搜索站点
- 可直接推送到下载器

## RSS订阅

![image-20250129200228457](https://img.ptools.fun/blog/image-20250129200228457.png)

![image-20250129200333491](https://img.ptools.fun/blog/image-20250129200333491.png)

![image-20250129200242709](https://img.ptools.fun/blog/image-20250129200242709.png)

- 支持 RSS 订阅功能

- 支持自动或手动操作订阅结果

- 支持自定义订阅标签

  

## 计划任务

![image-20250129195856357](https://img.ptools.fun/blog/image-20250129195856357.png)

![image-20250129195911090](https://img.ptools.fun/blog/image-20250129195911090.png)

![image-20250129195955170](https://img.ptools.fun/blog/image-20250129195955170.png)

- 使用 Cron 表达式

## 通知支持

> 支持多种通知方式
>
> 支持自定义通知内容

- IYUU
- Telegram
- WxPusher
- 企业微信
- PushPlus
- Bark
- PushDeer

## Docker容器简单管理

- 支持执行简单 SSH 命令
- 支持一键重建容器（使用最新镜像）
- 支持复制一键重建命令

![image-20250129201143859](https://img.ptools.fun/blog/image-20250129201143859.png)

![image-20250129201200848](https://img.ptools.fun/blog/image-20250129201200848.png)