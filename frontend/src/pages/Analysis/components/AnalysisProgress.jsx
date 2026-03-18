import { useEffect, useState, useRef } from 'react';
import { Typography, Flex } from 'antd';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

const { Text } = Typography;

const STEPS = [
  { label: 'Iniciando navegador', duration: 3000 },
  { label: 'Acessando URL', duration: 5000 },
  { label: 'Capturando estrutura da p\u00e1gina', duration: 5000 },
  { label: 'Mapeando elementos interativos', duration: 3000 },
  { label: 'Interpretando instru\u00e7\u00f5es com IA', duration: 8000 },
  { label: 'Gerando plano de testes', duration: 8000 },
  { label: 'Executando testes', duration: 20000 },
  { label: 'Consolidando resultados', duration: 3000 },
  { label: 'Analisando resultados com IA', duration: 8000 },
];

const AnalysisProgress = ({ isActive, isCompleted }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isActive || isCompleted) return;

    let step = 0;
    const advance = () => {
      step += 1;
      if (step < STEPS.length) {
        setCurrentStep(step);
        timerRef.current = setTimeout(advance, STEPS[step].duration);
      }
    };

    timerRef.current = setTimeout(advance, STEPS[0].duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, isCompleted]);

  useEffect(() => {
    if (isCompleted) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setCurrentStep(STEPS.length);
    }
  }, [isCompleted]);

  return (
    <Flex vertical gap={4} style={{ padding: '16px 0' }}>
      {STEPS.map((step, index) => {
        const isDone = isCompleted || index < currentStep;
        const isCurrent = !isCompleted && index === currentStep;

        return (
          <Flex
            key={step.label}
            align="center"
            gap={12}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              backgroundColor: isCurrent ? '#EFF6FF' : 'transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <span style={{ display: 'inline-flex', flexShrink: 0 }}>
              {isDone ? (
                <CheckCircle2 size={18} color="#22C55E" />
              ) : isCurrent ? (
                <Loader2
                  size={18}
                  color="#2563EB"
                  style={{ animation: 'spin 1s linear infinite' }}
                />
              ) : (
                <Circle size={18} color="#D1D5DB" />
              )}
            </span>
            <Text
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: isDone ? '#22C55E' : isCurrent ? '#2563EB' : '#9CA3AF',
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              {step.label}
            </Text>
          </Flex>
        );
      })}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Flex>
  );
};

export default AnalysisProgress;
