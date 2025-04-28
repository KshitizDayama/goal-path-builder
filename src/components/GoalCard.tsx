
import React from 'react';
import { Link } from 'react-router-dom';
import { calculateCompletion, formatDate, formatConsistencyScore } from '../utils/helpers';
import { Goal } from '../types';
import { Progress } from '@/components/ui/progress';

interface GoalCardProps {
  goal: Goal;
  index: number;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, index }) => {
  const completion = calculateCompletion(goal.tasks, goal.milestones);
  const hasUnlockedBadges = goal.badges?.some(badge => badge.unlocked) || false;
  
  // Calculate remaining milestones
  const totalMilestones = goal.milestones.length;
  const completedMilestones = goal.milestones.filter(m => m.completed).length;
  const remainingMilestones = totalMilestones - completedMilestones;
  const showMilestoneReminder = totalMilestones > 0 && 
                               (completedMilestones / totalMilestones) >= 0.7 && 
                               remainingMilestones > 0;
  
  return (
    <Link 
      to={`/goal/${index}`} 
      state={{ goal, id: index }} 
      className="block"
    >
      <div className="bg-card text-card-foreground rounded-lg shadow-lg hover:shadow-xl transition-shadow p-5 h-full border border-border">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold truncate">{goal.name}</h3>
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded bg-primary/20 text-primary">
            {formatConsistencyScore(goal.streak)}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">Deadline</div>
          <div className="text-sm font-medium">{formatDate(goal.deadline)}</div>
        </div>
        
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-1">Why</div>
          <p className="text-sm text-secondary-foreground line-clamp-2">{goal.why}</p>
        </div>
        
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">Total Time</div>
          <div className="text-sm">{goal.totalTimeSpent || 0} minutes</div>
        </div>
        
        {hasUnlockedBadges && (
          <div className="mb-3 flex flex-wrap gap-1">
            {goal.badges?.filter(badge => badge.unlocked).slice(0, 3).map(badge => (
              <span key={badge.id} className="text-lg" title={badge.name}>
                {badge.icon}
              </span>
            ))}
            {(goal.badges?.filter(badge => badge.unlocked).length || 0) > 3 && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                +{(goal.badges?.filter(badge => badge.unlocked).length || 0) - 3} more
              </span>
            )}
          </div>
        )}
        
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{completion}%</span>
          </div>
          <Progress
            value={completion}
            className="h-2"
          />
        </div>
        
        {showMilestoneReminder && (
          <div className="mt-3 text-sm text-primary font-medium">
            Only {remainingMilestones} milestone{remainingMilestones !== 1 ? 's' : ''} left to knock off this goal. Let's crush it!
          </div>
        )}
      </div>
    </Link>
  );
};

export default GoalCard;
