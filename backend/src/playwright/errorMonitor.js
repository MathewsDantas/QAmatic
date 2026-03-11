export const attachErrorMonitor = (page) => {
  const errors = {
    jsErrors: [],
    consoleErrors: [],
    requestFailures: [],
  };

  page.on('pageerror', (err) => {
    errors.jsErrors.push({
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.consoleErrors.push({
        text: msg.text(),
        timestamp: new Date().toISOString(),
      });
    }
  });

  page.on('requestfailed', (request) => {
    errors.requestFailures.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure()?.errorText || 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  });

  const getErrors = () => ({
    ...errors,
    summary: {
      totalJsErrors: errors.jsErrors.length,
      totalConsoleErrors: errors.consoleErrors.length,
      totalRequestFailures: errors.requestFailures.length,
      total: errors.jsErrors.length + errors.consoleErrors.length + errors.requestFailures.length,
    },
  });

  return { getErrors };
};
