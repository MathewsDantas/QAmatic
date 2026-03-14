import Analysis from '../models/Analysis.js';
import { launchBrowser, closeBrowser } from '../playwright/browserService.js';
import { navigateToUrl } from '../playwright/navigationService.js';
import { capturePageStructure } from './domParserService.js';
import { mapInteractiveElements } from './interactionMapper.js';
import { parseInstructions, generateTestPlan, analyzeResults } from './geminiService.js';
import { consolidateResults } from './resultConsolidator.js';
import { executeTestPlan } from '../playwright/testExecutor.js';
import { attachErrorMonitor } from '../playwright/errorMonitor.js';

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

const wrapStep = async (stepName, fn) => {
  try {
    return await fn();
  } catch (err) {
    const isTimeout = err.message?.includes('Timeout') || err.message?.includes('timeout');
    const prefix = isTimeout
      ? `Timeout em "${stepName}"`
      : `Falha em "${stepName}"`;
    const wrapped = new Error(`${prefix}: ${err.message}`);
    wrapped.step = stepName;
    throw wrapped;
  }
};

const runAnalysis = async (analysis) => {
  let browser = null;

  try {
    console.log(`[QAmatic] Iniciando análise ${analysis._id}...`);

    const { browser: b, page } = await wrapStep('Iniciar navegador', async () => {
      const result = await launchBrowser();
      console.log(`[QAmatic] Browser iniciado para análise ${analysis._id}`);
      return result;
    });
    browser = b;

    const { getErrors } = attachErrorMonitor(page);

    const navResult = await wrapStep('Acessar URL', async () => {
      const result = await navigateToUrl(page, analysis.url);
      console.log(`[QAmatic] Página carregada: ${result.title} (${result.status})`);
      return result;
    });

    const domStructure = await wrapStep('Capturar estrutura da página', async () => {
      const result = await capturePageStructure(page);
      console.log(`[QAmatic] DOM capturado: ${result.buttons.length} botões, ${result.links.length} links, ${result.inputs.length} inputs, ${result.forms.length} formulários`);
      return result;
    });

    const interactiveMap = await wrapStep('Mapear elementos interativos', () => {
      const result = mapInteractiveElements(domStructure);
      console.log(`[QAmatic] Elementos interativos: ${result.summary.totalInteractive} total`);
      return result;
    });

    const { objectives } = await wrapStep('Interpretar instruções com IA', async () => {
      const result = await parseInstructions(analysis.instructions);
      console.log(`[QAmatic] ${result.objectives.length} objetivos de teste gerados`);
      return result;
    });

    const { testPlan } = await wrapStep('Gerar plano de testes com IA', async () => {
      const result = await generateTestPlan(objectives, interactiveMap);
      console.log(`[QAmatic] Plano de testes gerado: ${result.testPlan.length} casos de teste`);
      return result;
    });

    const execution = await wrapStep('Executar testes', async () => {
      console.log(`[QAmatic] Executando testes...`);
      const result = await executeTestPlan(page, testPlan, analysis.url, analysis._id);
      console.log(`[QAmatic] Execução finalizada: ${result.summary.passed}/${result.summary.total} passaram`);
      return result;
    });

    const monitoredErrors = getErrors();
    if (monitoredErrors.summary.total > 0) {
      console.log(`[QAmatic] Erros detectados: ${monitoredErrors.summary.totalJsErrors} JS, ${monitoredErrors.summary.totalConsoleErrors} console, ${monitoredErrors.summary.totalRequestFailures} requests`);
    }

    const consolidated = await wrapStep('Consolidar resultados', () => {
      const result = consolidateResults(execution, monitoredErrors, testPlan);
      console.log(`[QAmatic] Resultados consolidados: ${result.errors.totalErrors} erros, ${result.evidence.length} evidências`);
      return result;
    });

    const aiAnalysis = await wrapStep('Analisar resultados com IA', async () => {
      const result = await analyzeResults(consolidated);
      console.log(`[QAmatic] Análise IA concluída: ${result.overallStatus} (score: ${result.overallScore})`);
      return result;
    });

    await analysis.updateOne({
      status: 'completed',
      result: {
        navigation: navResult,
        domStructure,
        interactiveMap,
        objectives,
        testPlan,
        execution,
        monitoredErrors,
        consolidated,
        aiAnalysis,
      },
    });
    console.log(`[QAmatic] Análise ${analysis._id} concluída`);
  } catch (err) {
    console.error(`[QAmatic] Erro na análise ${analysis._id} [${err.step || 'desconhecido'}]:`, err.message);
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
