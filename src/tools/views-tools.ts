/**
 * ClickUp Views Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createViewsTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_views_list',
      description: 'List all views in a workspace/space',
      inputSchema: z.object({
        team_id: z.string().describe('Team/Workspace ID'),
        space_id: z.string().describe('Space ID'),
        list_id: z.string().optional().describe('List ID'),
        folder_id: z.string().optional().describe('Folder ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getViews(args.team_id, args.space_id, args.list_id, args.folder_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_views_get',
      description: 'Get a specific view by ID',
      inputSchema: z.object({
        view_id: z.string().describe('View ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getView(args.view_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_views_get_tasks',
      description: 'Get tasks from a view',
      inputSchema: z.object({
        view_id: z.string().describe('View ID'),
        page: z.number().optional().describe('Page number'),
      }),
      handler: async (args: any) => {
        const response = await client.getViewTasks(args.view_id, args.page);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_views_create',
      description: 'Create a new view',
      inputSchema: z.object({
        team_id: z.string().describe('Team/Workspace ID'),
        space_id: z.string().describe('Space ID'),
        name: z.string().describe('View name'),
        type: z.string().describe('View type (list, board, calendar, gantt, etc.)'),
        parent: z.object({
          id: z.string(),
          type: z.number()
        }).optional().describe('Parent object (list, folder, space)'),
        grouping: z.object({
          field: z.string(),
          dir: z.number()
        }).optional().describe('Grouping configuration'),
        sorting: z.object({
          fields: z.array(z.object({
            field: z.string(),
            dir: z.number()
          }))
        }).optional().describe('Sorting configuration'),
      }),
      handler: async (args: any) => {
        const { team_id, space_id, ...data } = args;
        const response = await client.createView(team_id, space_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_views_update',
      description: 'Update a view',
      inputSchema: z.object({
        view_id: z.string().describe('View ID'),
        name: z.string().optional().describe('View name'),
        grouping: z.object({
          field: z.string(),
          dir: z.number()
        }).optional().describe('Grouping configuration'),
        sorting: z.object({
          fields: z.array(z.object({
            field: z.string(),
            dir: z.number()
          }))
        }).optional().describe('Sorting configuration'),
      }),
      handler: async (args: any) => {
        const { view_id, ...data } = args;
        const response = await client.updateView(view_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_views_delete',
      description: 'Delete a view',
      inputSchema: z.object({
        view_id: z.string().describe('View ID'),
      }),
      handler: async (args: any) => {
        await client.deleteView(args.view_id);
        return { content: [{ type: 'text', text: 'View deleted successfully' }] };
      }
    },
  ];
}
