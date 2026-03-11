export const mapInteractiveElements = (domStructure) => {
  const { buttons, links, inputs, selects, forms } = domStructure;

  const clickable = [
    ...buttons.map((b) => ({
      action: 'click',
      element: 'button',
      text: b.text,
      selector: b.selector,
    })),
    ...links
      .filter((l) => l.href && !l.href.startsWith('javascript:'))
      .map((l) => ({
        action: 'click',
        element: 'link',
        text: l.text,
        selector: l.selector,
        href: l.href,
      })),
  ];

  const fillable = [
    ...inputs.map((i) => ({
      action: 'fill',
      element: 'input',
      inputType: i.inputType,
      label: i.label,
      placeholder: i.placeholder,
      selector: i.selector,
      required: i.required,
    })),
    ...selects.map((s) => ({
      action: 'select',
      element: 'select',
      label: s.label,
      selector: s.selector,
      options: s.options,
      required: s.required,
    })),
  ];

  const formGroups = forms.map((f) => ({
    action: 'submit',
    element: 'form',
    method: f.method,
    selector: f.selector,
    fieldCount: f.fieldCount,
  }));

  return {
    clickable,
    fillable,
    formGroups,
    summary: {
      totalClickable: clickable.length,
      totalFillable: fillable.length,
      totalForms: formGroups.length,
      totalInteractive: clickable.length + fillable.length,
    },
  };
};
