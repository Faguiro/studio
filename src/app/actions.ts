
'use server';

import { generateSchedule, type ScheduleInput } from '@/ai/flows/intelligent-schedule-generation';

export async function getAiSchedule(input: ScheduleInput) {
  if (!input.tasks || input.tasks.length === 0) {
    return { schedule: 'Por favor, adicione algumas tarefas para gerar um cronograma.' };
  }

  try {
    const result = await generateSchedule(input);
    return result;
  } catch (error) {
    console.error('Error generating schedule:', error);
    return { schedule: 'Desculpe, ocorreu um erro ao gerar seu cronograma. Por favor, tente novamente.' };
  }
}
