import { chromium } from 'playwright';

export const launchBrowser = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  return { browser, context, page };
};

export const closeBrowser = async (browser) => {
  if (browser) {
    await browser.close();
  }
};
