import { GoogleGenerativeAI } from '@google/generative-ai';
import { instructionParserPrompt, testPlanPrompt, resultsAnalysisPrompt } from './prompts.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MAX_RETRIES = 3;

const cleanJSON = (text) => {
  let cleaned = text.trim();

  // Remove markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  // Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  return cleaned;
};

export const generateJSON = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = cleanJSON(text);

      return JSON.parse(cleaned);
    } catch (err) {
      lastError = err;
      console.warn(`[QAmatic] Gemini JSON parse falhou (tentativa ${attempt}/${MAX_RETRIES}):`, err.message);

      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw new Error(`Falha ao processar resposta da IA após ${MAX_RETRIES} tentativas: ${lastError.message}`);
};

export const parseInstructions = async (instructions) => {
  return await generateJSON(instructionParserPrompt(instructions));
};

export const generateTestPlan = async (objectives, interactiveMap) => {
  return await generateJSON(testPlanPrompt(objectives, interactiveMap));
};

export const analyzeResults = async (consolidatedResults) => {
  return await generateJSON(resultsAnalysisPrompt(consolidatedResults));
};
