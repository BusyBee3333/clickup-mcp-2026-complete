/**
 * ClickUp API Client
 * API v2: https://clickup.com/api
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { ClickUpConfig, ClickUpError } from '../types.js';

const BASE_URL = 'https://api.clickup.com/api/v2';
const RATE_LIMIT_DELAY = 100; // ms between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

export class ClickUpClient {
  private client: AxiosInstance;
  private lastRequestTime = 0;
  private apiToken: string;

  constructor(config: ClickUpConfig) {
    this.apiToken = config.apiToken || config.oauthToken || '';
    
    if (!this.apiToken) {
      throw new Error('ClickUp API token is required. Set CLICKUP_API_TOKEN environment variable.');
    }

    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': this.apiToken,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => this.handleError(error)
    );
  }

  private async handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      const clickupError = error.response.data as ClickUpError;
      const status = error.response.status;

      if (status === 429) {
        throw new Error(`Rate limit exceeded. Please try again later. ${clickupError.err || ''}`);
      } else if (status === 401) {
        throw new Error('Unauthorized. Check your API token.');
      } else if (status === 403) {
        throw new Error(`Forbidden: ${clickupError.err || 'Access denied'}`);
      } else if (status === 404) {
        throw new Error(`Not found: ${clickupError.err || 'Resource does not exist'}`);
      } else if (status === 400) {
        throw new Error(`Bad request: ${clickupError.err || 'Invalid parameters'}`);
      } else {
        throw new Error(`ClickUp API error (${status}): ${clickupError.err || error.message}`);
      }
    } else if (error.request) {
      throw new Error('No response from ClickUp API. Check your network connection.');
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }

  private async retryRequest<T>(
    fn: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && error instanceof Error && error.message.includes('Rate limit')) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.retryRequest(fn, retries - 1);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    await this.rateLimit();
    return this.retryRequest(async () => {
      const response = await this.client.get<T>(endpoint, { params });
      return response.data;
    });
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await this.rateLimit();
    return this.retryRequest(async () => {
      const response = await this.client.post<T>(endpoint, data, config);
      return response.data;
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    await this.rateLimit();
    return this.retryRequest(async () => {
      const response = await this.client.put<T>(endpoint, data);
      return response.data;
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    await this.rateLimit();
    return this.retryRequest(async () => {
      const response = await this.client.delete<T>(endpoint);
      return response.data;
    });
  }

  // Pagination helper
  async *paginate<T>(
    endpoint: string,
    params: Record<string, any> = {},
    dataKey: string
  ): AsyncGenerator<T[], void, unknown> {
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const response: any = await this.get(endpoint, { ...params, page });
      const items = response[dataKey] || [];
      
      if (items.length > 0) {
        yield items;
      }

      hasMore = !response.last_page && items.length > 0;
      page++;
    }
  }

  // ===== Team / Workspace =====
  
  async getAuthorizedTeams() {
    return this.get('/team');
  }

  async getTeam(teamId: string) {
    return this.get(`/team/${teamId}`);
  }

  // ===== Spaces =====

  async getSpaces(teamId: string, archived = false) {
    return this.get(`/team/${teamId}/space`, { archived });
  }

  async getSpace(spaceId: string) {
    return this.get(`/space/${spaceId}`);
  }

  async createSpace(teamId: string, data: any) {
    return this.post(`/team/${teamId}/space`, data);
  }

  async updateSpace(spaceId: string, data: any) {
    return this.put(`/space/${spaceId}`, data);
  }

  async deleteSpace(spaceId: string) {
    return this.delete(`/space/${spaceId}`);
  }

  // ===== Folders =====

  async getFolders(spaceId: string, archived = false) {
    return this.get(`/space/${spaceId}/folder`, { archived });
  }

  async getFolder(folderId: string) {
    return this.get(`/folder/${folderId}`);
  }

  async createFolder(spaceId: string, data: any) {
    return this.post(`/space/${spaceId}/folder`, data);
  }

  async updateFolder(folderId: string, data: any) {
    return this.put(`/folder/${folderId}`, data);
  }

  async deleteFolder(folderId: string) {
    return this.delete(`/folder/${folderId}`);
  }

  // ===== Lists =====

  async getFolderLists(folderId: string, archived = false) {
    return this.get(`/folder/${folderId}/list`, { archived });
  }

  async getSpaceLists(spaceId: string, archived = false) {
    return this.get(`/space/${spaceId}/list`, { archived });
  }

  async getList(listId: string) {
    return this.get(`/list/${listId}`);
  }

  async createList(folderId: string, data: any) {
    return this.post(`/folder/${folderId}/list`, data);
  }

  async createFolderlessList(spaceId: string, data: any) {
    return this.post(`/space/${spaceId}/list`, data);
  }

  async updateList(listId: string, data: any) {
    return this.put(`/list/${listId}`, data);
  }

  async deleteList(listId: string) {
    return this.delete(`/list/${listId}`);
  }

  async addTaskToList(listId: string, taskId: string) {
    return this.post(`/list/${listId}/task/${taskId}`);
  }

  async removeTaskFromList(listId: string, taskId: string) {
    return this.delete(`/list/${listId}/task/${taskId}`);
  }

  // ===== Views =====

  async getViews(teamId: string, spaceId: string, listId?: string, folderId?: string) {
    const params: any = { space_id: spaceId };
    if (listId) params.list_id = listId;
    if (folderId) params.folder_id = folderId;
    return this.get(`/team/${teamId}/view`, params);
  }

  async getView(viewId: string) {
    return this.get(`/view/${viewId}`);
  }

  async getViewTasks(viewId: string, page = 0) {
    return this.get(`/view/${viewId}/task`, { page });
  }

  async createView(teamId: string, spaceId: string, data: any) {
    return this.post(`/team/${teamId}/view`, { ...data, space_id: spaceId });
  }

  async updateView(viewId: string, data: any) {
    return this.put(`/view/${viewId}`, data);
  }

  async deleteView(viewId: string) {
    return this.delete(`/view/${viewId}`);
  }

  // ===== Tasks =====

  async getTasks(listId: string, params: any = {}) {
    return this.get(`/list/${listId}/task`, params);
  }

  async getTask(taskId: string, params: any = {}) {
    return this.get(`/task/${taskId}`, params);
  }

  async createTask(listId: string, data: any) {
    return this.post(`/list/${listId}/task`, data);
  }

  async updateTask(taskId: string, data: any) {
    return this.put(`/task/${taskId}`, data);
  }

  async deleteTask(taskId: string) {
    return this.delete(`/task/${taskId}`);
  }

  async getFilteredTasks(teamId: string, params: any = {}) {
    return this.get(`/team/${teamId}/task`, params);
  }

  async bulkUpdateTasks(taskIds: string[], data: any) {
    return this.post('/task/bulk', { task_ids: taskIds, ...data });
  }

  // ===== Task Dependencies =====

  async addDependency(taskId: string, dependsOn: string, dependencyOf?: string) {
    return this.post(`/task/${taskId}/dependency`, {
      depends_on: dependsOn,
      dependency_of: dependencyOf
    });
  }

  async deleteDependency(taskId: string, dependsOn: string, dependencyOf?: string) {
    return this.delete(`/task/${taskId}/dependency?depends_on=${dependsOn}${dependencyOf ? `&dependency_of=${dependencyOf}` : ''}`);
  }

  // ===== Task Members =====

  async getTaskMembers(taskId: string) {
    return this.get(`/task/${taskId}/member`);
  }

  // ===== Comments =====

  async getTaskComments(taskId: string) {
    return this.get(`/task/${taskId}/comment`);
  }

  async getListComments(listId: string) {
    return this.get(`/list/${listId}/comment`);
  }

  async getViewComments(viewId: string) {
    return this.get(`/view/${viewId}/comment`);
  }

  async createComment(taskId: string, data: any) {
    return this.post(`/task/${taskId}/comment`, data);
  }

  async updateComment(commentId: string, data: any) {
    return this.put(`/comment/${commentId}`, data);
  }

  async deleteComment(commentId: string) {
    return this.delete(`/comment/${commentId}`);
  }

  // ===== Checklists =====

  async createChecklist(taskId: string, data: any) {
    return this.post(`/task/${taskId}/checklist`, data);
  }

  async updateChecklist(checklistId: string, data: any) {
    return this.put(`/checklist/${checklistId}`, data);
  }

  async deleteChecklist(checklistId: string) {
    return this.delete(`/checklist/${checklistId}`);
  }

  async createChecklistItem(checklistId: string, data: any) {
    return this.post(`/checklist/${checklistId}/checklist_item`, data);
  }

  async updateChecklistItem(checklistId: string, checklistItemId: string, data: any) {
    return this.put(`/checklist/${checklistId}/checklist_item/${checklistItemId}`, data);
  }

  async deleteChecklistItem(checklistId: string, checklistItemId: string) {
    return this.delete(`/checklist/${checklistId}/checklist_item/${checklistItemId}`);
  }

  // ===== Goals =====

  async getGoals(teamId: string) {
    return this.get(`/team/${teamId}/goal`);
  }

  async getGoal(goalId: string) {
    return this.get(`/goal/${goalId}`);
  }

  async createGoal(teamId: string, data: any) {
    return this.post(`/team/${teamId}/goal`, data);
  }

  async updateGoal(goalId: string, data: any) {
    return this.put(`/goal/${goalId}`, data);
  }

  async deleteGoal(goalId: string) {
    return this.delete(`/goal/${goalId}`);
  }

  async createKeyResult(goalId: string, data: any) {
    return this.post(`/goal/${goalId}/key_result`, data);
  }

  async updateKeyResult(keyResultId: string, data: any) {
    return this.put(`/key_result/${keyResultId}`, data);
  }

  async deleteKeyResult(keyResultId: string) {
    return this.delete(`/key_result/${keyResultId}`);
  }

  // ===== Tags =====

  async getSpaceTags(spaceId: string) {
    return this.get(`/space/${spaceId}/tag`);
  }

  async createSpaceTag(spaceId: string, data: any) {
    return this.post(`/space/${spaceId}/tag`, data);
  }

  async updateTag(spaceId: string, tagName: string, data: any) {
    return this.put(`/space/${spaceId}/tag/${tagName}`, data);
  }

  async deleteTag(spaceId: string, tagName: string) {
    return this.delete(`/space/${spaceId}/tag/${tagName}`);
  }

  async addTagToTask(taskId: string, tagName: string) {
    return this.post(`/task/${taskId}/tag/${tagName}`);
  }

  async removeTagFromTask(taskId: string, tagName: string) {
    return this.delete(`/task/${taskId}/tag/${tagName}`);
  }

  // ===== Time Tracking =====

  async getTimeEntries(teamId: string, params: any = {}) {
    return this.get(`/team/${teamId}/time_entries`, params);
  }

  async getTimeEntry(teamId: string, timerId: string) {
    return this.get(`/team/${teamId}/time_entries/${timerId}`);
  }

  async createTimeEntry(teamId: string, data: any) {
    return this.post(`/team/${teamId}/time_entries`, data);
  }

  async updateTimeEntry(teamId: string, timerId: string, data: any) {
    return this.put(`/team/${teamId}/time_entries/${timerId}`, data);
  }

  async deleteTimeEntry(teamId: string, timerId: string) {
    return this.delete(`/team/${teamId}/time_entries/${timerId}`);
  }

  async getRunningTimeEntry(teamId: string, assignee?: string) {
    return this.get(`/team/${teamId}/time_entries/current`, assignee ? { assignee } : {});
  }

  async startTimer(teamId: string, taskId: string, data: any = {}) {
    return this.post(`/team/${teamId}/time_entries/start/${taskId}`, data);
  }

  async stopTimer(teamId: string) {
    return this.post(`/team/${teamId}/time_entries/stop`);
  }

  async getTaskTimeEntries(taskId: string) {
    return this.get(`/task/${taskId}/time`);
  }

  // ===== Custom Fields =====

  async getAccessibleCustomFields(listId: string) {
    return this.get(`/list/${listId}/field`);
  }

  async setCustomFieldValue(taskId: string, fieldId: string, value: any) {
    return this.post(`/task/${taskId}/field/${fieldId}`, { value });
  }

  async removeCustomFieldValue(taskId: string, fieldId: string) {
    return this.delete(`/task/${taskId}/field/${fieldId}`);
  }

  // ===== Webhooks =====

  async getWebhooks(teamId: string) {
    return this.get(`/team/${teamId}/webhook`);
  }

  async createWebhook(teamId: string, data: any) {
    return this.post(`/team/${teamId}/webhook`, data);
  }

  async updateWebhook(webhookId: string, data: any) {
    return this.put(`/webhook/${webhookId}`, data);
  }

  async deleteWebhook(webhookId: string) {
    return this.delete(`/webhook/${webhookId}`);
  }

  // ===== Templates =====

  async getTemplates(teamId: string, page = 0) {
    return this.get(`/team/${teamId}/taskTemplate`, { page });
  }

  async createTaskFromTemplate(listId: string, templateId: string, name: string) {
    return this.post(`/list/${listId}/taskTemplate/${templateId}`, { name });
  }

  // ===== Members / Guests =====

  async getListMembers(listId: string) {
    return this.get(`/list/${listId}/member`);
  }

  async inviteGuestToWorkspace(teamId: string, email: string, canEditTags: boolean) {
    return this.post(`/team/${teamId}/guest`, { email, can_edit_tags: canEditTags });
  }

  async getGuest(teamId: string, guestId: string) {
    return this.get(`/team/${teamId}/guest/${guestId}`);
  }

  async editGuestOnWorkspace(teamId: string, guestId: string, data: any) {
    return this.put(`/team/${teamId}/guest/${guestId}`, data);
  }

  async removeGuestFromWorkspace(teamId: string, guestId: string) {
    return this.delete(`/team/${teamId}/guest/${guestId}`);
  }

  async addGuestToTask(taskId: string, guestId: string, permissionLevel?: string) {
    return this.post(`/task/${taskId}/guest/${guestId}`, 
      permissionLevel ? { permission_level: permissionLevel } : {}
    );
  }

  async removeGuestFromTask(taskId: string, guestId: string) {
    return this.delete(`/task/${taskId}/guest/${guestId}`);
  }

  async addGuestToList(listId: string, guestId: string, permissionLevel?: string) {
    return this.post(`/list/${listId}/guest/${guestId}`, 
      permissionLevel ? { permission_level: permissionLevel } : {}
    );
  }

  async removeGuestFromList(listId: string, guestId: string) {
    return this.delete(`/list/${listId}/guest/${guestId}`);
  }

  async addGuestToFolder(folderId: string, guestId: string, permissionLevel?: string) {
    return this.post(`/folder/${folderId}/guest/${guestId}`, 
      permissionLevel ? { permission_level: permissionLevel } : {}
    );
  }

  async removeGuestFromFolder(folderId: string, guestId: string) {
    return this.delete(`/folder/${folderId}/guest/${guestId}`);
  }

  // ===== Docs =====

  async getDocs(workspaceId: string) {
    return this.get(`/team/${workspaceId}/docs`);
  }

  async searchDocs(workspaceId: string, search: string) {
    return this.get(`/team/${workspaceId}/docs`, { search });
  }
}
