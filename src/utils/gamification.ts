
import { Badge, Goal, TimerSession, User } from '../types';
import { generateId } from './helpers';

// XP calculation
export const calculateXpForSession = (minutes: number): number => {
  // Base XP: 1 XP per minute
  return Math.round(minutes);
};

// Level calculation
export const calculateLevel = (totalXp: number): number => {
  // Simple level calculation: sqrt(totalXp / 10)
  return Math.max(1, Math.floor(Math.sqrt(totalXp / 10)));
};

// Check for new level
export const checkLevelUp = (oldXp: number, newXp: number): boolean => {
  const oldLevel = calculateLevel(oldXp);
  const newLevel = calculateLevel(newXp);
  return newLevel > oldLevel;
};

// Default badges
export const getDefaultBadges = (): Badge[] => {
  return [
    {
      id: generateId(),
      name: 'First Focus',
      description: 'Complete your first focus session',
      unlocked: false,
      icon: '⏱️'
    },
    {
      id: generateId(),
      name: 'Consistent',
      description: 'Complete sessions 3 days in a row',
      unlocked: false,
      icon: '📆'
    },
    {
      id: generateId(),
      name: 'Milestone Master',
      description: 'Complete 5 milestones',
      unlocked: false,
      icon: '🏆'
    },
    {
      id: generateId(),
      name: 'Task Titan',
      description: 'Complete 10 tasks',
      unlocked: false,
      icon: '✅'
    },
    {
      id: generateId(),
      name: 'Hour Hero',
      description: 'Focus for a total of 60 minutes',
      unlocked: false,
      icon: '⌛'
    }
  ];
};

// Update badges based on user actions
export const updateBadges = (goal: Goal): Badge[] => {
  const badges = [...goal.badges];
  
  // Check First Focus badge
  if (goal.timerSessions.length > 0 && !badges.find(b => b.name === 'First Focus')?.unlocked) {
    const firstFocusBadge = badges.find(b => b.name === 'First Focus');
    if (firstFocusBadge) {
      firstFocusBadge.unlocked = true;
    }
  }
  
  // Check Consistent badge (3 consecutive days)
  if (goal.habitChain >= 3 && !badges.find(b => b.name === 'Consistent')?.unlocked) {
    const consistentBadge = badges.find(b => b.name === 'Consistent');
    if (consistentBadge) {
      consistentBadge.unlocked = true;
    }
  }
  
  // Check Milestone Master badge
  const completedMilestones = goal.milestones.filter(m => m.completed).length;
  if (completedMilestones >= 5 && !badges.find(b => b.name === 'Milestone Master')?.unlocked) {
    const milestoneBadge = badges.find(b => b.name === 'Milestone Master');
    if (milestoneBadge) {
      milestoneBadge.unlocked = true;
    }
  }
  
  // Check Task Titan badge
  const completedTasks = goal.tasks.filter(t => t.completed).length;
  if (completedTasks >= 10 && !badges.find(b => b.name === 'Task Titan')?.unlocked) {
    const taskBadge = badges.find(b => b.name === 'Task Titan');
    if (taskBadge) {
      taskBadge.unlocked = true;
    }
  }
  
  // Check Hour Hero badge
  const totalMinutes = goal.totalTimeSpent;
  if (totalMinutes >= 60 && !badges.find(b => b.name === 'Hour Hero')?.unlocked) {
    const hourBadge = badges.find(b => b.name === 'Hour Hero');
    if (hourBadge) {
      hourBadge.unlocked = true;
    }
  }
  
  return badges;
};

// Calculate habit chain (consecutive days with completed tasks)
export const calculateHabitChain = (goal: Goal): number => {
  // Get all dates with completed tasks or focus sessions
  const activeDates = new Set<string>();
  
  // Add dates from completed tasks
  goal.tasks.forEach(task => {
    if (task.completed && task.completedDate) {
      activeDates.add(task.completedDate);
    }
  });
  
  // Add dates from timer sessions
  goal.timerSessions.forEach(session => {
    if (session.completed) {
      activeDates.add(session.date);
    }
  });
  
  // Convert to array and sort
  const sortedDates = Array.from(activeDates).sort();
  
  if (sortedDates.length === 0) return 0;
  
  // Calculate chain
  let chain = 1;
  const today = new Date().toISOString().split('T')[0];
  
  // If today isn't in the active dates, chain is broken
  if (!activeDates.has(today)) return 0;
  
  // Count backward from today to find the chain
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() - 1);
  
  while (activeDates.has(currentDate.toISOString().split('T')[0])) {
    chain += 1;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return chain;
};

// Get or create user data
export const getUserData = (): User => {
  const storedUser = localStorage.getItem('streakly-user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  
  // Create default user
  const newUser: User = {
    dailyXp: 0,
    totalXp: 0,
    level: 1,
    badges: []
  };
  
  localStorage.setItem('streakly-user', JSON.stringify(newUser));
  return newUser;
};

// Update user data
export const updateUserData = (user: User): void => {
  localStorage.setItem('streakly-user', JSON.stringify(user));
};

// Reset daily XP at the start of a new day
export const checkAndResetDailyXp = (): User => {
  const user = getUserData();
  const lastResetDate = localStorage.getItem('streakly-last-reset-date');
  const today = new Date().toISOString().split('T')[0];
  
  if (lastResetDate !== today) {
    user.dailyXp = 0;
    localStorage.setItem('streakly-last-reset-date', today);
    updateUserData(user);
  }
  
  return user;
};
