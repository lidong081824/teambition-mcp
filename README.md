# teambition-mcp

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)
![License](https://img.shields.io/badge/license-ISC-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

A **Model Context Protocol (MCP)** server project for Teambition. This project aims to implement complete Teambition functionality integration through the MCP protocol, allowing you to manage Teambition tasks and projects directly in Claude Code, Cursor, and other MCP-compatible clients.

## 🎯 Project Vision

Through the MCP protocol, implement all core Teambition platform features, enabling users to complete the following without leaving their editor:
- ✅ Task management (query, create, update, delete)
- 📁 Project management
- 👥 Team collaboration
- 📊 Data statistics and analysis
- 🔔 Notification management

**Current Status:** Task querying functionality implemented. Other features are under development.

## Quick Navigation

- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Available Tools](#available-tools)
- [Development Guide](#development-guide)
- [Roadmap](#roadmap)
- [FAQ](#faq)

---

## Features

### Implemented Features

- 📋 **Task Querying** - Retrieve user's task lists
- 📝 **Task Details** - Display complete task information (title, content, due date, completion status, etc.)
- 🔐 **Auto Authentication** - Automatically handle Teambition API authentication
- 📊 **Formatted Output** - Format task data into readable text

### Planned Features

- ➕ Create new tasks
- ✏️ Update task information
- 🗑️ Delete tasks
- 📁 Project management features
- 👥 Member management
- 🏷️ Tag management
- 📅 Calendar integration
- 📈 Data statistics

---

## Project Structure

```
teambition-mcp/
├── src/
│   ├── index.ts           # Teambition MCP server main file
│   └── types.ts           # TypeScript type definitions
├── build/                 # Build output directory
├── tsconfig.json          # TypeScript configuration
├── package.json           # Project dependencies and scripts
├── README.md              # English documentation
├── README.zh-CN.md        # Chinese documentation
└── .gitignore             # Git ignore configuration
```

---

## Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **Yarn** or **npm**
- Teambition account with application credentials
- Claude Code or Cursor editor

### Installation Steps

```bash
# 1. Clone the project to your local machine
git clone <repository-url>
cd teambition-mcp

# 2. Install project dependencies
yarn install

# 3. Build TypeScript
yarn build
```

---

## Configuration

### Step 1: Obtain Teambition Application Credentials

1. Visit [Teambition Open Platform](https://open.teambition.com)
2. Log in to your account and navigate to organization management
3. Create a new application
4. Grant the following permissions to the application:
   - ✓ Read tasks
   - ✓ Read project information
   - ✓ Other required permissions (based on features you plan to use)

5. Copy and save the following credentials:
   - **App ID** - Application ID
   - **App Secret** - Application secret key
   - **Operator ID** - Operator ID
   - **Organization ID** - Organization ID

### Step 2: Configure MCP

Add the following configuration to your Claude Code or Cursor MCP configuration file:

**Configuration File Locations:**
- **Claude Code:** `~/.config/claude-code/mcp.json`
- **Cursor:** `~/.cursor/mcp.json`

**Configuration Example:**

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

> **💡 Tip:** Replace the above paths and credentials with actual values. Using absolute paths is recommended to avoid path resolution issues.

### Step 3: Enable the Server

After configuration, restart your editor or reload the MCP server configuration to start using.

---

## Usage Examples

### Task Queries

After configuration, you can naturally ask questions about tasks in Claude Code:

```
User: Query my tasks
Claude: [Display formatted task list]

User: What are my incomplete tasks?
Claude: [Filter and display incomplete tasks]

User: Show me tasks due today
Claude: [Display tasks due today]

User: List my recently created tasks
Claude: [Display tasks sorted by creation time]
```

**Expected Return Format:**

```
Status: ○ Incomplete
Title: Complete work plan
Content: Need to complete quarterly summary report by this Friday
Due Date: 2025-10-25T18:00:00.000Z
---
Status: ✓ Completed
Title: Write documentation
Content: No notes
Due Date: No due date
---
```

---

## Available Tools

### get-user-tasks

**Function:** Retrieve the current user's Teambition task list

**Parameters:** No parameters required

**Return Data Structure:**

```typescript
{
  content: [
    {
      type: 'text',
      text: string  // Formatted task list text
    }
  ]
}
```

**Return Content Includes:**
- 📌 Task title
- 📄 Task content/notes
- ✅ Completion status (✓ Completed / ○ Incomplete)
- 📅 Due date
- 🕐 Creation and update time
- 🏷️ Project ID

**Usage Examples:**
```
Please query my task list
Show me all my to-do items
What tasks need my attention?
```

**API Details:**
- **Endpoint:** `GET /api/v3/usertasks/search`
- **Authentication:** Bearer Token (automatically handled)
- **Pagination:** Returns first 20 tasks by default

---

## Development Guide

### Local Development

```bash
# Build the project
yarn build

# Type checking only (no file generation)
yarn tsc --noEmit

# Run tests (if configured)
yarn test

# Format code
yarn prettier

# Development mode (if watch mode is configured)
yarn dev
```

### Project Scripts

| Script | Function |
|--------|----------|
| `yarn build` | Compile TypeScript and set execute permissions |
| `yarn test` | Run test suite |
| `yarn prettier` | Format source code |

### Code Structure Explanation

#### `src/index.ts`
Main entry file for Teambition MCP server, containing:
- Server initialization logic
- API request wrapper
- Task querying and formatting functionality
- Authentication handling

#### `src/types.ts`
TypeScript type definition file, containing:
- `Task` - Task data structure
- `UserTasksResponse` - Task list API response
- `AppTokenResponse` - Authentication token response

### Adding New Features

If you want to add new features to the project, follow these steps:

1. **Define Types** - Add necessary interface definitions in `types.ts`
2. **Implement Feature** - Write feature functions in `index.ts`
3. **Register Tool** - Register new MCP tools using `server.tool()`
4. **Test** - Ensure functionality works correctly
5. **Update Documentation** - Add new feature documentation in README

### Contributing Guide

We welcome all forms of contributions!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Contribution Suggestions:**
- Implement roadmap features
- Improve error handling
- Add unit tests
- Optimize performance
- Enhance documentation

---

## Roadmap

### v1.0 (Current Version)
- [x] Basic project architecture
- [x] Teambition API authentication
- [x] Retrieve user task list
- [x] Task data formatting

### v1.1 (Planned)
- [ ] Create new tasks
- [ ] Update task status
- [ ] Update task details (title, content, due date, etc.)
- [ ] Delete tasks

### v1.2 (Planned)
- [ ] Project list query
- [ ] Project details query
- [ ] Task filtering functionality (by project, status, time, etc.)

### v2.0 (Future Planning)
- [ ] Member management
- [ ] Tag management
- [ ] Calendar integration
- [ ] File management
- [ ] Comment functionality
- [ ] Data statistics and reports

---

## FAQ

### Q: How do I obtain Teambition application credentials?

A: Visit [Teambition Open Platform](https://open.teambition.com), log in, and create a new application in application management to obtain the required credentials.

### Q: What should I do if I cannot connect to Teambition after configuration?

A: Please check the following:
1. Verify that your credentials are correct (App ID, App Secret, Operator ID, Organization ID)
2. Check if your network connection is normal
3. Confirm that the application has been granted necessary permissions
4. Check console error logs for more information
5. Verify that Node.js version meets requirements (18+)

### Q: Can I use multiple Teambition accounts simultaneously?

A: Yes. You can add multiple server instances in your configuration file with different credentials and names:

```json
{
  "mcpServers": {
    "teambition-work": { ... },
    "teambition-personal": { ... }
  }
}
```

### Q: Why can I only see 20 tasks?

A: The current version uses default pagination settings (20 items per page). Future versions will support custom pagination parameters and retrieving all tasks.

### Q: How do I update the project to the latest version?

A: Run in the project directory:
```bash
git pull
yarn install
yarn build
```

### Q: What features does the project support?

A: The current version only supports task querying functionality. We are actively developing more features. Please check the [Roadmap](#roadmap) for development plans.

### Q: How do I report issues or request new features?

A: Please submit an Issue on GitHub with detailed descriptions of the problem you encountered or the feature you want.

---

## Technology Stack

| Technology | Version | Description |
|-----------|---------|-------------|
| TypeScript | 5.8+ | Programming language |
| Node.js | 18+ | Runtime environment |
| MCP SDK | ^1.8.0 | Model Context Protocol official SDK |
| Fetch API | - | HTTP request library (Node.js built-in) |
| Zod | ^3.24.2 | Data validation library |

---

## License

This project is licensed under the **ISC License**. See [LICENSE](LICENSE) for details.

---

## Related Resources

- 📘 [Teambition Open Platform](https://open.teambition.com)
- 📘 [Teambition API Documentation](https://open.teambition.com/docs)
- 🔗 [Model Context Protocol](https://modelcontextprotocol.io)
- 📖 [Claude Code Documentation](https://docs.claude.com)
- 💬 [GitHub Issues](https://github.com/lidong081824/teambition-mcp/issues)

---

## Acknowledgments

Thanks to the Teambition team for providing the open API and the Anthropic team for developing the MCP protocol.

---

## Author

This project was created by studying official examples for educational and practical purposes. We hope to seamlessly integrate Teambition's powerful features into daily development workflows.

**Last Updated:** 2025-10-23

---

<div align="center">

**❓ Questions?** Please submit an Issue on GitHub

**💡 Suggestions?** Pull Requests are welcome

**⭐ Like this project?** Give us a Star!

</div>
