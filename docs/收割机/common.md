---
title: 05. 常见问题
description:
published: true
date: 2025-12-01T04:40:44.595Z
tags: [ ]
editor: markdown
dateCreated: 2024-09-29T14:33:37.633Z
---

# 常见问题

## 主辅分离

首先，要保证，要辅种的和下载的两个下载器映射的下载路径一致

这是下载器的路径映射	

|              | 下载器 A                     | 下载器 B                     |         |
|--------------|---------------------------|---------------------------|---------|
| 种子路径         | /volume1/docker/download1 | /volume1/docker/download1 | 这个可以不一致 |
| 物理路径（NAS 路径） | /volume1/downloads        | /volume1/downloads        | 保持一致    |
| 资源映射路径       | /downloads                | /downloads                | 保持一致    |

收割机中的路径映射

|              | 下载器 A[qb]                                    | 下载器 B[tr]                        |      |
|--------------|----------------------------------------------|----------------------------------|------|
| 种子路径         | /volume1/docker/download1/config/qBittorrent | /volume1/docker/download1/config |      |
| 收割机内路径       | /downloaders/qbt1                            | /downloaders/tr1                 | 各自映射 |
| 添加下载器时选择种子路径 | /downloaders/qbt1                            | /downloaders/qbt1                | 保持一致 |

然后，负责下载的，勾选刷流，保证不会对其辅种

![img.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img.png)

然后，辅种的下载器的种子路径选择负责下载的下载器的种子路径
然后执行辅种任务即可

担心出问题的，可以使用下载器菜单上的辅种操作

## 抓不到发种数据

发种是技术活，很多人都没发过种，我发过种的几个站点都适配过了，如果你发过种的站点没抓到数据，找到你的发种历史，拷贝发种历史那一块的 HTML 代码给我，你给我 html 我才能去写 Xpath，或者参考自行适配搞一下，然后给 xpath 发我

步骤如下：

1. F12打开开发工具窗口，

2. 访问个人页面=> 点击发布种子

   ![img_1.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_1.png)

3. 在开发者工具=>网络，里面找到getusertorrentlistajax.php，点击，在右侧找到响应
   ![img_2.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_2.png)

4. 如果你懂 xpath，直接提取发种数，不懂的可以拷贝所有内容发给我处理

   ![img_3.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_3.png)




## 城市无法辅种

城市的 passkey 有问题，需要到种子列表页拷贝种子下载链接，然后提取 cuhash，填到 passkey 里面

![img_4.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_4.png)	

在上图中左下角的小云朵上右键点击，复制链接，会得到一个如下所示的种子链接，提取 xxxx 部分，在收割机中填写到 passkey 部分保存即可

```
https://hdcity.city/download?id=62599&cuhash={xxxxxxxxxxxxxxxxxx}
```



## 下载授权文件失败

Docker 容器内部一直下载授权文件失败的，可以使用下面的命令手动下载授权文件：

```bash
curl -s -D - "https://repeat.ptools.fun/api/user/auth/file" --data-raw "{\"email\":\"你的邮箱\",\"token\":\"你的授权码\"}" -o encrypted_key.bin

# 例子
curl -s -D - "https://repeat.ptools.fun/api/user/auth/file" --data-raw "{\"email\":\"100000@qq.com\",\"token\":\"eyJhbGciOiJIUzI1NiIpXVCJ9.eyJNzM5ODh9.XIu9p-CAk8x0R-LE\"}" -o encrypted_key.bin
```



## `Invalid scheme component`
更新站点数据时报错：`Invalid scheme component`
![img_5.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_5.png)

这种一般都是代理地址不完整导致的，代理地址必须带上协议，也就是scheme： `http://`或者 `socks5://`

如果你在环境变量里面设置了错误的代理地址，可以修改环境变量后，在 APP 右上角的加号里选择批量设置修改站点信息中错误的代理地址

## 做种体积拿不到的

请检查 uid 是否正确

## 注册时间不正确的

请在浏览器安装油猴脚本后，访问控制面板，看到站点添加成功或者更新成功后刷新站点数据

## 皇后拿不到时魔

检查 Cookie 中是否有`c_lang_folder=`这个字段，如果有`c_lang_folder=cht`请修改为`c_lang_folder=chs`后保存重试。

## Emby联动

假如，你的收割机访问地址是：`http://192.168.1.2:28000`，那么，你的EMBY 联动地址就是：

```
http://192.168.1.2:28000/api/option/emby/webhook
```

然后打开 Emby，进入设置，在首选项中找到通知

```
# 当下仅支持这几种事件，不在列表的会发送一条 Emby 事件内容的消息
event_map = {
        "library.new": "媒体入库",
        "library.deleted": "资源删除",
        "system.notificationtest": "通知测试",
        "user.authenticated": "用户登录",
        'playback.start': "开始播放",
        'playback.pause': "暂停播放",
        'playback.unpause': "恢复播放",
        'playback.stop': "停止播放",
    }
```

> <font color=orange>当下仅支持这几种事件，不在列表的会发送一条 Emby 事件内容的消息</font>

添加通知=> WebHooks通知：

![img_6.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_6.png)


## 日志页面

收割机的 9001 端口是服务调度页面，里面可以看到各个服务的状态以及日志。

如果你是 bridge 桥接模式部署，那就是访问 9001 映射的端口

如果是 HOST 主机模式部署，就是直接访问 9001，有部分同学 9001 端口占用的，可以在环境变量中修改为其他端口，然后访问修改后的端口即可。

页面的每一行代表一个服务，绿色表示服务启动了，但是并不能代表服务正常，部分异常，例如端口冲突等异常，需要进入到日志才能查看到。

常见异常日志：

```
Address already in use. # 端口已被占用，常见于 Redis 服务
```

最后一列打开的页面为当前服务的实时日志，页面会实时刷新，调试时可以打开这个日志页面查看

![img_7.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_7.png)

## 进入调试后台

在 APP 端手动添加数据虽然添加了一定的验证，但是，总有那么点意外，导致数据无法加载或其他情况，又无法手动调整，故开放调试模式，打开调试模式需要添加活着修改环境变量 `LOGGER_LEVEL`为`DEBUG`，修改之后保存镜像，即可访问调试后台，如下文的 Compose 中所示，harvest 后台地址为：`http://192.168.1.1:28000`，调试后台地址为 harvest 后台地址加上`/admin`，即：`http://192.168.1.1:28000/admin`

> 进入调试模式需要映射8000端口或者HOST模式直接访问8000端口

> 进入调试后台后，可以在左侧的菜单中选择出问题的项目，找到出问题的条目，手动修改或者删除即可

调试模式打开方式：

1. Docker-Compose

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
         - ./qbittorrent1:/downloaders/qbt1 #  qb下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
         - ./tr2:/downloaders/tr2  #  Tr下载器种子文件映射目录， 前面为本地路径，后面为容器内路径，固定格式   如不需要辅种功能，下载器可以不映射
       environment:
         - TOKEN=YOUR-TOKEN # 填写你获取到的授权码
         - DJANGO_SUPERUSER_USERNAME=admin
         - DJANGO_SUPERUSER_EMAIL=YOUR-EMAIL # 填写你获取授权码使用的邮箱
         - DJANGO_SUPERUSER_PASSWORD=adminadmin
         - "LOGGER_LEVEL=DEBUG" # <font size=6>增加此行即可打开调试模式，默认为 INFO，可选值 INFO，DEBUG，ERROR，TRACE</font>
         - WEBUI_PORT=5173 # WEB访问端口
         - DJANGO_WEB_PORT=8000 # Django端口
         - REDIS_SERVER_PORT=6379 # 队列缓存服务
         - FLOWER_UI_PORT=5566 # 自动任务执行列表
         - SUPERVISOR_UI_PORT=9001 # 服务管理端口
         - CloudFlareSpeedTest=true # 测速开关
         - DEFAULT_PROXY=YOUR-PROXY # 此代理会在 CookieCLoud 同步时直接设置为同步站点的代理，已为部分不能使用代理访问的站点屏蔽，如果不打算设置代理，请删掉此项
       restart: always
       hostname: harvest
       container_name: harvest
       network_mode: bridge # 桥接模式，根据需要换成host模式（如：需要使用 IPV6的场景）
   ```

2. 手动添加环境变量
   名称：`LOGGER_LEVEL`	值：`DEBUG`

## 隐私模式进入

在仪表盘页面长按，会跳出菜单，下拉可以看到隐私模式，勾选隐私模式，首页站点名称会显示为*


## 启动失败/授权过期

1. 检查授权文件是否生成并放入 db 文件夹
2. 检查环境变量中的 Token 与 Email 是否填写

这两项都必须填写才能启动 Docker

## 签到失败

1. 部分站点有盾，目前无法签到
   	1. 红叶
   	2. 我堡
   	3. 优宝
   	4. 农场
   	5. 猪猪
2. 北洋军阀站点限制，抓到自动签到会BAN，故不支持自动签到
3. 限时签到（有可能是服务器时间设置不准确）U2、海胆均设置在上午 9 点以后才执行签到

## 数据更新失败/注册日期异常

1. 检查代理地址
2. 检查 Cookie
3. 检查 UID 是否填写

## 油猴不显示操作按钮

油猴安全验证已修复并生效，请按油猴教程添加油猴 Token

## 辅种时出现不再本下载器的种子

下载器种子目录映射必须是一对一的，请检查下载器种子目录是否映射并正确选择

## 默认代理设置

1. 安装 Docker 时，在环境变量中设置默认代理 DEFAULT_PROXY，会在导入站点（CC、PTPP、油猴）时自动为站点添加代理，部分限制代理访问的站点不会自动添加（如 PTT，猪猪等）
2. 但是，如果你没有代理并且忘记删除此环境变量，又导入了站点，导致无法抓取数据和签到，有如下解决方案：
   	方案1. 删除 DB 文件夹下的 data.sqlite3 文件，删除环境变量中的DEFAULT_PROXY，重建容器，重新导入
   	方案2. 批量更换代理功能，在 App 右上角有个批量功能，点击打开窗口，选择代理，填入你的代理地址（`http://xxxxx.xxxxx:xxx`），点击执行即可批量替换

## 批量替换 UA

在 App 右上角有个批量功能，点击打开窗口，选择UserAgent，填入新的 ua，点击执行即可批量替换

## Cannot connect to host xxxxxx.xxx

网络问题，请稍后重试，尝试增删代理

## 每次辅种都有很多失败的，全部卡在校验0%动不了，怎么回事？

校验 0%，可能的原因：

1. 种子文件夹映射或者选择错误 => 检查映射，并确认选择了正确的种子文件夹
2. 种子资源文件被修改过文件加名字或者路径 => 只修改资源最外部文件或者文件夹名称的，程序已做了自动修正，其余的程序方面无能为力，可以手动修正资源名称或者报告站点

## 辅种结果解释 
```
本次获取辅种数据，共31条辅种数据，耗时35.23秒。当前下载器:tr下载器 本次辅种成功推送195个种子，失败84个种子，等待校验的种子数量:1，本次辅种校验种子22个。
```
1. 可能是站点已删种 => 从 IYUU 获取的数据，站点删种并不会通知 IYUU 删除对应种子，可以反馈给 IYUU
2. 种子链接生成出错 => 部分站点种子下载链接生成非常规 PASSKEY 方式，已有部分站点做了处理，
   1. 海豹海豚，必须填写 AuthKey和 Passkey（可以在种子下载地址中获取对应 key）
   2. 馒头需要在线获取，程序已自动处理
   3. 城市的种子下载链接所用并非 PASSKEY，需要在种子列表页的种子下载链接中获取 https://hdcity.city/download?id={种子 id}&cuhash={所需 Key}

## 可以用WatchTower更新Docker吗

可以，镜像本身没有做任何限制

## 天空，皇后如何自动签到啊？

在App系统设置中添加百度ocr信息

[百度ocr获取方式](/通用教程/baidu-ocr)

## 如何自己添加站点

映射/app/sites 文件夹，然后里面会有配置文件，你可以参照相似的站点尝试处理规则，也可以发站点给我进行适配

## APP一直报401错误

这种是 docker验证auth 失败，直接在 APP 端退出重新登录即可

![img_8.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_8.png)

## APP一直报404错误

![img_9.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_9.png)

APP 端报 404 错误多数是服务未能正常启动导致的，这是我们可以检查 django 的服务日志

![img_10.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_10.png)

这是中间就会web 访问的日志信息

### 解决方案

>  <font color=orange>下面的解决方案任选其一</font>

#### 1. 如果日志中报错为Redis：LOADING Redis is loading the dataset in memory

删除 db 文件夹下的 rdb文件和appendonlydir 文件夹，然后重启 docker 或者重启 Redis 服务

![img_11.png](/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E5%B8%B8%E8%A7%81/img_11.png)

#### 2. 实用外部Redis服务

1. 添加缓存相关的环境变量：`CACHE_REDIS_CONNECTION`，格式为：`redis://192.168.1.2:6379/1`【最后的 `1`应当是`0-15` 之间的任意一个数字】
2. 添加后台任务缓存相关的环境变量：`CELERY_REDIS_CONNECTION`，格式为：`redis://192.168.1.2:6379/15`

> PS【最后的 `1`应当是`0-15` 之间的任意一个数字，两个尽量选择不同的数字】

> PS2 【两个环境变量如果设置必须一起设置】