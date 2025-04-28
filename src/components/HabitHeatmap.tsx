
import React, { useState } from 'react';
import { format, subDays } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HabitHeatmapProps {
  sessions: {
    date: string;
    count: number;
  }[];
}

const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ sessions }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Generate the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });

  // Create a map for easier lookup of session counts
  const sessionMap = sessions.reduce((acc, session) => {
    acc[session.date] = session.count;
    return acc;
  }, {} as Record<string, number>);

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-card border border-border';
    if (count <= 1) return 'bg-primary/30';
    if (count <= 3) return 'bg-primary/60';
    return 'bg-primary';
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-secondary-foreground">7-Day Activity</h3>
        <button 
          onClick={() => setIsVisible(!isVisible)}
          className="text-secondary-foreground hover:text-foreground"
        >
          {isVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      
      {isVisible && (
        <div className="flex justify-between">
          {last7Days.map((day) => {
            const count = sessionMap[day] || 0;
            return (
              <div key={day} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-md ${getIntensity(count)} flex items-center justify-center transition-colors`}
                  title={`${count} activities on ${format(new Date(day), 'MMM d')}`}
                >
                  {count > 0 && <span className="text-xs font-medium text-foreground">{count}</span>}
                </div>
                <span className="text-[10px] mt-1 text-secondary-foreground">
                  {format(new Date(day), 'dd')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HabitHeatmap;
