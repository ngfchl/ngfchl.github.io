---
title: 02. 安装教程
description: 
published: true
date: 2025-12-01T04:41:00.192Z
tags: install
editor: markdown
dateCreated: 2024-09-29T14:32:58.877Z
---

# 安装教程

> 安装教程以群晖为例，但是各家均大差不差，参照群晖的配置安装即可
>
> <font color=orange size=3>推荐使用 docker-compose 【项目（群晖）】【Compose（飞牛）】方式安装</font>
>
> 常用 Docker 镜像源地址：
>
> ```json
> {
> "registry-mirrors":[
> "https://docker.xuanyuan.me",
> "https://docker.1ms.run",
> "https://dockerhub.icu",
> "https://hub.rat.dev",
> "https://docker.wanpeng.top",
> "https://doublezonline.cloud",
> "https://docker.mrxn.net",
> "https://docker.anyhub.us.kg",
> "https://dislabaiot.xyz",
> "https://docker.fxxk.dedyn.io",
> "https://docker-mirror.aigc2d.com",
> "https://dockerproxy.net",
> "https://docker.kejilion.pro",
> "https://docker.1panel.live"
> ]
> }
> ```
>
> ## <font color=orange>提示</font>
>
> <font color=red>项目未占用五个端口，使用 HOST 模式时，如果遇到端口冲突，可以修改一下五个环境变量</font>
>
> ```
> - WEBUI_PORT=5173 # WEB访问端口，使用 host 模式时如果端口冲突，请修改
> - DJANGO_WEB_PORT=8000 # Django端口，使用 host 模式时如果端口冲突，请修改
> - REDIS_SERVER_PORT=6379 # 队列缓存服务，使用 host 模式时如果端口冲突，请修改
> - FLOWER_UI_PORT=5566 # 自动任务执行列表，使用 host 模式时如果端口冲突，请修改
> - SUPERVISOR_UI_PORT=9001 # 服务管理端口，使用 host 模式时如果端口冲突，请修改
> ```
>
> 



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



1. 创建文件夹

   1. 在 docker 文件夹下创建 harvest，在 harvest 下创建 db 文件夹

      ![image-20240423223215593](https://img.ptools.fun/blog/image-20240423223215593.png)

      ![image-20240423223236144](https://img.ptools.fun/blog/image-20240423223236144.png)

      ![image-20240423223252435](https://img.ptools.fun/blog/image-20240423223252435.png)

      ![image-20240423223312220](https://img.ptools.fun/blog/image-20240423223312220.png)

      ![image-20240423223358710](https://img.ptools.fun/blog/image-20240423223358710.png)

2. 打开 Container Manager ，选择项目，新增，输入项目名称，选择项目文件夹（harvest）

   ![image-20240423223451622](https://img.ptools.fun/blog/image-20240423223451622.png)

   ![image-20240423223552800](https://img.ptools.fun/blog/image-20240423223552800.png)

   3. 选择创建 docker-compose.yml

      ![image-20240423223636416](https://img.ptools.fun/blog/image-20240423223636416.png)

3. 复制配置文件内容，粘贴到输入框，粘贴不了的刷新下网页，修改填写你的端口，授权码，邮箱，以及网络模式，这里有两个重点：

   > <font color="orange">下载器文件夹的映射规则，</font>
   > 冒号前面是本地文件夹，
   > 下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射映射，<font color="yellow">此处有调整，QB 下载器和 TR 下载器均映射到种子文件夹的上一级</font>  
   >
   > 
   >
   > 右面是容器内文件夹：
   > <font color="red">固定格式，必须是/downloaders/开头</font>

   ><font color="orange">DEFAULT_PROXY</font>
   >
   >这个环境变量是用来给站点自动添加代理的，主要可以在 CC 同步和 PTPP 导入时自动为站点添加代理
   >
   >格式为 http://192.168.1.99:7890
   ><font color="orange">WEBUI_PORT</font>
   >这个环境变量重新启用，并作为对外服务端口，包括 WEB 界面和 APP 访问地址端口均为此端口或此端口对应的映射端口，现默认值为 5173

   ![image-20240423223813406](https://img.ptools.fun/blog/image-20240423223813406.png)

   ![image-20240423223937689](https://img.ptools.fun/blog/image-20240423223937689.png)

   ![image-20240423224711878](https://img.ptools.fun/blog/image-20240423224711878.png)	

4. 修改完成之后就可以下一步，下一步，点击完成就会自动下载镜像，并生成容器。

   ![image-20240423225126927](https://img.ptools.fun/blog/image-20240423225126927.png)

   ![image-20240423225143288](https://img.ptools.fun/blog/image-20240423225143288.png)

   ![image-20240423225159267](https://img.ptools.fun/blog/image-20240423225159267.png)

   ![image-20240423225219131](https://img.ptools.fun/blog/image-20240423225219131.png)

   6. 如果这个报失败，Exit Code 1，不要急，点击关闭。exit code 0 表示成功

      ![image-20240423225505137](https://img.ptools.fun/blog/image-20240423225505137.png)

      1. 检查 token 和邮箱是否正确

      2. 检查授权文件是否放到 db 文件夹

      3. 点击项目名称，进去之后会看到 harvest 下面有一行红字，这里就是显示我们没有创建 sites 文件夹，到 harvest 下手动穿件 sites 文件夹，重新启动，
         	![image-20240423225803211](https://img.ptools.fun/blog/image-20240423225803211.png)![image-20240423225701445](https://img.ptools.fun/blog/image-20240423225701445.png)

         ![image-20240423230016836](https://img.ptools.fun/blog/image-20240423230016836.png)

   7. 此时你只要等几分钟，就可以访问 5173 映射出来的端口了

      1. 因为默认打开了自动更新和自动测速，需要等待启动完成

      2. 希望看到进度的可以点击容器名称，然后点右上角的操作=>打开终端机查看实时日志

      ![image-20240423230310554](https://img.ptools.fun/blog/image-20240423230310554.png)

![image-20240423230328333](https://img.ptools.fun/blog/image-20240423230328333.png)

![image-20240423230515275](https://img.ptools.fun/blog/image-20240423230515275.png)


## 手动安装

> <font color="red">如果你是套件版本的下载器，请使用 `docker-compose` 方式安装，手动方式无法映射配置文件夹</font>


1. 在 docker 文件夹下创建 harvest，在 harvest 下创建 db 文件夹

   ![image-20240423223215593](https://img.ptools.fun/blog/image-20240423223215593.png)

   ![image-20240423223236144](https://img.ptools.fun/blog/image-20240423223236144.png)

   ![image-20240423223252435](https://img.ptools.fun/blog/image-20240423223252435.png)

   ![image-20240423223312220](https://img.ptools.fun/blog/image-20240423223312220.png)

   ![image-20240423223358710](https://img.ptools.fun/blog/image-20240423223358710.png)

2. 下载镜像
   	镜像名称：`newptools/harvest`  
   	命令：`docker pull newptools/harvest`

3. 开始启动容器
   	
   ![](https://img.ptools.fun/blog/2024-05-07_231333_0615730.3149943869805871.png)

4. 点击运行，需要改名的改名 
   	

![](https://img.ptools.fun/blog/2024-05-07_231502_0368180.47790518934812565.png)  

6. 开始配置
   	

![](https://img.ptools.fun/blog/2024-05-07_231552_8529630.7279347414166042.png)  
	1. 端口映射
			容器默认占用三个端口：5173(WEBUI 端口)，8000(对外服务端口)，6379（缓存服务端口），9001（服务查看端口）,
			如果使用 bridge 模式，根据需要映射自己的端口即可，默认配置 5173 即可，其他两个无需配置，9001 端口可以通过/api/logging 进行访问，不在赘述。  
	![](https://img.ptools.fun/blog/2024-05-07_231750_2931440.41039802805284176.png)  
	2. 文件夹映射

* 文件夹映射两个，db （数据存放目录）与 sites（自定义站点配置文件目录，非必需，能自己搞配置文件的可以映射）

* 但是如果需要辅种，还需要映射下载器相关目录

  > <font color="orange">下载器文件夹的映射规则，</font>
  >
  > 
  >
  > 冒号前面是本地文件夹，
  > 下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射，<font color="yellow">此处有调整，QB 下载器和 TR 下载器均映射到 config 一级</font>  
  >
  > 
  >
  > <font color="red">QB：你的QB 种子文件夹所在的上一级，映射到 ~~BT_backup~~<font color="orange"> `config`</font></font>    
  > <font color="red">TR： TR 下载器配置文件夹中种子文件夹所在的上一级，映射到~~torrents~~<font color="orange"> `config`</font></font>  
  > 右面是容器内文件夹：
  > <font color="red">固定格式，必须是/downloaders/开头，后面自定义</font>  


![](https://img.ptools.fun/blog/2024-05-07_232108_8450130.762797907881636.png)


最简文件夹配置

> <font color="red" size=6>sites 文件夹 为自定义站点配置文件夹，如果内置站点满足需求，可以不映射</font>
> ![](https://img.ptools.fun/blog/2024-05-07_232213_8541350.006351633074616503.png)  
> 下载器文件夹映射  

![](https://img.ptools.fun/blog/2024-05-07_232540_7969160.34788344008074135.png)

![](https://img.ptools.fun/blog/2024-05-07_232717_6600050.8735151297372008.png)

![](https://img.ptools.fun/blog/2024-05-07_232732_2670550.8616426086482857.png)  
	3. 环境变量修改
需要修改的不多，网络模式使用HOST 模式的，在这里修改有冲突或者自己想要的端口  

> 另有环境变量： `DEFAULT_PROXY`，用于设置 CC 和 PTPP导入站点时为站点添加默认代理，同时用于豆瓣资源爬取时的默认代理
> `WEBUI_PORT`
>
> > <font color="orange"> 这个环境变量重新启用，并作为对外服务端口，包括 WEB 界面和 APP 访问地址端口均为此端口或此端口对应的映射端口，现默认值为 5173</font>  

   ![](https://img.ptools.fun/blog/2024-05-07_233342_1450920.18483479215682186.png)

7. 配置完成，启动即可

![](https://img.ptools.fun/blog/2024-05-07_233447_1625710.8520370494044811.png)