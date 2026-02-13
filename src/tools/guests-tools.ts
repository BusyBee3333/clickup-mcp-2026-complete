/**
 * ClickUp Guests Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createGuestsTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_guests_invite',
      description: 'Invite a guest to a workspace',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        email: z.string().describe('Guest email address'),
        can_edit_tags: z.boolean().optional().describe('Allow guest to edit tags'),
      }),
      handler: async (args: any) => {
        const response = await client.inviteGuestToWorkspace(
          args.team_id, 
          args.email, 
          args.can_edit_tags || false
        );
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_guests_get',
      description: 'Get guest details',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        guest_id: z.string().describe('Guest ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getGuest(args.team_id, args.guest_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_guests_edit',
      description: 'Edit guest permissions',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        guest_id: z.string().describe('Guest ID'),
        username: z.string().optional().describe('Username'),
        can_edit_tags: z.boolean().optional().describe('Allow guest to edit tags'),
        can_see_time_spent: z.boolean().optional().describe('Allow guest to see time spent'),
        can_see_time_estimated: z.boolean().optional().describe('Allow guest to see time estimated'),
      }),
      handler: async (args: any) => {
        const { team_id, guest_id, ...data } = args;
        const response = await client.editGuestOnWorkspace(team_id, guest_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_guests_remove',
      description: 'Remove a guest from a workspace',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        guest_id: z.string().describe('Guest ID'),
      }),
      handler: async (args: any) => {
        await client.removeGuestFromWorkspace(args.team_id, args.guest_id);
        return { content: [{ type: 'text', text: 'Guest removed successfully' }] };
      }
    },

    {
      name: 'clickup_guests_add_to_task',
      description: 'Add a guest to a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        guest_id: z.string().describe('Guest ID'),
        permission_level: z.string().optional().describe('Permission level (read, comment, edit, create)'),
      }),
      handler: async (args: any) => {
        const response = await client.addGuestToTask(args.task_id, args.guest_id, args.permission_level);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_guests_add_to_list',
      description: 'Add a guest to a list',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
        guest_id: z.string().describe('Guest ID'),
        permission_level: z.string().optional().describe('Permission level (read, comment, edit, create)'),
      }),
      handler: async (args: any) => {
        const response = await client.addGuestToList(args.list_id, args.guest_id, args.permission_level);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_guests_add_to_folder',
      description: 'Add a guest to a folder',
      inputSchema: z.object({
        folder_id: z.string().describe('Folder ID'),
        guest_id: z.string().describe('Guest ID'),
        permission_level: z.string().optional().describe('Permission level (read, comment, edit, create)'),
      }),
      handler: async (args: any) => {
        const response = await client.addGuestToFolder(args.folder_id, args.guest_id, args.permission_level);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },
  ];
}
