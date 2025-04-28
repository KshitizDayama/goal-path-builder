
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedDate?: string; // ISO format YYYY-MM-DD
}
