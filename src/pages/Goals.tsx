
import React from 'react';
import MultiStepGoalForm from '../components/MultiStepGoalForm';
import GoalCard from '../components/GoalCard';
import { Goal } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const Goals: React.FC = () => {
  const [goals, setGoals] = useLocalStorage<Goal[]>('streakly-goals', []);

  const handleAddGoal = (goal: Goal) => {
    setGoals([...goals, goal]);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Goals</h1>
      
      <MultiStepGoalForm onAddGoal={handleAddGoal} />
      
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600">No goals yet</h3>
          <p className="text-gray-500 mt-1">Create your first goal to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;
