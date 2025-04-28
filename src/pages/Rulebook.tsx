
import React from 'react';

const Rulebook: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">The Streakly Rulebook</h1>
      
      <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">XP & Leveling System</h2>
        <div className="space-y-4">
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Focus Timer XP</h3>
            <p className="text-secondary-foreground">1 minute of focused work = 1 XP</p>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Task Completion</h3>
            <p className="text-secondary-foreground">Each completed task = 5 XP</p>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Milestone Completion</h3>
            <p className="text-secondary-foreground">Each completed milestone = 20 XP</p>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Leveling Formula</h3>
            <p className="text-secondary-foreground">Level = ⌊sqrt(Total XP ÷ 10)⌋</p>
            <p className="text-secondary-foreground mt-2">Example: 400 XP = Level 6</p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">Progress & Consistency</h2>
        <div className="space-y-4">
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Goal Progress</h3>
            <p className="text-secondary-foreground">Progress % = (Completed Tasks + Completed Milestones) ÷ (Total Tasks + Total Milestones) × 100%</p>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Consistency Score</h3>
            <p className="text-secondary-foreground">Days with at least one task completed for this goal</p>
            <p className="text-secondary-foreground mt-2">The score resets if a day is missed</p>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Habit Chain</h3>
            <p className="text-secondary-foreground">Number of consecutive days with activity</p>
            <p className="text-secondary-foreground mt-2">Chain breaks if no activity is recorded for a day</p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Badges & Rewards</h2>
        <div className="space-y-4">
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">First Focus ⏱️</h3>
            <p className="text-secondary-foreground">Complete your first focus session</p>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Consistent 📆</h3>
            <p className="text-secondary-foreground">Complete sessions 3 days in a row</p>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Milestone Master 🏆</h3>
            <p className="text-secondary-foreground">Complete 5 milestones</p>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Task Titan ✅</h3>
            <p className="text-secondary-foreground">Complete 10 tasks</p>
          </div>
          
          <div className="bg-background p-4 rounded-md border border-border">
            <h3 className="font-bold mb-2">Hour Hero ⌛</h3>
            <p className="text-secondary-foreground">Focus for a total of 60 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rulebook;
