
'use server';

import { generateSchedule, type ScheduleInput } from '@/ai/flows/intelligent-schedule-generation';

export async function getAiSchedule(input: ScheduleInput) {
  if (!input.tasks || input.tasks.length === 0) {
    return { schedule: 'Please add some tasks to generate a schedule.' };
  }

  try {
    const result = await generateSchedule(input);
    return result;
  } catch (error) {
    console.error('Error generating schedule:', error);
    return { schedule: 'Sorry, an error occurred while generating your schedule. Please try again.' };
  }
}
