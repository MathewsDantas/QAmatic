import { Card, Typography, Flex } from 'antd';
import { ExternalLink } from 'lucide-react';
import StatusBadge from '../../../components/StatusBadge';
import ScoreCircle from '../../../components/ScoreCircle';

const { Title, Text, Paragraph } = Typography;

const ReportHeader = ({ aiAnalysis, consolidated, url }) => {
  return (
    <Card styles={{ body: { padding: '24px 28px' } }}>
      <Flex vertical gap={16}>
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap="middle">
          <Flex vertical gap={10} style={{ flex: 1 }}>
            <Title level={3} style={{ margin: 0 }}>
              Relatório da Análise
            </Title>
            {url && (
              <Flex align="center" gap={6}>
                <ExternalLink size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
                <Text type="secondary" style={{ fontSize: 13 }} copyable={{ text: url }}>
                  {url}
                </Text>
              </Flex>
            )}
            <Flex gap={8} align="center" style={{ marginTop: 2 }}>
              <StatusBadge status={aiAnalysis.overallStatus} />
              <Text type="secondary">
                {consolidated.summary.passed}/{consolidated.summary.totalTestCases} testes passaram
              </Text>
            </Flex>
          </Flex>
          <ScoreCircle score={aiAnalysis.overallScore} size={80} />
        </Flex>
        <Paragraph type="secondary" style={{ margin: 0, lineHeight: 1.6 }}>
          {aiAnalysis.summary}
        </Paragraph>
      </Flex>
    </Card>
  );
};

export default ReportHeader;
