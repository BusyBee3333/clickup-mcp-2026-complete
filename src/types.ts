/**
 * ClickUp API Types
 * Based on ClickUp API v2: https://clickup.com/api
 */

// ===== Core Types =====

export interface ClickUpConfig {
  apiToken?: string;
  clientId?: string;
  clientSecret?: string;
  oauthToken?: string;
}

export interface ClickUpUser {
  id: number;
  username: string;
  email: string;
  color: string;
  profilePicture: string | null;
  initials: string;
  role: number;
  custom_role: number | null;
  last_active: string;
  date_joined: string;
  date_invited: string;
}

export interface ClickUpTeam {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  members: ClickUpUser[];
}

// ===== Task Types =====

export interface ClickUpTask {
  id: string;
  custom_id: string | null;
  name: string;
  text_content: string;
  description: string;
  status: ClickUpStatus;
  orderindex: string;
  date_created: string;
  date_updated: string;
  date_closed: string | null;
  date_done: string | null;
  archived: boolean;
  creator: ClickUpUser;
  assignees: ClickUpUser[];
  watchers: ClickUpUser[];
  checklists: ClickUpChecklist[];
  tags: ClickUpTag[];
  parent: string | null;
  priority: ClickUpPriority | null;
  due_date: string | null;
  start_date: string | null;
  points: number | null;
  time_estimate: number | null;
  time_spent: number | null;
  custom_fields: ClickUpCustomFieldValue[];
  dependencies: ClickUpTaskDependency[];
  linked_tasks: ClickUpLinkedTask[];
  team_id: string;
  url: string;
  permission_level: string;
  list: ClickUpListReference;
  project: ClickUpFolderReference;
  folder: ClickUpFolderReference;
  space: ClickUpSpaceReference;
}

export interface ClickUpStatus {
  id: string;
  status: string;
  color: string;
  orderindex: number;
  type: string;
}

export interface ClickUpPriority {
  id: string;
  priority: string;
  color: string;
  orderindex: string;
}

export interface ClickUpTaskDependency {
  task_id: string;
  depends_on: string;
  type: number;
  date_created: string;
  user: ClickUpUser;
}

export interface ClickUpLinkedTask {
  task_id: string;
  link_id: string;
  date_created: string;
  user: ClickUpUser;
}

// ===== Space Types =====

export interface ClickUpSpace {
  id: string;
  name: string;
  private: boolean;
  statuses: ClickUpStatus[];
  multiple_assignees: boolean;
  features: ClickUpSpaceFeatures;
  archived: boolean;
}

export interface ClickUpSpaceFeatures {
  due_dates: { enabled: boolean; start_date: boolean; remap_due_dates: boolean; remap_closed_due_date: boolean };
  time_tracking: { enabled: boolean };
  tags: { enabled: boolean };
  time_estimates: { enabled: boolean };
  checklists: { enabled: boolean };
  custom_fields: { enabled: boolean };
  remap_dependencies: { enabled: boolean };
  dependency_warning: { enabled: boolean };
  portfolios: { enabled: boolean };
}

export interface ClickUpSpaceReference {
  id: string;
  name: string;
  access: boolean;
}

// ===== Folder Types =====

export interface ClickUpFolder {
  id: string;
  name: string;
  orderindex: number;
  override_statuses: boolean;
  hidden: boolean;
  space: ClickUpSpaceReference;
  task_count: string;
  archived: boolean;
  statuses: ClickUpStatus[];
  lists: ClickUpList[];
  permission_level: string;
}

export interface ClickUpFolderReference {
  id: string;
  name: string;
  hidden: boolean;
  access: boolean;
}

// ===== List Types =====

export interface ClickUpList {
  id: string;
  name: string;
  orderindex: number;
  status: ClickUpStatus | null;
  priority: ClickUpPriority | null;
  assignee: ClickUpUser | null;
  task_count: number;
  due_date: string | null;
  start_date: string | null;
  folder: ClickUpFolderReference;
  space: ClickUpSpaceReference;
  archived: boolean;
  override_statuses: boolean;
  statuses: ClickUpStatus[];
  permission_level: string;
}

export interface ClickUpListReference {
  id: string;
  name: string;
  access: boolean;
}

// ===== View Types =====

export interface ClickUpView {
  id: string;
  name: string;
  type: string;
  parent: {
    id: string;
    type: number;
  };
  grouping: {
    field: string;
    dir: number;
  };
  divide: {
    field: string | null;
    dir: number | null;
  };
  sorting: {
    fields: Array<{
      field: string;
      dir: number;
    }>;
  };
  filters: {
    op: string;
    fields: any[];
  };
  columns: {
    fields: any[];
  };
  team_sidebar: {
    assignees: any[];
    assigned_comments: boolean;
    unassigned_tasks: boolean;
  };
  settings: {
    show_task_locations: boolean;
    show_subtasks: number;
    show_subtask_parent_names: boolean;
    show_closed_subtasks: boolean;
    show_assignees: boolean;
    show_images: boolean;
    collapse_empty_columns: boolean | null;
    me_comments: boolean;
    me_subtasks: boolean;
    me_checklists: boolean;
  };
}

// ===== Comment Types =====

export interface ClickUpComment {
  id: string;
  comment: Array<{
    text: string;
  }>;
  comment_text: string;
  user: ClickUpUser;
  resolved: boolean;
  assignee: ClickUpUser | null;
  assigned_by: ClickUpUser | null;
  reactions: ClickUpReaction[];
  date: string;
}

export interface ClickUpReaction {
  reaction: string;
  users: ClickUpUser[];
}

// ===== Doc Types =====

export interface ClickUpDoc {
  id: string;
  name: string;
  type: string;
  parent: {
    id: string;
    type: number;
  };
  date_created: string;
  date_updated: string;
  creator: ClickUpUser;
  deleted: boolean;
  content: string;
}

// ===== Goal Types =====

export interface ClickUpGoal {
  id: string;
  name: string;
  team_id: string;
  date_created: string;
  start_date: string | null;
  due_date: string | null;
  description: string;
  private: boolean;
  archived: boolean;
  creator: ClickUpUser;
  color: string;
  pretty_id: string;
  multiple_owners: boolean;
  folder_id: string | null;
  members: ClickUpUser[];
  owners: ClickUpUser[];
  key_results: ClickUpKeyResult[];
  percent_completed: number;
  history: any[];
  pretty_url: string;
}

export interface ClickUpKeyResult {
  id: string;
  goal_id: string;
  name: string;
  creator: ClickUpUser;
  type: string;
  unit: string | null;
  steps_start: number;
  steps_end: number;
  steps_current: number;
  percent_completed: number;
  task_ids: string[];
  list_ids: string[];
  subcategory_ids: string[];
  owners: ClickUpUser[];
}

// ===== Tag Types =====

export interface ClickUpTag {
  name: string;
  tag_fg: string;
  tag_bg: string;
  creator: number;
}

// ===== Checklist Types =====

export interface ClickUpChecklist {
  id: string;
  task_id: string;
  name: string;
  orderindex: number;
  resolved: number;
  unresolved: number;
  items: ClickUpChecklistItem[];
}

export interface ClickUpChecklistItem {
  id: string;
  name: string;
  orderindex: number;
  assignee: ClickUpUser | null;
  resolved: boolean;
  parent: string | null;
  date_created: string;
  children: string[];
}

// ===== Time Tracking Types =====

export interface ClickUpTimeEntry {
  id: string;
  task: {
    id: string;
    name: string;
    status: ClickUpStatus;
    custom_type: any;
  };
  wid: string;
  user: ClickUpUser;
  billable: boolean;
  start: string;
  end: string | null;
  duration: string;
  description: string;
  tags: ClickUpTag[];
  source: string;
  at: string;
}

// ===== Custom Field Types =====

export interface ClickUpCustomField {
  id: string;
  name: string;
  type: string;
  type_config: any;
  date_created: string;
  hide_from_guests: boolean;
  required: boolean;
}

export interface ClickUpCustomFieldValue {
  id: string;
  name: string;
  type: string;
  type_config: any;
  date_created: string;
  hide_from_guests: boolean;
  value: any;
  required: boolean;
}

// ===== Webhook Types =====

export interface ClickUpWebhook {
  id: string;
  userid: number;
  team_id: number;
  endpoint: string;
  client_id: string;
  events: string[];
  task_id: string | null;
  list_id: string | null;
  folder_id: string | null;
  space_id: string | null;
  health: {
    status: string;
    fail_count: number;
  };
  secret: string;
}

// ===== Template Types =====

export interface ClickUpTemplate {
  id: string;
  name: string;
}

// ===== Guest Types =====

export interface ClickUpGuest {
  user: ClickUpUser;
  invited_by: ClickUpUser;
}

// ===== Workspace Types =====

export interface ClickUpWorkspace {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  members: ClickUpUser[];
}

// ===== API Response Types =====

export interface ClickUpListResponse<T> {
  data: T[];
  last_page?: boolean;
}

export interface ClickUpTasksResponse {
  tasks: ClickUpTask[];
  last_page?: boolean;
}

export interface ClickUpSpacesResponse {
  spaces: ClickUpSpace[];
}

export interface ClickUpFoldersResponse {
  folders: ClickUpFolder[];
}

export interface ClickUpListsResponse {
  lists: ClickUpList[];
}

export interface ClickUpViewsResponse {
  views: ClickUpView[];
}

export interface ClickUpCommentsResponse {
  comments: ClickUpComment[];
}

export interface ClickUpGoalsResponse {
  goals: ClickUpGoal[];
}

export interface ClickUpTimeEntriesResponse {
  data: ClickUpTimeEntry[];
}

export interface ClickUpWebhooksResponse {
  webhooks: ClickUpWebhook[];
}

// ===== Error Types =====

export interface ClickUpError {
  err: string;
  ECODE: string;
}

// ===== API Request Types =====

export interface CreateTaskRequest {
  name: string;
  description?: string;
  assignees?: number[];
  tags?: string[];
  status?: string;
  priority?: number;
  due_date?: number;
  due_date_time?: boolean;
  time_estimate?: number;
  start_date?: number;
  start_date_time?: boolean;
  notify_all?: boolean;
  parent?: string;
  links_to?: string;
  check_required_custom_fields?: boolean;
  custom_fields?: Array<{
    id: string;
    value: any;
  }>;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  status?: string;
  priority?: number;
  due_date?: number;
  due_date_time?: boolean;
  time_estimate?: number;
  start_date?: number;
  start_date_time?: boolean;
  assignees?: {
    add?: number[];
    rem?: number[];
  };
  archived?: boolean;
}

export interface CreateSpaceRequest {
  name: string;
  multiple_assignees?: boolean;
  features?: Partial<ClickUpSpaceFeatures>;
}

export interface CreateFolderRequest {
  name: string;
}

export interface CreateListRequest {
  name: string;
  content?: string;
  due_date?: number;
  due_date_time?: boolean;
  priority?: number;
  assignee?: number;
  status?: string;
}

export interface CreateCommentRequest {
  comment_text: string;
  assignee?: number;
  notify_all?: boolean;
}

export interface CreateGoalRequest {
  name: string;
  due_date?: number;
  description?: string;
  multiple_owners?: boolean;
  owners?: number[];
  color?: string;
}

export interface CreateKeyResultRequest {
  name: string;
  owners?: number[];
  type: string;
  steps_start?: number;
  steps_end?: number;
  unit?: string;
  task_ids?: string[];
  list_ids?: string[];
}

export interface CreateTimeEntryRequest {
  description?: string;
  tags?: string[];
  start: number;
  billable?: boolean;
  duration: number;
  assignee?: number;
  tid?: string;
}

export interface CreateWebhookRequest {
  endpoint: string;
  events: string[];
}

export interface CreateChecklistRequest {
  name: string;
}

export interface CreateChecklistItemRequest {
  name: string;
  assignee?: number;
}
