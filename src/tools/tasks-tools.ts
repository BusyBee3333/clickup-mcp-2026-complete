/**
 * ClickUp Tasks Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createTasksTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_tasks_list',
      description: 'List tasks in a list with optional filtering',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
        archived: z.boolean().optional().describe('Include archived tasks'),
        page: z.number().optional().describe('Page number for pagination'),
        order_by: z.string().optional().describe('Order by field'),
        reverse: z.boolean().optional().describe('Reverse order'),
        subtasks: z.boolean().optional().describe('Include subtasks'),
        statuses: z.array(z.string()).optional().describe('Filter by statuses'),
        include_closed: z.boolean().optional().describe('Include closed tasks'),
        assignees: z.array(z.string()).optional().describe('Filter by assignees'),
        tags: z.array(z.string()).optional().describe('Filter by tags'),
        due_date_gt: z.number().optional().describe('Due date greater than (Unix timestamp)'),
        due_date_lt: z.number().optional().describe('Due date less than (Unix timestamp)'),
        date_created_gt: z.number().optional().describe('Created after (Unix timestamp)'),
        date_created_lt: z.number().optional().describe('Created before (Unix timestamp)'),
        date_updated_gt: z.number().optional().describe('Updated after (Unix timestamp)'),
        date_updated_lt: z.number().optional().describe('Updated before (Unix timestamp)'),
        custom_fields: z.array(z.object({
          field_id: z.string(),
          operator: z.string(),
          value: z.any()
        })).optional().describe('Custom field filters'),
      }),
      handler: async (args: any) => {
        const response = await client.getTasks(args.list_id, args);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_get',
      description: 'Get a specific task by ID',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        custom_task_ids: z.boolean().optional().describe('Use custom task IDs'),
        team_id: z.string().optional().describe('Team ID (required if using custom task IDs)'),
        include_subtasks: z.boolean().optional().describe('Include subtasks'),
      }),
      handler: async (args: any) => {
        const response = await client.getTask(args.task_id, {
          custom_task_ids: args.custom_task_ids,
          team_id: args.team_id,
          include_subtasks: args.include_subtasks
        });
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_create',
      description: 'Create a new task',
      inputSchema: z.object({
        list_id: z.string().describe('List ID'),
        name: z.string().describe('Task name'),
        description: z.string().optional().describe('Task description'),
        assignees: z.array(z.number()).optional().describe('Assignee user IDs'),
        tags: z.array(z.string()).optional().describe('Tag names'),
        status: z.string().optional().describe('Status name'),
        priority: z.number().optional().describe('Priority (1=urgent, 2=high, 3=normal, 4=low)'),
        due_date: z.number().optional().describe('Due date (Unix timestamp in milliseconds)'),
        due_date_time: z.boolean().optional().describe('Include time in due date'),
        time_estimate: z.number().optional().describe('Time estimate in milliseconds'),
        start_date: z.number().optional().describe('Start date (Unix timestamp in milliseconds)'),
        start_date_time: z.boolean().optional().describe('Include time in start date'),
        notify_all: z.boolean().optional().describe('Notify all task watchers'),
        parent: z.string().optional().describe('Parent task ID for subtasks'),
        links_to: z.string().optional().describe('Link to another task ID'),
        check_required_custom_fields: z.boolean().optional().describe('Validate required custom fields'),
        custom_fields: z.array(z.object({
          id: z.string(),
          value: z.any()
        })).optional().describe('Custom field values'),
      }),
      handler: async (args: any) => {
        const { list_id, ...data } = args;
        const response = await client.createTask(list_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_update',
      description: 'Update an existing task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        name: z.string().optional().describe('Task name'),
        description: z.string().optional().describe('Task description'),
        status: z.string().optional().describe('Status name'),
        priority: z.number().optional().describe('Priority (1=urgent, 2=high, 3=normal, 4=low)'),
        due_date: z.number().optional().describe('Due date (Unix timestamp in milliseconds)'),
        due_date_time: z.boolean().optional().describe('Include time in due date'),
        parent: z.string().optional().describe('Parent task ID'),
        time_estimate: z.number().optional().describe('Time estimate in milliseconds'),
        start_date: z.number().optional().describe('Start date (Unix timestamp in milliseconds)'),
        start_date_time: z.boolean().optional().describe('Include time in start date'),
        assignees_add: z.array(z.number()).optional().describe('Add assignees (user IDs)'),
        assignees_rem: z.array(z.number()).optional().describe('Remove assignees (user IDs)'),
        archived: z.boolean().optional().describe('Archive/unarchive task'),
      }),
      handler: async (args: any) => {
        const { task_id, assignees_add, assignees_rem, ...data } = args;
        
        if (assignees_add || assignees_rem) {
          data.assignees = {
            add: assignees_add,
            rem: assignees_rem
          };
        }
        
        const response = await client.updateTask(task_id, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_delete',
      description: 'Delete a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        custom_task_ids: z.boolean().optional().describe('Use custom task IDs'),
        team_id: z.string().optional().describe('Team ID (required if using custom task IDs)'),
      }),
      handler: async (args: any) => {
        const response = await client.deleteTask(args.task_id);
        return { content: [{ type: 'text', text: 'Task deleted successfully' }] };
      }
    },

    {
      name: 'clickup_tasks_search',
      description: 'Search/filter tasks across a team',
      inputSchema: z.object({
        team_id: z.string().describe('Team ID'),
        page: z.number().optional().describe('Page number'),
        order_by: z.string().optional().describe('Order by field'),
        reverse: z.boolean().optional().describe('Reverse order'),
        subtasks: z.boolean().optional().describe('Include subtasks'),
        space_ids: z.array(z.string()).optional().describe('Filter by space IDs'),
        project_ids: z.array(z.string()).optional().describe('Filter by project/folder IDs'),
        list_ids: z.array(z.string()).optional().describe('Filter by list IDs'),
        statuses: z.array(z.string()).optional().describe('Filter by statuses'),
        include_closed: z.boolean().optional().describe('Include closed tasks'),
        assignees: z.array(z.string()).optional().describe('Filter by assignee IDs'),
        tags: z.array(z.string()).optional().describe('Filter by tags'),
        due_date_gt: z.number().optional().describe('Due date greater than'),
        due_date_lt: z.number().optional().describe('Due date less than'),
        date_created_gt: z.number().optional().describe('Created after'),
        date_created_lt: z.number().optional().describe('Created before'),
        date_updated_gt: z.number().optional().describe('Updated after'),
        date_updated_lt: z.number().optional().describe('Updated before'),
      }),
      handler: async (args: any) => {
        const { team_id, ...params } = args;
        const response = await client.getFilteredTasks(team_id, params);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_bulk_update',
      description: 'Bulk update multiple tasks',
      inputSchema: z.object({
        task_ids: z.array(z.string()).describe('Array of task IDs'),
        status: z.string().optional().describe('Status to set'),
        priority: z.number().optional().describe('Priority to set'),
        assignees_add: z.array(z.number()).optional().describe('Add assignees'),
        assignees_rem: z.array(z.number()).optional().describe('Remove assignees'),
        archived: z.boolean().optional().describe('Archive/unarchive'),
      }),
      handler: async (args: any) => {
        const { task_ids, assignees_add, assignees_rem, ...data } = args;
        
        if (assignees_add || assignees_rem) {
          data.assignees = {
            add: assignees_add,
            rem: assignees_rem
          };
        }
        
        const response = await client.bulkUpdateTasks(task_ids, data);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_get_time_entries',
      description: 'Get time entries for a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getTaskTimeEntries(args.task_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_add_time_entry',
      description: 'Add a time entry to a task',
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
      name: 'clickup_tasks_get_custom_fields',
      description: 'Get custom field values for a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
      }),
      handler: async (args: any) => {
        const task = await client.getTask(args.task_id);
        const customFields = (task as any).custom_fields || [];
        return { content: [{ type: 'text', text: JSON.stringify(customFields, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_set_custom_field',
      description: 'Set a custom field value on a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        field_id: z.string().describe('Custom field ID'),
        value: z.any().describe('Field value'),
      }),
      handler: async (args: any) => {
        const response = await client.setCustomFieldValue(args.task_id, args.field_id, args.value);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_add_dependency',
      description: 'Add a task dependency',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        depends_on: z.string().optional().describe('Task this depends on'),
        dependency_of: z.string().optional().describe('Task that depends on this'),
      }),
      handler: async (args: any) => {
        const response = await client.addDependency(args.task_id, args.depends_on, args.dependency_of);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_remove_dependency',
      description: 'Remove a task dependency',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
        depends_on: z.string().optional().describe('Task this depends on'),
        dependency_of: z.string().optional().describe('Task that depends on this'),
      }),
      handler: async (args: any) => {
        const response = await client.deleteDependency(args.task_id, args.depends_on, args.dependency_of);
        return { content: [{ type: 'text', text: 'Dependency removed' }] };
      }
    },

    {
      name: 'clickup_tasks_list_members',
      description: 'List members assigned to a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getTaskMembers(args.task_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_tasks_add_comment',
      description: 'Add a comment to a task',
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
      name: 'clickup_tasks_get_comments',
      description: 'Get comments for a task',
      inputSchema: z.object({
        task_id: z.string().describe('Task ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getTaskComments(args.task_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },
  ];
}
