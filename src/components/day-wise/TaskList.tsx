'use client';

import type { Task } from '@/app/types';
import { TaskItem } from './TaskItem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarefas de Hoje</CardTitle>
        <CardDescription>Aqui está o que você tem para fazer.</CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-muted-foreground">Nenhuma tarefa ainda</h3>
            <p className="mt-1 text-sm text-muted-foreground/80">Adicione uma tarefa acima para começar!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
