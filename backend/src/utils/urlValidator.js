export const validateUrl = (url) => {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return 'URL inválida.';
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return 'Apenas protocolos HTTP e HTTPS são suportados.';
  }

  return null;
};

export const checkUrlAccessible = async (url) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return `URL retornou status ${response.status}.`;
    }

    return null;
  } catch (err) {
    if (err.name === 'AbortError') {
      return 'URL não respondeu dentro do tempo limite (10s).';
    }
    return 'Não foi possível acessar a URL.';
  }
};
