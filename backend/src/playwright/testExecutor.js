import AnalysisLog from "../models/AnalysisLog.js";
import { captureScreenshot, capturePageState } from "./evidenceService.js";

const STEP_TIMEOUT = 10000;

// Delay aleatório para simular comportamento humano
const humanDelay = (min = 300, max = 800) =>
  new Promise((r) =>
    setTimeout(r, Math.floor(Math.random() * (max - min)) + min),
  );

// Scroll suave até o elemento antes de interagir
const scrollToElement = async (page, locator) => {
  try {
    await locator.evaluate((el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    await humanDelay(400, 700);
  } catch {
    // elemento pode não estar visível ainda
  }
};

// Digitação caractere a caractere com velocidade variável
const humanType = async (page, locator, text) => {
  await locator.click();
  await locator.fill("");
  for (const char of text) {
    await page.keyboard.type(char, {
      delay: Math.floor(Math.random() * 100) + 30,
    });
  }
};

// Encontra o primeiro elemento visível quando há múltiplos com mesmo seletor
const findVisibleElement = async (page, selector) => {
  const locator = page.locator(selector);
  const count = await locator.count();

  if (count > 1) {
    for (let i = 0; i < count; i++) {
      const el = locator.nth(i);
      if (await el.isVisible()) return el;
    }
  }

  return locator.first();
};

// Parse do formato tipado: "type:visible", "type:contains|Tradutor"
const parseAssertionValue = (value) => {
  if (!value) return { type: "exists", expected: null };

  const match = value.match(/^type:(\w+)(?:\|(.+))?$/);
  if (match) {
    return { type: match[1].toLowerCase(), expected: match[2] || null };
  }

  return { type: "legacy_contains", expected: value };
};

const executeStep = async (page, step) => {
  const startTime = Date.now();

  try {
    switch (step.action) {
      case "navigate":
        await page.goto(step.value || step.selector, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        await humanDelay(500, 1000);
        break;

      case "click": {
        const clickTarget = await findVisibleElement(page, step.selector);
        await scrollToElement(page, clickTarget);
        await humanDelay(200, 500);
        await clickTarget.click({ timeout: STEP_TIMEOUT });
        await humanDelay(300, 600);
        break;
      }

      case "press":
        await humanDelay(200, 400);
        await page.keyboard.press(step.value || "Enter");
        await humanDelay(300, 600);
        break;

      case "fill": {
        const fillTarget = page.locator(step.selector).first();
        await scrollToElement(page, fillTarget);
        await humanDelay(200, 400);
        await humanType(page, fillTarget, step.value || "");
        await humanDelay(200, 500);
        break;
      }

      case "select": {
        const selectTarget = page.locator(step.selector).first();
        await scrollToElement(page, selectTarget);
        await humanDelay(200, 400);
        await selectTarget.selectOption(step.value || "", {
          timeout: STEP_TIMEOUT,
        });
        await humanDelay(300, 600);
        break;
      }

      case "submit": {
        const submitTarget = page.locator(step.selector).first();
        await scrollToElement(page, submitTarget);
        await humanDelay(200, 400);
        await submitTarget.evaluate((form) => form.submit());
        await humanDelay(500, 1000);
        break;
      }

      case "wait":
        await page.waitForTimeout(parseInt(step.value, 10) || 1000);
        break;

      case "assert": {
        const assertion = parseAssertionValue(step.value);
        let passed = false;
        let actual = "";

        switch (assertion.type) {
          case "visible": {
            const el = page.locator(step.selector).first();
            await scrollToElement(page, el);
            passed = await el.isVisible({ timeout: STEP_TIMEOUT });
            actual = passed ? "visible" : "not visible";
            break;
          }
          case "enabled": {
            const el = page.locator(step.selector).first();
            await scrollToElement(page, el);
            passed = await el.isEnabled({ timeout: STEP_TIMEOUT });
            actual = passed ? "enabled" : "disabled";
            break;
          }
          case "exists": {
            const count = await page.locator(step.selector).count();
            passed = count > 0;
            actual = `${count} element(s) found`;
            break;
          }
          case "contains": {
            const el = page.locator(step.selector).first();
            await scrollToElement(page, el);
            const text = await el.innerText({ timeout: STEP_TIMEOUT });
            actual = (text || "").substring(0, 200);
            passed = text != null && text.includes(assertion.expected || "");
            break;
          }
          case "url_contains": {
            const currentUrl = page.url();
            actual = currentUrl;
            passed = currentUrl.includes(assertion.expected || "");
            break;
          }
          default: {
            const el = page.locator(step.selector).first();
            await scrollToElement(page, el);
            const text = await el.innerText({ timeout: STEP_TIMEOUT });
            actual = (text || "").substring(0, 200);
            passed = text != null && text.includes(assertion.expected || "");
            break;
          }
        }

        return {
          order: step.order,
          action: step.action,
          selector: step.selector,
          value: step.value,
          description: step.description,
          status: passed ? "passed" : "failed",
          expected: step.value,
          actual,
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
          status: "skipped",
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
      status: "passed",
      duration: Date.now() - startTime,
    };
  } catch (err) {
    return {
      order: step.order,
      action: step.action,
      selector: step.selector,
      value: step.value,
      description: step.description,
      status: "failed",
      error: err.message,
      duration: Date.now() - startTime,
    };
  }
};

const saveLog = async (
  analysisId,
  testCase,
  stepResult,
  screenshot,
  pageUrl,
) => {
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
      await page.waitForLoadState("domcontentloaded").catch(() => {});
      await page.waitForTimeout(800);

      screenshot = await captureScreenshot(
        page,
        analysisId,
        testCase.id,
        step.order,
      );
      const state = await capturePageState(page);
      pageUrl = state.url;
    } catch {
      // screenshot pode falhar se o browser já fechou
    }

    result.screenshot = screenshot;
    results.push(result);

    // await saveLog(analysisId, testCase, result, screenshot, pageUrl);

    if (result.status === "failed" && step.action !== "assert") {
      break;
    }
  }

  const passed = results.every((r) => r.status === "passed");

  return {
    id: testCase.id,
    name: testCase.name,
    objectiveId: testCase.objectiveId,
    status: passed ? "passed" : "failed",
    steps: results,
    summary: {
      total: results.length,
      passed: results.filter((r) => r.status === "passed").length,
      failed: results.filter((r) => r.status === "failed").length,
      skipped: results.filter((r) => r.status === "skipped").length,
    },
  };
};

export const executeTestPlan = async (page, testPlan, url, analysisId) => {
  const results = [];

  for (const testCase of testPlan) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const result = await executeTestCase(page, testCase, analysisId);
    results.push(result);
    console.log(
      `[QAmatic]   ${result.status === "passed" ? "✓" : "✗"} ${result.name}`,
    );
  }

  const totalPassed = results.filter((r) => r.status === "passed").length;

  return {
    results,
    summary: {
      total: results.length,
      passed: totalPassed,
      failed: results.length - totalPassed,
    },
  };
};
