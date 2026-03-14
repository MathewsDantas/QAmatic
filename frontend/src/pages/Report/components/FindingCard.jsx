import { Card, Tag, Typography, Image, Flex } from 'antd';
import {
  BugOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const severityConfig = {
  critica: { color: 'red', label: 'Crítica' },
  alta: { color: 'orange', label: 'Alta' },
  media: { color: 'gold', label: 'Média' },
  baixa: { color: 'blue', label: 'Baixa' },
};

const FindingCard = ({ finding }) => {
  const severity = severityConfig[finding.severidade] || severityConfig.media;

  return (
    <Card size="small">
      <Flex vertical gap="small">
        <Flex justify="space-between" align="center">
          <Tag color={severity.color}>{severity.label}</Tag>
          {finding.testCaseId && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              TC#{finding.testCaseId} - Step {finding.stepOrder}
            </Text>
          )}
        </Flex>

        <div>
          <Flex gap={4} align="baseline">
            <BugOutlined style={{ color: '#ff4d4f' }} />
            <Text strong>Problema</Text>
          </Flex>
          <Paragraph style={{ margin: '4px 0 0 18px' }}>{finding.problema}</Paragraph>
        </div>

        <div>
          <Flex gap={4} align="baseline">
            <ThunderboltOutlined style={{ color: '#faad14' }} />
            <Text strong>Impacto</Text>
          </Flex>
          <Paragraph style={{ margin: '4px 0 0 18px' }}>{finding.impacto}</Paragraph>
        </div>

        <div>
          <Flex gap={4} align="baseline">
            <ToolOutlined style={{ color: '#52c41a' }} />
            <Text strong>Sugestão</Text>
          </Flex>
          <Paragraph style={{ margin: '4px 0 0 18px' }}>{finding.sugestao}</Paragraph>
        </div>

        {finding.evidencia && (
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Evidência:</Text>
            <Image
              src={`/api/screenshots/${finding.evidencia}`}
              alt="Evidência"
              style={{ marginTop: 4, borderRadius: 4 }}
              width="100%"
            />
          </div>
        )}
      </Flex>
    </Card>
  );
};

export default FindingCard;
