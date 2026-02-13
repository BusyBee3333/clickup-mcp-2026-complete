/**
 * ClickUp Teams/Workspaces Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createTeamsTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_teams_list_workspaces',
      description: 'List all authorized workspaces/teams',
      inputSchema: z.object({}),
      handler: async (args: any) => {
        const response = await client.getAuthorizedTeams();
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_teams_get_workspace',
      description: 'Get workspace/team details',
      inputSchema: z.object({
        team_id: z.string().describe('Team/Workspace ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getTeam(args.team_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_teams_list_members',
      description: 'List members of a list',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getListMembers(args.list_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_teams_get_member',
      description: 'Get task member details',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getTaskMembers(args.task_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },
  ];
}
