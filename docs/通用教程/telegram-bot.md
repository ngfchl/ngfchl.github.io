---
title: Telegram 机器人
description: 
published: true
date: 2025-12-01T04:41:32.331Z
tags: 
editor: markdown
dateCreated: 2024-09-29T13:55:37.043Z
---

# Telegram机器人

## 申请TOKEN

1. 首先在 telegram 中搜索 botfather，并和 botfather 开始对话：

   ![img](https://pic2.zhimg.com/80/v2-d57c351b90448514bfd57ea8d3318251_720w.webp)

2. 按下 "/start" 之后，botfather 会回复如下信息：

   ![img](https://pic4.zhimg.com/80/v2-b7c2984c7837e2bd6d7c39dc2d3ed71f_720w.webp)

3. 紧接着回复 "/newbot" 开始创建你的 bot，botfather 会要求你输入 bot 的名字和 bot 用户名，bot 名会显示在搜索界面，而 bot 的 username 在搜索 bot 和添加 bot 入 group 的时候会起作用（你无法通过搜索 bot 名来添加 bot 如群组）。username 必须以 bot 或者_bot（不区分大小写）结尾：如 ABCBot，ABC_bot。

   ![img](https://pic1.zhimg.com/80/v2-fe5b2c44d8ed7444ad63304991e8a574_720w.webp)

4. 完成了这两项后，botfather 会给你 bot 专属的 token：

   ![img](https://pic1.zhimg.com/80/v2-91965cce46669cd5452eca401013167c_720w.webp)

## 获取chat_id

1. 搜索添加机器人：`@getidsbot`

   ![image-20230629110117640](https://img.ptools.fun/blog/image-20230629110117640.png)

2. 点击`/start`

   ![image-20230629110145718](https://img.ptools.fun/blog/image-20230629110145718.png)

3. 获取ID，ID后面的一串红色数字，就是你的ID

   ![image-20230629110242853](https://img.ptools.fun/blog/image-20230629110242853.png)

## 添加BOT通知

```
[notify.telegram_push]
name = 'Telegram通知'
telegram_token = '前文获取的TOKEN'
telegram_chat_id = '前文获取的ID'
[notify.telegram_push.proxy]
http = '你的代理地址'
https = '你的代理地址'
```

