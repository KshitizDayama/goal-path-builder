
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { User } from '../types';

interface UserProgressProps {
  user: User;
}

const UserProgress: React.FC<UserProgressProps> = ({ user }) => {
  // Calculate XP needed for next level (simple formula: 100 * current level)
  const xpForNextLevel = user.level * 100;
  
  // Calculate progress percentage
  const progressPercentage = Math.min(Math.round((user.dailyXp / xpForNextLevel) * 100), 100);

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            {user.level}
          </div>
          <span className="ml-2 font-semibold">Level {user.level}</span>
        </div>
        <span className="text-sm text-secondary-foreground">
          {user.dailyXp} / {xpForNextLevel} XP Today
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default UserProgress;
