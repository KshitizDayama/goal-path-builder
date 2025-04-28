
import { format, addDays, parseISO, differenceInSeconds } from "date-fns";

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
