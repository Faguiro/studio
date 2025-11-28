'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TaskPriority } from '@/app/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome da tarefa deve ter pelo menos 3 caracteres.',
  }),
  estimatedDuration: z.coerce.number().min(1, {
    message: 'A duração deve ser de pelo menos 1 minuto.',
  }),
  priority: z.enum(['High', 'Medium', 'Low']),
});

interface TaskFormProps {
  onAddTask: (name: string, estimatedDuration: number, priority: TaskPriority) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      estimatedDuration: 30,
      priority: 'Medium',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddTask(values.name, values.estimatedDuration, values.priority as TaskPriority);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Nova Tarefa</CardTitle>
        <CardDescription>O que você quer realizar hoje?</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Tarefa</FormLabel>
                  <FormControl>
                    <Input placeholder="ex., Terminar o relatório do projeto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração Est. (min)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">Alta</SelectItem>
                        <SelectItem value="Medium">Média</SelectItem>
                        <SelectItem value="Low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Tarefa
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
