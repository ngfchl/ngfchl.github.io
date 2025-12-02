---
title: Unraid - WireGuard
description: 
published: true
date: 2025-12-01T04:40:33.756Z
tags: 
editor: markdown
dateCreated: 2024-09-29T14:38:01.284Z
---

# WireGuard 基础使用



> 本文工具均用于异地办公和局域网互访，请勿用于违法犯罪。

## 准备工作



1. unraid 设备一台，版本 `6.8` 以上，本人使用环境 `6.11.1`

   ![image-1669616849221](https://img.ptools.fun/blog/image-1669616849221.png)

2. 公网 IP（没有 v4 公网的，V6 也可以，动态公网请使用 DDNS）

3. 电脑一台

4. 本地局域网 IP 不可与家中局域网 IP 在同一网段。

## 中继服务器节点设置



### unraid 设置

1. 登录 Unraid，打开设置 =》VPN 管理器

   

   ![image-1669616868050](https://img.ptools.fun/blog/image-1669616868050.png)

   

   

2. 默认如下界面中只有 `wg0`，endpoint 填写你的公网 IP 或者域名，后面的端口号默认为：`51820`, 可以随意更改，不与其他服务冲突即可。

   

   ![image-1669616889040](https://img.ptools.fun/blog/image-1669616889040.png)

   

   

3. 点击`生成密钥对`，其他可以保持默认，应用即可。点击右上角的`无效`，变绿后，服务即已经运行起来了。

![image-1669616901120](https://img.ptools.fun/blog/image-1669616901120.png)





### 路由器设置

> 如果你的设备和路由器都打开了 UPNP，本操作可以略过

在路由器中添加端口映射，内网选择你的 unraid 局域网 IP，端口号填写上面你设置的端口号，协议选择 UDP 即可，保存，中继节点服务器设置完成。

## Peer 节点设置



1. 添加节点：

   

   ![image-1669616926336](https://img.ptools.fun/blog/image-1669616926336.png)

   

2. 会打开这样一个窗口，`peer name` 选项为节点名称，可以自定义

   

   ![image-1669616953337](https://img.ptools.fun/blog/image-1669616953337.png)

   

3. 选择节点类型

   

   ![image-1669616968947](https://img.ptools.fun/blog/image-1669616968947.png)

   

4. 生成密钥和密钥对

   

   ![image-1669616983462](https://img.ptools.fun/blog/image-1669616983462.png)

   

5. 点击应用，保存设置，即完成节点添加，会弹窗提示你节点已更新。

   

   ![image-1669616999027](https://img.ptools.fun/blog/image-1669616999027.png)

   

6. 使用节点

   1. 手机电脑下载 Wireguard 客户端

   2. 点击节点右上角的小眼睛会弹出节点信息

      

      ![image-1669617018240](https://img.ptools.fun/blog/image-1669617018240.png)

      

      

      ![image-1669617031060](https://img.ptools.fun/blog/image-1669617031060.png)

      

   3. 手机端可以打开 Wireguard 客户端扫描二维码添加节点，电脑端可以点击下载压缩包，选择从文件导入

      

      ![image-1669617047695](https://img.ptools.fun/blog/image-1669617047695.png)

      

   4. 激活隧道即可使用局域网 IP 访问家中资源。