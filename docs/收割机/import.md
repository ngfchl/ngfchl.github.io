---
title: 03. 站点导入
description:
published: true
date: 2026-06-13T00:00:00.000Z
tags: [ 导入, 导出, CookieCloud, PTPP, 浏览器插件 ]
editor: markdown
dateCreated: 2024-09-29T14:34:14.534Z
---

# 站点导入与数据导入导出

Go Harvest 支持多种导入方式：

- 浏览器插件导入：通过「收割机助手」同步站点 Cookie、添加站点、推送种子和辅助辅种。
- 外部数据导入：从 PTPP、PT-depiler、CookieCloud 等来源导入站点数据。
- 数据备份导入导出：导出当前数据备份，或从备份恢复。
- 旧版收割机导入：导入旧版数据库文件，或通过旧版接口迁移数据。

APP 中导入导出入口集中在「设置中心」的「数据导入导出」区域。导入任务执行完毕会产生通知，建议先配置 [通知配置](/收割机/notify)。

![数据导入导出](/images/import/数据导入导出.png)

## APP 数据导入导出

### 数据备份与恢复

数据导入导出页面用于完整备份和恢复当前 Go Harvest 数据。

常见用途：

- 迁移到新设备或新容器。
- 在升级、换数据库、调整部署前做备份。
- 从备份文件恢复站点、下载器、任务、通知等配置。

操作建议：

1. 导出前确认没有正在运行的导入、迁移或批量任务。
2. 导出的备份文件妥善保存。
3. 恢复备份前先确认目标环境已经初始化并能正常登录。
4. 恢复后刷新站点数据，并检查下载器路径、通知配置和计划任务。

### 外部数据导入

外部数据导入用于从第三方工具导入站点数据，例如 PTPP、PT-depiler、CookieCloud 等。

![外部数据导入收割机](/images/import/外部数据导入收割机.png)

导入前请确认：

- 后端可以访问目标站点。
- Cookie、User-Agent、UID、Passkey 等字段尽量完整。
- 如果站点需要代理，导入后检查站点代理字段。
- 导入完成后建议手动刷新站点数据，确认 Cookie 和 UID 是否正确。

### 导入旧版收割机数据库

旧版数据库导入适合从旧版收割机迁移到 Go Harvest。

![导入旧版收割机数据库](/images/import/导入旧版收割机数据库.png)

注意事项：

- 导入前先备份当前 Go Harvest 数据。
- 旧版 SQLite 数据库文件较大时，上传和处理需要等待。
- 导入后需要检查下载器路径、站点代理、通知渠道和计划任务。
- 如果导入后个别站点无法刷新，优先检查 UID、Passkey、Cookie 和 User-Agent。

### 旧版收割机数据接口导入

如果旧版服务仍可访问，也可以通过旧版接口导入数据。

![旧版收割机数据接口导入](/images/import/旧版收割机数据接口导入.png)

使用建议：

- 确认旧版服务地址、账号和 token 可用。
- 如果旧版服务在内网，Go Harvest 后端所在机器需要能访问旧版地址。
- 接口导入完成后查看通知和服务端日志，确认是否有失败条目。

## 浏览器插件导入 - 收割机助手

由于浏览器权限收紧，部分站点 Cookie 已无法使用 js 脚本获取，特此更换技术栈，使用浏览器插件来获取站点 Cookie 并同步至收割机服务器。

### 插件安装

#### 商店安装

> <font color="orange">目前插件已在 Chrome 商店、Firefox 插件商店、EDGE 插件商店上线，在商店搜索 <font color="red">`收割机助手`</font> 即可。</font>
> <font color="deeporange">Firefox 审核较快，基本上提交就审核，Chrome 商店一天左右，EDGE 审核较慢；着急使用可以使用群内发布的压缩包。</font>

[Chrome 商店](https://chromewebstore.google.com/detail/%E6%94%B6%E5%89%B2%E6%9C%BA%E5%8A%A9%E6%89%8B/ejmjhdnlmpfapjbppphjhojamgjgllln?authuser=0&hl=zh-CN)

[EDGE 商店](https://microsoftedge.microsoft.com/addons/detail/%E6%94%B6%E5%89%B2%E6%9C%BA%E5%8A%A9%E6%89%8B/mmcdpibkihoeamigemkblfbpccadbdkj)

[Firefox 商店](https://addons.mozilla.org/zh-CN/firefox/addon/%E6%94%B6%E5%89%B2%E6%9C%BA%E5%8A%A9%E6%89%8B/)

#### 压缩包安装

[插件压缩包下载](https://github.com/ngfchl/harvest-ext/releases)

> Firefox 下载 `harvest-addon-firefox.xpi` 或者 `harvest-addon-firefox.zip`。
> EDGE / Chrome 下载 `harvest-addon-chrome-local.zip`。
> GitHub 访问不畅时可以使用 GitHub 代理。

1. 首先在微信群或者群组下载对应浏览器的插件压缩包。

   Chrome 系浏览器，包括 EDGE、Chrome、360 等均使用 Chrome 的 zip 包。Firefox 系浏览器使用 Firefox 的 zip 包。

2. 打开浏览器插件管理页面。

   ![插件管理页面](/images/import/img.png)

3. 打开开发者模式。

   ![打开开发者模式](/images/import/img_1.png)

4. 将下载的插件压缩包拖至插件管理页面，安装完成。

### 配置服务器信息

1. 点击插件图标，弹出配置窗口。

   ![插件配置窗口](/images/import/img_2.png)

2. 填写相关字段。

   - 收割机服务器地址。
   - 安全 Token：原油猴 Token。可在 APP 的系统设置中添加安全 Token，可以自定义，也可以使用随机按钮生成。
   - 插件浮窗显示的图片地址，可以填写任意可正常打开的图片地址。

   ![安全 Token 设置](/images/import/img_3.png)

   ![插件图片设置](/images/import/img_4.png)

3. 填写完成后，点击登录鉴权按钮。如果配置正确，会自动保存服务器信息；提示错误时请检查地址和 Token 是否填写正确。

   ![登录鉴权](/images/import/img_5.png)

### Popup 界面

点击插件图标会弹出窗口如下，填写相关信息登录即可。

> <font color=orange>一键添加和清理缓存都必须有这个标签页存在才能正常执行。</font>

![插件 Popup](/images/import/img_6.png)

常用功能：

1. **更新缓存**：插件登录后会自动从服务器拉取站点配置信息、已添加站点信息以及下载器列表。点击此按钮会强制更新缓存信息，减少插件与服务器频繁交互。

   ![更新缓存](/images/import/img_7.png)

2. **显示站点**：显示站点列表，可以快速将站点 Cookie 写入浏览器、更新站点数据、签到等。

   ![显示站点](/images/import/img_8.png)

3. **一键同步**：一键同步已添加站点的 Cookie 信息，此功能仅同步 Cookie 和 User-Agent。

   ![一键同步](/images/import/img_9.png)

4. **一键写入**：将收割机保存的站点 Cookie 写入到浏览器，可用于新电脑或新安装浏览器时快速恢复登录状态。

   ![一键写入](/images/import/img_10.png)

5. **导入模式开关**：打开导入模式时，会显示一键添加按钮，此时可以一键导入未添加的站点。

   ![导入模式开关](/images/import/img_11.png)

   站点添加成功后会关闭当前页面，未关闭的站点就是添加失败的，可以手动点击同步数据按钮。

   如果个人中心或者控制面板打开后页面自动关闭，请关闭导入模式。

6. **一键添加**：导入模式打开后才会显示。点击按钮会筛选未添加的站点列表，同时在本地 Cookie 信息中筛选访问过的站点，访问站点配置文件中设定的控制面板地址，打开页面后触发站点信息同步。

   > <font color="orange">一键添加结束之后，请记得关闭导入模式，否则访问站点个人中心或者控制面板时可能会被自动关闭。</font>

   ![一键添加](/images/import/img_12.png)

7. **清理缓存**：逐一打开所有站点的每个域名，并清理收割机写入本地存储的信息。插件与服务器交互正常时请勿随意操作，耗时较久。

   ![清理缓存](/images/import/img_13.png)

### 错误处理

遇到错误时，请按 F12 到控制台或 Console 查看报错信息。

![错误处理](/images/import/img_14.png)

### 插件使用

插件的使用逻辑与油猴脚本基本保持一致，但也新增了一些功能。

#### 站点信息同步

访问个人信息页或者控制面板页面时会自动同步数据，点击同步数据会跳转至控制面板页面后自动同步。

![站点信息同步](/images/import/img_15.png)

#### 下载种子

在种子列表页面会显示下载全部和下载免费按钮，点击后会弹出下载器选择界面。qBittorrent 下载器显示分类，Transmission 下载器显示常用文件夹，点击即可开始下载。

![下载种子列表](/images/import/img_16.png)

在种子详情页会显示 `下载到` 按钮。该功能与上一条一致，区别是只下载当前种子。

![下载种子详情](/images/import/img_17.png)

#### 辅种助手

辅种助手仅支持 IYUU 支持的站点。助手会从 IYUU 读取本种子已经发布的站点信息，同时显示可以发布的站点。因数据来源不齐全，可能会有错漏。

![辅种助手](/images/import/img_18.png)

## PTPP / CookieCloud 导入

PTPP、PT-depiler、CookieCloud 等外部来源统一在 APP 的外部数据导入入口中处理。

![外部数据导入收割机](/images/import/外部数据导入收割机.png)

导入建议：

- PTPP 备份前确认允许 PTPP 操作 Cookie，并勾选备份 Cookie。
- CookieCloud 导入前先在设置中心配置 CookieCloud 参数。
- 首次导入站点时会获取 UID 和 Passkey，耗时可能较长。
- 导入完成后刷新站点数据，检查 UID、Passkey、Cookie、User-Agent 和代理字段是否正确。
- 导入任务完成后会有通知，通知配置见 [通知配置](/收割机/notify)。

## 数据备份导入导出

数据导入导出页面用于完整备份和恢复当前 Go Harvest 数据。

![数据导入导出](/images/import/数据导入导出.png)

常见用途：

- 迁移到新设备或新容器。
- 在升级、换数据库、调整部署前做备份。
- 从备份文件恢复站点、下载器、任务、通知等配置。

恢复备份前建议先确认目标环境已经初始化并能正常登录。恢复后刷新站点数据，并检查下载器路径、通知配置和计划任务。

## 旧版收割机数据导入

旧版数据导入适合从旧版收割机迁移到 Go Harvest。

### 导入旧版数据库

![导入旧版收割机数据库](/images/import/导入旧版收割机数据库.png)

注意事项：

- 导入前先备份当前 Go Harvest 数据。
- 旧版 SQLite 数据库文件较大时，上传和处理需要等待。
- 导入后需要检查下载器路径、站点代理、通知渠道和计划任务。
- 如果导入后个别站点无法刷新，优先检查 UID、Passkey、Cookie 和 User-Agent。

### 通过旧版接口导入

如果旧版服务仍可访问，也可以通过旧版接口导入数据。

![旧版收割机数据接口导入](/images/import/旧版收割机数据接口导入.png)

使用建议：

- 确认旧版服务地址、账号和 token 可用。
- 如果旧版服务在内网，Go Harvest 后端所在机器需要能访问旧版地址。
- 接口导入完成后查看通知和服务端日志，确认是否有失败条目。

## 特殊站点处理

大多数站点都使用 Cookie 来进行访问，但是个别站点需要特殊设置。

### 找不到某些站点

工具只内置了一部分常规站点，其余站点可以自行适配或者找大佬索要站点配置文件，然后将配置文件放到 `sites` 文件夹中。

1. 到 TG 频道下载最新的 sites。
2. 在微信群中下载。
3. 找大佬要。
4. 自制配置文件。

### 馒头

馒头官方要求第三方软件不得使用 Cookie 访问网站，必须使用令牌，否则有 BAN 号风险。

> 令牌获取：控制台 => 实验室 => 令牌
>
> ![馒头令牌](/images/import/img_29.png)
>
> 令牌使用：mteam => 编辑 => AuthKey

近日馒头域名有更换，请在 APP 上清除缓存后，下拉刷新数据，找到馒头 => 编辑，重新选择站点域名即可。

## 部分站点 UID 不为数字

部分站点 UID 为用户名，手动填写时需要注意：

1. 莫妮卡。
2. 普斯特。
3. IPTorrents。
4. TorrentLeech。
5. AZ 家族。
6. 待补充。