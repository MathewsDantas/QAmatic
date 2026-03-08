import { Input, Typography } from 'antd';

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
