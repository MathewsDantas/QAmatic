import AnalysisLog from '../models/AnalysisLog.js';
import { captureScreenshot, capturePageState } from './evidenceService.js';

const STEP_TIMEOUT = 10000;

const executeStep = async (page, step) => {
  const startTime = Date.now();

  try {
    switch (step.action) {
      case 'navigate':
        await page.goto(step.value || step.selector, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        });
        break;

      case 'click':
        await page.locator(step.selector).first().click({ timeout: STEP_TIMEOUT });
        break;

      case 'fill':
        await page.locator(step.selector).first().fill(step.value || '', { timeout: STEP_TIMEOUT });
        break;

      case 'select':
        await page.locator(step.selector).first().selectOption(step.value || '', { timeout: STEP_TIMEOUT });
        break;

      case 'submit':
        await page.locator(step.selector).first().evaluate((form) => form.submit());
        break;

      case 'wait':
        await page.waitForTimeout(parseInt(step.value, 10) || 1000);
        break;

      case 'assert': {
        const element = page.locator(step.selector).first();
        const text = await element.textContent({ timeout: STEP_TIMEOUT });
        const passed = text && text.includes(step.value);
        return {
          order: step.order,
          action: step.action,
          selector: step.selector,
          value: step.value,
          description: step.description,
          status: passed ? 'passed' : 'failed',
          expected: step.value,
          actual: (text || '').substring(0, 200),
          duration: Date.now() - startTime,
        };
      }

      default:
        return {
          order: step.order,
          action: step.action,
          selector: step.selector,
          value: step.value,
          description: step.description,
          status: 'skipped',
          error: `Ação desconhecida: ${step.action}`,
          duration: 0,
        };
    }

    return {
      order: step.order,
      action: step.action,
      selector: step.selector,
      value: step.value,
      description: step.description,
      status: 'passed',
      duration: Date.now() - startTime,
    };
  } catch (err) {
    return {
      order: step.order,
      action: step.action,
      selector: step.selector,
      value: step.value,
      description: step.description,
      status: 'failed',
      error: err.message,
      duration: Date.now() - startTime,
    };
  }
};

const saveLog = async (analysisId, testCase, stepResult, screenshot, pageUrl) => {
  try {
    await AnalysisLog.create({
      analysisId,
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      stepOrder: stepResult.order,
      action: stepResult.action,
      selector: stepResult.selector || null,
      value: stepResult.value || null,
      description: stepResult.description,
      status: stepResult.status,
      error: stepResult.error || null,
      duration: stepResult.duration,
      screenshot,
      pageUrl,
    });
  } catch (err) {
    console.error(`[QAmatic] Erro ao salvar log:`, err.message);
  }
};

export const executeTestCase = async (page, testCase, analysisId) => {
  const results = [];

  for (const step of testCase.steps) {
    const result = await executeStep(page, step);

    // Aguarda a página estabilizar antes do screenshot
    let screenshot = null;
    let pageUrl = null;
    try {
      await page.waitForLoadState('domcontentloaded').catch(() => {});
      await page.waitForTimeout(800);

      screenshot = await captureScreenshot(page, analysisId, testCase.id, step.order);
      const state = await capturePageState(page);
      pageUrl = state.url;
    } catch {
      // screenshot pode falhar se o browser já fechou
    }

    result.screenshot = screenshot;
    results.push(result);

    await saveLog(analysisId, testCase, result, screenshot, pageUrl);

    if (result.status === 'failed' && step.action !== 'assert') {
      break;
    }
  }

  const passed = results.every((r) => r.status === 'passed');

  return {
    id: testCase.id,
    name: testCase.name,
    objectiveId: testCase.objectiveId,
    status: passed ? 'passed' : 'failed',
    steps: results,
    summary: {
      total: results.length,
      passed: results.filter((r) => r.status === 'passed').length,
      failed: results.filter((r) => r.status === 'failed').length,
      skipped: results.filter((r) => r.status === 'skipped').length,
    },
  };
};

export const executeTestPlan = async (page, testPlan, url, analysisId) => {
  const results = [];

  for (const testCase of testPlan) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const result = await executeTestCase(page, testCase, analysisId);
    results.push(result);
    console.log(`[QAmatic]   ${result.status === 'passed' ? '✓' : '✗'} ${result.name}`);
  }

  const totalPassed = results.filter((r) => r.status === 'passed').length;

  return {
    results,
    summary: {
      total: results.length,
      passed: totalPassed,
      failed: results.length - totalPassed,
    },
  };
};
