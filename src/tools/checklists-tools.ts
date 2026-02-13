/**
 * ClickUp Checklists Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createChecklistsTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_checklists_create',
      description: 'Create a checklist on a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        name: z.string().describe('Checklist name'),
      }),
      handler: async (args: any) => {
        const { task_id, ...data } = args;
        const response = await client.createChecklist(task_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_checklists_update',
      description: 'Update a checklist',
      inputSchema: z.object({
        checklist_id: z.string().describe('Checklist ID'),
        name: z.string().optional().describe('Checklist name'),
        position: z.number().optional().describe('Position/order index'),
      }),
      handler: async (args: any) => {
        const { checklist_id, ...data } = args;
        const response = await client.updateChecklist(checklist_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_checklists_delete',
      description: 'Delete a checklist',
      inputSchema: z.object({
        checklist_id: z.string().describe('Checklist ID'),
      }),
      handler: async (args: any) => {
        await client.deleteChecklist(args.checklist_id);
        return { content: [{ type: 'text', text: 'Checklist deleted successfully' }] };
      }
    },

    {
      name: 'clickup_checklists_create_item',
      description: 'Create a checklist item',
      inputSchema: z.object({
        checklist_id: z.string().describe('Checklist ID'),
        name: z.string().describe('Item name'),
        assignee: z.number().optional().describe('Assignee user ID'),
      }),
      handler: async (args: any) => {
        const { checklist_id, ...data } = args;
        const response = await client.createChecklistItem(checklist_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_checklists_update_item',
      description: 'Update a checklist item',
      inputSchema: z.object({
        checklist_id: z.string().describe('Checklist ID'),
        checklist_item_id: z.string().describe('Checklist Item ID'),
        name: z.string().optional().describe('Item name'),
        assignee: z.number().optional().describe('Assignee user ID'),
        resolved: z.boolean().optional().describe('Mark as resolved/completed'),
        parent: z.string().optional().describe('Parent item ID (for nesting)'),
      }),
      handler: async (args: any) => {
        const { checklist_id, checklist_item_id, ...data } = args;
        const response = await client.updateChecklistItem(checklist_id, checklist_item_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_checklists_delete_item',
      description: 'Delete a checklist item',
      inputSchema: z.object({
        checklist_id: z.string().describe('Checklist ID'),
        checklist_item_id: z.string().describe('Checklist Item ID'),
      }),
      handler: async (args: any) => {
        await client.deleteChecklistItem(args.checklist_id, args.checklist_item_id);
        return { content: [{ type: 'text', text: 'Checklist item deleted successfully' }] };
      }
    },
  ];
}
