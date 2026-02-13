/**
 * ClickUp Goals Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createGoalsTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_goals_list',
      description: 'List all goals in a team',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getGoals(args.team_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_goals_get',
      description: 'Get a specific goal by ID',
      inputSchema: z.object({
        goal_id: z.string().describe('Goal ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getGoal(args.goal_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_goals_create',
      description: 'Create a new goal',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        name: z.string().describe('Goal name'),
        due_date: z.number().optional().describe('Due date (Unix timestamp in milliseconds)'),
        description: z.string().optional().describe('Goal description'),
        multiple_owners: z.boolean().optional().describe('Allow multiple owners'),
        owners: z.array(z.number()).optional().describe('Owner user IDs'),
        color: z.string().optional().describe('Color hex code'),
      }),
      handler: async (args: any) => {
        const { team_id, ...data } = args;
        const response = await client.createGoal(team_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_goals_update',
      description: 'Update a goal',
      inputSchema: z.object({
        goal_id: z.string().describe('Goal ID'),
        name: z.string().optional().describe('Goal name'),
        due_date: z.number().optional().describe('Due date (Unix timestamp in milliseconds)'),
        description: z.string().optional().describe('Goal description'),
        rem_owners: z.array(z.number()).optional().describe('Remove owner user IDs'),
        add_owners: z.array(z.number()).optional().describe('Add owner user IDs'),
        color: z.string().optional().describe('Color hex code'),
      }),
      handler: async (args: any) => {
        const { goal_id, ...data } = args;
        const response = await client.updateGoal(goal_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_goals_delete',
      description: 'Delete a goal',
      inputSchema: z.object({
        goal_id: z.string().describe('Goal ID'),
      }),
      handler: async (args: any) => {
        await client.deleteGoal(args.goal_id);
        return { content: [{ type: 'text', text: 'Goal deleted successfully' }] };
      }
    },

    {
      name: 'clickup_goals_add_key_result',
      description: 'Add a key result to a goal',
      inputSchema: z.object({
        goal_id: z.string().describe('Goal ID'),
        name: z.string().describe('Key result name'),
        owners: z.array(z.number()).optional().describe('Owner user IDs'),
        type: z.string().describe('Type: number, currency, boolean, percentage, automatic'),
        steps_start: z.number().optional().describe('Starting value (for number/currency/percentage)'),
        steps_end: z.number().optional().describe('Target value'),
        unit: z.string().optional().describe('Unit (for currency)'),
        task_ids: z.array(z.string()).optional().describe('Task IDs (for automatic)'),
        list_ids: z.array(z.string()).optional().describe('List IDs (for automatic)'),
      }),
      handler: async (args: any) => {
        const { goal_id, ...data } = args;
        const response = await client.createKeyResult(goal_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_goals_update_key_result',
      description: 'Update a key result',
      inputSchema: z.object({
        key_result_id: z.string().describe('Key Result ID'),
        name: z.string().optional().describe('Key result name'),
        note: z.string().optional().describe('Note'),
        steps_current: z.number().optional().describe('Current value'),
        steps_start: z.number().optional().describe('Starting value'),
        steps_end: z.number().optional().describe('Target value'),
      }),
      handler: async (args: any) => {
        const { key_result_id, ...data } = args;
        const response = await client.updateKeyResult(key_result_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },
  ];
}
