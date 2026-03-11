import { generateJSON } from './geminiService.js';

export const generateTestPlan = async (objectives, interactiveMap) => {
  const prompt = `Você é um engenheiro de automação de testes. Gere um plano de execução de testes baseado nos objetivos e nos elementos interativos disponíveis na página.

Objetivos de teste:
${JSON.stringify(objectives, null, 2)}

Elementos interativos disponíveis na página:
${JSON.stringify(interactiveMap, null, 2)}

Retorne um JSON com a seguinte estrutura:
{
  "testPlan": [
    {
      "id": 1,
      "objectiveId": 1,
      "name": "Nome do caso de teste",
      "steps": [
        {
          "order": 1,
          "action": "navigate | click | fill | select | submit | wait | assert",
          "selector": "seletor CSS do elemento (usar os seletores dos elementos disponíveis)",
          "value": "valor a preencher (se aplicável)",
          "description": "descrição legível da ação"
        }
      ]
    }
  ]
}

Regras:
- Use APENAS os seletores que existem nos elementos interativos fornecidos
- Cada step deve ter uma ação clara e executável pelo Playwright
- Ações possíveis: navigate, click, fill, select, submit, wait, assert
- O campo "value" é obrigatório para ações "fill" e "select", use valores de teste realistas
- Para "assert", use value como a condição esperada (ex: "visível", "contém texto X")
- Ordene os steps pela sequência lógica de execução
- Retorne APENAS o JSON, sem explicações`;

  return await generateJSON(prompt);
};
