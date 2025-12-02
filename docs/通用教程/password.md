---
title: Django 密码错误处理
description:
published: true
date: 2025-12-01T04:41:25.476Z
tags: [ ]
editor: markdown
dateCreated: 2024-09-29T13:59:08.195Z
---

# 忘记密码



## 无法登陆、更新出错之提示密码错误处理

1. 第一次登录修改账号密码之后，一定要记牢了，不小心删除数据库文件也会报密码错误，流程都是相似的，自行琢磨一下
2. 更新出错再第 3 步跳转到第 5 步进行即可
3. 密码不正确也有可能是初始化是密码未创建成功

## 命令行方式处理

1. 进入宿主机命令行

2. 查找容器 ID：`sudo docker ps -a`

   ![img.png](/images/common/img.png)

3. 进入容器命令行：`docker exec -it 9a1c6bdafe9a /bin/bash`

4. 进入项目文件夹：`cd /ptools` `cd /app`

5. 创建用户或修改密码

   > 提醒：输入密码无回显，即无 ***，输入完确认即可

   修改密码命令：`python manage.py changepassword 你的用户名`

   创建用户命令：`python manage.py createsuperuser`
