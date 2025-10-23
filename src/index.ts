/**
 * Teambition MCP Server
 *
 * 这是一个 Model Context Protocol (MCP) 服务器,用于与 Teambition API 集成。
 * 提供获取用户任务列表等功能。
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { Task, UserTasksResponse, AppTokenResponse } from './types.js'

// Teambition 应用凭证
let APP_ID = ''
let APP_SECRET = ''
let OPERATOR_ID = ''
let TENANT_ID = ''

// Teambition API 基础地址
const TB_API_BASE = 'https://open.teambition.com'

// 请求头配置
let headers: Record<string, string> = {}

// 常量定义
const DEFAULT_PAGE_SIZE = 20
const SUCCESS_CODE = 200

/**
 * 创建 MCP 服务器实例
 */
const server = new McpServer({
  name: 'teambition-mcp',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
})

/**
 * 发起 HTTP 请求的通用方法
 *
 * @template T - 期望的响应数据类型
 * @param url - 请求的 URL 地址
 * @param options - fetch API 请求选项
 * @returns 返回解析后的 JSON 数据,失败时返回 null
 */
async function makeRequest<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  try {
    // 合并全局 headers 和请求特定的选项
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...options
    })

    // 检查 HTTP 响应状态
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    return (await response.json()) as T
  } catch (error) {
    console.error('Error making Teambition API request:', error)
    return null
  }
}

/**
 * 格式化任务列表为可读的文本格式
 *
 * @param tasksResponse - 任务列表响应数据
 * @returns 格式化后的任务信息字符串数组
 */
function formatTasks(tasksResponse: UserTasksResponse): string[] {
  const tasks = tasksResponse.result

  return tasks.map((task) => {
    const status = task.isDone ? '✓ 已完成' : '○ 未完成'
    const title = task.content || '未设置标题'
    const content = task.note || '无备注'
    const dueDate = task.dueDate || '无截止日期'

    return [
      `状态: ${status}`,
      `标题: ${title}`,
      `内容: ${content}`,
      `截止时间: ${dueDate}`,
      '---',
    ].join('\n')
  })
}

/**
 * 获取 Teambition 访问令牌
 *
 * 使用应用 ID 和密钥向 Teambition API 请求访问令牌。
 * 该令牌用于后续的 API 调用认证。
 *
 * @returns 返回访问令牌字符串
 * @throws 当请求失败或响应无效时抛出错误
 */
async function getAccessToken(): Promise<string> {
  const res = await makeRequest<AppTokenResponse>(`${TB_API_BASE}/api/appToken`, {
    method: 'POST',
    body: JSON.stringify({
      appId: APP_ID,
      appSecret: APP_SECRET,
    }),
  })

  if (!res || !res.appToken) {
    throw new Error('Failed to get Teambition access token')
  }

  return res.appToken
}

/**
 * 获取用户任务列表
 *
 * 这是一个 MCP 工具函数,用于查询当前用户的任务列表。
 *
 * @returns MCP 工具响应对象,包含格式化的任务列表文本
 */
async function getUserTasks() {
  // 构建查询 URL,使用默认参数获取最近的任务
  const url = `${TB_API_BASE}/api/v3/usertasks/search?roleTypes=&tql=&pageToken=&pageSize=${DEFAULT_PAGE_SIZE}`

  // 发起 API 请求
  const data = await makeRequest<UserTasksResponse>(url)

  // 检查响应有效性
  if (!data || data.code !== SUCCESS_CODE) {
    return {
      content: [
        {
          type: 'text' as const,
          text: '获取任务数据失败。请检查您的凭证和权限配置。',
        },
      ],
    }
  }

  // 格式化任务列表
  const formattedTasks = formatTasks(data)

  // 构建返回结果
  return {
    content: [
      {
        type: 'text' as const,
        text: `当前用户任务列表 (共 ${data.count} 个任务):\n\n${formattedTasks.join('\n')}`,
      },
    ],
  }
}

// 注册 MCP 工具
server.tool('get-user-tasks', 'Get user teambition tasks', {}, getUserTasks)

/**
 * 主函数 - 初始化并启动 MCP 服务器
 *
 * 执行步骤:
 * 1. 从命令行参数读取 Teambition 凭证信息
 * 2. 获取访问令牌
 * 3. 配置请求头
 * 4. 启动 MCP 服务器
 */
async function main() {
  // 从命令行参数获取凭证
  // 参数顺序: APP_ID APP_SECRET OPERATOR_ID TENANT_ID
  [APP_ID, APP_SECRET, OPERATOR_ID, TENANT_ID] = process.argv.slice(2)

  // 验证必需的参数
  if (!APP_ID || !APP_SECRET || !OPERATOR_ID || !TENANT_ID) {
    throw new Error(
      'Missing required arguments. Usage: <APP_ID> <APP_SECRET> <OPERATOR_ID> <TENANT_ID>'
    )
  }

  console.error('Initializing Teambition MCP Server...')

  // 获取访问令牌
  const accessToken = await getAccessToken()
  console.error('Access token obtained successfully')

  // 配置全局请求头
  headers = {
    'X-Operator-Id': OPERATOR_ID,         // 操作者 ID
    Authorization: `Bearer ${accessToken}`, // 授权令牌
    'X-Tenant-Id': TENANT_ID,             // 租户 ID
    'X-Tenant-Type': 'organization',      // 租户类型
  }

  // 创建标准输入输出传输层
  const transport = new StdioServerTransport()

  // 连接服务器到传输层
  await server.connect(transport)

  console.error('Teambition MCP Server running on stdio')
}

// 启动服务器并处理未捕获的错误
main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
