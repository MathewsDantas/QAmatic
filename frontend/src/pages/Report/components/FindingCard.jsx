import { Card, Typography, Image, Flex } from 'antd';
import { Bug, Zap, Wrench } from 'lucide-react';
import SeverityTag from '../../../components/SeverityTag';

const { Text, Paragraph } = Typography;

const severityBorderColor = {
  critica: '#EF4444',
  alta: '#F97316',
  media: '#F59E0B',
  baixa: '#3B82F6',
};

const FindingSection = ({ icon: Icon, iconColor, label, children }) => (
  <div>
    <Flex align="center" gap={8} style={{ marginBottom: 4 }}>
      <Flex
        align="center"
        justify="center"
        style={{
          width: 22,
          height: 22,
          borderRadius: 4,
          backgroundColor: `${iconColor}14`,
          flexShrink: 0,
        }}
      >
        <Icon size={12} color={iconColor} />
      </Flex>
      <Text strong style={{ fontSize: 13 }}>{label}</Text>
    </Flex>
    <Paragraph style={{ margin: '0 0 0 30px', fontSize: 13, lineHeight: 1.6 }}>
      {children}
    </Paragraph>
  </div>
);

const FindingCard = ({ finding }) => {
  const borderColor =
    severityBorderColor[finding.severidade] || severityBorderColor.media;

  return (
    <Card
      size="small"
      style={{
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: 8,
      }}
      styles={{ body: { padding: '16px 20px' } }}
    >
      <Flex vertical gap={12}>
        <Flex justify="space-between" align="center">
          <SeverityTag severity={finding.severidade} />
          {finding.testCaseId && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              TC#{finding.testCaseId} - Step {finding.stepOrder}
            </Text>
          )}
        </Flex>

        <FindingSection icon={Bug} iconColor="#EF4444" label="Problema">
          {finding.problema}
        </FindingSection>

        <FindingSection icon={Zap} iconColor="#F59E0B" label="Impacto">
          {finding.impacto}
        </FindingSection>

        <FindingSection icon={Wrench} iconColor="#22C55E" label="Sugestão">
          {finding.sugestao}
        </FindingSection>

        {finding.evidencia && (
          <div style={{ marginTop: 4, marginLeft: 30 }}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
              Evidência:
            </Text>
            <Image
              src={`/api/screenshots/${finding.evidencia}`}
              alt="Evidência"
              style={{ borderRadius: 6 }}
              width="100%"
            />
          </div>
        )}
      </Flex>
    </Card>
  );
};

export default FindingCard;
