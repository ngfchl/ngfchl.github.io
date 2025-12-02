---
title: 06. SSH 使用
description: 
published: true
date: 2025-12-01T04:41:03.566Z
tags: 
editor: markdown
dateCreated: 2024-11-22T18:27:59.675Z
---

# 收割机 APP 肿 SSH 终端的使用

收割机APP 肿的 SSH 仅用于 Docker 管理，因此需要用户具有 docker 权限，部分 NAS SSH 用户是没有 docker 权限的，因此，需要自行添加：

## 群晖

1. 界面添加

   1. 控制面板=>用户与群组=>用户群组=>添加用户群组：docker

      ![img.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/ssh/img.png)

   2. 用户账号=>用户名=>编辑=>用户群组=>勾选 docker

      ![img_1.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/ssh/img_1.png)

   3. 保存

2. 命令行添加

   1. 打开 SSH

      ![img_2.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/ssh/img_2.png)

   2. SSH 登录群晖

   3. 添加用户组

      ```
      sudo synogroup --add docker
      ```

   4. 用户添加 docker 权限

      ```
      sudo synogroup --memberadd docker 用户名
      ```

      用户名替换为你的用户名

   5. 重启群晖



## 飞牛/极空间/绿联/UNAS

> 基于 Debian 的都可以如此操作

1. 打开 SSH

   ![img_3.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/ssh/img_3.png)

2. SSH登录 NAS

3. 添加用户组，已存在会提示`already exists`，不存在会提示添加成功

   ```
   sudo groupadd docker
   ```

   ![img_4.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/ssh/img_4.png)

4. 用户添加 docker 权限

   ```
   sudo usermod -aG docker 用户名
   ```

   用户名替换为你的用户名

5. 重启 NAS