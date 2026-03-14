export const consolidateResults = (execution, monitoredErrors, testPlan) => {
  const allSteps = execution.results.flatMap((tc) => tc.steps);

  const summary = {
    totalTestCases: execution.results.length,
    passed: execution.summary.passed,
    failed: execution.summary.failed,
    totalSteps: allSteps.length,
    stepsPassed: allSteps.filter((s) => s.status === 'passed').length,
    stepsFailed: allSteps.filter((s) => s.status === 'failed').length,
    stepsSkipped: allSteps.filter((s) => s.status === 'skipped').length,
  };

  const executionErrors = [];
  for (const tc of execution.results) {
    for (const step of tc.steps) {
      if (step.status === 'failed' && step.error) {
        executionErrors.push({
          testCaseId: tc.id,
          testCaseName: tc.name,
          stepOrder: step.order,
          action: step.action,
          selector: step.selector,
          description: step.description,
          error: step.error,
        });
      }
    }
  }

  const errors = {
    executionErrors,
    jsErrors: monitoredErrors.jsErrors,
    consoleErrors: monitoredErrors.consoleErrors,
    requestFailures: monitoredErrors.requestFailures,
    totalErrors: executionErrors.length + monitoredErrors.summary.total,
  };

  const evidence = [];
  for (const tc of execution.results) {
    for (const step of tc.steps) {
      if (step.screenshot) {
        evidence.push({
          testCaseId: tc.id,
          testCaseName: tc.name,
          stepOrder: step.order,
          status: step.status,
          screenshot: step.screenshot,
        });
      }
    }
  }

  const testCases = execution.results.map((tc) => ({
    id: tc.id,
    name: tc.name,
    objectiveId: tc.objectiveId,
    status: tc.status,
    totalSteps: tc.summary.total,
    passed: tc.summary.passed,
    failed: tc.summary.failed,
    skipped: tc.summary.skipped,
    failedSteps: tc.steps
      .filter((s) => s.status === 'failed')
      .map((s) => ({
        order: s.order,
        action: s.action,
        selector: s.selector,
        description: s.description,
        error: s.error || null,
        expected: s.expected || null,
        actual: s.actual || null,
        screenshot: s.screenshot || null,
      })),
  }));

  return { summary, errors, evidence, testCases };
};
