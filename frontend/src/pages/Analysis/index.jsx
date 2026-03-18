import { Typography, Card, Button, Flex, Divider } from 'antd';
import { Play, RotateCcw } from 'lucide-react';
import useAnalysis from './useAnalysis';
import useHistoryStore from '../../store/useHistoryStore';
import UrlInput from './components/UrlInput';
import TestInstructions from './components/TestInstructions';
import AnalysisProgress from './components/AnalysisProgress';
import RecentAnalysesList from './components/RecentAnalysesList';
import PageContainer from '../../components/PageContainer';

const { Title, Paragraph, Text } = Typography;

const Analysis = () => {
  const {
    url,
    instructions,
    errors,
    status,
    isLoading,
    handleUrlChange,
    handleInstructionsChange,
    handleSubmit,
    handleReset,
  } = useAnalysis();

  const entries = useHistoryStore((state) => state.entries);
  const isAnalyzing = status === 'analyzing';
  const isCompleted = status === 'completed';

  if (isAnalyzing) {
    return (
      <PageContainer maxWidth={600}>
        <Flex vertical align="center" gap="middle">
          <Title level={3} style={{ margin: 0 }}>
            Análise em andamento
          </Title>
          <Paragraph type="secondary" style={{ margin: 0, textAlign: 'center' }}>
            Aguarde enquanto executamos os testes automatizados...
          </Paragraph>
        </Flex>

        <Card style={{ marginTop: 24 }}>
          <AnalysisProgress isActive isCompleted={false} />
        </Card>

        <Flex justify="center" style={{ marginTop: 16 }}>
          <Button
            icon={<RotateCcw size={16} />}
            onClick={handleReset}
          >
            Cancelar
          </Button>
        </Flex>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth={720}>
      <Title level={2} style={{ marginBottom: 4 }}>
        Nova Análise
      </Title>
      <Paragraph type="secondary">
        Informe a URL do sistema e descreva o que deseja testar.
      </Paragraph>

      <Card>
        <Flex vertical gap="middle">
          <div>
            <Text strong>URL do sistema</Text>
            <div style={{ marginTop: 8 }}>
              <UrlInput
                url={url}
                error={errors.url}
                onUrlChange={handleUrlChange}
              />
            </div>
          </div>
          <div>
            <Text strong>O que vamos testar?</Text>
            <div style={{ marginTop: 8 }}>
              <TestInstructions
                instructions={instructions}
                error={errors.instructions}
                onInstructionsChange={handleInstructionsChange}
              />
            </div>
          </div>
          <Flex gap="small">
            <Button
              type="primary"
              icon={<Play size={16} />}
              size="large"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              Iniciar Análise
            </Button>
            {isCompleted && (
              <Button
                size="large"
                icon={<RotateCcw size={16} />}
                onClick={handleReset}
              >
                Nova análise
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>

      {entries.length > 0 && (
        <>
          <Divider />
          <Title level={4} style={{ marginBottom: 8 }}>
            Análises Recentes
          </Title>
          <RecentAnalysesList />
        </>
      )}
    </PageContainer>
  );
};

export default Analysis;
