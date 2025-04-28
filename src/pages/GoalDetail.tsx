
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { 
  formatCountdown, 
  calculateCompletion, 
  getTodayISO,
  formatReflectionDate
} from '../utils/helpers';
import { Goal, Task, Milestone, Reflection } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const GoalDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { goal: initialGoal, id } = location.state || {};
  
  const [goals, setGoals] = useLocalStorage<Goal[]>('streakly-goals', []);
  const [goal, setGoal] = useState<Goal | null>(null);
  
  const [countdown, setCountdown] = useState('00:00:00:00');
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [reflection, setReflection] = useState('');
  
  // Load the goal from localStorage or location state
  useEffect(() => {
    if (initialGoal) {
      setGoal(initialGoal);
    } else if (goals[id]) {
      setGoal(goals[id]);
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
      setReflection(goal.reflections[selectedDate].content);
    } else {
      setReflection('');
    }
  }, [selectedDate, goal]);
  
  if (!goal) {
    return <div className="p-8 text-center">Loading goal...</div>;
  }
  
  const completion = calculateCompletion(goal.tasks, goal.milestones);
  
  // Handle task completion toggle
  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = goal.tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    const updatedGoal = { ...goal, tasks: updatedTasks };
    updateGoal(updatedGoal);
  };
  
  // Handle milestone completion toggle
  const toggleMilestoneCompletion = (milestoneId: string) => {
    const updatedMilestones = goal.milestones.map(milestone => 
      milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone
    );
    
    const updatedGoal = { ...goal, milestones: updatedMilestones };
    updateGoal(updatedGoal);
  };
  
  // Update deadline
  const updateDeadline = (newDeadline: string) => {
    const updatedGoal = { ...goal, deadline: newDeadline };
    updateGoal(updatedGoal);
  };
  
  // Save reflection
  const saveReflection = () => {
    if (!reflection.trim()) return;
    
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
      [selectedDate]: {
        date: selectedDate,
        content: reflection
      }
    };
    
    const updatedGoal = {
      ...goal,
      reflections: updatedReflections,
      streak: newStreak,
      lastReflectionDate: isToday ? today : goal.lastReflectionDate
    };
    
    updateGoal(updatedGoal);
    alert('Reflection saved successfully!');
  };
  
  // Update goal in localStorage
  const updateGoal = (updatedGoal: Goal) => {
    setGoal(updatedGoal);
    
    const updatedGoals = [...goals];
    updatedGoals[id] = updatedGoal;
    setGoals(updatedGoals);
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/goals')}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Goals
      </button>

      {/* Header Panel */}
      <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Streak: {goal.streak} days
              </span>
              <span className="text-gray-500">
                Today: {format(new Date(), 'dd/MM/yyyy')}
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-3">{goal.name}</h1>
            <p className="text-gray-700 mt-1">Why: {goal.why}</p>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Deadline</div>
            <input 
              type="date" 
              value={goal.deadline}
              onChange={(e) => updateDeadline(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="bg-white rounded-md px-4 py-2 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Time remaining</div>
            <div className="text-lg font-mono font-semibold">{countdown}</div>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <div className="flex justify-between text-sm mb-1">
              <span className="mr-2">Progress:</span>
              <span className="font-medium">{completion}%</span>
            </div>
            <div className="w-full sm:w-48 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${completion}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones and Tasks panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milestones panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Milestones</h2>
          {goal.milestones.length === 0 ? (
            <p className="text-gray-500">No milestones added yet.</p>
          ) : (
            <ul className="space-y-3">
              {goal.milestones.map((milestone) => (
                <li key={milestone.id} className="flex items-start">
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={() => toggleMilestoneCompletion(milestone.id)}
                    className="rounded border-gray-300 text-blue-600 mt-1"
                  />
                  <span 
                    className={`ml-3 ${milestone.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                  >
                    {milestone.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tasks panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          {goal.tasks.length === 0 ? (
            <p className="text-gray-500">No tasks added yet.</p>
          ) : (
            <ul className="space-y-3">
              {goal.tasks.map((task) => (
                <li key={task.id} className="flex items-start">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="rounded border-gray-300 text-blue-600 mt-1"
                  />
                  <span 
                    className={`ml-3 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
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
      <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-semibold">Daily Reflection</h2>
          <div className="mt-2 sm:mt-0">
            <input
              type="date"
              value={selectedDate}
              max={getTodayISO()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        <div className="mb-2 text-sm text-gray-600">
          {formatReflectionDate(selectedDate)}
        </div>
        
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="What went well? What can be improved?"
          className="w-full p-3 border border-gray-300 rounded-md h-32 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        
        <button
          onClick={saveReflection}
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors"
        >
          Save Reflection
        </button>
      </div>
    </div>
  );
};

export default GoalDetail;
