/**
 * ClickUp Lists Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createListsTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_lists_list',
      description: 'List all lists in a folder or space',
      inputSchema: z.object({
        folder_id: z.string().optional().describe('Folder ID'),
        space_id: z.string().optional().describe('Space ID (for folderless lists)'),
        archived: z.boolean().optional().describe('Include archived lists'),
      }),
      handler: async (args: any) => {
        let response;
        if (args.folder_id) {
          response = await client.getFolderLists(args.folder_id, args.archived);
        } else if (args.space_id) {
          response = await client.getSpaceLists(args.space_id, args.archived);
        } else {
          throw new Error('Either folder_id or space_id must be provided');
        }
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_lists_get',
      description: 'Get a specific list by ID',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getList(args.list_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_lists_create',
      description: 'Create a new list',
      inputSchema: z.object({
        folder_id: z.string().optional().describe('Folder ID'),
        space_id: z.string().optional().describe('Space ID (for folderless list)'),
        name: z.string().describe('List name'),
        content: z.string().optional().describe('List description'),
        due_date: z.number().optional().describe('Due date (Unix timestamp)'),
        due_date_time: z.boolean().optional().describe('Include time in due date'),
        priority: z.number().optional().describe('Priority (1-4)'),
        assignee: z.number().optional().describe('Default assignee user ID'),
        status: z.string().optional().describe('Default status'),
      }),
      handler: async (args: any) => {
        const { folder_id, space_id, ...data } = args;
        let response;
        if (folder_id) {
          response = await client.createList(folder_id, data);
        } else if (space_id) {
          response = await client.createFolderlessList(space_id, data);
        } else {
          throw new Error('Either folder_id or space_id must be provided');
        }
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_lists_update',
      description: 'Update a list',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
        name: z.string().optional().describe('List name'),
        content: z.string().optional().describe('List description'),
        due_date: z.number().optional().describe('Due date (Unix timestamp)'),
        due_date_time: z.boolean().optional().describe('Include time in due date'),
        priority: z.number().optional().describe('Priority (1-4)'),
        assignee: z.number().optional().describe('Default assignee user ID'),
        unset_status: z.boolean().optional().describe('Remove default status'),
      }),
      handler: async (args: any) => {
        const { list_id, ...data } = args;
        const response = await client.updateList(list_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_lists_delete',
      description: 'Delete a list',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
      }),
      handler: async (args: any) => {
        await client.deleteList(args.list_id);
        return { content: [{ type: 'text', text: 'List deleted successfully' }] };
      }
    },

    {
      name: 'clickup_lists_add_task',
      description: 'Add an existing task to a list',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
        task_id: z.string().describe('Task ID'),
      }),
      handler: async (args: any) => {
        const response = await client.addTaskToList(args.list_id, args.task_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_lists_remove_task',
      description: 'Remove a task from a list',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
        task_id: z.string().describe('Task ID'),
      }),
      handler: async (args: any) => {
        await client.removeTaskFromList(args.list_id, args.task_id);
        return { content: [{ type: 'text', text: 'Task removed from list successfully' }] };
      }
    },
  ];
}
