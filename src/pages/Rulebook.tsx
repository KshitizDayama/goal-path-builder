
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText } from 'lucide-react';

const Rulebook: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BookText className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-bold">Rulebook</h1>
      </div>
      
      <p className="text-secondary-foreground">
        This rulebook explains the science and psychology behind the features in Streakly.
        Understanding these concepts will help you build stronger habits and achieve your goals more effectively.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Fogg Behavior Model (B=MAP)</CardTitle>
            <CardDescription>Understanding what drives behavior change</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">
              The Fogg Behavior Model states that three elements must converge at the same 
              moment for a behavior to occur: <strong>Motivation</strong>, <strong>Ability</strong>, 
              and a <strong>Prompt</strong>. When behavior doesn't occur, at least one of these 
              elements is missing.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-secondary-foreground">
              <li>
                <strong>Motivation:</strong> Your "why" statement helps build motivation
              </li>
              <li>
                <strong>Ability:</strong> Breaking goals into small tasks makes them easier to accomplish
              </li>
              <li>
                <strong>Prompt:</strong> The "If→Then" triggers remind you when to take action
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>The Habit Loop</CardTitle>
            <CardDescription>How habits form and sustain</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">
              The Habit Loop consists of three parts: <strong>Cue</strong>, <strong>Routine</strong>, 
              and <strong>Reward</strong>. This loop is the backbone of habit formation.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-secondary-foreground">
              <li>
                <strong>Cue:</strong> Your time-based triggers act as cues
              </li>
              <li>
                <strong>Routine:</strong> The actual tasks you perform
              </li>
              <li>
                <strong>Reward:</strong> XP, badges, and random rewards provide positive reinforcement
              </li>
              <li>
                <strong>Craving:</strong> The anticipation of the reward that drives behavior
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Variable Rewards</CardTitle>
            <CardDescription>Why unpredictability creates strong engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">
              Variable rewards are powerful motivators because our brains are wired to seek patterns 
              and predict outcomes. When rewards are unpredictable, we stay engaged longer.
            </p>
            <p className="mt-3 text-secondary-foreground">
              In Streakly, variable rewards happen when you:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-secondary-foreground">
              <li>Complete a timer session</li>
              <li>Finish tasks or milestones</li>
              <li>Reach new streak milestones</li>
            </ul>
            <p className="mt-3 text-secondary-foreground">
              You never know which reward you'll get: a motivational quote, confetti animation, 
              or something else!
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>The Zeigarnik Effect</CardTitle>
            <CardDescription>Leveraging our discomfort with unfinished tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">
              The Zeigarnik Effect states that people remember uncompleted tasks better than completed ones. 
              This creates a psychological tension that motivates us to finish what we've started.
            </p>
            <p className="mt-3 text-secondary-foreground">
              Streakly uses this principle by:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-secondary-foreground">
              <li>Showing clear progress bars for each goal</li>
              <li>Displaying incomplete tasks prominently</li>
              <li>Breaking goals into visible milestones</li>
              <li>Creating a sense of "open loops" that need closing</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Implementation Intentions</CardTitle>
            <CardDescription>The power of "If-Then" planning</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">
              Implementation intentions are specific plans that detail when, where, and how you'll act on your goals. 
              The "If [situation], then I will [action]" format creates a mental link between the situation and 
              behavior.
            </p>
            <p className="mt-3 text-secondary-foreground">
              Research shows this approach can make you 2-3 times more likely to follow through. 
              Streakly's trigger system is built on this principle.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reflection and Self-Efficacy</CardTitle>
            <CardDescription>Learning from experience increases confidence</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground">
              Regular reflection strengthens your self-efficacy — your belief in your ability to 
              achieve goals. By examining what went well and what could be improved, you build 
              confidence and refine your approach.
            </p>
            <p className="mt-3 text-secondary-foreground">
              Streakly's daily reflection prompts and journaling features help you 
              build this habit of reflection and continuous improvement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rulebook;
