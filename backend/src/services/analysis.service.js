import Analysis from '../models/Analysis.js';
import { launchBrowser, closeBrowser } from '../playwright/browserService.js';
import { navigateToUrl } from '../playwright/navigationService.js';
import { capturePageStructure } from './domParserService.js';
import { mapInteractiveElements } from './interactionMapper.js';

export const createAnalysis = async ({ url, instructions, userId }) => {
  const analysis = await Analysis.create({
    url,
    instructions,
    userId,
    status: 'analyzing',
  });

  runAnalysis(analysis);

  return {
    id: analysis._id,
    url: analysis.url,
    instructions: analysis.instructions,
    status: analysis.status,
    createdAt: analysis.createdAt,
  };
};

const runAnalysis = async (analysis) => {
  let browser = null;

  try {
    console.log(`[QAmatic] Iniciando análise ${analysis._id}...`);

    const { browser: b, page } = await launchBrowser();
    browser = b;
    console.log(`[QAmatic] Browser iniciado para análise ${analysis._id}`);

    const navResult = await navigateToUrl(page, analysis.url);
    console.log(`[QAmatic] Página carregada: ${navResult.title} (${navResult.status})`);

    const domStructure = await capturePageStructure(page);
    console.log(`[QAmatic] DOM capturado: ${domStructure.buttons.length} botões, ${domStructure.links.length} links, ${domStructure.inputs.length} inputs, ${domStructure.forms.length} formulários`);

    const interactiveMap = mapInteractiveElements(domStructure);
    console.log(`[QAmatic] Elementos interativos: ${interactiveMap.summary.totalInteractive} total`);

    // TODO: enviar domStructure + interactiveMap para o agente IA (Gemini)

    await analysis.updateOne({
      status: 'completed',
      result: { navigation: navResult, domStructure, interactiveMap },
    });
    console.log(`[QAmatic] Análise ${analysis._id} concluída`);
  } catch (err) {
    console.error(`[QAmatic] Erro na análise ${analysis._id}:`, err.message);
    await analysis.updateOne({
      status: 'error',
      errorMessage: err.message,
    });
  } finally {
    await closeBrowser(browser);
  }
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
