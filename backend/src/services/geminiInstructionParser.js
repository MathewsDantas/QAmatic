import { generateJSON } from './geminiService.js';

export const parseInstructions = async (instructions) => {
  const prompt = `Você é um analista de QA. Analise as instruções do usuário e transforme em objetivos de teste estruturados.

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

  return await generateJSON(prompt);
};
