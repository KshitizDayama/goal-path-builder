
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Clock } from 'lucide-react';
import { 
  formatCountdown, 
  calculateCompletion, 
  getTodayISO,
  formatReflectionDate,
  formatConsistencyScore,
  getActivityData,
  updateTaskCompletionDate
} from '../utils/helpers';
import { Goal, Task, Milestone, Reflection, TimerSession, User } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import PomodoroTimer from '../components/PomodoroTimer';
import HabitHeatmap from '../components/HabitHeatmap';
import BadgeDisplay from '../components/BadgeDisplay';
import UserProgress from '../components/UserProgress';
import ReflectionForm from '../components/ReflectionForm';
import { 
  calculateXpForSession, 
  checkLevelUp, 
  updateBadges,
  getUserData, 
  updateUserData,
  checkAndResetDailyXp
} from '../utils/gamification';
import { getRandomQuote } from '../data/quotes';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const GoalDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { goal: initialGoal, id } = location.state || {};
  
  const [goals, setGoals] = useLocalStorage<Goal[]>('streakly-goals', []);
  const [goal, setGoal] = useState<Goal | null>(null);
  
  const [countdown, setCountdown] = useState('00:00:00:00');
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [user, setUser] = useState<User>(getUserData());
  
  // Load the goal from localStorage or location state
  useEffect(() => {
    const userData = checkAndResetDailyXp();
    setUser(userData);
    
    if (initialGoal) {
      // If the initial goal doesn't have the new fields, add them
      const updatedGoal = {
        ...initialGoal,
        totalTimeSpent: initialGoal.totalTimeSpent || 0,
        xp: initialGoal.xp || 0,
        level: initialGoal.level || 1,
        badges: initialGoal.badges || [],
        habitChain: initialGoal.habitChain || 0,
        timerSessions: initialGoal.timerSessions || [],
      };
      setGoal(updatedGoal);
    } else if (goals[id]) {
      // Same for goals from localStorage
      const storedGoal = goals[id];
      const updatedGoal = {
        ...storedGoal,
        totalTimeSpent: storedGoal.totalTimeSpent || 0,
        xp: storedGoal.xp || 0,
        level: storedGoal.level || 1,
        badges: storedGoal.badges || [],
        habitChain: storedGoal.habitChain || 0,
        timerSessions: storedGoal.timerSessions || []
      };
      setGoal(updatedGoal);
    } else {
      // If goal not found, redirect to goals page
      navigate('/goals');
    }
  }, [initialGoal, goals, id, navigate]);
  
  // Update the countdown timer
  useEffect(() => {
    if (!goal?.deadline) return;
    
    const updateCountdown = () => {
      setCountdown(formatCountdown(goal.deadline));
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [goal?.deadline]);
  
  // Load the reflection for the selected date
  useEffect(() => {
    if (!goal) return;
    
    if (goal.reflections && goal.reflections[selectedDate]) {
      setReflection(goal.reflections[selectedDate]);
    } else {
      setReflection(null);
    }
  }, [selectedDate, goal]);
  
  if (!goal) {
    return <div className="p-8 text-center">Loading goal...</div>;
  }
  
  const completion = calculateCompletion(goal.tasks, goal.milestones);
  
  // Handle task completion toggle
  const toggleTaskCompletion = (taskId: string) => {
    const task = goal.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newCompleted = !task.completed;
    
    // Update task with completion date if newly completed
    const updatedTask = updateTaskCompletionDate(task, newCompleted);
    
    const updatedTasks = goal.tasks.map(t => 
      t.id === taskId ? updatedTask : t
    );
    
    // If task is being completed, grant XP
    if (newCompleted && !task.completed) {
      // Award 5 XP for completing a task
      const newXp = goal.xp + 5;
      const userXp = user.totalXp + 5;
      const userDailyXp = user.dailyXp + 5;
      
      // Check for level up
      if (checkLevelUp(goal.xp, newXp)) {
        toast({
          title: "Level Up! 🎉",
          description: `You've reached level ${Math.floor(Math.sqrt(newXp / 10))}!`,
        });
      }
      
      // Show random reward
      showRandomReward("task");
      
      // Update user XP
      const updatedUser = {
        ...user,
        totalXp: userXp,
        dailyXp: userDailyXp,
        level: Math.floor(Math.sqrt(userXp / 10))
      };
      
      setUser(updatedUser);
      updateUserData(updatedUser);
      
      // Update goal with new XP
      const updatedGoal = { 
        ...goal, 
        tasks: updatedTasks,
        xp: newXp
      };
      
      // Update badges
      updatedGoal.badges = updateBadges(updatedGoal);
      
      updateGoal(updatedGoal);
    } else {
      const updatedGoal = { 
        ...goal, 
        tasks: updatedTasks
      };
      updateGoal(updatedGoal);
    }
  };
  
  // Handle milestone completion toggle
  const toggleMilestoneCompletion = (milestoneId: string) => {
    const milestone = goal.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;
    
    const newCompleted = !milestone.completed;
    
    const updatedMilestones = goal.milestones.map(m => 
      m.id === milestoneId ? { ...m, completed: newCompleted } : m
    );
    
    // If milestone is being completed, grant XP
    if (newCompleted && !milestone.completed) {
      // Award 20 XP for completing a milestone
      const newXp = goal.xp + 20;
      const userXp = user.totalXp + 20;
      const userDailyXp = user.dailyXp + 20;
      
      // Check for level up
      if (checkLevelUp(goal.xp, newXp)) {
        toast({
          title: "Level Up! 🎉",
          description: `You've reached level ${Math.floor(Math.sqrt(newXp / 10))}!`,
        });
      }
      
      // Show random reward
      showRandomReward("milestone");
      
      // Update user XP
      const updatedUser = {
        ...user,
        totalXp: userXp,
        dailyXp: userDailyXp,
        level: Math.floor(Math.sqrt(userXp / 10))
      };
      
      setUser(updatedUser);
      updateUserData(updatedUser);
      
      // Update goal with new XP
      const updatedGoal = { 
        ...goal, 
        milestones: updatedMilestones,
        xp: newXp
      };
      
      // Update badges
      updatedGoal.badges = updateBadges(updatedGoal);
      
      updateGoal(updatedGoal);
    } else {
      const updatedGoal = { 
        ...goal, 
        milestones: updatedMilestones
      };
      updateGoal(updatedGoal);
    }
  };
  
  // Update deadline
  const updateDeadline = (newDeadline: string) => {
    const updatedGoal = { ...goal, deadline: newDeadline };
    updateGoal(updatedGoal);
  };
  
  // Handle timer completion
  const handleTimerComplete = (session: TimerSession) => {
    if (!goal) return;
    
    // Calculate XP gain
    const xpGained = calculateXpForSession(session.duration);
    
    // Update goal
    const updatedGoal = {
      ...goal,
      timerSessions: [...(goal.timerSessions || []), session],
      totalTimeSpent: (goal.totalTimeSpent || 0) + session.duration,
      xp: (goal.xp || 0) + xpGained
    };
    
    // Update user XP
    const updatedUser = {
      ...user,
      totalXp: user.totalXp + xpGained,
      dailyXp: user.dailyXp + xpGained,
      level: Math.floor(Math.sqrt((user.totalXp + xpGained) / 10))
    };
    
    // Check for level up
    if (checkLevelUp(user.totalXp, user.totalXp + xpGained)) {
      toast({
        title: "Level Up! 🎉",
        description: `You've reached level ${updatedUser.level}!`,
      });
    }
    
    // Update badges
    updatedGoal.badges = updateBadges(updatedGoal);
    
    // Update goal and user
    setUser(updatedUser);
    updateUserData(updatedUser);
    updateGoal(updatedGoal);
  };
  
  // Show random reward
  const showRandomReward = (type: "timer" | "task" | "milestone") => {
    const rewards: Array<() => void> = [
      // Quote reward
      () => {
        const { quote, author } = getRandomQuote();
        toast({
          title: "Great job! 🎉",
          description: `"${quote}" — ${author}`,
        });
      },
      // Confetti reward (simulated with toast)
      () => {
        const messages = {
          timer: "You completed a focus session!",
          task: "You completed a task!",
          milestone: "You reached a milestone!"
        };
        
        toast({
          title: "Amazing work! 🎊",
          description: messages[type],
          variant: "default",
        });
      },
      // Star reward
      () => {
        const items = {
          timer: "focus session",
          task: "task",
          milestone: "milestone"
        };
        
        toast({
          title: "You earned a star! ⭐",
          description: `Great job completing that ${items[type]}!`,
        });
      }
    ];
    
    // Pick random reward
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    randomReward();
  };
  
  // Save reflection
  const saveReflection = (newReflection: Reflection) => {
    if (!goal) return;
    
    const today = getTodayISO();
    const isToday = selectedDate === today;
    
    // Only increment streak if it's today and either first reflection or consecutive day
    let newStreak = goal.streak;
    if (isToday) {
      const lastDate = goal.lastReflectionDate;
      const yesterday = format(parseISO(today).setDate(parseISO(today).getDate() - 1), 'yyyy-MM-dd');
      
      if (!lastDate || lastDate === yesterday) {
        newStreak += 1;
      } else if (lastDate !== today) {
        newStreak = 1; // Reset streak if not consecutive
      }
    }
    
    const updatedReflections = {
      ...goal.reflections,
      [selectedDate]: newReflection
    };
    
    const updatedGoal = {
      ...goal,
      reflections: updatedReflections,
      streak: newStreak,
      lastReflectionDate: isToday ? today : goal.lastReflectionDate
    };
    
    updateGoal(updatedGoal);
    toast({
      title: "Reflection saved",
      description: "Your reflection has been saved successfully.",
    });
  };
  
  // Update goal in localStorage
  const updateGoal = (updatedGoal: Goal) => {
    setGoal(updatedGoal);
    
    const updatedGoals = [...goals];
    updatedGoals[id] = updatedGoal;
    setGoals(updatedGoals);
  };

  // Calculate activity data for the heatmap
  const activityData = getActivityData(goal);

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/goals')}
        className="flex items-center text-primary hover:text-primary/80"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Goals
      </button>

      {/* User Progress */}
      <UserProgress user={user} />

      {/* Header Panel */}
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                Consistency Score: {formatConsistencyScore(goal.streak)}
              </span>
              <span className="text-secondary-foreground">
                Today: {format(new Date(), 'dd/MM/yyyy')}
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-3">{goal.name}</h1>
            <p className="text-secondary-foreground mt-1">Why: {goal.why}</p>
          </div>
          
          <div>
            <div className="text-sm text-secondary-foreground mb-1">Deadline</div>
            <input 
              type="date" 
              value={goal.deadline}
              onChange={(e) => updateDeadline(e.target.value)}
              className="p-2 border border-border rounded bg-background text-foreground"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="bg-background rounded-md px-4 py-2 shadow-sm">
            <div className="text-xs text-secondary-foreground mb-1">Time remaining</div>
            <div className="text-lg font-mono font-semibold">{countdown}</div>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <div className="flex justify-between text-sm mb-1">
              <span className="mr-2 text-secondary-foreground">Progress:</span>
              <span className="font-medium">{completion}%</span>
            </div>
            <Progress value={completion} className="w-full sm:w-48 h-2.5" />
          </div>
        </div>
        
        {/* Habit Heatmap */}
        <HabitHeatmap sessions={activityData} />
        
        {/* Total Time Spent */}
        <div className="mt-4">
          <div className="text-sm font-medium mb-1 text-secondary-foreground">
            Total Time Spent: {Math.round(goal.totalTimeSpent)} minutes
          </div>
          <Progress 
            value={Math.min((goal.totalTimeSpent / 60) * 100, 100)} 
            className="h-2"
          />
        </div>
      </div>

      {/* Pomodoro Timer */}
      <PomodoroTimer goalId={goal.id} onTimerComplete={handleTimerComplete} />

      {/* Badges */}
      <BadgeDisplay badges={goal.badges || []} />

      {/* Milestones and Tasks panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milestones panel */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Milestones</h2>
          {goal.milestones.length === 0 ? (
            <p className="text-secondary-foreground">No milestones added yet.</p>
          ) : (
            <ul className="space-y-3">
              {goal.milestones.map((milestone) => (
                <li key={milestone.id} className="flex items-start">
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={() => toggleMilestoneCompletion(milestone.id)}
                    className="rounded border-border text-primary mt-1"
                  />
                  <span 
                    className={`ml-3 ${milestone.completed ? 'line-through text-secondary-foreground/50' : 'text-foreground'}`}
                  >
                    {milestone.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tasks panel */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          {goal.tasks.length === 0 ? (
            <p className="text-secondary-foreground">No tasks added yet.</p>
          ) : (
            <ul className="space-y-3">
              {goal.tasks.map((task) => (
                <li key={task.id} className="flex items-start">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="rounded border-border text-primary mt-1"
                  />
                  <span 
                    className={`ml-3 ${task.completed ? 'line-through text-secondary-foreground/50' : 'text-foreground'}`}
                  >
                    {task.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Reflection section */}
      <ReflectionForm
        selectedDate={selectedDate}
        reflection={reflection}
        onSave={saveReflection}
      />
    </div>
  );
};

export default GoalDetail;
