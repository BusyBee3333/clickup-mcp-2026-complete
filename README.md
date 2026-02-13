# ClickUp MCP Server

Complete Model Context Protocol server for ClickUp - the all-in-one productivity platform.

## Features

- **93 Tools** across all ClickUp domains
- **18 React MCP Apps** for rich interactive UIs
- **Full API Coverage**: Tasks, Spaces, Folders, Lists, Views, Comments, Docs, Goals, Tags, Time Tracking, Teams, Webhooks, Custom Fields, Templates, and Guests
- **Production Ready**: Rate limiting, pagination, error handling, comprehensive types

## Installation

```bash
npm install @mcpengine/clickup
```

## Configuration

Add to your MCP settings:

```json
{
  "mcpServers": {
    "clickup": {
      "command": "node",
      "args": ["/path/to/@mcpengine/clickup/dist/index.js"],
      "env": {
        "CLICKUP_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Authentication

ClickUp MCP supports two authentication methods:

1. **Personal API Token** (recommended for development):
   - Get your token from: https://app.clickup.com/settings/apps
   - Set `CLICKUP_API_TOKEN` environment variable

2. **OAuth2** (for production apps):
   - Set `CLICKUP_CLIENT_ID`, `CLICKUP_CLIENT_SECRET`, and `CLICKUP_OAUTH_TOKEN`

## Available Tools

### Tasks (17 tools)
- `clickup_tasks_list` - List tasks with filtering
- `clickup_tasks_get` - Get task details
- `clickup_tasks_create` - Create new task
- `clickup_tasks_update` - Update task
- `clickup_tasks_delete` - Delete task
- `clickup_tasks_filter` - Advanced task filtering
- `clickup_tasks_bulk_update` - Bulk update tasks
- `clickup_tasks_get_time_entries` - Get time entries for task
- `clickup_tasks_add_time_entry` - Add time entry
- `clickup_tasks_get_custom_fields` - Get custom field values
- `clickup_tasks_set_custom_field` - Set custom field value
- `clickup_tasks_add_dependency` - Add task dependency
- `clickup_tasks_remove_dependency` - Remove dependency
- `clickup_tasks_list_members` - List task members
- `clickup_tasks_add_comment` - Add comment to task
- `clickup_tasks_get_comments` - Get task comments
- `clickup_tasks_search` - Search tasks

### Spaces (5 tools)
- `clickup_spaces_list` - List spaces
- `clickup_spaces_get` - Get space details
- `clickup_spaces_create` - Create space
- `clickup_spaces_update` - Update space
- `clickup_spaces_delete` - Delete space

### Folders (5 tools)
- `clickup_folders_list` - List folders
- `clickup_folders_get` - Get folder details
- `clickup_folders_create` - Create folder
- `clickup_folders_update` - Update folder
- `clickup_folders_delete` - Delete folder

### Lists (7 tools)
- `clickup_lists_list` - List lists
- `clickup_lists_get` - Get list details
- `clickup_lists_create` - Create list
- `clickup_lists_update` - Update list
- `clickup_lists_delete` - Delete list
- `clickup_lists_add_task` - Add task to list
- `clickup_lists_remove_task` - Remove task from list

### Views (5 tools)
- `clickup_views_list` - List views
- `clickup_views_get` - Get view details
- `clickup_views_create` - Create view
- `clickup_views_update` - Update view
- `clickup_views_delete` - Delete view

### Comments (5 tools)
- `clickup_comments_list` - List comments
- `clickup_comments_get` - Get comment
- `clickup_comments_create` - Create comment
- `clickup_comments_update` - Update comment
- `clickup_comments_delete` - Delete comment

### Docs (3 tools)
- `clickup_docs_list` - List docs
- `clickup_docs_get` - Get doc
- `clickup_docs_create` - Create doc
- `clickup_docs_search` - Search docs

### Goals (7 tools)
- `clickup_goals_list` - List goals
- `clickup_goals_get` - Get goal
- `clickup_goals_create` - Create goal
- `clickup_goals_update` - Update goal
- `clickup_goals_delete` - Delete goal
- `clickup_goals_add_key_result` - Add key result
- `clickup_goals_update_key_result` - Update key result

### Tags (5 tools)
- `clickup_tags_list` - List tags
- `clickup_tags_create` - Create tag
- `clickup_tags_update` - Update tag
- `clickup_tags_delete` - Delete tag
- `clickup_tags_add_to_task` - Add tag to task

### Checklists (6 tools)
- `clickup_checklists_create` - Create checklist
- `clickup_checklists_update` - Update checklist
- `clickup_checklists_delete` - Delete checklist
- `clickup_checklists_create_item` - Create checklist item
- `clickup_checklists_update_item` - Update item
- `clickup_checklists_delete_item` - Delete item

### Time Tracking (7 tools)
- `clickup_time_list_entries` - List time entries
- `clickup_time_get_entry` - Get time entry
- `clickup_time_create` - Create time entry
- `clickup_time_update` - Update time entry
- `clickup_time_delete` - Delete time entry
- `clickup_time_get_running` - Get running timer
- `clickup_time_start` - Start timer
- `clickup_time_stop` - Stop timer

### Teams (6 tools)
- `clickup_teams_list_workspaces` - List workspaces
- `clickup_teams_get_workspace` - Get workspace
- `clickup_teams_list_members` - List members
- `clickup_teams_get_member` - Get member
- `clickup_teams_list_groups` - List groups
- `clickup_teams_create_group` - Create group

### Webhooks (4 tools)
- `clickup_webhooks_list` - List webhooks
- `clickup_webhooks_create` - Create webhook
- `clickup_webhooks_update` - Update webhook
- `clickup_webhooks_delete` - Delete webhook

### Custom Fields (4 tools)
- `clickup_custom_fields_list` - List custom fields
- `clickup_custom_fields_get` - Get custom field
- `clickup_custom_fields_set_value` - Set field value
- `clickup_custom_fields_remove_value` - Remove value

### Templates (2 tools)
- `clickup_templates_list` - List templates
- `clickup_templates_apply` - Apply template

### Guests (6 tools)
- `clickup_guests_invite` - Invite guest
- `clickup_guests_get` - Get guest
- `clickup_guests_edit` - Edit guest
- `clickup_guests_remove` - Remove guest
- `clickup_guests_add_to_task` - Add guest to task
- `clickup_guests_add_to_list` - Add guest to list

## React MCP Apps (18 Total)

All apps are built with React + Vite and use the standalone app pattern. Each app has its own directory in `src/ui/react-app/` with `App.tsx`, `index.html`, and `vite.config.ts`.

### Task Management (4 apps)
- **task-dashboard** - Task overview with status counts, overdue tasks, and priority breakdown
- **task-detail** - Full task view with description, custom fields, subtasks, comments, and time tracking
- **task-grid** - Spreadsheet-style task view with sorting and filtering
- **task-board** - Kanban board view with tasks organized by status

### Workspace & Organization (4 apps)
- **space-overview** - Space dashboard showing folders, lists, and members
- **folder-overview** - Folder detail view with lists and statistics
- **list-view** - List detail view with tasks and filters
- **workspace-overview** - High-level workspace dashboard with spaces and team metrics

### Views & Visualization (1 app)
- **calendar-view** - Monthly calendar view with task due dates

### Goals & Tracking (2 apps)
- **goal-tracker** - Track goals, targets, and progress metrics
- **member-workload** - Team capacity and workload distribution view

### Time Tracking (2 apps)
- **time-dashboard** - Time tracking overview with hours logged and team analytics
- **time-entries** - List of time entries with filtering and export

### Content & Collaboration (3 apps)
- **doc-browser** - Browse and view ClickUp Docs
- **comment-thread** - View and manage task comments and discussions
- **checklist-manager** - Create and manage checklists within tasks

### Configuration & Admin (2 apps)
- **tag-manager** - Manage workspace tags and tag organization
- **template-gallery** - Browse and apply task and list templates

## API Coverage

This server implements the complete ClickUp API v2:
- https://clickup.com/api/clickupapiref/operation/GetTasks/
- Rate limiting and pagination handled automatically
- Comprehensive error handling and retries

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run watch
```

## License

MIT
