/**
 * ClickUp Templates Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createTemplatesTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_templates_list',
      description: 'List available task templates',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        page: z.number().optional().describe('Page number'),
      }),
      handler: async (args: any) => {
        const response = await client.getTemplates(args.team_id, args.page);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_templates_apply',
      description: 'Create a task from a template',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
        template_id: z.string().describe('Template ID'),
        name: z.string().describe('Task name'),
      }),
      handler: async (args: any) => {
        const response = await client.createTaskFromTemplate(args.list_id, args.template_id, args.name);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },
  ];
}
