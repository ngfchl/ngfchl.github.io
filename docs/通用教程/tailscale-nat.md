---
title: Tailscale 内网互访
description:
published: true
date: 2025-12-01T04:41:28.890Z
tags: [ Tailscale, 虚拟组网, ]
editor: markdown
dateCreated: 2024-09-29T14:36:01.898Z
---

# Tailscale虚拟组网

> 本教程可以实现所有登录同一账号的设备互相访问局域网，NAS下的操作基本相同

例：你家里的网络是192.168.1.*，设置之后，所有登陆了与家里使用的Tailscale相同账号的设备，可以直接使用192.168.1.*
来访问家里的设备，比如，NAS的地址是192.168.1.222:5000，手机打开Tailscale后在4G/5G网络下可以直接使用192.168.1.222:5000来访问NAS

## <font color="red">本文用的IP地址释义</font>

<font color="red">如你你的NAS访问地址是`192.168.1.*`，下文中所有的IP地址为：`192.168.1.0` </font>

<font color="red">如你你的NAS访问地址是`192.168.2.*`，下文中所有的IP地址为：`192.168.2.0`</font>

<font color="orange">以此类推
</font>

## Unraid下的操作

1. Unraid7.2已经自带Tailscale不再需要另外安装

2. 点击登录，跳转到登录链接，暂无图

3. 选择你的账户登录即可，暂无图

4. 登录后在Tailscale页面=>广告路由，输入自己的子网(192.168.1.*)：`192.168.1.0/24`，点击添加：
   ```
   192.168.1.* => 192.168.1.0/24
   192.168.2.* => 192.168.2.0/24
   192.168.31.* => 192.168.31.0/24
   192.168.20.* => 192.168.20.0/24
   ```
5. 找到高级网络选项，选择`允许Tailscale子网`

6. 重启Tailscale。

7. 了解Linux的，可以使用如下命令

```Bash
# 启动Tailscale
tailscale up -d
# 打开页面显示的登录链接登录

# 请使用这个命令
tailscale up --advertise-routes=192.168.1.0/24 --accept-routes=true
```

## 群晖套件版

1. 套件请自行安装
2. 安装完毕后点击Tailscale图标即可打开登录界面，自行注册登录
3. 登录SSH，运行命令即可：
   ```bash
   sudo tailscale up --advertise-routes=192.168.1.0/24 --accept-routes=true
   ```

## Taiscale控制台操作

1. 打开taiscale控制台，选择刚才操作的设备

   ![img_2.png](/images/common/img_2.png)

2. 打开路由转发，即可使用已在tailscale子网中的设备访问你配置的子网内的所有设备

   ![img_1.png](/images/common/img_1.png)

   ![img_3.png](/images/common/img_3.png)


