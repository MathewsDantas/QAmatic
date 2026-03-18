import { Typography, Button, Flex } from 'antd';

const { Text, Paragraph } = Typography;

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <Flex
      vertical
      align="center"
      gap="small"
      style={{ padding: '48px 24px', textAlign: 'center' }}
    >
      {Icon && (
        <span style={{ color: '#9CA3AF', marginBottom: 8 }}>
          <Icon size={48} strokeWidth={1.5} />
        </span>
      )}
      {title && (
        <Text strong style={{ fontSize: 16 }}>
          {title}
        </Text>
      )}
      {description && (
        <Paragraph type="secondary" style={{ margin: 0, maxWidth: 360 }}>
          {description}
        </Paragraph>
      )}
      {actionLabel && onAction && (
        <Button type="primary" onClick={onAction} style={{ marginTop: 8 }}>
          {actionLabel}
        </Button>
      )}
    </Flex>
  );
};

export default EmptyState;
