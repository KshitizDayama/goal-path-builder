
import React from 'react';
import { Badge } from '../types';

interface BadgeDisplayProps {
  badges: Badge[];
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  
  if (unlockedBadges.length === 0) {
    return (
      <div className="bg-card rounded-lg p-4 shadow-sm text-center">
        <h3 className="text-sm font-medium mb-2 text-secondary-foreground">Badges</h3>
        <p className="text-xs text-secondary-foreground">Complete tasks and sessions to unlock badges!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium mb-3 text-secondary-foreground">Badges Earned</h3>
      <div className="flex flex-wrap gap-2">
        {unlockedBadges.map(badge => (
          <div 
            key={badge.id}
            className="border border-primary/30 bg-card rounded-md p-2 flex flex-col items-center justify-center w-16 h-16"
            title={badge.description}
          >
            <div className="text-xl">{badge.icon}</div>
            <div className="text-[10px] text-center mt-1 text-secondary-foreground truncate w-full">
              {badge.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeDisplay;
