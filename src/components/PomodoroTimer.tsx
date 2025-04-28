
import React, { useState, useEffect } from 'react';
import { getRandomQuote } from '../data/quotes';
import { Bell, Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { TimerSession } from '../types';
import { useToast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  goalId: string;
  onTimerComplete: (session: TimerSession) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ goalId, onTimerComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes in seconds
  const [focusDuration, setFocusDuration] = useState(25); // minutes
  const [breakDuration, setBreakDuration] = useState(5); // minutes
  const { toast } = useToast();

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  }, [mode, focusDuration, breakDuration]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer completed
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'focus') {
      // Record completed focus session
      const session: TimerSession = {
        date: new Date().toISOString().split('T')[0],
        duration: focusDuration,
        goalId,
        completed: true
      };
      
      onTimerComplete(session);
      
      // Show reward
      showRandomReward();
      
      // Switch to break mode
      setMode('break');
      setTimeLeft(breakDuration * 60);
    } else {
      // Break completed, switch back to focus mode
      setMode('focus');
      setTimeLeft(focusDuration * 60);
      
      // Notify user break is over
      toast({
        title: "Break finished!",
        description: "Time to get back to focusing.",
      });
    }
  };

  const showRandomReward = () => {
    const rewards: Array<() => void> = [
      // Quote reward
      () => {
        const { quote, author } = getRandomQuote();
        toast({
          title: "Focus session completed! 🎉",
          description: `"${quote}" — ${author}`,
        });
      },
      // Confetti reward (simulated with toast)
      () => {
        toast({
          title: "Amazing work! 🎊",
          description: `You completed a ${focusDuration}-minute focus session!`,
          variant: "default",
        });
      },
      // Star reward
      () => {
        toast({
          title: "You earned a star! ⭐",
          description: `Great job completing that ${focusDuration}-minute focus session!`,
        });
      }
    ];
    
    // Pick random reward
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    randomReward();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        {mode === 'focus' ? 'Focus Timer' : 'Break Timer'}
      </h2>
      
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold font-mono mb-6">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex space-x-3 mb-6">
          <button
            onClick={toggleTimer}
            className={`px-4 py-2 rounded-full flex items-center ${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
            } text-white transition-colors`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                {timeLeft === (mode === 'focus' ? focusDuration * 60 : breakDuration * 60) ? 'Start' : 'Resume'}
              </>
            )}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2 rounded-full flex items-center bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full">
          <div>
            <label htmlFor="focus-duration" className="block text-sm font-medium mb-1 text-secondary-foreground">
              Focus (minutes)
            </label>
            <input
              id="focus-duration"
              type="number"
              min="1"
              max="60"
              value={focusDuration}
              onChange={(e) => setFocusDuration(Number(e.target.value))}
              className="w-full p-2 border border-border rounded bg-background text-foreground"
              disabled={isRunning}
            />
          </div>
          <div>
            <label htmlFor="break-duration" className="block text-sm font-medium mb-1 text-secondary-foreground">
              Break (minutes)
            </label>
            <input
              id="break-duration"
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => setBreakDuration(Number(e.target.value))}
              className="w-full p-2 border border-border rounded bg-background text-foreground"
              disabled={isRunning}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
