> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/clickup)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🚀 ClickUp MCP Server — 2026 Complete Version

## 💡 What This Unlocks

**This MCP server gives AI direct access to your entire ClickUp workspace.** Instead of clicking through tasks, lists, and spaces manually, you just *tell* Claude what you need—and it executes instantly across your entire project management workflow.

### 🎯 ClickUp-Specific Power Moves

The AI can directly control your ClickUp workspace with natural language. Here are **5 real workflows** using the actual tools in this MCP server:

1. **🔥 Sprint Planning Automation**
   - AI uses `list_spaces` → `list_lists` → `list_tasks` to audit your entire workspace structure
   - Identifies overdue tasks, calculates sprint velocity, and auto-creates new tasks with `create_task` for next sprint
   - *"Show me all overdue tasks in Marketing space, calculate team velocity, and create next week's sprint tasks"*

2. **⏱️ Time Tracking Intelligence**
   - AI calls `get_time_entries` with date ranges to pull all tracked time across projects
   - Generates burndown reports, identifies bottlenecks, and flags under-logged tasks
   - *"Pull time entries for Q1, show which tasks took longer than estimated, and flag team members under 30 hours"*

3. **📋 Bulk Task Operations**
   - AI uses `list_tasks` with filters (status, assignee, due date) to find matching tasks
   - Batch updates with `update_task` (reassign, reprioritize, reschedule) across dozens of tasks in seconds
   - *"Find all 'In Progress' tasks assigned to Sarah with due dates this week, reassign to Tom, and push due dates by 3 days"*

4. **🔔 Smart Status Reporting**
   - AI chains `list_tasks` → `get_task` (with subtasks) → `add_comment` to generate weekly status updates
   - Calculates completion rates, flags blockers, and posts summary comments to leadership tasks
   - *"Generate weekly status report for Product Launch project, identify blockers, and post summary comment to executive task"*

5. **🎯 Priority Triage Workflow**
   - AI uses `list_tasks` filtered by priority and due dates to surface urgent work
   - Calls `update_task` to adjust priorities based on dependencies and deadlines
   - Posts updates via `add_comment` to notify team of priority shifts
   - *"Show all P1 tasks due in next 48 hours, escalate any with incomplete dependencies, and notify assignees via comments"*

### 🔗 The Real Power: Chaining Operations

AI doesn't just execute single commands—it orchestrates **multi-step workflows**:

- **Workspace Audit** → `list_spaces` → `list_lists` → `list_tasks` (all statuses) → Generate health report
- **Task Migration** → `list_tasks` (source list) → `create_task` (destination list) → `update_task` (archive source)
- **Time Analysis** → `get_time_entries` (filtered by assignee) → Cross-reference with `list_tasks` → Flag discrepancies

## 📦 What's Inside

**8 production-ready ClickUp API tools** covering core project management operations:

| Tool | Purpose |
|------|---------|
| `list_spaces` | List all spaces in your workspace/team |
| `list_lists` | Get lists from folders or spaces (folderless) |
| `list_tasks` | Query tasks with filters (status, assignee, dates, pagination) |
| `get_task` | Fetch detailed task info (including subtasks) |
| `create_task` | Create new tasks with full metadata (assignees, tags, dates, priority) |
| `update_task` | Update existing tasks (name, description, status, assignees, dates) |
| `add_comment` | Add comments to tasks (supports markdown, assignee tagging) |
| `get_time_entries` | Pull time tracking data with filters (user, date range, task/list/space) |

All tools include proper error handling, automatic authentication, and full TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/ClickUp-MCP-2026-Complete.git
   cd clickup-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your ClickUp API token:**
   - Go to your ClickUp workspace → **Settings** (bottom left)
   - Navigate to **My Settings** → **Apps**
   - Click **Generate** under "API Token" section
   - Copy the token (starts with `pk_`)

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "clickup": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/clickup-mcp-2026-complete/dist/index.js"],
         "env": {
           "CLICKUP_API_KEY": "pk_your_token_here"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop** — the 🔌 icon in the bottom right should show "clickup" connected

### Option 2: Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/clickup-mcp)

1. Click the button above
2. Set your `CLICKUP_API_KEY` environment variable in Railway dashboard
3. Use the Railway URL as your MCP server endpoint in remote Claude configurations

### Option 3: Docker

```bash
docker build -t clickup-mcp .
docker run -p 3000:3000 \
  -e CLICKUP_API_KEY=pk_your_token_here \
  clickup-mcp
```

## 🔐 Authentication

**ClickUp uses personal API tokens** for authentication (no OAuth required).

- **Get your token:** ClickUp Settings → My Settings → Apps → Generate API Token
- **Format:** Starts with `pk_` followed by 48 characters
- **Permissions:** Token inherits your user permissions in the workspace
- **Security:** Store securely; token grants full API access to your ClickUp data

📖 **Official docs:** [ClickUp API Authentication](https://clickup.com/api/developer-portal/authentication/)

The MCP server handles authentication automatically—just set `CLICKUP_API_KEY` in your environment.

## 🎯 Example Prompts for Project Management

Once connected to Claude, use these natural language prompts:

**Sprint Planning:**
- *"Show me all active tasks in the Engineering space, group by assignee, and identify anyone over 40 hours this sprint"*
- *"Create 5 tasks for next sprint: API integration, UI design, database migration, testing, and deployment—assign to the usual team"*

**Task Management:**
- *"Find all P1 tasks in the Product space due this week and show me their current status"*
- *"Update task #abc123 to status 'In Review', add Sarah as assignee, and set due date to Friday"*
- *"List all tasks with 'blocked' in the description, add a comment asking for updates, and bump priority to urgent"*

**Time Tracking & Reporting:**
- *"Pull all time entries for the Marketing team from last month and generate a summary report"*
- *"Show me which tasks have the most time logged but are still marked 'In Progress'"*
- *"Get time entries for user ID abc123 for this week and compare to their assigned task estimates"*

**Workspace Intelligence:**
- *"Audit my entire workspace: show spaces, lists in each space, task counts, and flag any lists with 0 tasks or 50+ tasks"*
- *"Find all tasks created in the last 7 days across all spaces and summarize what the team is working on"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- ClickUp workspace with API access

### Setup

```bash
git clone https://github.com/BusyBee3333/ClickUp-MCP-2026-Complete.git
cd clickup-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your ClickUp API token (pk_...)
npm run build
npm start
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Project Structure

```
clickup-mcp-2026-complete/
├── src/
│   └── index.ts          # Main MCP server + ClickUp API client
├── dist/                 # Compiled JavaScript (after build)
├── package.json
├── tsconfig.json
└── .env.example
```

## 🐛 Troubleshooting

### "Authentication failed" or 401 errors
- Verify your API token starts with `pk_` and is exactly 50 characters
- Check token wasn't revoked in ClickUp Settings → Apps
- Ensure your user has access to the workspace/space you're querying

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating `claude_desktop_config.json`
- Verify the path in config is **absolute** (not relative)
- Check that `dist/index.js` exists after running `npm run build`
- Look at Claude Desktop logs: macOS `~/Library/Logs/Claude/mcp*.log`

### "Rate limit exceeded"
- ClickUp API has rate limits (100 requests/min for free, higher for paid)
- The MCP server doesn't implement retry logic yet—add delays between bulk operations
- Consider upgrading your ClickUp plan for higher limits

### Tasks not filtering correctly
- `list_tasks` uses ClickUp's query parameter syntax—check [ClickUp API docs](https://clickup.com/api/clickupreference/operation/GetTasks/) for exact filter formats
- Status names are **case-sensitive** and must match your workspace's custom statuses
- Assignee IDs are numeric user IDs (not email addresses)—use `list_users` tool if available or check ClickUp UI

## 📖 Resources

- **[ClickUp API Documentation](https://clickup.com/api/)** — Official REST API reference
- **[ClickUp API Portal](https://clickup.com/api/developer-portal/)** — Generate tokens, view rate limits
- **[MCP Protocol Specification](https://modelcontextprotocol.io/)** — How MCP servers work
- **[Claude Desktop Documentation](https://claude.ai/desktop)** — Configure AI integrations

## 🤝 Contributing

Contributions are welcome! Missing a ClickUp API endpoint you need? Want to add webhooks support? Open a PR.

**How to contribute:**

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/add-custom-fields-support`)
3. Add your tool definition in `src/index.ts` (follow existing patterns)
4. Test locally with Claude Desktop
5. Commit your changes (`git commit -m 'Add custom fields tool'`)
6. Push to your fork (`git push origin feature/add-custom-fields-support`)
7. Open a Pull Request with details on what you added

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

You're free to use, modify, and distribute this MCP server for personal or commercial projects.

## 🙏 Credits

Built by **[MCPEngage](https://mcpengage.com)** — AI infrastructure for business software.

This server is part of the **MCPEngage 2026 Complete Series**, providing production-ready MCP servers for 30+ business platforms.

**Want more?** Check out our full catalog:
- [Asana MCP Server](https://github.com/BusyBee3333/Asana-MCP-2026-Complete) — Project management
- [Jira MCP Server](https://github.com/BusyBee3333/Jira-MCP-2026-Complete) — Issue tracking
- [Trello MCP Server](https://github.com/BusyBee3333/Trello-MCP-2026-Complete) — Kanban boards
- [Wrike MCP Server](https://github.com/BusyBee3333/Wrike-MCP-2026-Complete) — Work management
- ...and 26 more at [mcpengage.com](https://mcpengage.com)

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage) (invite on mcpengine.pages.dev).
