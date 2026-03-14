import { Tag, Typography, Progress, Flex } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const statusConfig = {
  approved: { color: 'success', icon: <CheckCircleOutlined />, label: 'Aprovado' },
  rejected: { color: 'error', icon: <CloseCircleOutlined />, label: 'Reprovado' },
  needs_attention: { color: 'warning', icon: <ExclamationCircleOutlined />, label: 'Atenção Necessária' },
};

const ReportHeader = ({ aiAnalysis, consolidated }) => {
  const config = statusConfig[aiAnalysis.overallStatus] || statusConfig.needs_attention;

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
        <Flex vertical>
          <Title level={3} style={{ margin: 0 }}>Relatório da Análise</Title>
          <Flex gap="small" align="center" style={{ marginTop: 8 }}>
            <Tag icon={config.icon} color={config.color} style={{ fontSize: 14, padding: '4px 12px' }}>
              {config.label}
            </Tag>
            <Text type="secondary">
              {consolidated.summary.passed}/{consolidated.summary.totalTestCases} testes passaram
            </Text>
          </Flex>
        </Flex>
        <Progress
          type="circle"
          percent={aiAnalysis.overallScore}
          size={80}
          strokeColor={aiAnalysis.overallScore >= 80 ? '#52c41a' : aiAnalysis.overallScore >= 50 ? '#faad14' : '#ff4d4f'}
        />
      </Flex>
      <Paragraph type="secondary" style={{ margin: 0 }}>{aiAnalysis.summary}</Paragraph>
    </Flex>
  );
};

export default ReportHeader;
