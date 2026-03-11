export const capturePageStructure = async (page) => {
  return await page.evaluate(() => {
    const getSelector = (el) => {
      if (el.id) return `#${el.id}`;
      if (el.name) return `[name="${el.name}"]`;
      if (el.className && typeof el.className === 'string') {
        const cls = el.className.trim().split(/\s+/).slice(0, 2).join('.');
        if (cls) return `${el.tagName.toLowerCase()}.${cls}`;
      }
      return el.tagName.toLowerCase();
    };

    const getLabel = (el) => {
      if (el.id) {
        const label = document.querySelector(`label[for="${el.id}"]`);
        if (label) return label.textContent.trim();
      }
      const parent = el.closest('label');
      if (parent) return parent.textContent.trim();
      if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
      if (el.placeholder) return el.placeholder;
      return '';
    };

    const getText = (el) => {
      return (el.textContent || el.value || el.getAttribute('aria-label') || '').trim().substring(0, 100);
    };

    const buttons = [...document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"]')].map((el) => ({
      type: 'button',
      text: getText(el),
      selector: getSelector(el),
      tag: el.tagName.toLowerCase(),
    }));

    const links = [...document.querySelectorAll('a[href]')].map((el) => ({
      type: 'link',
      text: getText(el),
      href: el.getAttribute('href'),
      selector: getSelector(el),
    }));

    const inputs = [...document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea')].map((el) => ({
      type: 'input',
      inputType: el.type || 'text',
      label: getLabel(el),
      placeholder: el.placeholder || '',
      selector: getSelector(el),
      required: el.required,
    }));

    const selects = [...document.querySelectorAll('select')].map((el) => ({
      type: 'select',
      label: getLabel(el),
      selector: getSelector(el),
      options: [...el.options].slice(0, 10).map((o) => o.textContent.trim()),
      required: el.required,
    }));

    const forms = [...document.querySelectorAll('form')].map((el) => ({
      type: 'form',
      action: el.action || '',
      method: el.method || 'get',
      selector: getSelector(el),
      fieldCount: el.elements.length,
    }));

    return { buttons, links, inputs, selects, forms };
  });
};
