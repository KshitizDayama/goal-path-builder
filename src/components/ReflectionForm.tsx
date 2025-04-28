
import React, { useState, useEffect } from 'react';
import { formatReflectionDate, getTodayISO } from '../utils/helpers';
import { Reflection } from '../types';

interface ReflectionFormProps {
  selectedDate: string;
  reflection: Reflection | null;
  onSave: (reflection: Reflection) => void;
}

const ReflectionForm: React.FC<ReflectionFormProps> = ({ selectedDate, reflection, onSave }) => {
  const [content, setContent] = useState('');
  const [whatWentWell, setWhatWentWell] = useState('');
  const [whatToImprove, setWhatToImprove] = useState('');
  
  // Update form when selected date or reflection changes
  useEffect(() => {
    if (reflection) {
      setContent(reflection.content || '');
      setWhatWentWell(reflection.whatWentWell || '');
      setWhatToImprove(reflection.whatToImprove || '');
    } else {
      setContent('');
      setWhatWentWell('');
      setWhatToImprove('');
    }
  }, [selectedDate, reflection]);
  
  const handleSave = () => {
    const newReflection: Reflection = {
      date: selectedDate,
      content,
      whatWentWell,
      whatToImprove,
    };
    
    onSave(newReflection);
  };
  
  const isToday = selectedDate === getTodayISO();
  
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold">Daily Reflection</h2>
        <div className="mt-2 sm:mt-0">
          <input
            type="date"
            value={selectedDate}
            max={getTodayISO()}
            onChange={(e) => onSave({
              date: e.target.value,
              content,
              whatWentWell,
              whatToImprove
            })}
            className="p-2 border border-border rounded bg-background text-foreground"
          />
        </div>
      </div>
      
      <div className="mb-2 text-sm text-secondary-foreground">
        {formatReflectionDate(selectedDate)}
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="reflection-content" className="block text-sm font-medium mb-1 text-secondary-foreground">
            General Thoughts
          </label>
          <textarea
            id="reflection-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full p-3 border border-border rounded-md h-24 mb-4 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label htmlFor="what-went-well" className="block text-sm font-medium mb-1 text-secondary-foreground">
            What went well?
          </label>
          <textarea
            id="what-went-well"
            value={whatWentWell}
            onChange={(e) => setWhatWentWell(e.target.value)}
            placeholder="What successes, even small ones, did you have today?"
            className="w-full p-3 border border-border rounded-md h-20 mb-4 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label htmlFor="what-to-improve" className="block text-sm font-medium mb-1 text-secondary-foreground">
            One tweak for next time?
          </label>
          <textarea
            id="what-to-improve"
            value={whatToImprove}
            onChange={(e) => setWhatToImprove(e.target.value)}
            placeholder="What's one small change that could improve your next session?"
            className="w-full p-3 border border-border rounded-md h-20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      <button
        onClick={handleSave}
        className="mt-4 bg-primary text-primary-foreground rounded px-4 py-2 hover:bg-primary/90 transition-colors"
        disabled={!isToday}
      >
        {isToday ? 'Save Reflection' : 'Can only save reflections for today'}
      </button>
    </div>
  );
};

export default ReflectionForm;
