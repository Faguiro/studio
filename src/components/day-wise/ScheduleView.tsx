'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface ScheduleViewProps {
  schedule: string | null;
  isLoading: boolean;
}

export function ScheduleView({ schedule, isLoading }: ScheduleViewProps) {
  if (isLoading) {
    return (
      <div className="mt-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Clique no botão acima para gerar seu cronograma.
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-md border bg-muted/30 p-4">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
        {schedule}
      </pre>
    </div>
  );
}
