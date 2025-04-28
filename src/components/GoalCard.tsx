
import React from 'react';
import { Link } from 'react-router-dom';
import { calculateCompletion, formatDate } from '../utils/helpers';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  index: number;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, index }) => {
  const completion = calculateCompletion(goal.tasks, goal.milestones);
  
  return (
    <Link 
      to={`/goal/${index}`} 
      state={{ goal, id: index }} 
      className="block"
    >
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{goal.name}</h3>
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded bg-blue-100 text-blue-800">
            {goal.streak} days
          </span>
        </div>
        
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">Deadline</div>
          <div className="text-sm font-medium">{formatDate(goal.deadline)}</div>
        </div>
        
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Why</div>
          <p className="text-sm text-gray-700 line-clamp-2">{goal.why}</p>
        </div>
        
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GoalCard;
