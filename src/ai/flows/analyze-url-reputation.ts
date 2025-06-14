
'use server';

/**
 * @fileOverview Analyzes URLs in real-time to identify malicious patterns or domain age.
 *
 * - analyzeURLReputation - A function that handles the URL reputation analysis process.
 * - AnalyzeURLReputationInput - The input type for the analyzeURLReputation function.
 * - AnalyzeURLReputationOutput - The return type for the analyzeURLReputation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeURLReputationInputSchema = z.object({
  url: z.string().describe('The URL to analyze.'),
});
export type AnalyzeURLReputationInput = z.infer<typeof AnalyzeURLReputationInputSchema>;

const AnalyzeURLReputationOutputSchema = z.object({
  isMalicious: z.boolean().describe('Whether the URL is likely to be malicious.'),
  reputationScore: z.number().describe('A score indicating the reputation of the URL (0-100, 0 being highly malicious).'),
  explanation: z.string().describe('An explanation of why the URL is considered malicious or safe.'),
});
export type AnalyzeURLReputationOutput = z.infer<typeof AnalyzeURLReputationOutputSchema>;

export async function analyzeURLReputation(input: AnalyzeURLReputationInput): Promise<AnalyzeURLReputationOutput> {
  return analyzeURLReputationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeURLReputationPrompt',
  input: {schema: AnalyzeURLReputationInputSchema},
  output: {schema: AnalyzeURLReputationOutputSchema},
  prompt: `You are a cybersecurity expert analyzing URLs for malicious activity.

  Analyze the given URL and determine if it is likely to be a phishing attempt or otherwise malicious.
  Provide a reputation score from 0 to 100, where 0 is highly malicious and 100 is completely safe.
  Explain your reasoning in the explanation field.

  URL: {{{url}}}
  `,
});

const analyzeURLReputationFlow = ai.defineFlow(
  {
    name: 'analyzeURLReputationFlow',
    inputSchema: AnalyzeURLReputationInputSchema,
    outputSchema: AnalyzeURLReputationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
