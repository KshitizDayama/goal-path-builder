
import { format, addDays, parseISO, differenceInSeconds, isSameDay } from "date-fns";
import { Goal, Task, TimerSession } from "../types";

// Format date to DD/MM/YYYY
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy');
};

// Format deadline countdown
export const formatCountdown = (deadline: string): string => {
  const now = new Date();
  const targetDate = parseISO(deadline);
  
  const totalSeconds = Math.max(0, differenceInSeconds(targetDate, now));
  
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Calculate goal completion percentage
export const calculateCompletion = (tasks: { completed: boolean }[], milestones: { completed: boolean }[]): number => {
  const totalItems = tasks.length + milestones.length;
  if (totalItems === 0) return 0;
  
  const completedItems = tasks.filter(t => t.completed).length + milestones.filter(m => m.completed).length;
  return Math.round((completedItems / totalItems) * 100);
};

// Get today's date in ISO format (YYYY-MM-DD)
export const getTodayISO = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

// Format date for display in reflection section
export const formatReflectionDate = (dateStr: string): string => {
  return format(parseISO(dateStr), 'EEEE, MMMM do, yyyy');
};

// Format timer duration in MM:SS format
export const formatTimerDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format pluralized time units
export const formatTimeUnit = (value: number, unit: string): string => {
  return `${value} ${unit}${value !== 1 ? 's' : ''}`;
};

// Format consistency score with proper grammar
export const formatConsistencyScore = (days: number): string => {
  return `${days} ${days === 1 ? 'day' : 'days'}`;
};

// Get sessions for a specific day
export const getSessionsForDay = (sessions: TimerSession[], date: string): TimerSession[] => {
  return sessions.filter(session => 
    isSameDay(parseISO(session.date), parseISO(date)) && session.completed
  );
};

// Count active days in the past 7 days
export const countActiveDaysInWeek = (goal: Goal): number => {
  const today = new Date();
  let count = 0;
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayStr = format(day, 'yyyy-MM-dd');
    
    // Check if there was any activity on this day
    const hasSession = goal.timerSessions.some(s => s.date === dayStr && s.completed);
    const hasCompletedTask = goal.tasks.some(t => 
      t.completed && t.completedDate === dayStr
    );
    
    if (hasSession || hasCompletedTask) {
      count++;
    }
  }
  
  return count;
};

// Get activity data for heatmap
export const getActivityData = (goal: Goal) => {
  const today = new Date();
  const result = [];
  
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayStr = format(day, 'yyyy-MM-dd');
    
    // Count activities on this day
    const sessions = goal.timerSessions.filter(s => 
      s.date === dayStr && s.completed
    ).length;
    
    const completedTasks = goal.tasks.filter(t => 
      t.completed && t.completedDate === dayStr
    ).length;
    
    result.push({
      date: dayStr,
      count: sessions + completedTasks
    });
  }
  
  return result;
};

// Update task completed date when status changes
export const updateTaskCompletionDate = (task: Task, completed: boolean): Task => {
  if (completed && !task.completedDate) {
    return {
      ...task,
      completed,
      completedDate: getTodayISO()
    };
  } else if (!completed) {
    const { completedDate, ...rest } = task as Task & { completedDate?: string };
    return {
      ...rest,
      completed
    };
  }
  return {
    ...task,
    completed
  };
};
