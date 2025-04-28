
import React, { useState } from 'react';
import { generateId } from '../utils/helpers';
import { Goal, Task, Milestone } from '../types';
import { getDefaultBadges } from '../utils/gamification';

interface MultiStepGoalFormProps {
  onAddGoal: (goal: Goal) => void;
}

const MultiStepGoalForm: React.FC<MultiStepGoalFormProps> = ({ onAddGoal }) => {
  const [step, setStep] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [why, setWhy] = useState('');
  
  const [tasks, setTasks] = useState<Task[]>([{ id: generateId(), text: '', completed: false }]);
  const [milestones, setMilestones] = useState<Milestone[]>([{ id: generateId(), text: '', completed: false }]);

  const handleAddTask = () => {
    setTasks([...tasks, { id: generateId(), text: '', completed: false }]);
  };

  const handleTaskChange = (id: string, text: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, text } : task));
  };

  const handleAddMilestone = () => {
    setMilestones([...milestones, { id: generateId(), text: '', completed: false }]);
  };

  const handleMilestoneChange = (id: string, text: string) => {
    setMilestones(milestones.map(milestone => milestone.id === id ? { ...milestone, text } : milestone));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty tasks and milestones
    const filteredTasks = tasks.filter(task => task.text.trim() !== '');
    const filteredMilestones = milestones.filter(milestone => milestone.text.trim() !== '');
    
    const newGoal: Goal = {
      id: generateId(),
      name,
      deadline,
      why,
      tasks: filteredTasks,
      milestones: filteredMilestones,
      reflections: {},
      streak: 0,
      // New fields for gamification
      totalTimeSpent: 0,
      xp: 0,
      level: 1,
      badges: getDefaultBadges(),
      habitChain: 0,
      timerSessions: []
    };
    
    onAddGoal(newGoal);
    
    // Reset form
    setStep(1);
    setIsFormOpen(false);
    setName('');
    setDeadline('');
    setWhy('');
    setTasks([{ id: generateId(), text: '', completed: false }]);
    setMilestones([{ id: generateId(), text: '', completed: false }]);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  if (!isFormOpen) {
    return (
      <div className="mb-8">
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="font-semibold">Create New Goal</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Create New Goal</h2>
        <button 
          onClick={() => setIsFormOpen(false)} 
          className="text-secondary-foreground hover:text-foreground"
          aria-label="Close form"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress steps indicator */}
      <div className="flex mb-6">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              step === num ? 'border-primary bg-primary text-primary-foreground' : 
              step > num ? 'border-primary bg-background text-primary' : 'border-border bg-background text-secondary-foreground'
            }`}>
              {step > num ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : num}
            </div>
            <div className={`text-xs mt-1 ${step >= num ? 'text-primary' : 'text-secondary-foreground'}`}>
              Step {num}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Name, Deadline & Why</h3>
            <div>
              <label htmlFor="goal-name" className="block text-sm font-medium text-secondary-foreground mb-1">Goal Name</label>
              <input
                id="goal-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="goal-deadline" className="block text-sm font-medium text-secondary-foreground mb-1">Deadline</label>
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="goal-why" className="block text-sm font-medium text-secondary-foreground mb-1">Why (Your Motivation)</label>
              <textarea
                id="goal-why"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-24"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-primary-foreground rounded px-4 py-2 hover:bg-primary/90 transition-colors"
                disabled={!name || !deadline || !why}
              >
                Next: Step 2 of 3
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add Tasks</h3>
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div key={task.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={task.text}
                    onChange={(e) => handleTaskChange(task.id, e.target.value)}
                    className="flex-1 p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Task ${index + 1}`}
                  />
                  {index === tasks.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddTask}
                      className="p-2 bg-muted rounded-md text-secondary-foreground hover:bg-muted/80"
                      title="Add another task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-muted text-foreground rounded px-4 py-2 hover:bg-muted/80 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-primary-foreground rounded px-4 py-2 hover:bg-primary/90 transition-colors"
                disabled={tasks.every(task => task.text.trim() === '')}
              >
                Next: Step 3 of 3
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add Milestones</h3>
            <p className="text-sm text-secondary-foreground">Create small milestones to track your progress</p>
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={milestone.text}
                    onChange={(e) => handleMilestoneChange(milestone.id, e.target.value)}
                    className="flex-1 p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Milestone ${index + 1}`}
                  />
                  {index === milestones.length - 1 && (
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="p-2 bg-muted rounded-md text-secondary-foreground hover:bg-muted/80"
                      title="Add another milestone"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-muted text-foreground rounded px-4 py-2 hover:bg-muted/80 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-primary text-primary-foreground rounded px-4 py-2 hover:bg-primary/90 transition-colors"
              >
                Finish & Save Goal
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MultiStepGoalForm;
