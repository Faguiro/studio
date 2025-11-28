'use server';

/**
 * @fileOverview An AI agent that generates an optimized schedule for the user's day based on their tasks,
 *  priorities, and estimated durations.
 *
 * - generateSchedule - A function that generates the schedule.
 * - ScheduleInput - The input type for the generateSchedule function.
 * - ScheduleOutput - The return type for the generateSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScheduleInputSchema = z.object({
  tasks: z.array(
    z.object({
      name: z.string().describe('The name of the task.'),
      priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the task.'),
      duration: z.number().describe('The estimated duration of the task in minutes.'),
    })
  ).describe('A list of tasks to schedule.'),
});
export type ScheduleInput = z.infer<typeof ScheduleInputSchema>;

const ScheduleOutputSchema = z.object({
  schedule: z.string().describe('An optimized schedule for the day, taking into account task priorities and durations.'),
});
export type ScheduleOutput = z.infer<typeof ScheduleOutputSchema>;

export async function generateSchedule(input: ScheduleInput): Promise<ScheduleOutput> {
  return generateScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSchedulePrompt',
  input: {schema: ScheduleInputSchema},
  output: {schema: ScheduleOutputSchema},
  prompt: `You are an AI assistant that generates an optimized schedule for the user's day.
  The schedule should take into account the priority and duration of each task.
  Prioritize high priority tasks and schedule them earlier in the day.
  Provide the schedule in a clear and easy-to-read format.

  Tasks:
  {{#each tasks}}
  - Name: {{this.name}}, Priority: {{this.priority}}, Duration: {{this.duration}} minutes
  {{/each}}
  `,
});

const generateScheduleFlow = ai.defineFlow(
  {
    name: 'generateScheduleFlow',
    inputSchema: ScheduleInputSchema,
    outputSchema: ScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
