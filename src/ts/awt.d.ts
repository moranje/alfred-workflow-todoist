interface WorkflowItem {
  title: string;
  uid?: string;
  arg?: string;
  type?: string;
  valid?: boolean;
  autocomplete?: string;
  icon?: string;
  subtitle?: string;
}

interface NodeCallback {
  (error: Error, data?: any): void;
}
