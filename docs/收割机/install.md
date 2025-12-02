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

## <font color=orange>提示</font>

<font color=red>项目未占用五个端口，使用 HOST 模式时，如果遇到端口冲突，可以修改一下五个环境变量</font>

```
- WEBUI_PORT=5173 # WEB访问端口，使用 host 模式时如果端口冲突，请修改
- DJANGO_WEB_PORT=8000 # Django端口，使用 host 模式时如果端口冲突，请修改
- REDIS_SERVER_PORT=6379 # 队列缓存服务，使用 host 模式时如果端口冲突，请修改
- FLOWER_UI_PORT=5566 # 自动任务执行列表，使用 host 模式时如果端口冲突，请修改
- SUPERVISOR_UI_PORT=9001 # 服务管理端口，使用 host 模式时如果端口冲突，请修改
```

## docker-compose

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

1. 在 docker 文件夹下创建 harvest，在 harvest 下创建 db 文件夹

   ![img.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img.png)
   ![img_1.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_1.png)
   ![img_2.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_2.png)
   ![img_3.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_3.png)
   ![img_4.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_4.png)

2. 打开 Container Manager ，选择项目，新增，输入项目名称，选择项目文件夹（harvest）

   ![img_5.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_5.png)
   ![img_6.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_6.png)

3. 选择创建 docker-compose.yml

   ![img_7.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_7.png)

4. 复制配置文件内容，粘贴到输入框，粘贴不了的刷新下网页，修改填写你的端口，授权码，邮箱，以及网络模式，这里有两个重点：

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

5. 修改完成之后就可以下一步，下一步，点击完成就会自动下载镜像，并生成容器。

   ![img_11.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_11.png)
   ![img_12.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_12.png)
   ![img_13.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_13.png)
   ![img_14.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_14.png)

6. 如果这个报失败，Exit Code 1，不要急，点击关闭。exit code 0 表示成功

   ![img_15.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_15.png)

    1. 检查 token 和邮箱是否正确

    2. 检查授权文件是否放到 db 文件夹

    3. 点击项目名称，进去之后会看到 harvest 下面有一行红字，这里就是显示我们没有创建 sites 文件夹，到 harvest 下手动穿件
       sites
       文件夹，重新启动，
       ![img_16.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_16.png)
       ![img_17.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_17.png)
       ![img_18.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_18.png)

7. 此时你只要等几分钟，就可以访问 5173 映射出来的端口了

    1. 因为默认打开了自动更新和自动测速，需要等待启动完成

    2. 希望看到进度的可以点击容器名称，然后点右上角的操作=>打开终端机查看实时日志

   ![img_19.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_19.png)
   ![img_20.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_20.png)
   ![img_21.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%AE%89%E8%A3%85/img_21.png)
