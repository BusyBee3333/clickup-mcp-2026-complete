/**
 * ClickUp Spaces Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createSpacesTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_spaces_list',
      description: 'List all spaces in a workspace',
      inputSchema: z.object({
        team_id: z.string().describe('Team/Workspace ID'),
        archived: z.boolean().optional().describe('Include archived spaces'),
      }),
      handler: async (args: any) => {
        const response = await client.getSpaces(args.team_id, args.archived);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_spaces_get',
      description: 'Get a specific space by ID',
      inputSchema: z.object({
        space_id: z.string().describe('Space ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getSpace(args.space_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_spaces_create',
      description: 'Create a new space',
      inputSchema: z.object({
        team_id: z.string().describe('Team/Workspace ID'),
        name: z.string().describe('Space name'),
        multiple_assignees: z.boolean().optional().describe('Allow multiple assignees'),
        features: z.object({
          due_dates: z.object({
            enabled: z.boolean().optional(),
            start_date: z.boolean().optional(),
            remap_due_dates: z.boolean().optional(),
            remap_closed_due_date: z.boolean().optional(),
          }).optional(),
          time_tracking: z.object({ enabled: z.boolean().optional() }).optional(),
          tags: z.object({ enabled: z.boolean().optional() }).optional(),
          time_estimates: z.object({ enabled: z.boolean().optional() }).optional(),
          checklists: z.object({ enabled: z.boolean().optional() }).optional(),
          custom_fields: z.object({ enabled: z.boolean().optional() }).optional(),
          remap_dependencies: z.object({ enabled: z.boolean().optional() }).optional(),
          dependency_warning: z.object({ enabled: z.boolean().optional() }).optional(),
          portfolios: z.object({ enabled: z.boolean().optional() }).optional(),
        }).optional().describe('Space features configuration'),
      }),
      handler: async (args: any) => {
        const { team_id, ...data } = args;
        const response = await client.createSpace(team_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_spaces_update',
      description: 'Update a space',
      inputSchema: z.object({
        space_id: z.string().describe('Space ID'),
        name: z.string().optional().describe('Space name'),
        color: z.string().optional().describe('Space color (hex)'),
        private: z.boolean().optional().describe('Make space private'),
        admin_can_manage: z.boolean().optional().describe('Allow admins to manage'),
        multiple_assignees: z.boolean().optional().describe('Allow multiple assignees'),
        features: z.object({
          due_dates: z.object({
            enabled: z.boolean().optional(),
            start_date: z.boolean().optional(),
            remap_due_dates: z.boolean().optional(),
            remap_closed_due_date: z.boolean().optional(),
          }).optional(),
          time_tracking: z.object({ enabled: z.boolean().optional() }).optional(),
          tags: z.object({ enabled: z.boolean().optional() }).optional(),
          time_estimates: z.object({ enabled: z.boolean().optional() }).optional(),
          checklists: z.object({ enabled: z.boolean().optional() }).optional(),
          custom_fields: z.object({ enabled: z.boolean().optional() }).optional(),
          remap_dependencies: z.object({ enabled: z.boolean().optional() }).optional(),
          dependency_warning: z.object({ enabled: z.boolean().optional() }).optional(),
          portfolios: z.object({ enabled: z.boolean().optional() }).optional(),
        }).optional().describe('Space features configuration'),
      }),
      handler: async (args: any) => {
        const { space_id, ...data } = args;
        const response = await client.updateSpace(space_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_spaces_delete',
      description: 'Delete a space',
      inputSchema: z.object({
        space_id: z.string().describe('Space ID'),
      }),
      handler: async (args: any) => {
        await client.deleteSpace(args.space_id);
        return { content: [{ type: 'text', text: 'Space deleted successfully' }] };
      }
    },
  ];
}
