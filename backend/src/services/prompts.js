export const instructionParserPrompt = (instructions) =>
  `Você é um analista de QA. Analise as instruções do usuário e transforme em objetivos de teste estruturados.

Instruções do usuário:
"""
${instructions}
"""

Retorne um JSON com a seguinte estrutura:
{
  "objectives": [
    {
      "id": 1,
      "description": "Descrição clara do objetivo de teste",
      "actions": ["ação específica 1", "ação específica 2"]
    }
  ]
}

Regras:
- Cada objetivo deve ser atômico e testável
- As ações devem ser específicas (ex: "preencher campo email", "clicar botão submit")
- Use verbos de ação: identificar, preencher, clicar, validar, verificar
- Ordene os objetivos pela sequência lógica de execução
- Retorne APENAS o JSON, sem explicações`;

export const testPlanPrompt = (objectives, interactiveMap) =>
  `Você é um engenheiro de automação de testes. Gere um plano de execução de testes baseado nos objetivos e nos elementos interativos disponíveis na página.

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
          "action": "navigate | click | fill | select | submit | press | wait | assert",
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
- Ações possíveis: navigate, click, fill, select, submit, press, wait, assert
- Para "press", use value com o nome da tecla (ex: "Enter", "Tab", "Escape")
- Sempre que houver uma ação de envio/submit, gere DOIS test cases separados: um usando "press" com "Enter" e outro usando "click" no botão de submit. Isso garante cobertura dos dois modos de interação
- O campo "value" é obrigatório para ações "fill" e "select", use valores de teste realistas
- Para "assert", o campo "value" DEVE seguir o formato tipado: "type:<tipo>" ou "type:<tipo>|<valor_esperado>"
- Tipos de asserção disponíveis:
  - "type:visible" — verifica se o elemento está visível na página
  - "type:enabled" — verifica se o elemento está habilitado
  - "type:exists" — verifica se o elemento existe no DOM
  - "type:contains|texto esperado" — verifica se o conteúdo do elemento contém o texto
  - "type:url_contains|trecho" — verifica se a URL da página contém o trecho (selector pode ser vazio)
- NUNCA use descrições em linguagem natural no campo "value" de um assert
- Exemplos corretos: "type:visible", "type:contains|Tradutor", "type:url_contains|search?q=teste"
- Ordene os steps pela sequência lógica de execução
- Retorne APENAS o JSON, sem explicações`;
