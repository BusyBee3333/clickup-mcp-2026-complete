/**
 * ClickUp Webhooks Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createWebhooksTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_webhooks_list',
      description: 'List all webhooks in a team',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getWebhooks(args.team_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_webhooks_create',
      description: 'Create a webhook',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        endpoint: z.string().describe('Webhook endpoint URL'),
        events: z.array(z.string()).describe('Event types (e.g., taskCreated, taskUpdated, taskDeleted)'),
        space_id: z.string().optional().describe('Filter to space ID'),
        folder_id: z.string().optional().describe('Filter to folder ID'),
        list_id: z.string().optional().describe('Filter to list ID'),
        task_id: z.string().optional().describe('Filter to task ID'),
      }),
      handler: async (args: any) => {
        const { team_id, ...data } = args;
        const response = await client.createWebhook(team_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_webhooks_update',
      description: 'Update a webhook',
      inputSchema: z.object({
        webhook_id: z.string().describe('Webhook ID'),
        endpoint: z.string().optional().describe('Webhook endpoint URL'),
        events: z.array(z.string()).optional().describe('Event types'),
        status: z.string().optional().describe('Status (active, disabled)'),
      }),
      handler: async (args: any) => {
        const { webhook_id, ...data } = args;
        const response = await client.updateWebhook(webhook_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_webhooks_delete',
      description: 'Delete a webhook',
      inputSchema: z.object({
        webhook_id: z.string().describe('Webhook ID'),
      }),
      handler: async (args: any) => {
        await client.deleteWebhook(args.webhook_id);
        return { content: [{ type: 'text', text: 'Webhook deleted successfully' }] };
      }
    },
  ];
}
