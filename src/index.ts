#!/usr/bin/env node

/**
 * ClickUp MCP Server
 * Complete integration with ClickUp API v2
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { ClickUpClient } from './clients/clickup.js';
import type { ClickUpConfig } from './types.js';

// Import tool creators
import { createTasksTools } from './tools/tasks-tools.js';
import { createSpacesTools } from './tools/spaces-tools.js';
import { createFoldersTools } from './tools/folders-tools.js';
import { createListsTools } from './tools/lists-tools.js';
import { createViewsTools } from './tools/views-tools.js';
import { createCommentsTools } from './tools/comments-tools.js';
import { createDocsTools } from './tools/docs-tools.js';
import { createGoalsTools } from './tools/goals-tools.js';
import { createTagsTools } from './tools/tags-tools.js';
import { createChecklistsTools } from './tools/checklists-tools.js';
import { createTimeTrackingTools } from './tools/time-tracking-tools.js';
import { createTeamsTools } from './tools/teams-tools.js';
import { createWebhooksTools } from './tools/webhooks-tools.js';
import { createCustomFieldsTools } from './tools/custom-fields-tools.js';
import { createTemplatesTools } from './tools/templates-tools.js';
import { createGuestsTools } from './tools/guests-tools.js';

class ClickUpServer {
  private server: Server;
  private client: ClickUpClient;
  private tools: Map<string, any> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'clickup',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize ClickUp client
    const config: ClickUpConfig = {
      apiToken: process.env.CLICKUP_API_TOKEN,
      oauthToken: process.env.CLICKUP_OAUTH_TOKEN,
      clientId: process.env.CLICKUP_CLIENT_ID,
      clientSecret: process.env.CLICKUP_CLIENT_SECRET,
    };

    this.client = new ClickUpClient(config);

    // Register all tools
    this.registerTools();

    // Setup request handlers
    this.setupHandlers();

    // Error handling
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private registerTools() {
    const allTools = [
      ...createTasksTools(this.client),
      ...createSpacesTools(this.client),
      ...createFoldersTools(this.client),
      ...createListsTools(this.client),
      ...createViewsTools(this.client),
      ...createCommentsTools(this.client),
      ...createDocsTools(this.client),
      ...createGoalsTools(this.client),
      ...createTagsTools(this.client),
      ...createChecklistsTools(this.client),
      ...createTimeTrackingTools(this.client),
      ...createTeamsTools(this.client),
      ...createWebhooksTools(this.client),
      ...createCustomFieldsTools(this.client),
      ...createTemplatesTools(this.client),
      ...createGuestsTools(this.client),
    ];

    for (const tool of allTools) {
      this.tools.set(tool.name, tool);
    }
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = Array.from(this.tools.values()).map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: {
          type: 'object',
          properties: tool.inputSchema.shape,
          required: Object.keys(tool.inputSchema.shape).filter(
            key => !tool.inputSchema.shape[key].isOptional()
          ),
        },
      }));

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = this.tools.get(request.params.name);
      
      if (!tool) {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }

      try {
        // Validate input
        const args = tool.inputSchema.parse(request.params.arguments);
        
        // Execute tool
        const result = await tool.handler(args);
        
        return result;
      } catch (error) {
        if (error instanceof Error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ClickUp MCP server running on stdio');
  }
}

const server = new ClickUpServer();
server.run().catch(console.error);
