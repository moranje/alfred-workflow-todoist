export interface WorkflowItem {
  title: string;
  uid?: string;
  arg?: string;
  type?: string;
  valid?: boolean;
  autocomplete?: string;
  icon?: string;
  subtitle?: string;
}

export interface NodeCallback {
  (error: Error | null, data?: any): void;
}

export interface Task {
  'labels': Array<number>;
  'all_day': boolean;
  'date_lang': null | string;
  'id': number;
  'content': string;
  'checked': number;
  'user_id': number;
  'due_date_utc': null | string;
  'priority': number;
  'project_id': number;
  'date_string': null | string;
}

export interface Project {
  'name': string;
  'id': number;
}

export interface Label {
  'name': string;
  'id': number;
}
