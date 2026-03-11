import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.resolve(__dirname, '../../screenshots');

const ensureDir = async () => {
  await fs.mkdir(SCREENSHOTS_DIR, { recursive: true });
};

export const captureScreenshot = async (page, analysisId, testCaseId, stepOrder) => {
  await ensureDir();

  const filename = `${analysisId}_tc${testCaseId}_step${stepOrder}_${Date.now()}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);

  await page.screenshot({ path: filepath, fullPage: false });

  return filename;
};

export const capturePageState = async (page) => {
  return {
    url: page.url(),
    title: await page.title(),
  };
};
