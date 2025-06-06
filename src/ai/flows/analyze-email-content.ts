// src/ai/flows/analyze-email-content.ts
'use server';

/**
 * @fileOverview Email content analyzer for phishing detection.
 *
 * - analyzeEmailContent - Analyzes email content and classifies it as legitimate or phishing.
 * - AnalyzeEmailContentInput - The input type for the analyzeEmailContent function.
 * - AnalyzeEmailContentOutput - The return type for the analyzeEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEmailContentInputSchema = z.object({
  emailContent: z.string().describe('The content of the email to analyze.'),
});
export type AnalyzeEmailContentInput = z.infer<typeof AnalyzeEmailContentInputSchema>;

const AnalyzeEmailContentOutputSchema = z.object({
  isPhishing: z.boolean().describe('Whether the email is classified as phishing (true) or legitimate (false).'),
  confidenceScore: z.number().describe('A score between 0 and 1 indicating the confidence level of the classification.'),
  reason: z.string().describe('The reasoning behind the classification.'),
});
export type AnalyzeEmailContentOutput = z.infer<typeof AnalyzeEmailContentOutputSchema>;

export async function analyzeEmailContent(input: AnalyzeEmailContentInput): Promise<AnalyzeEmailContentOutput> {
  return analyzeEmailContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEmailContentPrompt',
  input: {schema: AnalyzeEmailContentInputSchema},
  output: {schema: AnalyzeEmailContentOutputSchema},
  prompt: `You are an expert in identifying phishing emails. Analyze the following email content and determine if it is a phishing attempt.

Email Content: {{{emailContent}}}

Based on your analysis, classify the email as either phishing or legitimate and provide a confidence score and reason for your classification.  The confidence score should be between 0 and 1.

Consider factors such as suspicious links, urgent requests, grammatical errors, and mismatched sender information.

Output a JSON object that follows the schema.`,
});

const analyzeEmailContentFlow = ai.defineFlow(
  {
    name: 'analyzeEmailContentFlow',
    inputSchema: AnalyzeEmailContentInputSchema,
    outputSchema: AnalyzeEmailContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
