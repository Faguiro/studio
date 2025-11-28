'use client';

import type { Task } from '@/app/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { BarChart as BarChartIcon } from 'lucide-react';

interface ProgressChartProps {
  tasks: Task[];
}

export function ProgressChart({ tasks }: ProgressChartProps) {
  const completedTasks = tasks.filter(t => t.isComplete).length;
  const pendingTasks = tasks.length - completedTasks;

  const chartData = [
    { name: 'Concluídas', value: completedTasks, fill: 'hsl(var(--accent))' },
    { name: 'Pendentes', value: pendingTasks, fill: 'hsl(var(--muted))' },
  ];

  const chartConfig = {
    completed: {
      label: 'Concluídas',
      color: 'hsl(var(--accent))',
    },
    pending: {
      label: 'Pendentes',
      color: 'hsl(var(--muted))',
    },
  };
  
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso Diário</CardTitle>
        <CardDescription>Você completou {completedTasks} de {totalTasks} tarefas.</CardDescription>
      </CardHeader>
      <CardContent>
        {totalTasks > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
              </Pie>
               <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-3xl font-bold"
                >
                  {completionPercentage}%
                </text>
                 <text
                  x="50%"
                  y="50%"
                  dy="1.5em"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-sm"
                >
                  Completo
                </text>
            </PieChart>
          </ChartContainer>
        ) : (
           <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center h-[244px]">
            <BarChartIcon className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-muted-foreground">Sem dados</h3>
            <p className="mt-1 text-sm text-muted-foreground/80">Adicione tarefas para ver seu progresso.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
