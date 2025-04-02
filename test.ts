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

// Helper function for making NWS API requests
async function makeRequest<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const response = await fetch(url, { headers, ...options });
    if (!response.ok) {
      console.log('response', response)
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
      appId: process.env.APP_ID,
      appSecret: process.env.APP_SECRET,
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
      `IsDone: ${task.isDone}`,
      `TaskTitle: ${task.content || "Is not set"}`,
      `TaskContent: ${task.note || "Is not set"}`,
      `DueDate: ${task.dueDate || "Is not set"}`,
      "---",
    ].join("\n");
  })
}

// Register weather tools
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
  console.log('accessToken', accessToken)
  headers = {
    'X-Operator-Id': process.env.OPERATOR_ID,
    'Authorization': `Bearer ${accessToken}`,
    'X-Tenant-Id': process.env.TENANT_ID,
    'X-Tenant-Type': 'organization',
  }
  console.log('await getUserTasks()', await getUserTasks())
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
