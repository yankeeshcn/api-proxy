# API 代理服务

[English](README.md) | **中文**

基于 Nitro 框架构建的简单 API 代理服务，根据请求路径将 HTTP 请求转发到配置的目标 API。

## 🚀 快速开始

### 部署到 Vercel

> 注意：请注意 Vercel 免费套餐的使用限制，不建议公开部署以防止滥用。

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/OrzMiku/api-proxy)

### 部署到 Cloudflare

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/OrzMiku/api-proxy)

1. 将此仓库 Fork 到你的 GitHub 账号。
2. 创建一个新的 Cloudflare Worker 项目。
3. 导入 Fork 的仓库，创建并部署。
4. 前往 `Settings > Variables and Secrets`，添加所需的变量（例如：`PROXY_OPENAI_TARGET`）。

## 📝 项目功能

这是一个简单的反向代理：

- 接收特定路径的 HTTP 请求（例如：`/openai/**`）
- 将请求转发到配置的目标服务器（例如：`https://api.openai.com`）
- 将响应返回给客户端
- 移除客户端 IP 请求头以提供基本隐私保护

适用场景：

- 绕过 Web 应用中的 CORS 限制
- 将 API 端点隐藏在单一域名后
- 在客户端和 API 之间添加简单的代理层

## 🌟 核心特性

- **请求转发**：转发包括请求头、请求体和查询参数的 HTTP 请求
- **隐私保护**：从转发的请求中移除客户端 IP 请求头（`x-forwarded-for`、`x-real-ip`）
- **环境变量配置**：通过环境变量配置代理目标
- **可选仪表板**：查看配置端点的简单 Web 界面
- **轻量级**：依赖少，基于 Nitro 框架构建

## ⚙️ 配置指南

### 环境变量

使用 `PROXY_{名称}_TARGET` 模式配置代理目标：

```env
# 基础代理配置
PROXY_GEMINI_TARGET=https://generativelanguage.googleapis.com
PROXY_OPENAI_TARGET=https://api.openai.com
PROXY_ANTHROPIC_TARGET=https://api.anthropic.com

# 可选：启用首页仪表板
HOMEPAGE_ENABLE=true
```

### 代理配置表

| 端点路径        | 目标地址                                    | 环境变量                                                        | 说明              |
| --------------- | ------------------------------------------- | --------------------------------------------------------------- | ----------------- |
| `/gemini/**`    | `https://generativelanguage.googleapis.com` | `PROXY_GEMINI_TARGET=https://generativelanguage.googleapis.com` | Google Gemini API |
| `/openai/**`    | `https://api.openai.com`                    | `PROXY_OPENAI_TARGET=https://api.openai.com`                    | OpenAI API        |
| `/anthropic/**` | `https://api.anthropic.com`                 | `PROXY_ANTHROPIC_TARGET=https://api.anthropic.com`              | Anthropic API     |

### 添加新的代理

只需按照命名模式添加环境变量即可添加新的代理端点：

```env
# 将 /myapi/** 请求转发到 https://api.example.com
PROXY_MYAPI_TARGET=https://api.example.com

# 将 /v1/chat/** 请求转发到 https://chat.example.com
PROXY_V1_CHAT_TARGET=https://chat.example.com
```

服务将自动：

- 将 `PROXY_MYAPI_TARGET` 转换为路由 `/myapi/**`
- 将 `PROXY_V1_CHAT_TARGET` 转换为路由 `/v1/chat/**`

## 📊 仪表板

当 `HOMEPAGE_ENABLE=true` 时，访问根 URL 可查看：

- 配置的代理端点列表
- 每个端点的目标 URL
- 快速复制 URL 的复制按钮

## 📄 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。
