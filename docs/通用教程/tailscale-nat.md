---
title: Tailscale 内网互访
description: 
published: true
date: 2025-12-01T04:41:28.890Z
tags: 
editor: markdown
dateCreated: 2024-09-29T14:36:01.898Z
---

# Tailscale虚拟组网

> 本教程可以实现所有登录同一账号的设备互相访问局域网，NAS下的操作基本相同

例：你家里的网络是192.168.1.*，设置之后，所有登陆了与家里使用的Tailscale相同账号的设备，可以直接使用192.168.1.*来访问家里的设备，比如，NAS的地址是192.168.1.222:5000，手机打开Tailscale后在4G/5G网络下可以直接使用192.168.1.222:5000来访问NAS

## <font color="red">本文用的IP地址释义</font>

<font color="red">如你你的NAS访问地址是`192.168.1.*`，下文中所有的IP地址为：`192.168.1.0` </font>

<font color="red">如你你的NAS访问地址是`192.168.2.*`，下文中所有的IP地址为：`192.168.2.0`</font>

<font color="orange">以此类推
</font>

## Unraid
1. 应用市场安装Tailscale应用，选择这个：`deasmi/unraid-tailscale`

   ![image-20230613085050866](https://img.ptools.fun/blog/image-20230613085050866.png)

2. 安装无需任何更改，直接应用即可

   ![img](https://img.ptools.fun/blog/image-20230613084935845.png)

3. 打开日志，点击登录链接，暂无图

4. 选择你的账户登录即可，暂无图

5. 点击docker，打开控制台输入以下命令，打开IP转发功能，并添加路由

```Bash
# 打开ipv4转发
echo 'net.ipv4.ip_forward = 1' | tee -a /etc/sysctl.conf
# 打开IPV6转发
echo 'net.ipv6.conf.all.forwarding = 1' | tee -a /etc/sysctl.conf
# 启用转发
sysctl -p /etc/sysctl.conf
# 设置子网：·192.168.1.0/24· 替换成你的设备所在的子网网段
./tailscale up --advertise-routes=192.168.1.0/24
# 如果报以下信息
Some peers are advertising routes but --accept-routes is false
# 请使用这个命令
./tailscale up --advertise-routes=192.168.1.0/24 --accept-routes=true
```

1. 打开taiscale控制台，选择刚才操作的设备

   ![img](https://img.ptools.fun/blog/image-20230613085057186.png)

2. 打开路由转发，即可使用已在tailscale子网中的设备访问你配置的子网内的所有设备

   ![img](https://img.ptools.fun/blog/image-20230613085111936.png)

   ![img](https://img.ptools.fun/blog/image-20230613085118970.png)
   
## 群晖套件版

1. 套件请自行安装
2. 安装完毕后点击Tailscale图标即可打开登录界面，自行注册登录
3. 登录SSH，运行命令即可：
	```bash
	sudo tailscale up --advertise-routes=192.168.1.0/24 --accept-routes=true
	```

