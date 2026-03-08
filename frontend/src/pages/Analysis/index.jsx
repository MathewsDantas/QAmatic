import { Typography, Card, Button, Flex } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import useAnalysis from './useAnalysis';
import UrlInput from './components/UrlInput';
import TestInstructions from './components/TestInstructions';

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

  const isAnalyzing = status === 'analyzing';
  const isCompleted = status === 'completed';

  return (
    <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 16px' }}>
      <Title level={2}>Nova Análise</Title>
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
              icon={<SearchOutlined />}
              size="large"
              onClick={handleSubmit}
              loading={isLoading || isAnalyzing}
              disabled={isLoading || isAnalyzing}
              style={{ flex: 1 }}
            >
              {isAnalyzing ? 'Analisando...' : 'Iniciar Análise'}
            </Button>
            {isCompleted && (
              <Button
                size="large"
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                Nova análise
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>
    </div>
  );
};

export default Analysis;
