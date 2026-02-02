#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "clickup";
const MCP_VERSION = "1.0.0";
const API_BASE_URL = "https://api.clickup.com/api/v2";

// ============================================
// API CLIENT
// ============================================
class ClickUpClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`ClickUp API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    // Handle empty responses (like 204 No Content)
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Space endpoints
  async listSpaces(teamId: string, archived?: boolean) {
    const params = new URLSearchParams();
    if (archived !== undefined) params.append("archived", archived.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/team/${teamId}/space${query}`);
  }

  // List endpoints
  async listLists(folderId: string, archived?: boolean) {
    const params = new URLSearchParams();
    if (archived !== undefined) params.append("archived", archived.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/folder/${folderId}/list${query}`);
  }

  async listFolderlessLists(spaceId: string, archived?: boolean) {
    const params = new URLSearchParams();
    if (archived !== undefined) params.append("archived", archived.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/space/${spaceId}/list${query}`);
  }

  // Task endpoints
  async listTasks(listId: string, options?: {
    archived?: boolean;
    page?: number;
    order_by?: string;
    reverse?: boolean;
    subtasks?: boolean;
    statuses?: string[];
    include_closed?: boolean;
    assignees?: string[];
    due_date_gt?: number;
    due_date_lt?: number;
  }) {
    const params = new URLSearchParams();
    if (options?.archived !== undefined) params.append("archived", options.archived.toString());
    if (options?.page !== undefined) params.append("page", options.page.toString());
    if (options?.order_by) params.append("order_by", options.order_by);
    if (options?.reverse !== undefined) params.append("reverse", options.reverse.toString());
    if (options?.subtasks !== undefined) params.append("subtasks", options.subtasks.toString());
    if (options?.include_closed !== undefined) params.append("include_closed", options.include_closed.toString());
    if (options?.statuses) options.statuses.forEach(s => params.append("statuses[]", s));
    if (options?.assignees) options.assignees.forEach(a => params.append("assignees[]", a));
    if (options?.due_date_gt) params.append("due_date_gt", options.due_date_gt.toString());
    if (options?.due_date_lt) params.append("due_date_lt", options.due_date_lt.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/list/${listId}/task${query}`);
  }

  async getTask(taskId: string, includeSubtasks?: boolean) {
    const params = new URLSearchParams();
    if (includeSubtasks !== undefined) params.append("include_subtasks", includeSubtasks.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/task/${taskId}${query}`);
  }

  async createTask(listId: string, data: {
    name: string;
    description?: string;
    assignees?: string[];
    tags?: string[];
    status?: string;
    priority?: number;
    due_date?: number;
    due_date_time?: boolean;
    time_estimate?: number;
    start_date?: number;
    start_date_time?: boolean;
    notify_all?: boolean;
    parent?: string;
    links_to?: string;
    custom_fields?: any[];
  }) {
    return this.post(`/list/${listId}/task`, data);
  }

  async updateTask(taskId: string, data: {
    name?: string;
    description?: string;
    assignees?: { add?: string[]; rem?: string[] };
    status?: string;
    priority?: number;
    due_date?: number;
    due_date_time?: boolean;
    time_estimate?: number;
    start_date?: number;
    start_date_time?: boolean;
    parent?: string;
    archived?: boolean;
  }) {
    return this.put(`/task/${taskId}`, data);
  }

  // Comment endpoints
  async addComment(taskId: string, commentText: string, assignee?: string, notifyAll?: boolean) {
    const payload: any = { comment_text: commentText };
    if (assignee) payload.assignee = assignee;
    if (notifyAll !== undefined) payload.notify_all = notifyAll;
    return this.post(`/task/${taskId}/comment`, payload);
  }

  // Time tracking endpoints
  async getTimeEntries(teamId: string, options?: {
    start_date?: number;
    end_date?: number;
    assignee?: string;
    include_task_tags?: boolean;
    include_location_names?: boolean;
    space_id?: string;
    folder_id?: string;
    list_id?: string;
    task_id?: string;
  }) {
    const params = new URLSearchParams();
    if (options?.start_date) params.append("start_date", options.start_date.toString());
    if (options?.end_date) params.append("end_date", options.end_date.toString());
    if (options?.assignee) params.append("assignee", options.assignee);
    if (options?.include_task_tags !== undefined) params.append("include_task_tags", options.include_task_tags.toString());
    if (options?.include_location_names !== undefined) params.append("include_location_names", options.include_location_names.toString());
    if (options?.space_id) params.append("space_id", options.space_id);
    if (options?.folder_id) params.append("folder_id", options.folder_id);
    if (options?.list_id) params.append("list_id", options.list_id);
    if (options?.task_id) params.append("task_id", options.task_id);
    const query = params.toString() ? `?${params.toString()}` : "";
    return this.get(`/team/${teamId}/time_entries${query}`);
  }
}

// ============================================
// TOOL DEFINITIONS
// ============================================
const tools = [
  {
    name: "list_spaces",
    description: "List all spaces in a ClickUp workspace/team",
    inputSchema: {
      type: "object" as const,
      properties: {
        team_id: { type: "string", description: "The workspace/team ID" },
        archived: { type: "boolean", description: "Include archived spaces" },
      },
      required: ["team_id"],
    },
  },
  {
    name: "list_lists",
    description: "List all lists in a folder or space (folderless lists)",
    inputSchema: {
      type: "object" as const,
      properties: {
        folder_id: { type: "string", description: "The folder ID (for lists in a folder)" },
        space_id: { type: "string", description: "The space ID (for folderless lists)" },
        archived: { type: "boolean", description: "Include archived lists" },
      },
    },
  },
  {
    name: "list_tasks",
    description: "List tasks in a list with optional filters",
    inputSchema: {
      type: "object" as const,
      properties: {
        list_id: { type: "string", description: "The list ID" },
        archived: { type: "boolean", description: "Filter by archived status" },
        page: { type: "number", description: "Page number (0-indexed)" },
        order_by: { 
          type: "string", 
          description: "Order by field: id, created, updated, due_date",
          enum: ["id", "created", "updated", "due_date"]
        },
        reverse: { type: "boolean", description: "Reverse order" },
        subtasks: { type: "boolean", description: "Include subtasks" },
        include_closed: { type: "boolean", description: "Include closed tasks" },
        statuses: { 
          type: "array", 
          items: { type: "string" },
          description: "Filter by status names" 
        },
        assignees: { 
          type: "array", 
          items: { type: "string" },
          description: "Filter by assignee user IDs" 
        },
      },
      required: ["list_id"],
    },
  },
  {
    name: "get_task",
    description: "Get detailed information about a specific task",
    inputSchema: {
      type: "object" as const,
      properties: {
        task_id: { type: "string", description: "The task ID" },
        include_subtasks: { type: "boolean", description: "Include subtask details" },
      },
      required: ["task_id"],
    },
  },
  {
    name: "create_task",
    description: "Create a new task in a list",
    inputSchema: {
      type: "object" as const,
      properties: {
        list_id: { type: "string", description: "The list ID to create the task in" },
        name: { type: "string", description: "Task name" },
        description: { type: "string", description: "Task description (supports markdown)" },
        assignees: { 
          type: "array", 
          items: { type: "string" },
          description: "Array of user IDs to assign" 
        },
        tags: { 
          type: "array", 
          items: { type: "string" },
          description: "Array of tag names" 
        },
        status: { type: "string", description: "Status name" },
        priority: { 
          type: "number", 
          description: "Priority: 1=urgent, 2=high, 3=normal, 4=low",
          enum: [1, 2, 3, 4]
        },
        due_date: { type: "number", description: "Due date as Unix timestamp in milliseconds" },
        start_date: { type: "number", description: "Start date as Unix timestamp in milliseconds" },
        time_estimate: { type: "number", description: "Time estimate in milliseconds" },
        parent: { type: "string", description: "Parent task ID (to create as subtask)" },
      },
      required: ["list_id", "name"],
    },
  },
  {
    name: "update_task",
    description: "Update an existing task",
    inputSchema: {
      type: "object" as const,
      properties: {
        task_id: { type: "string", description: "The task ID to update" },
        name: { type: "string", description: "New task name" },
        description: { type: "string", description: "New task description" },
        status: { type: "string", description: "New status name" },
        priority: { 
          type: "number", 
          description: "Priority: 1=urgent, 2=high, 3=normal, 4=low, null=none",
          enum: [1, 2, 3, 4]
        },
        due_date: { type: "number", description: "Due date as Unix timestamp in milliseconds" },
        start_date: { type: "number", description: "Start date as Unix timestamp in milliseconds" },
        time_estimate: { type: "number", description: "Time estimate in milliseconds" },
        assignees_add: { 
          type: "array", 
          items: { type: "string" },
          description: "User IDs to add as assignees" 
        },
        assignees_remove: { 
          type: "array", 
          items: { type: "string" },
          description: "User IDs to remove from assignees" 
        },
        archived: { type: "boolean", description: "Archive or unarchive the task" },
      },
      required: ["task_id"],
    },
  },
  {
    name: "add_comment",
    description: "Add a comment to a task",
    inputSchema: {
      type: "object" as const,
      properties: {
        task_id: { type: "string", description: "The task ID" },
        comment_text: { type: "string", description: "Comment text (supports markdown)" },
        assignee: { type: "string", description: "User ID to assign the comment to" },
        notify_all: { type: "boolean", description: "Notify all assignees" },
      },
      required: ["task_id", "comment_text"],
    },
  },
  {
    name: "get_time_entries",
    description: "Get time tracking entries for a workspace",
    inputSchema: {
      type: "object" as const,
      properties: {
        team_id: { type: "string", description: "The workspace/team ID" },
        start_date: { type: "number", description: "Start date as Unix timestamp in milliseconds" },
        end_date: { type: "number", description: "End date as Unix timestamp in milliseconds" },
        assignee: { type: "string", description: "Filter by user ID" },
        task_id: { type: "string", description: "Filter by task ID" },
        list_id: { type: "string", description: "Filter by list ID" },
        space_id: { type: "string", description: "Filter by space ID" },
        include_task_tags: { type: "boolean", description: "Include task tags in response" },
        include_location_names: { type: "boolean", description: "Include location names in response" },
      },
      required: ["team_id"],
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: ClickUpClient, name: string, args: any) {
  switch (name) {
    case "list_spaces": {
      const { team_id, archived } = args;
      return await client.listSpaces(team_id, archived);
    }
    case "list_lists": {
      const { folder_id, space_id, archived } = args;
      if (folder_id) {
        return await client.listLists(folder_id, archived);
      } else if (space_id) {
        return await client.listFolderlessLists(space_id, archived);
      } else {
        throw new Error("Either folder_id or space_id is required");
      }
    }
    case "list_tasks": {
      const { list_id, archived, page, order_by, reverse, subtasks, include_closed, statuses, assignees } = args;
      return await client.listTasks(list_id, {
        archived,
        page,
        order_by,
        reverse,
        subtasks,
        include_closed,
        statuses,
        assignees,
      });
    }
    case "get_task": {
      const { task_id, include_subtasks } = args;
      return await client.getTask(task_id, include_subtasks);
    }
    case "create_task": {
      const { list_id, name, description, assignees, tags, status, priority, due_date, start_date, time_estimate, parent } = args;
      return await client.createTask(list_id, {
        name,
        description,
        assignees,
        tags,
        status,
        priority,
        due_date,
        start_date,
        time_estimate,
        parent,
      });
    }
    case "update_task": {
      const { task_id, name, description, status, priority, due_date, start_date, time_estimate, assignees_add, assignees_remove, archived } = args;
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (due_date !== undefined) updateData.due_date = due_date;
      if (start_date !== undefined) updateData.start_date = start_date;
      if (time_estimate !== undefined) updateData.time_estimate = time_estimate;
      if (archived !== undefined) updateData.archived = archived;
      if (assignees_add || assignees_remove) {
        updateData.assignees = {};
        if (assignees_add) updateData.assignees.add = assignees_add;
        if (assignees_remove) updateData.assignees.rem = assignees_remove;
      }
      return await client.updateTask(task_id, updateData);
    }
    case "add_comment": {
      const { task_id, comment_text, assignee, notify_all } = args;
      return await client.addComment(task_id, comment_text, assignee, notify_all);
    }
    case "get_time_entries": {
      const { team_id, start_date, end_date, assignee, task_id, list_id, space_id, include_task_tags, include_location_names } = args;
      return await client.getTimeEntries(team_id, {
        start_date,
        end_date,
        assignee,
        task_id,
        list_id,
        space_id,
        include_task_tags,
        include_location_names,
      });
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const apiKey = process.env.CLICKUP_API_KEY;
  if (!apiKey) {
    console.error("Error: CLICKUP_API_KEY environment variable required");
    console.error("Get your API key from ClickUp Settings > Apps > API Token");
    process.exit(1);
  }

  const client = new ClickUpClient(apiKey);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
