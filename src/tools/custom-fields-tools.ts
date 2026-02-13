/**
 * ClickUp Custom Fields Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createCustomFieldsTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_custom_fields_list',
      description: 'List accessible custom fields for a list',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getAccessibleCustomFields(args.list_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_custom_fields_get',
      description: 'Get custom field values for a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
      }),
      handler: async (args: any) => {
        const task = await client.getTask(args.task_id);
        const customFields = (task as any).custom_fields || [];
        return { content: [{ type: 'text', text: JSON.stringify(customFields, null, 2) }] };
      }
    },

    {
      name: 'clickup_custom_fields_set_value',
      description: 'Set a custom field value on a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        field_id: z.string().describe('Custom field ID'),
        value: z.any().describe('Field value (type depends on field type)'),
      }),
      handler: async (args: any) => {
        const response = await client.setCustomFieldValue(args.task_id, args.field_id, args.value);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_custom_fields_remove_value',
      description: 'Remove a custom field value from a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        field_id: z.string().describe('Custom field ID'),
      }),
      handler: async (args: any) => {
        await client.removeCustomFieldValue(args.task_id, args.field_id);
        return { content: [{ type: 'text', text: 'Custom field value removed successfully' }] };
      }
    },
  ];
}
