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
          description: step.description,
          status: 'skipped',
          message: `Ação desconhecida: ${step.action}`,
          duration: 0,
        };
    }

    return {
      order: step.order,
      action: step.action,
      description: step.description,
      status: 'passed',
      duration: Date.now() - startTime,
    };
  } catch (err) {
    return {
      order: step.order,
      action: step.action,
      description: step.description,
      status: 'failed',
      error: err.message,
      duration: Date.now() - startTime,
    };
  }
};

export const executeTestCase = async (page, testCase) => {
  const results = [];

  for (const step of testCase.steps) {
    const result = await executeStep(page, step);
    results.push(result);

    // Se um step falha (exceto assert), para a execução do caso
    if (result.status === 'failed' && step.action !== 'assert') {
      break;
    }
  }

  const passed = results.every((r) => r.status === 'passed');
  const failed = results.filter((r) => r.status === 'failed').length;

  return {
    id: testCase.id,
    name: testCase.name,
    objectiveId: testCase.objectiveId,
    status: passed ? 'passed' : 'failed',
    steps: results,
    summary: {
      total: results.length,
      passed: results.filter((r) => r.status === 'passed').length,
      failed,
      skipped: results.filter((r) => r.status === 'skipped').length,
    },
  };
};

export const executeTestPlan = async (page, testPlan, url) => {
  const results = [];

  for (const testCase of testPlan) {
    // Navega de volta à URL original antes de cada caso de teste
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const result = await executeTestCase(page, testCase);
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
