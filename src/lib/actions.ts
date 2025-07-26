'use server';

import { suggestCareSchedule, SuggestCareScheduleInput, SuggestCareScheduleOutput } from '@/ai/flows/suggest-care-schedule';

export async function handleSuggestCareSchedule(input: SuggestCareScheduleInput): Promise<SuggestCareScheduleOutput> {
  try {
    const output = await suggestCareSchedule(input);
    return output;
  } catch (error) {
    console.error('Error in suggestCareSchedule flow:', error);
    throw new Error('Failed to get care suggestions from AI.');
  }
}
