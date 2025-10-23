# teambition-mcp

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)
![License](https://img.shields.io/badge/license-ISC-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

一个基于 **Model Context Protocol (MCP)** 的 Teambition 服务器项目。该项目致力于通过 MCP 协议实现 Teambition 的完整功能集成，让你可以在 Claude Code、Cursor 等支持 MCP 的客户端中直接管理 Teambition 任务和项目。

## 🎯 项目愿景

通过 MCP 协议，实现 Teambition 平台的所有核心功能，让用户无需离开编辑器即可完成：
- ✅ 任务管理（查询、创建、更新、删除）
- 📁 项目管理
- 👥 团队协作
- 📊 数据统计与分析
- 🔔 通知管理

**当前状态：** 已实现任务查询功能，其他功能正在开发中。

## 快速导航

- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [使用示例](#使用示例)
- [可用工具](#可用工具)
- [开发指南](#开发指南)
- [路线图](#路线图)
- [常见问题](#常见问题)

---

## 功能特性

### 已实现功能

- 📋 **任务查询** - 获取用户的任务列表
- 📝 **任务详情** - 展示任务的完整信息（标题、内容、截止时间、完成状态等）
- 🔐 **自动认证** - 自动处理 Teambition API 认证流程
- 📊 **格式化输出** - 将任务数据格式化为易读的文本

### 规划中的功能

- ➕ 创建新任务
- ✏️ 更新任务信息
- 🗑️ 删除任务
- 📁 项目管理功能
- 👥 成员管理
- 🏷️ 标签管理
- 📅 日历集成
- 📈 数据统计

---

## 项目结构

```
teambition-mcp/
├── src/
│   ├── index.ts           # Teambition MCP 服务器主文件
│   └── types.ts           # TypeScript 类型定义
├── build/                 # 编译输出目录
├── tsconfig.json          # TypeScript 配置文件
├── package.json           # 项目依赖和脚本配置
├── README.md              # 英文说明文档
├── README.zh-CN.md        # 中文说明文档
└── .gitignore             # Git 忽略配置
```

---

## 快速开始

### 前置条件

- **Node.js** 18.0 或更高版本
- **Yarn** 或 **npm**
- Teambition 账户和相应的应用凭证
- Claude Code 或 Cursor 编辑器

### 安装步骤

```bash
# 1. 克隆项目到本地
git clone <https://github.com/lidong081824/teambition-mcp.git>
cd teambition-mcp

# 2. 安装项目依赖
yarn install

# 3. 编译 TypeScript
yarn build
```

---

## 配置说明

### 步骤 1：获取 Teambition 应用凭证

1. 访问 [Teambition 开放平台](https://open.teambition.com)
2. 登录你的账户，进入组织管理
3. 创建一个新的应用
4. 为应用授予以下权限：
   - ✓ 读取任务
   - ✓ 读取项目信息
   - ✓ 其他所需权限（根据你计划使用的功能）

5. 复制并保存以下凭证信息：
   - **App ID** - 应用 ID
   - **App Secret** - 应用密钥
   - **Operator ID** - 操作者 ID
   - **Organization ID** - 组织 ID

### 步骤 2：配置 MCP

在你的 Claude Code 或 Cursor 的 MCP 配置文件中添加以下内容：

**配置文件位置：**
- **Claude Code:** `~/.config/claude-code/mcp.json`
- **Cursor:** `~/.cursor/mcp.json`

**配置示例：**

```json
{
  "mcpServers": {
    "teambition-mcp": {
      "command": "node",
      "args": [
        "/path/to/teambition-mcp/build/index.js",
        "YOUR_APP_ID",
        "YOUR_APP_SECRET",
        "YOUR_OPERATOR_ID",
        "YOUR_ORGANIZATION_ID"
      ]
    }
  }
}
```

> **💡 提示：** 请将上述路径和凭证替换为实际的值。建议使用绝对路径以避免路径解析问题。

### 步骤 3：启用服务器

配置完成后，重启你的编辑器或重新加载 MCP 服务器配置即可使用。

---

## 使用示例

### 任务查询

配置完成后，你可以在 Claude Code 中自然地询问关于任务的问题：

```
用户：查询我的任务
Claude：[显示格式化的任务列表]

用户：我有哪些未完成的任务？
Claude：[筛选并显示未完成的任务]

用户：显示我今天到期的任务
Claude：[显示今日到期的任务]

用户：列出我最近创建的任务
Claude：[按创建时间排序显示任务]
```

**预期返回格式：**

```
状态: ○ 未完成
标题: 完成工作计划
内容: 需要在本周五前完成季度总结报告
截止时间: 2025-10-25T18:00:00.000Z
---
状态: ✓ 已完成
标题: 撰写文档
内容: 无备注
截止时间: 无截止日期
---
```

---

## 可用工具

### get-user-tasks

**功能：** 获取当前用户的 Teambition 任务列表

**参数：** 无需参数

**返回数据结构：**

```typescript
{
  content: [
    {
      type: 'text',
      text: string  // 格式化后的任务列表文本
    }
  ]
}
```

**返回内容包括：**
- 📌 任务标题
- 📄 任务内容/备注
- ✅ 完成状态（✓ 已完成 / ○ 未完成）
- 📅 截止时间
- 🕐 创建时间和更新时间
- 🏷️ 所属项目 ID

**使用示例：**
```
请查询我的任务列表
显示我所有的待办事项
有哪些任务需要我处理？
```

**API 说明：**
- **端点：** `GET /api/v3/usertasks/search`
- **认证：** Bearer Token（自动处理）
- **分页：** 默认返回前 20 条任务

---

## 开发指南

### 本地开发

```bash
# 构建项目
yarn build

# 只进行类型检查（不生成文件）
yarn tsc --noEmit

# 运行测试（如果已配置）
yarn test

# 代码格式化
yarn prettier

# 开发模式（如果配置了 watch 模式）
yarn dev
```

### 项目脚本说明

| 脚本 | 功能 |
|------|------|
| `yarn build` | 编译 TypeScript 并设置执行权限 |
| `yarn test` | 运行测试套件 |
| `yarn prettier` | 格式化源代码 |

### 代码结构说明

#### `src/index.ts`
Teambition MCP 服务器的主入口文件，包含：
- 服务器初始化逻辑
- API 请求封装
- 任务查询和格式化功能
- 认证处理

#### `src/types.ts`
TypeScript 类型定义文件，包含：
- `Task` - 任务数据结构
- `UserTasksResponse` - 任务列表 API 响应
- `AppTokenResponse` - 认证令牌响应

### 添加新功能

如果你想为项目添加新功能，请遵循以下步骤：

1. **定义类型** - 在 `types.ts` 中添加必要的接口定义
2. **实现功能** - 在 `index.ts` 中编写功能函数
3. **注册工具** - 使用 `server.tool()` 注册新的 MCP 工具
4. **测试** - 确保功能正常工作
5. **更新文档** - 在 README 中添加新功能的说明

### 贡献指南

我们欢迎所有形式的贡献！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

**贡献建议：**
- 实现路线图中的功能
- 改进错误处理
- 添加单元测试
- 优化性能
- 完善文档

---

## 路线图

### v1.0（当前版本）
- [x] 基础项目架构
- [x] Teambition API 认证
- [x] 获取用户任务列表
- [x] 任务数据格式化

### v1.1（计划中）
- [ ] 创建新任务
- [ ] 更新任务状态
- [ ] 更新任务详情（标题、内容、截止时间等）
- [ ] 删除任务

### v1.2（计划中）
- [ ] 项目列表查询
- [ ] 项目详情查询
- [ ] 任务筛选功能（按项目、状态、时间等）

### v2.0（未来规划）
- [ ] 成员管理
- [ ] 标签管理
- [ ] 日历集成
- [ ] 文件管理
- [ ] 评论功能
- [ ] 数据统计和报表

---

## 常见问题

### Q: 如何获取 Teambition 应用凭证？

A: 访问 [Teambition 开放平台](https://open.teambition.com)，登录后在应用管理中创建新应用，即可获取相关凭证。

### Q: 配置后无法连接到 Teambition？

A: 请检查以下几点：
1. 确认凭证信息正确无误（App ID、App Secret、Operator ID、Organization ID）
2. 检查网络连接是否正常
3. 确认应用是否已授予必要权限
4. 查看控制台错误日志获取更多信息
5. 确认 Node.js 版本是否符合要求（18+）

### Q: 能否同时使用多个 Teambition 账户？

A: 可以。在配置文件中添加多个服务器实例，使用不同的凭证和名称即可：

```json
{
  "mcpServers": {
    "teambition-work": { ... },
    "teambition-personal": { ... }
  }
}
```

### Q: 为什么只能看到 20 个任务？

A: 当前版本使用默认分页设置（每页 20 条）。未来版本将支持自定义分页参数和获取所有任务。

### Q: 如何更新项目到最新版本？

A: 在项目目录下运行：
```bash
git pull
yarn install
yarn build
```

### Q: 项目支持哪些功能？

A: 当前版本仅支持任务查询功能。我们正在积极开发更多功能，请查看[路线图](#路线图)了解开发计划。

### Q: 如何报告问题或请求新功能？

A: 请在 GitHub 上提交 Issue，详细描述你遇到的问题或想要的功能。

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| TypeScript | 5.8+ | 编程语言 |
| Node.js | 18+ | 运行时环境 |
| MCP SDK | ^1.8.0 | Model Context Protocol 官方 SDK |
| Fetch API | - | HTTP 请求库（Node.js 内置） |
| Zod | ^3.24.2 | 数据验证库 |

---

## 许可证

本项目采用 **ISC License** 许可证。详见 [LICENSE](LICENSE) 文件。

---

## 相关资源

- 📘 [Teambition 开放平台](https://open.teambition.com)
- 📘 [Teambition API 文档](https://open.teambition.com/docs)
- 🔗 [Model Context Protocol](https://modelcontextprotocol.io)
- 📖 [Claude Code 文档](https://docs.claude.com)
- 💬 [GitHub Issues](https://github.com/lidong081824/teambition-mcp/issues)

---

## 致谢

感谢 Teambition 团队提供的开放 API 和 Anthropic 团队开发的 MCP 协议。

---

## 作者

本项目通过学习官方示例创建，用于教学和实践目的。我们希望将 Teambition 的强大功能无缝集成到日常开发工作流中。

**更新日期：** 2025-10-23

---

<div align="center">

**❓ 有问题？** 请在 GitHub 上提交 Issue

**💡 有建议？** 欢迎提交 Pull Request

**⭐ 喜欢这个项目？** 给我们一个 Star 吧！

</div>
