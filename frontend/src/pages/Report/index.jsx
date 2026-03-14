import { Typography, Spin, Alert, Button, Flex, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useReport from './useReport';
import ReportHeader from './components/ReportHeader';
import TestSummary from './components/TestSummary';
import FindingCard from './components/FindingCard';

const { Title } = Typography;

const Report = () => {
  const { report, loading, error } = useReport();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 16px' }}>
        <Alert type="error" message="Erro" description={error} showIcon />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/')}>
          Voltar
        </Button>
      </div>
    );
  }

  if (report.status === 'analyzing') {
    return (
      <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 16px' }}>
        <Alert
          type="info"
          message="Análise em andamento"
          description="A análise ainda está sendo executada. Aguarde..."
          showIcon
        />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/')}>
          Voltar
        </Button>
      </div>
    );
  }

  if (report.status === 'error') {
    return (
      <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 16px' }}>
        <Alert
          type="error"
          message="Erro na análise"
          description={report.errorMessage || 'Ocorreu um erro durante a execução.'}
          showIcon
        />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/')}>
          Nova análise
        </Button>
      </div>
    );
  }

  const { consolidated, aiAnalysis } = report.result;

  return (
    <div style={{ maxWidth: 800, margin: '32px auto', padding: '0 16px 48px' }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        style={{ marginBottom: 16 }}
      >
        Nova análise
      </Button>

      <Flex vertical gap="large">
        <ReportHeader aiAnalysis={aiAnalysis} consolidated={consolidated} />

        <TestSummary consolidated={consolidated} />

        <div>
          <Title level={4}>Problemas Encontrados</Title>
          {aiAnalysis.findings.length === 0 ? (
            <Empty description="Nenhum problema encontrado" />
          ) : (
            <Flex vertical gap="middle">
              {aiAnalysis.findings.map((finding) => (
                <FindingCard key={finding.id} finding={finding} />
              ))}
            </Flex>
          )}
        </div>
      </Flex>
    </div>
  );
};

export default Report;
