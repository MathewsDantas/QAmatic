import { Input, Typography } from 'antd';
import { Globe } from 'lucide-react';

const { Text } = Typography;

const UrlInput = ({ url, error, onUrlChange }) => {
  return (
    <div>
      <Input
        size="large"
        placeholder="https://meusistema.com"
        value={url}
        onChange={onUrlChange}
        status={error ? 'error' : ''}
        prefix={<Globe size={16} color="#9CA3AF" />}
        allowClear
      />
      {error && (
        <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
          {error}
        </Text>
      )}
    </div>
  );
};

export default UrlInput;
