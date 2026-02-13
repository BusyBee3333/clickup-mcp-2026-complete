/**
 * ClickUp Tags Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createTagsTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_tags_list',
      description: 'List all tags in a space',
      inputSchema: z.object({
        space_id: z.string().describe('Space ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getSpaceTags(args.space_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tags_create',
      description: 'Create a new tag',
      inputSchema: z.object({
        space_id: z.string().describe('Space ID'),
        name: z.string().describe('Tag name'),
        tag_fg: z.string().optional().describe('Foreground color (hex)'),
        tag_bg: z.string().optional().describe('Background color (hex)'),
      }),
      handler: async (args: any) => {
        const { space_id, name, ...data } = args;
        const response = await client.createSpaceTag(space_id, { tag: { name, ...data } });
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tags_update',
      description: 'Update a tag',
      inputSchema: z.object({
        space_id: z.string().describe('Space ID'),
        tag_name: z.string().describe('Current tag name'),
        new_name: z.string().optional().describe('New tag name'),
        tag_fg: z.string().optional().describe('Foreground color (hex)'),
        tag_bg: z.string().optional().describe('Background color (hex)'),
      }),
      handler: async (args: any) => {
        const { space_id, tag_name, new_name, ...data } = args;
        const updateData: any = { ...data };
        if (new_name) updateData.name = new_name;
        const response = await client.updateTag(space_id, tag_name, { tag: updateData });
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tags_delete',
      description: 'Delete a tag',
      inputSchema: z.object({
        space_id: z.string().describe('Space ID'),
        tag_name: z.string().describe('Tag name'),
      }),
      handler: async (args: any) => {
        await client.deleteTag(args.space_id, args.tag_name);
        return { content: [{ type: 'text', text: 'Tag deleted successfully' }] };
      }
    },

    {
      name: 'clickup_tags_add_to_task',
      description: 'Add a tag to a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        tag_name: z.string().describe('Tag name'),
      }),
      handler: async (args: any) => {
        const response = await client.addTagToTask(args.task_id, args.tag_name);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tags_remove_from_task',
      description: 'Remove a tag from a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        tag_name: z.string().describe('Tag name'),
      }),
      handler: async (args: any) => {
        await client.removeTagFromTask(args.task_id, args.tag_name);
        return { content: [{ type: 'text', text: 'Tag removed from task successfully' }] };
      }
    },
  ];
}
