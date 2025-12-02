---
title: 常用内网穿透
description:
published: true
date: 2025-12-01T04:41:38.935Z
tags: [ ]
editor: markdown
dateCreated: 2025-06-01T07:56:20.537Z
---

# 内网穿透

除了 Ngrok 以外，还有一些不错的内网穿透工具可以将本地服务器暴露在公网。这些工具大多提供隧道服务，使开发者能轻松调试和共享本地应用。以下是一些常用的 Ngrok 替代工具：

## 1. **Cloudflare Tunnel（原 Argo Tunnel）**

- **特点**：提供强大的隧道服务，结合 Cloudflare 的 DNS 管理和 DDoS 保护功能，非常适合企业级应用。

- **免费和收费**：提供免费版，企业版有额外的性能优化和支持。

- 命令

  ```
  cloudflared tunnel create <tunnel-name>
  cloudflared tunnel route dns <tunnel-name> <subdomain.example.com>
  cloudflared tunnel run <tunnel-name>
  ```

- **网址**：Cloudflare Tunnel

## 2. **LocalTunnel**

- **特点**：简单易用，支持自定义子域名，但稳定性可能不如其他方案。

- **免费和收费**：完全免费。

- 安装

  ```
  npm install -g localtunnel
  ```

- 启动

  ```
  lt --port 8000 --subdomain yoursubdomain
  ```

- **网址**：LocalTunnel

## 3. **Serveo**

- **特点**：无需安装客户端，直接通过 SSH 创建隧道，适合临时和小规模使用。

- **免费和收费**：免费。

- 命令

  ```
  ssh -R 80:localhost:8000 serveo.net
  ```

- **网址**：[Serveo](https://serveo.net/)

## 4. **Expose**

- **特点**：开源，支持自定义域名和 HTTPS，支持团队协作。

- **免费和收费**：开源免费版，企业版有附加功能。

- 安装

  ```
  composer global require beyondcode/expose
  ```

- 启动

  

  ```
  expose share localhost:8000
  ```

- **网址**：Expose

## 5. **FRP (Fast Reverse Proxy)**

- **特点**：高性能的开源反向代理工具，适合在内网部署多个隧道服务。
- **免费和收费**：开源免费。
- **安装**： 配置和使用较复杂，需要在服务器端和客户端分别配置。
- **网址**：[FRP](https://github.com/fatedier/frp)

## 6. **PageKite**

- **特点**：历史悠久，支持 HTTP 和 HTTPS 的隧道，支持自定义子域。

- **免费和收费**：免费版有流量限制，收费版提供更多带宽。

- 命令

  ```
  pagekite.py 8000 yourname.pagekite.me
  ```

- **网址**：[PageKite](https://pagekite.net/)

## 7. **Tailscale**

- **特点**：基于 WireGuard 的零配置 VPN，可以实现私有的、安全的点对点隧道。
- **免费和收费**：个人版免费，企业版收费。
- **网址**：[Tailscale](https://tailscale.com/)