import { Card, Typography, Flex, Row, Col } from 'antd';
import { Play, CheckCircle2, XCircle, ListChecks } from 'lucide-react';

const { Text } = Typography;

const SummaryItem = ({ icon: SummaryIcon, iconColor, label, value, valueColor }) => (
  <Flex align="center" gap={12}>
    <Flex
      align="center"
      justify="center"
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: `${iconColor}14`,
        flexShrink: 0,
      }}
    >
      <SummaryIcon size={18} color={iconColor} />
    </Flex>
    <Flex vertical>
      <Text type="secondary" style={{ fontSize: 12 }}>{label}</Text>
      <Text strong style={{ fontSize: 20, lineHeight: 1.2, color: valueColor }}>
        {value}
      </Text>
    </Flex>
  </Flex>
);

const TestSummary = ({ consolidated }) => {
  const { summary } = consolidated;

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <Play size={16} color="#2563EB" />
          <span>Resumo da Execução</span>
        </Flex>
      }
      size="small"
    >
      <Row gutter={[24, 16]}>
        <Col xs={12} sm={6}>
          <SummaryItem
            icon={Play}
            iconColor="#6B7280"
            label="Total"
            value={summary.totalTestCases}
          />
        </Col>
        <Col xs={12} sm={6}>
          <SummaryItem
            icon={CheckCircle2}
            iconColor="#22C55E"
            label="Passou"
            value={summary.passed}
            valueColor="#22C55E"
          />
        </Col>
        <Col xs={12} sm={6}>
          <SummaryItem
            icon={XCircle}
            iconColor="#EF4444"
            label="Falhou"
            value={summary.failed}
            valueColor="#EF4444"
          />
        </Col>
        <Col xs={12} sm={6}>
          <SummaryItem
            icon={ListChecks}
            iconColor="#2563EB"
            label="Steps"
            value={`${summary.stepsPassed}/${summary.totalSteps}`}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default TestSummary;
