/**
 * ClickUp Folders Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createFoldersTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_folders_list',
      description: 'List all folders in a space',
      inputSchema: z.object({
        space_id: z.string().describe('Space ID'),
        archived: z.boolean().optional().describe('Include archived folders'),
      }),
      handler: async (args: any) => {
        const response = await client.getFolders(args.space_id, args.archived);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_folders_get',
      description: 'Get a specific folder by ID',
      inputSchema: z.object({
        folder_id: z.string().describe('Folder ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getFolder(args.folder_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_folders_create',
      description: 'Create a new folder',
      inputSchema: z.object({
        space_id: z.string().describe('Space ID'),
        name: z.string().describe('Folder name'),
      }),
      handler: async (args: any) => {
        const { space_id, ...data } = args;
        const response = await client.createFolder(space_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_folders_update',
      description: 'Update a folder',
      inputSchema: z.object({
        folder_id: z.string().describe('Folder ID'),
        name: z.string().optional().describe('Folder name'),
      }),
      handler: async (args: any) => {
        const { folder_id, ...data } = args;
        const response = await client.updateFolder(folder_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_folders_delete',
      description: 'Delete a folder',
      inputSchema: z.object({
        folder_id: z.string().describe('Folder ID'),
      }),
      handler: async (args: any) => {
        await client.deleteFolder(args.folder_id);
        return { content: [{ type: 'text', text: 'Folder deleted successfully' }] };
      }
    },
  ];
}
