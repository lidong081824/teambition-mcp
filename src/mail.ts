import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from "zod";

const WY_MAIL_API_BASE = 'https://services.qiye.163.com'
let headers = {}

// Create server instance
const server = new McpServer({
  name: 'email-mcp',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
})

// Helper function for making API requests
async function makeRequest<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const response = await fetch(url, { headers, ...options })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    // console.log(response.blob())
    return await (await response.blob()).text() as T
  } catch (error) {
    console.error('Error making NWS request:', error)
    return null
  }
}

async function getEmailPrice({ users, years }: { users: number, years: number }) {
  const data = await makeRequest<string>(`${WY_MAIL_API_BASE}/service/admin/price/?v=3&type=1g&num=${users}&year=${years}&t=1744551983336`, {
    method: 'GET',
  })
  console.log('data', data)
  if (!data) {
    return {
      content: [
        {
          type: 'text' as const,
          text: 'Failed to retrieve tasks data',
        },
      ],
    }
  }
  const regex = /ajax_res="([^"]+)"/;
  const match = data.match(regex);

  if (!match) {
    return {
      content: [
        {
          type: 'text' as const,
          text: 'Failed to retrieve tasks data',
        },
      ],
    }
  }
  const price = match[1].split('|')[2];
  return {
    content: [
      {
        type: 'text' as const,
        text: `The number of accounts is ${users}, and the service life of the mailbox is ${years} years, the price is ${price}`,
      },
    ],
  }
}

// Register tools
server.tool('get-email-price', 'Get email pricing plan', {
  users: z.number().min(0).max(200).describe("Number of enterprise email users"),
  years: z.number().min(0).max(3).describe("Service life of enterprise mailbox"),
}, getEmailPrice)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Teambition MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
