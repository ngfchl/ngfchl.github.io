---
title: 阿里云盘
description: 
published: true
date: 2025-12-01T04:41:18.742Z
tags: ali
editor: markdown
dateCreated: 2024-09-29T13:54:56.538Z
---

# 阿里云盘签到

> 支持多账号


1. 电脑登录阿里云盘
2. F12打开开发者模式
3. 打开控制台，输入代码，即可获取到refresh_token

   ```
   JSON.parse(localStorage.getItem("token")).refresh_token
   ```

   如获取不到，请继续向下操作。
4. 找到应用程序标签，找不到的点小箭头打开更多菜单
  ![](https://img.ptools.fun/blog/202306292341737.png)
5. 找到本地存储，点击展开的域名，在右侧找到TOKEN选项，在下方展示的内容中即可找到refresh_token
  ![image-20230629233701038](https://img.ptools.fun/blog/image-20230629233701038.png)