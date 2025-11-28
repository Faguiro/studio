'use client';

import { useState, useTransition } from 'react';
import type { Task, TaskPriority } from '@/app/types';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { ProgressChart } from './ProgressChart';
import { ScheduleView } from './ScheduleView';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { getAiSchedule } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function DayPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAddTask = (name: string, estimatedDuration: number, priority: TaskPriority) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      estimatedDuration,
      priority,
      isComplete: false,
      timeSpent: 0,
      isRunning: false,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, ...updates } : task)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleGenerateSchedule = () => {
    const tasksToSchedule = tasks
      .filter(task => !task.isComplete)
      .map(task => ({
        name: task.name,
        priority: task.priority,
        duration: task.estimatedDuration,
      }));
    
    if (tasksToSchedule.length === 0) {
      toast({
        title: "Nenhuma Tarefa para Agendar",
        description: "Por favor, adicione algumas tarefas ou desmarque as concluídas antes de gerar um cronograma.",
      });
      return;
    }

    startTransition(async () => {
      const result = await getAiSchedule({ tasks: tasksToSchedule });
      if (result.schedule) {
        setSchedule(result.schedule);
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao gerar o cronograma.",
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="lg:col-span-2 space-y-6">
        <TaskForm onAddTask={handleAddTask} />
        <TaskList tasks={tasks} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cronograma com IA</CardTitle>
            <CardDescription>Deixe a IA otimizar o seu dia.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerateSchedule} disabled={isPending} className="w-full">
              <Lightbulb className="mr-2 h-4 w-4" />
              {isPending ? 'Gerando...' : 'Gerar Cronograma Inteligente'}
            </Button>
            <ScheduleView schedule={schedule} isLoading={isPending} />
          </CardContent>
        </Card>
        <ProgressChart tasks={tasks} />
      </div>
    </div>
  );
}
