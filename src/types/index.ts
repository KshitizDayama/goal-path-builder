
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
  whatWentWell?: string;
  whatToImprove?: string;
}

export interface TimerSession {
  date: string; // ISO format YYYY-MM-DD
  duration: number; // in minutes
  goalId: string;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface Trigger {
  id: string;
  time: string; // HH:MM format
  taskId: string;
  message: string;
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
  totalTimeSpent: number; // in minutes
  xp: number;
  level: number;
  badges: Badge[];
  triggers?: Trigger[];
  habitChain: number; // consecutive days with tasks completed
  timerSessions: TimerSession[];
  accountabilityBuddy?: string;
}

export interface User {
  dailyXp: number;
  totalXp: number;
  level: number;
  badges: Badge[];
}

export type RewardType = 'quote' | 'confetti' | 'star';
