import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// import { z } from "zod";

const TEAMBITION_API_BASE = "https://open.teambition.com";
let accessToken = "";
let headers = {};

interface UserTasksResponse {
  "code": number,
  "count": number,
  "result": [
    {
      "content": string,
      "created": string,
      "startDate": string,
      "dueDate": string,
      "isDone": boolean,
      "note": string,
      "projectId": string,
      "updated": string,
    }
  ]
}

// Create server instance
const server = new McpServer({
  name: "teambition-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Helper function for making NWS API requests
async function makeRequest<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const response = await fetch(url, { headers, ...options });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

async function getTeambitionAuthToken() {
  const res = await makeRequest<{ appToken: string }>(`${TEAMBITION_API_BASE}/api/appToken`, {
    method: "POST",
    body: JSON.stringify({
      appId: process.argv[2],
      appSecret: process.argv[3],
    }),
  })
  if (!res) {
    throw new Error("Failed to get Teambition auth token")
  }
  return res.appToken
}

// Format alert data
function formatTasks(tasksResponse: UserTasksResponse): string[] {
  const props = tasksResponse.result;
  return props.map((task) => {
    return [
      `IsDone: ${task.isDone || "Unknown"}`,
      `TaskTitle: ${task.content || "Unknown"}`,
      `TaskContent: ${task.note || "Unknown"}`,
      `DueDate: ${task.dueDate || "Unknown"}`,
      "---",
    ].join("\n");
  })
}

// Register weather tools
server.tool(
  "get-user-tasks",
  "Get user teambition tasks",
  {},
  getUserTasks,
);

async function getUserTasks() {
  const url = `${TEAMBITION_API_BASE}/api/v3/usertasks/search?pageSize=10&roleTypes=creator%2Cexecutor%2CinvolveMember`;
  const data = await makeRequest<UserTasksResponse>(url);
  if (!data || data.code !== 200) {
    return {
      content: [
        {
          type: "text" as const,
          text: "Failed to retrieve tasks data",
        },
      ],
    };
  }
  const t = formatTasks(data)
  return {
    content: [
      {
        type: "text" as const,
        text: `Current user ticks is:\n\n${t.join("\n")}`,
      },
    ],
  };
}

async function main() {
  accessToken = await getTeambitionAuthToken()
  headers = {
    'X-Operator-Id': process.argv[4],
    'Authorization': `Bearer ${accessToken}`,
    'X-Tenant-Id': process.argv[5],
    'X-Tenant-Type': 'organization',
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Teambition MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
