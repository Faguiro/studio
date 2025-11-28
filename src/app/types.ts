export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  name: string;
  priority: TaskPriority;
  estimatedDuration: number; // in minutes
  isComplete: boolean;
  timeSpent: number; // in seconds
  isRunning: boolean;
}
