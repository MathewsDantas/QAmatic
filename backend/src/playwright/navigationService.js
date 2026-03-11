const NAVIGATION_TIMEOUT = 30000;

export const navigateToUrl = async (page, url) => {
  const response = await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: NAVIGATION_TIMEOUT,
  });

  if (!response) {
    throw new Error(`Nenhuma resposta ao acessar ${url}.`);
  }

  if (!response.ok() && response.status() !== 304) {
    throw new Error(`Página retornou status ${response.status()}.`);
  }

  return {
    status: response.status(),
    url: page.url(),
    title: await page.title(),
  };
};
