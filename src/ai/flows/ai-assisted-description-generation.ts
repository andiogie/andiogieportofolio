'use server';
/**
 * @fileOverview AI assistant to refine descriptions for work experience or projects.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIAssistedDescriptionInputSchema = z.object({
  originalDescription: z.string().optional(),
  contextType: z.enum(['work-experience', 'portfolio-project']),
  contextDetails: z.object({
    companyName: z.string().optional(),
    position: z.string().optional(),
    projectName: z.string().optional(),
    technologiesUsed: z.string().optional(),
  }),
});
export type AIAssistedDescriptionInput = z.infer<typeof AIAssistedDescriptionInputSchema>;

const AIAssistedDescriptionOutputSchema = z.object({
  generatedDescription: z.string(),
});
export type AIAssistedDescriptionOutput = z.infer<typeof AIAssistedDescriptionOutputSchema>;

const prompt = ai.definePrompt({
  name: 'aiAssistedDescriptionPrompt',
  input: { schema: AIAssistedDescriptionInputSchema },
  output: { schema: AIAssistedDescriptionOutputSchema },
  prompt: `You are a professional resume writer. Refine this description.

Context: {{contextType}}
Subject: {{contextDetails.projectName}}{{contextDetails.companyName}}
Role: {{contextDetails.position}}
Current: {{originalDescription}}

Instructions:
1. Make it professional and achievement-oriented.
2. Use strong action verbs.
3. Keep it under 3 sentences.`,
});

export async function aiAssistedDescriptionGeneration(input: AIAssistedDescriptionInput): Promise<AIAssistedDescriptionOutput> {
  try {
    const { output } = await prompt(input);
    return output!;
  } catch (error) {
    console.error('GenAI Flow Error:', error);
    return { generatedDescription: input.originalDescription || "AI generation failed. Please check your API key." };
  }
}
