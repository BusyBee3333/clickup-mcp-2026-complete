/**
 * ClickUp Docs Tools
 */

import { z } from 'zod';
import type { ClickUpClient } from '../clients/clickup.js';

export function createDocsTools(client: ClickUpClient) {
  return [
    {
      name: 'clickup_docs_list',
      description: 'List all docs in a workspace',
      inputSchema: z.object({
        workspace_id: z.string().describe('Workspace/Team ID'),
      }),
      handler: async (args: any) => {
        const response = await client.getDocs(args.workspace_id);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },

    {
      name: 'clickup_docs_search',
      description: 'Search docs in a workspace',
      inputSchema: z.object({
        workspace_id: z.string().describe('Workspace/Team ID'),
        search: z.string().describe('Search query'),
      }),
      handler: async (args: any) => {
        const response = await client.searchDocs(args.workspace_id, args.search);
        return { content: [{ type: 'text', text: JSON.stringify(response, null, 2) }] };
      }
    },
  ];
}
