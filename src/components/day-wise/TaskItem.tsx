'use client';

import { useState, useEffect, useRef } from 'react';
import type { Task } from '@/app/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Play, Square, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id:string) => void;
}

const priorityMap: Record<Task['priority'], string> = {
  High: 'Alta',
  Medium: 'Média',
  Low: 'Baixa',
};

const priorityStyles = {
  High: 'bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30',
  Low: 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30',
};

export function TaskItem({ task, onUpdateTask, onDeleteTask }: TaskItemProps) {
  const [time, setTime] = useState(task.timeSpent);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (task.isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (time !== task.timeSpent) {
          onUpdateTask(task.id, { timeSpent: time });
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [task.isRunning, task.id, onUpdateTask, time, task.timeSpent]);
  
  useEffect(() => {
    setTime(task.timeSpent);
  }, [task.timeSpent]);

  const handleToggleTimer = () => {
    onUpdateTask(task.id, { isRunning: !task.isRunning });
  };
  
  const handleToggleComplete = (checked: boolean) => {
    onUpdateTask(task.id, { isComplete: checked, isRunning: false });
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if(hours > 0) parts.push(String(hours).padStart(2, '0'));
    parts.push(String(minutes).padStart(2, '0'));
    parts.push(String(seconds).padStart(2, '0'));
    return parts.join(':');
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border p-3 transition-all',
        task.isComplete ? 'bg-muted/50' : 'bg-card'
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.isComplete}
        onCheckedChange={(checked) => handleToggleComplete(Boolean(checked))}
        aria-label={`Marcar ${task.name} como concluída`}
        className="h-5 w-5"
      />
      <div className="flex-1">
        <label
          htmlFor={`task-${task.id}`}
          className={cn('font-medium', task.isComplete ? 'text-muted-foreground line-through' : 'text-foreground')}
        >
          {task.name}
        </label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
           <Badge variant="outline" className={cn("text-xs", priorityStyles[task.priority])}>{priorityMap[task.priority]}</Badge>
           <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Est: {task.estimatedDuration} min</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <div className={cn(
            "text-sm font-mono tabular-nums",
            task.isRunning ? "text-primary font-semibold" : "text-muted-foreground"
            )}>
          {formatTime(time)}
        </div>
        <Button variant={task.isRunning ? 'destructive' : 'outline'} size="icon" onClick={handleToggleTimer} disabled={task.isComplete} className="h-8 w-8">
          {task.isRunning ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span className="sr-only">{task.isRunning ? 'Parar cronômetro' : 'Iniciar cronômetro'}</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir tarefa</span>
        </Button>
      </div>
    </div>
  );
}
