import { Image, Typography, Flex, Empty } from 'antd';
import { Camera } from 'lucide-react';

const { Text } = Typography;

const EvidenceGallery = ({ consolidated }) => {
  const evidence = consolidated?.evidence?.filter((e) => e.screenshot) || [];

  if (evidence.length === 0) {
    return <Empty description="Nenhuma evidência capturada" />;
  }

  return (
    <Image.PreviewGroup>
      <Flex wrap="wrap" gap={16}>
        {evidence.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: 200,
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
            }}
          >
            <Image
              src={`/api/screenshots/${item.screenshot}`}
              alt={`${item.testCaseName} - Step ${item.stepOrder}`}
              width={200}
              height={120}
              style={{ objectFit: 'cover' }}
            />
            <div style={{ padding: '6px 10px' }}>
              <Flex align="center" gap={4}>
                <Camera size={12} color="#9CA3AF" />
                <Text
                  type="secondary"
                  ellipsis
                  style={{ fontSize: 11 }}
                >
                  {item.testCaseName}
                </Text>
              </Flex>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Step {item.stepOrder} · {item.status === 'passed' ? '✓' : '✗'}
              </Text>
            </div>
          </div>
        ))}
      </Flex>
    </Image.PreviewGroup>
  );
};

export default EvidenceGallery;
