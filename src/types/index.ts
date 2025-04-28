
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  text: string;
  completed: boolean;
}

export interface Reflection {
  date: string; // ISO format YYYY-MM-DD
  content: string;
}

export interface Goal {
  id: string;
  name: string;
  deadline: string; // ISO format YYYY-MM-DD
  why: string;
  tasks: Task[];
  milestones: Milestone[];
  reflections: Record<string, Reflection>;
  streak: number;
  lastReflectionDate?: string;
}
