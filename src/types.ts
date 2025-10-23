/**
 * Teambition MCP Server - Type Definitions
 *
 * 包含 Teambition API 相关的所有类型定义
 */

/**
 * 任务项数据结构
 */
export interface Task {
  content: string      // 任务标题
  created: string      // 创建时间
  startDate: string    // 开始时间
  dueDate: string      // 截止时间
  isDone: boolean      // 是否完成
  note: string         // 任务备注/详情
  projectId: string    // 所属项目 ID
  updated: string      // 更新时间
}

/**
 * 用户任务列表 API 响应结构
 */
export interface UserTasksResponse {
  code: number         // 响应状态码
  count: number        // 任务总数
  result: Task[]       // 任务列表
}

/**
 * Teambition 访问令牌响应结构
 */
export interface AppTokenResponse {
  appToken: string     // 应用访问令牌
}
