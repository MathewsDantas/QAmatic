import Analysis from '../models/Analysis.js';

export const createAnalysis = async ({ url, instructions, userId }) => {
  const analysis = await Analysis.create({
    url,
    instructions,
    userId,
    status: 'analyzing',
  });

  // TODO: iniciar job de automação (Playwright + Gemini) em background
  // Por enquanto apenas cria o registro com status 'analyzing'

  return {
    id: analysis._id,
    url: analysis.url,
    instructions: analysis.instructions,
    status: analysis.status,
    createdAt: analysis.createdAt,
  };
};

export const getAnalysisById = async (id, userId) => {
  const analysis = await Analysis.findOne({ _id: id, userId });
  if (!analysis) {
    const error = new Error('Analysis not found');
    error.status = 404;
    throw error;
  }
  return analysis;
};
