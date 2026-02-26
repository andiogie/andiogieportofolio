import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Fail-safe initialization for Genkit
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || 'missing_api_key_placeholder',
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
