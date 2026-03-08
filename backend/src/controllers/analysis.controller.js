import * as analysisService from '../services/analysis.service.js';
import { validateUrl, checkUrlAccessible } from '../utils/urlValidator.js';

export const startAnalysis = async (req, res, next) => {
  try {
    const { url, instructions } = req.body;

    if (!url || !instructions) {
      const error = new Error('URL and instructions are required');
      error.status = 400;
      throw error;
    }

    const formatError = validateUrl(url);
    if (formatError) {
      const error = new Error(formatError);
      error.status = 400;
      throw error;
    }

    const accessError = await checkUrlAccessible(url);
    if (accessError) {
      const error = new Error(accessError);
      error.status = 422;
      throw error;
    }

    const result = await analysisService.createAnalysis({
      url,
      instructions,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await analysisService.getAnalysisById(
      req.params.id,
      req.user.id
    );
    res.json({ success: true, data: analysis });
  } catch (error) {
    next(error);
  }
};
