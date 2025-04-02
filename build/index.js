import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// import { z } from "zod";
let APP_ID = '';
let APP_SECRET = '';
let OPERATOR_ID = '';
let TENANT_ID = '';
const TB_API_BASE = 'https://open.teambition.com';
let accessToken = '';
let headers = {};
// Create server instance
const server = new McpServer({
    name: 'teambition-mcp',
    version: '1.0.0',
    capabilities: {
        resources: {},
        tools: {},
    },
});
// Helper function for making API requests
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, { headers, ...options });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json());
    }
    catch (error) {
        console.error('Error making NWS request:', error);
        return null;
    }
}
// Format task data
function formatTasks(tasksResponse) {
    const props = tasksResponse.result;
    return props.map((task) => {
        return [
            `IsDone: ${task.isDone}`,
            `TaskTitle: ${task.content || 'Not set yet'}`,
            `TaskContent: ${task.note || 'Not set yet'}`,
            `DueDate: ${task.dueDate || 'Not set yet'}`,
            '---',
        ].join('\n');
    });
}
// Get Teambition app access token
async function getAccessToken() {
    const res = await makeRequest(`${TB_API_BASE}/api/appToken`, {
        method: 'POST',
        body: JSON.stringify({
            appId: APP_ID,
            appSecret: APP_SECRET,
        }),
    });
    if (!res) {
        throw new Error('Failed to get Teambition access token');
    }
    return res.appToken;
}
// Register tools
server.tool('get-user-tasks', 'Get user teambition tasks', {}, getUserTasks);
async function getUserTasks() {
    const url = `${TB_API_BASE}/api/v3/usertasks/search?pageSize=10&roleTypes=creator%2Cexecutor%2CinvolveMember`;
    const data = await makeRequest(url);
    if (!data || data.code !== 200) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'Failed to retrieve tasks data',
                },
            ],
        };
    }
    const t = formatTasks(data);
    return {
        content: [
            {
                type: 'text',
                text: `Current user ticks is:\n\n${t.join('\n')}`,
            },
        ],
    };
}
async function main() {
    [APP_ID, APP_SECRET, OPERATOR_ID, TENANT_ID] = process.argv.slice(2);
    headers = {
        'X-Operator-Id': OPERATOR_ID,
        Authorization: `Bearer ${await getAccessToken()}`,
        'X-Tenant-Id': TENANT_ID,
        'X-Tenant-Type': 'organization',
    };
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Teambition MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
