---
title: 07. 通知配置
description:
published: true
date: 2026-06-13T00:00:00.000Z
tags: [ 通知, 企业微信, 微信机器人, QQ机器人 ]
editor: markdown
dateCreated: 2025-06-01T07:53:26.109Z
---

# 通知配置

收割机后端聚合了多种通知渠道，APP 和 WebUI 的「设置中心」负责维护通知参数，「通知测试」可以单独测试某一个通道是否可用。

本文统一说明通知通道、通知测试、QQ 机器人、微信机器人、企业微信、机器人指令、常见问题和通知历史。

## 1. 支持的通知渠道

通知渠道包括：

- 企业微信。
- 微信机器人。
- QQ 机器人。
- WxPusher。
- PushDeer。
- Bark。
- 爱语飞飞。
- 喵呜通知。
- Server 酱。
- PushPlus。
- Telegram。
- Telegram Webhook。

后端通知测试接口使用 `/api/option/test`，通过 query 参数 `push_type` 指定推送通道。默认「默认通道」会以空 `push_type` 请求后端，对应后端的 `NoPushType`。

通道参数：

| 通道 | `push_type` |
| --- | --- |
| 默认通道 | 空字符串 |
| 企业微信 | `wechat_work_push` |
| 微信机器人 | `wechat_bot_push` |
| WxPusher | `wxpusher_push` |
| PushDeer | `pushdeer_push` |
| Server 酱 | `server_chan_push` |
| Bark | `bark_push` |
| 爱语飞飞 | `iyuu_push` |
| Telegram | `telegram_push` |
| QQ 机器人 | `qqbot_push` |
| PushPlus | `pushplus_push` |
| 喵呜通知 | `meow_push` |

接口示例：

```text
GET /api/option/test?title=测试标题&content=测试内容&push_type=wechat_bot_push
```

如果 `push_type` 为空，后端按默认通知逻辑处理；如果指定具体通道，只测试该通道，适合排查某一个通知配置是否可用。

## 2. QQ 机器人

QQ 机器人用于通过 QQ Bot 发送通知，也可以通过 C2C 单聊接收用户指令。配置入口位于「设置中心」的通知渠道区域。

![服务器配置](/images/go-harvest/界面/服务器配置.png)

### 2.1 原理

后端通过 WebSocket 长连接接收 QQ 机器人事件，例如 `C2C_MESSAGE_CREATE`。首次收到用户消息时会自动将 openid 写入 `uids`。

`qqbot_push` 同时作为通知渠道，其他模块可通过后端通知服务向配置用户推送消息。

### 2.2 需要填写

- `机器人 App ID`：QQ 机器人应用 ID。
- `机器人 Secret`：QQ 机器人应用密钥。
- `接收 UIDs`：通知接收人的 UID 列表，由后端或机器人会话同步，当前页面只读。

### 2.3 使用流程

1. 打开「设置中心」。
2. 展开「QQ机器人」，填写 `机器人 App ID` 和 `机器人 Secret`。
3. 保存配置。
4. 确认 `接收 UIDs` 已由后端或机器人会话同步；该字段只读，不需要手动填写。
5. 展开「通知测试」，推送通道选择「QQ 机器人」，发送一条测试消息。
6. 如果目标 QQ 用户能收到测试消息，说明 QQ 机器人通知已可用。

系统启动时会自动尝试通过 WebSocket 连接 QQ 机器人网关，无需手动启动。

## 3. 微信机器人

微信机器人用于通过微信 IM Bot 发送通知，也可以接收用户指令。参数由扫码登录流程自动同步，通知渠道中的微信机器人字段仅用于查看，不需要手动输入，也没有保存按钮。

![微信机器人扫码登录](/images/go-harvest/界面/微信机器人扫码登录.png)

### 3.1 原理

微信机器人基于 `corespeed-io/wechatbot` SDK，通过 `bot.Run()` 长轮询接收用户消息。启动后自动保持通道活跃，无需额外心跳。

`wechat_bot_push` 同时作为通知渠道，签到、数据抓取等模块可通过后端通知服务向配置用户推送消息。

### 3.2 只读字段

只读字段包括：

- `IM BOT Token`：微信机器人接口 Token。
- `IM BOT User ID`：通知接收人的用户 ID。

### 3.3 使用流程

1. 打开「设置中心」。
2. 切换到「常用工具」。
3. 展开「微信机器人登录」，点击「获取二维码」。
4. 用手机微信扫码并确认登录。
5. 登录完成后，在微信中向机器人发送一条测试消息 `ping`，用于让后端建立或刷新会话上下文，后端会返回 `pong`。
6. 回到「服务器设置」中的「微信机器人」查看同步后的只读参数。
7. 展开「通知测试」，推送通道选择「微信机器人」，填写测试标题和内容后点击发送。
8. 如果手机端能收到测试消息，说明微信机器人通知已可用。

「微信机器人登录」页面会自动轮询登录状态；二维码有效期约 120 秒，过期后点击「重新获取」。登录成功后工具会显示成功状态，稍后自动收起二维码状态。

扫码登录状态：

| status | 含义 |
| --- | --- |
| `wait` | 等待扫码 |
| `scaned` | 已扫码，请在微信中确认 |
| `confirmed` | 登录成功，凭证已写入 |
| `expired` | 二维码已过期，需重新获取 |

相关接口：

- `GET /api/option/wechatbot/qrcode`：获取二维码。
- `GET /api/option/wechatbot/qrcode/status`：查询扫码状态。
- `POST /api/option/wechatbot/start`：启动长轮询。
- `POST /api/option/wechatbot/stop`：停止长轮询。
- `GET /api/option/wechatbot/status`：查询运行状态。

系统启动时会自动尝试启动微信机器人。如果已有配置且凭证有效，会自动进入长轮询。

## 4. 企业微信

> PS: 如果只使用企业微信通知，需要配置可信 IP。
>
> <font color=orange>如果需要配置回调，需要域名为 A 记录，AAAA 记录【即 IPV6 公网域名】不可用。</font>

### 4.1 版本要求

更新 Docker 到最新版本，镜像最低需要 2025 年 5 月 22 日发布的版本。

### 4.2 创建企业微信应用

1. 登录企业微信。

   [打开](https://work.weixin.qq.com/)

2. 在应用管理-自建应用中创建应用。

3. 点击我的企业，可以在页面最下方找到企业 ID，通常是 `ww` 开头，复制留存。

   [进入我的企业](https://work.weixin.qq.com/wework_admin/frame#/profile)

   <img src="https://img.ptools.fun/blog/image-20250601153329530.png"  align="left" />

4. 进入应用管理。

   [进入应用管理](https://work.weixin.qq.com/wework_admin/frame#/apps)

   ![img.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img.png)

5. 创建应用。

   [创建应用](https://work.weixin.qq.com/wework_admin/frame#/apps/createApiApp)

   - 选择图标，随便找个图即可。
   - 填写应用名称，自己能识别是哪个应用即可。
   - 应用介绍随便填。
   - 可见范围建议只选择自己。

6. 点击应用图标，进入应用管理。

### 4.3 配置回调地址

1. 点击进入应用后，可以看到应用简介，在这里拿到应用 ID 和 Secret，留存备用。

   ![img_1.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img_1.png)

   Secret 因为安全原因会发到企业微信客户端查看。

   ![img_2.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img_2.png)

   ![img_3.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img_3.png)

2. 将收割机访问地址通过反代、内网穿透、frp、ngfork 等方式处理，让企业微信可以通过公网访问收割机。

   > Token => 系统设置 => 安全 Token

   企业微信回调接口地址：

   ```text
   {你的收割机访问地址}/api/option/wechat?source=harvest&token={你的 Token}
   ```

   大括号不要，例如：

   ```text
   https://www.baidu.com/api/option/wechat?source=harvest&token=123456
   ```

3. 找到接收消息 -> 配置 API 接收。

   ![img_4.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img_4.png)

4. 在新界面填入回调地址，并随机生成 Token 与 EncodingAESKey。

   ![img_5.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img_5.png)

5. 在收割机中填入企业微信相关信息。

   - 背景图可以填写网络图片地址，需要以 `http://` 或 `https://` 开头，例如 Bing 随机图：`https://bing.img.run/rand_1366x768.php`。
   - 固定代理：如果没有固定公网地址，可以使用第三方提供的企业微信代理，或者自建企业微信代理，并将代理的公网地址填入可信 IP。
   - 接收 ID 不懂的直接填写 `@all`。

   ![img_6.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img_6.png)

6. 收割机中配置好企业微信相关信息后，在网页中点击保存。

   ![img_7.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img_7.png)

### 4.4 回调使用

1. 更新菜单：第一次配置菜单，直接在企业微信 APP 中发送消息 `更新菜单` 即可，后续可在菜单中选择更新菜单。

   ![img_8.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img_8.png)

   ![img_9.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img_9.png)

2. 发送邀请：非试用用户可以邀请他人试用收割机，每个月可以邀请三个邮箱，每个邮箱只能被邀请一次，在应用中直接发送电子邮箱地址即可触发邀请。

   ![img_10.png](../.vuepress/public/images/%E6%94%B6%E5%89%B2%E6%9C%BA/%E4%BC%81%E5%BE%AE/img_10.png)

## 5. 机器人指令

微信机器人和 QQ 机器人支持相同的指令集：

| 指令 | 别名 | 说明 |
| --- | --- | --- |
| `签到打卡` | `签到`、`打卡` | 执行自动签到任务 |
| `更新数据` | `更新` | 执行批量抓取站点信息 |
| `更新代码` | - | 执行自动更新任务 |
| `今日新增` | `今日` | 计算今日数据统计 |
| `帮助` | `help` | 返回操作菜单 + 文档链接 |
| `菜单` | - | 仅返回操作菜单 |
| `文档` | - | 返回全部文档链接列表 |
| `ping` | - | 回复 pong，检测连通性 |

发送以下关键词可获取对应文档链接：

```text
简介 安装 指南 常见问题 ssh 企业微信 app 站点导入 自行适配 自定义主题 协议 阿里云盘 百度ocr cookiecloud tailscale telegram 命令行 穿透 tg群
```

指令处理流程：

```text
用户发送消息
  -> 解析指令
  -> ping 回复 pong
  -> 帮助/help 返回完整帮助信息
  -> 菜单 返回操作指令
  -> 文档 返回文档链接列表
  -> 简介/安装等 返回对应文档链接
  -> 签到打卡等任务 先回复任务正在执行中，再执行任务并回复结果
  -> 今日新增 先回复正在计算中，再返回统计结果
  -> 邮箱地址 申请试用
  -> 其他 返回无法识别和帮助信息
```

## 6. 常见问题

### 通知测试失败

检查：

- `push_type` 是否选择了正确通道。
- 对应通知渠道是否已保存配置。
- 通知 WebHook、Token、Secret、Chat ID 等字段是否复制完整。
- 后端所在网络是否能访问对应通知服务。
- 「日志中心」中的服务端日志是否有明确错误。

### 企业微信回调配置失败

检查：

- 回调域名是否为公网可访问的 A 记录域名。
- 回调地址是否包含正确的安全 Token。
- 企业微信可信 IP 是否包含当前出口 IP 或代理 IP。
- Token 与 EncodingAESKey 是否和企业微信后台一致。

### 微信机器人收不到消息

检查：

- 是否已扫码登录。
- 登录二维码是否过期。
- 是否已向机器人发送 `ping` 激活会话。
- 日志中是否有「微信机器人长轮询启动」相关记录。

微信机器人通知如果返回 `ret=-2`，通常需要先给微信机器人发送一条消息以激活会话。

### QQ 机器人收不到消息

检查：

- `机器人 App ID` 和 `机器人 Secret` 是否正确。
- `接收 UIDs` 是否已由后端或机器人会话同步。
- 后端服务是否能访问 QQ 机器人接口。
- 日志中是否有 QQ 机器人鉴权或 WebSocket 连接错误。

### 通知历史没有记录

检查：

- 后端任务是否实际产生通知。
- 通知发送是否被配置过滤。
- 当前登录账号是否有权限查看通知历史。
- 数据库中通知历史是否被清理。

## 7. 通知历史

APP 顶部通知按钮进入通知历史。未读通知会在顶部栏展示，多个通知会轮播。

![通知历史记录](/images/go-harvest/界面/通知历史记录.png)

通知历史页支持：

- 查看通知列表。
- 查看通知详情。
- 单条标记已读。
- 全部标记已读。
- 删除单条通知。
- 删除全部通知。
- 打开通知内链接。
- Markdown 内容多行选择。

顶部未读通知会在主界面 header 中显示，桌面端可显示摘要。
