'use server';

/**
 * @fileOverview AI-powered plant care suggestion flow.
 *
 * - suggestCareSchedule - A function that suggests plant care schedule based on plant description and image.
 * - SuggestCareScheduleInput - The input type for the suggestCareSchedule function.
 * - SuggestCareScheduleOutput - The return type for the suggestCareSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCareScheduleInputSchema = z.object({
  plantName: z.string().describe('The name of the plant.'),
  plantDescription: z.string().describe('The description of the plant.'),
  plantPhotoDataUri: z
    .string()
    .describe(
      'A photo of the plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep the backslashes to prevent JSON errors
    ),
  plantType: z.string().describe('The type of plant (e.g., succulent, fern, etc.).'),
});
export type SuggestCareScheduleInput = z.infer<typeof SuggestCareScheduleInputSchema>;

const SuggestCareScheduleOutputSchema = z.object({
  careSchedule: z.string().describe('The suggested care schedule for the plant.'),
  additionalResources: z.string().describe('Links to additional resources for specialized subjects.'),
});
export type SuggestCareScheduleOutput = z.infer<typeof SuggestCareScheduleOutputSchema>;

export async function suggestCareSchedule(input: SuggestCareScheduleInput): Promise<SuggestCareScheduleOutput> {
  return suggestCareScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCareSchedulePrompt',
  input: {schema: SuggestCareScheduleInputSchema},
  output: {schema: SuggestCareScheduleOutputSchema},
  prompt: `You are an expert in plant care, providing optimal care schedules based on plant descriptions and images.

  Consider the plant's type, description, and appearance to suggest a comprehensive care schedule, including watering frequency, fertilization, pruning, and sunlight requirements.

  Provide general care information, acknowledging that individual factors like specific soil compositions or fertilizer brands may significantly alter appropriate routines.  Include links to additional sources on specialized subjects.

  Plant Name: {{{plantName}}}
  Plant Type: {{{plantType}}}
  Description: {{{plantDescription}}}
  Photo: {{media url=plantPhotoDataUri}}

  Care Schedule:
  `,
});

const suggestCareScheduleFlow = ai.defineFlow(
  {
    name: 'suggestCareScheduleFlow',
    inputSchema: SuggestCareScheduleInputSchema,
    outputSchema: SuggestCareScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
