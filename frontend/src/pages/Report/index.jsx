import { Typography, Spin, Alert, Button, Flex, Empty } from 'antd';
import { ArrowLeft, ListChecks, AlertTriangle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useReport from './useReport';
import PageContainer from '../../components/PageContainer';
import ReportHeader from './components/ReportHeader';
import TestSummary from './components/TestSummary';
import TestExecutionList from './components/TestExecutionList';
import FindingCard from './components/FindingCard';
import EvidenceGallery from './components/EvidenceGallery';

const { Title } = Typography;

const SectionTitle = ({ icon: Icon, iconColor, children }) => (
  <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
    <Flex
      align="center"
      justify="center"
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: `${iconColor}14`,
        flexShrink: 0,
      }}
    >
      <Icon size={16} color={iconColor} />
    </Flex>
    <Title level={4} style={{ margin: 0 }}>{children}</Title>
  </Flex>
);

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
      <PageContainer maxWidth={720}>
        <Alert type="error" message="Erro" description={error} showIcon />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/dashboard')}>
          Voltar
        </Button>
      </PageContainer>
    );
  }

  if (report.status === 'analyzing') {
    return (
      <PageContainer maxWidth={720}>
        <Alert
          type="info"
          message="Análise em andamento"
          description="A análise ainda está sendo executada. Aguarde..."
          showIcon
        />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/dashboard')}>
          Voltar
        </Button>
      </PageContainer>
    );
  }

  if (report.status === 'error') {
    return (
      <PageContainer maxWidth={720}>
        <Alert
          type="error"
          message="Erro na análise"
          description={report.errorMessage || 'Ocorreu um erro durante a execução.'}
          showIcon
        />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/dashboard')}>
          Voltar
        </Button>
      </PageContainer>
    );
  }

  const { consolidated, aiAnalysis, execution } = report.result;

  return (
    <PageContainer maxWidth={960}>
      <Button
        type="text"
        icon={<ArrowLeft size={16} />}
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: 16 }}
      >
        Voltar para análises
      </Button>

      <Flex vertical gap={32}>
        <ReportHeader
          aiAnalysis={aiAnalysis}
          consolidated={consolidated}
          url={report.url}
        />

        <TestSummary consolidated={consolidated} />

        <div>
          <SectionTitle icon={ListChecks} iconColor="#2563EB">
            Execução dos Testes
          </SectionTitle>
          <TestExecutionList execution={execution} />
        </div>

        <div>
          <SectionTitle icon={AlertTriangle} iconColor="#F59E0B">
            Problemas Encontrados
          </SectionTitle>
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

        <div>
          <SectionTitle icon={Camera} iconColor="#7C3AED">
            Evidências
          </SectionTitle>
          <EvidenceGallery consolidated={consolidated} />
        </div>
      </Flex>
    </PageContainer>
  );
};

export default Report;
