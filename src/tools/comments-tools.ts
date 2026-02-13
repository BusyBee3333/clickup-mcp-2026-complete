/**
 * ClickUp Comments Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createCommentsTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_comments_list',
      description: 'List comments on a task, list, or view',
      inputSchema: z.object({
        task_id: z.string().optional().describe('Task ID'),
        list_id: z.string().optional().describe('List ID'),
        view_id: z.string().optional().describe('View ID'),
      }),
      handler: async (args: any) => {
        let response;
        if (args.task_id) {
          response = await client.getTaskComments(args.task_id);
        } else if (args.list_id) {
          response = await client.getListComments(args.list_id);
        } else if (args.view_id) {
          response = await client.getViewComments(args.view_id);
        } else {
          throw new Error('One of task_id, list_id, or view_id must be provided');
        }
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_comments_create',
      description: 'Create a comment on a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        comment_text: z.string().describe('Comment text'),
        assignee: z.number().optional().describe('Assign comment to user ID'),
        notify_all: z.boolean().optional().describe('Notify all task watchers'),
      }),
      handler: async (args: any) => {
        const { task_id, ...data } = args;
        const response = await client.createComment(task_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_comments_update',
      description: 'Update a comment',
      inputSchema: z.object({
        comment_id: z.string().describe('Comment ID'),
        comment_text: z.string().optional().describe('Comment text'),
        assignee: z.number().optional().describe('Assign comment to user ID'),
        resolved: z.boolean().optional().describe('Mark as resolved'),
      }),
      handler: async (args: any) => {
        const { comment_id, ...data } = args;
        const response = await client.updateComment(comment_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_comments_delete',
      description: 'Delete a comment',
      inputSchema: z.object({
        comment_id: z.string().describe('Comment ID'),
      }),
      handler: async (args: any) => {
        await client.deleteComment(args.comment_id);
        return { content: [{ type: 'text', text: 'Comment deleted successfully' }] };
      }
    },
  ];
}
