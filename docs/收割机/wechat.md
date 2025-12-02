---
title: 07. 企业微信
description: 
published: true
date: 2025-12-01T04:41:07.061Z
tags: 
editor: markdown
dateCreated: 2025-06-01T07:53:26.109Z
---

# 企业微信使用教程

> PS: 如果只使用企业微信通知，需要配置可信 IP
>
> ### <font color=orange>如果需要配置回调，需要域名为 A 记录，AAAA 记录【即 IPV6 公网域名】不可用</font>

## 更新 Docker 到最新版本，镜像最低需要 2025 年 5 月 22 日发布的版本

## 创建企业微信应用

   1. 登录企业微信

      [打开](https://work.weixin.qq.com/)

   2. 在应用管理-自建应用中创建应用

      1. 点击我的企业，可以在页面最下方找到企业 ID，通常是 ww 开头，复制留存 [进入我的企业]( https://work.weixin.qq.com/wework_admin/frame#/profile)

         <img src="https://img.ptools.fun/blog/image-20250601153329530.png"  align="left" />

      2. [进入应用管理](https://work.weixin.qq.com/wework_admin/frame#/apps)

         <img src="https://img.ptools.fun/blog/image-20250601152012204.png"  align="left" />

      3. [创建应用](https://work.weixin.qq.com/wework_admin/frame#/apps/createApiApp)

         1. 选择图标【随便找个图就行】
         2. 填写应用名称 【自己能识别是哪个应用就行】
         3. 应用介绍随便填
         4. 可见范围：安全起见，只选择自己就行

      4. 如此这般，应用便创建完成了

      5. 点击应用图表，即可进入应用管理

## 配置回调地址

   1. 点击进入应用后，可以看到应用简介，在这里你可以拿到应用 ID 和 Secret，留存备用

      <img src="https://img.ptools.fun/blog/image-20250601153036426.png"  align="left" />

      Secret 因为安全原因会发到企业微信客户端查看

      <img src="https://img.ptools.fun/blog/image-20250601153110967.png"  align="left" />

      <img src="https://img.ptools.fun/blog/image-20250601153138079.png"  align="left"/>

   2. 你需要将收割机的访问地址通过反代或者内网穿透、frp、ngfork 等处理，让收割机可以通过广域网访问

      > Token => 系统设置 => 安全 Token

      然后，你的收割机企业微信回调接口地址：`{你的收割机访问地址}/api/option/wechat?source=harvest&token={你的 Token}`

      大括号不要，例如：`https://www.baidu.com/api/option`/wechat?source=harvest&token=123456

   3. 找到接收消息->配置 API 接收

      <img src="https://img.ptools.fun/blog/image-20250601152705311.png"  align="left"/>

   4. 在新界面，填入回调地址，并随机生成 Token 与 EncodingAESKey

      <img src="https://img.ptools.fun/blog/image-20250601152821728.png"  align="left"/>

   5. 在收割机中填入 Token 与 EncodingAESKey，这里用到了前面获取的所有信息

      1. 背景图可以填写自己喜欢的图片的网络地址，需要`http://`或`https://`开头，例如：Bing 随机图网址：https://bing.img.run/rand_1366x768.php
      2. 固定代理：如果没有固定公网地址，可以使用第三方提供的企业微信代理，或者自建企业微信代理，并将代理的公网地址填入到可信 IP 中
      3. 接收 ID 不懂的直接填写`@all`

      <img src="https://img.ptools.fun/blog/image-20250601152936091.png" alt="image-20250601152936091"  align="left"/>

   6. 收割机中配置好新奇微信相关信息后，在网页中点击保存即可

      <img src="https://img.ptools.fun/blog/image-20250601154042372.png" alt="image-20250601154042372"  align="left"/>

## 回调使用

   1. 更新菜单：第一次配置菜单，直接在企业微信 APP 中发送消息：`更新菜单`即可，后续可在菜单中选择更新菜单

      <img src="https://img.ptools.fun/blog/image-20250601154506686.png"  align="left"/>

      <img src="https://img.ptools.fun/blog/image-20250601154533906.png" align="left"/>

   2. 发送邀请：非试用用户可以邀请他人试用收割机，每个月可以邀请三个邮箱，每个邮箱只能被邀请一次，在应用中直接发送电子邮箱地址即可触发邀请

​		<img src="https://img.ptools.fun/blog/image-20250601154808618.png" alt="image-20250601154808618" />	