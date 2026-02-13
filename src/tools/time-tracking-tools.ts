/**
 * ClickUp Time Tracking Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createTimeTrackingTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_time_list_entries',
      description: 'List time entries in a team',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        start_date: z.number().optional().describe('Start date filter (Unix timestamp in milliseconds)'),
        end_date: z.number().optional().describe('End date filter (Unix timestamp in milliseconds)'),
        assignee: z.number().optional().describe('Filter by assignee user ID'),
        include_task_tags: z.boolean().optional().describe('Include task tags'),
        include_location_names: z.boolean().optional().describe('Include location names'),
        space_id: z.string().optional().describe('Filter by space ID'),
        folder_id: z.string().optional().describe('Filter by folder ID'),
        list_id: z.string().optional().describe('Filter by list ID'),
        task_id: z.string().optional().describe('Filter by task ID'),
      }),
      handler: async (args: any) => {
        const { team_id, ...params } = args;
        const response = await client.getTimeEntries(team_id, params);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_time_get_entry',
      description: 'Get a specific time entry',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        timer_id: z.string().describe('Timer/Time Entry ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getTimeEntry(args.team_id, args.timer_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_time_create',
      description: 'Create a time entry',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        task_id: z.string().describe('Task ID'),
        duration: z.number().describe('Duration in milliseconds'),
        start: z.number().describe('Start time (Unix timestamp in milliseconds)'),
        description: z.string().optional().describe('Time entry description'),
        billable: z.boolean().optional().describe('Is billable'),
        assignee: z.number().optional().describe('Assignee user ID'),
        tags: z.array(z.string()).optional().describe('Tag names'),
      }),
      handler: async (args: any) => {
        const { team_id, task_id, ...data } = args;
        data.tid = task_id;
        const response = await client.createTimeEntry(team_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_time_update',
      description: 'Update a time entry',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        timer_id: z.string().describe('Timer/Time Entry ID'),
        description: z.string().optional().describe('Time entry description'),
        billable: z.boolean().optional().describe('Is billable'),
        start: z.number().optional().describe('Start time (Unix timestamp in milliseconds)'),
        end: z.number().optional().describe('End time (Unix timestamp in milliseconds)'),
        duration: z.number().optional().describe('Duration in milliseconds'),
        assignee: z.number().optional().describe('Assignee user ID'),
        tags: z.array(z.string()).optional().describe('Tag names'),
      }),
      handler: async (args: any) => {
        const { team_id, timer_id, ...data } = args;
        const response = await client.updateTimeEntry(team_id, timer_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_time_delete',
      description: 'Delete a time entry',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        timer_id: z.string().describe('Timer/Time Entry ID'),
      }),
      handler: async (args: any) => {
        await client.deleteTimeEntry(args.team_id, args.timer_id);
        return { content: [{ type: 'text', text: 'Time entry deleted successfully' }] };
      }
    },

    {
      name: 'clickup_time_get_running',
      description: 'Get running timer for a user',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        assignee: z.string().optional().describe('Assignee user ID (defaults to current user)'),
      }),
      handler: async (args: any) => {
        const response = await client.getRunningTimeEntry(args.team_id, args.assignee);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_time_start',
      description: 'Start a timer for a task',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        task_id: z.string().describe('Task ID'),
        description: z.string().optional().describe('Timer description'),
        billable: z.boolean().optional().describe('Is billable'),
      }),
      handler: async (args: any) => {
        const { team_id, task_id, ...data } = args;
        const response = await client.startTimer(team_id, task_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_time_stop',
      description: 'Stop the running timer',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
      }),
      handler: async (args: any) => {
        const response = await client.stopTimer(args.team_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },
  ];
}
