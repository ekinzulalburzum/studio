'use server';
/**
 * @fileOverview An AI assistant for providing information and recommendations on lamb health, nutrition, and general care.
 *
 * - lambHealthAssistant - A function that provides advice on lamb health.
 * - LambHealthAssistantInput - The input type for the lambHealthAssistant function.
 * - LambHealthAssistantOutput - The return type for the lambHealthAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LambHealthAssistantInputSchema = z.object({
  question: z.string().describe('The user\'s question about lamb health, nutrition, or general care.'),
});
export type LambHealthAssistantInput = z.infer<typeof LambHealthAssistantInputSchema>;

const LambHealthAssistantOutputSchema = z.object({
  answer: z.string().describe('A comprehensive answer and recommendation based on the user\'s question.'),
});
export type LambHealthAssistantOutput = z.infer<typeof LambHealthAssistantOutputSchema>;

export async function lambHealthAssistant(input: LambHealthAssistantInput): Promise<LambHealthAssistantOutput> {
  return lambHealthAssistantFlow(input);
}

const lambHealthAssistantPrompt = ai.definePrompt({
  name: 'lambHealthAssistantPrompt',
  input: {schema: LambHealthAssistantInputSchema},
  output: {schema: LambHealthAssistantOutputSchema},
  prompt: `You are an expert assistant specializing in lamb health, nutrition, and general care. Your goal is to provide accurate, helpful, and comprehensive information and recommendations to lamb owners.

User's Question: {{{question}}}`,
});

const lambHealthAssistantFlow = ai.defineFlow(
  {
    name: 'lambHealthAssistantFlow',
    inputSchema: LambHealthAssistantInputSchema,
    outputSchema: LambHealthAssistantOutputSchema,
  },
  async input => {
    const {output} = await lambHealthAssistantPrompt(input);
    return output!;
  }
);
