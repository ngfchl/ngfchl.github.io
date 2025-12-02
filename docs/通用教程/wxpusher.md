---
title: WxPusher 推送
description: 
published: true
date: 2025-12-01T04:41:42.229Z
tags: 
editor: markdown
dateCreated: 2024-09-29T13:56:25.020Z
---

# WxPusher通知

> 官方文档很详细：[打开官方文档](https://wxpusher.zjiecode.com/docs/#/)

> <font color="red">一定要记得关注自己创建的应用！！！</font>

```toml
[notify]
[notify.wxpusher_push]
name = 'WxPusher通知'
app_id = ''
token = ''
# 可以填写多个，以英文逗号分隔
uids = ''
```



1. 打开网站：[WxPusher 微信消息推送服务 (zjiecode.com)](https://wxpusher.zjiecode.com/admin/login)

2. 微信扫码登录

   ![image-20230629095002740](https://img.ptools.fun/blog/image-20230629095002740.png)

3. 创建新应用

   ![image-20230629095033605](https://img.ptools.fun/blog/image-20230629095033605.png)

   ![image-20230629095054617](https://img.ptools.fun/blog/image-20230629095054617.png)

   

   回调地址：可以不填写，不填写用户关注的时候，就不会有回调，你不能拿到用户的 UID，参考[回调说明](https://wxpusher.zjiecode.com/docs/#/?id=callback)。

   设置 URL：可以不填写，填写以后，用户在微信端打开「我的订阅」，可以直接跳转到这个地址，并且会携带 uid 作为参数，方便做定制化页面展示。

   联系方式：可以不填写，告诉用户，如何联系到你，给你反馈问题。

   关注提示：用户关注或者扫应用码的时候发送给用户的提示，你可以不填写，Wxpusher 会提供一个默认文案。你也可以在用户关注回调给你 UID 的时候，再主动推送一个提示消息给用户。

   说明：描述一下，你的应用，推送的是啥内容，用户通过链接关注，或者在微信端查看的时候可以看到。

4. 查看APP ID

   创建完成应该已经可以看到应用ID，如果你没记下来，可以这样查看

   ![image-20230629095807116](https://img.ptools.fun/blog/image-20230629095807116.png)

4. [获取 appToken](https://wxpusher.zjiecode.com/docs/#/?id=获取apptoken)

   在你创建应用的过程中，你应该已经看到 appToken，如果没有保存，可以通过下面的方式重制它，这个TOKEN只显示一次，忘记了只能重置。

   打开应用的后台 https://wxpusher.zjiecode.com/admin/，从左侧菜单栏，找到 appToken 菜单，在这里，你可以重置 appToken，请注意，重置后，老的 appToken 会立即失效，调用接口会失败。

   ![获取appToken](https://wxpusher.zjiecode.com/docs/imgs/appToken.png)

5.  [获取 UID](https://wxpusher.zjiecode.com/docs/#/?id=获取uid)

   目前有 3 种方式获取 UID：

   1. 关注公众号：wxpusher，然后点击「我的」-「我的 UID」查询到 UID；
   2. 通过[创建参数二维码](https://wxpusher.zjiecode.com/docs/#/?id=create-qrcode)接口创建一个定制的二维码，用户扫描此二维码后，会通过[用户关注回调](https://wxpusher.zjiecode.com/docs/#/?id=subscribe-callback)把 UID 推送给你；
   3. 通过[创建参数二维码](https://wxpusher.zjiecode.com/docs/#/?id=create-qrcode)接口创建一个定制的二维码，然后用[查询扫码用户 UID](https://wxpusher.zjiecode.com/docs/#/?id=query-uid) 接口，查询扫描此二维码的用户 UID；

6. 关注新创建的应用

   ![image-20230629100004595](https://img.ptools.fun/blog/image-20230629100004595.png)

7. 完成