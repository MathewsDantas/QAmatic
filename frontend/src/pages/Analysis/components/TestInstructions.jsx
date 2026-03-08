import { Input, Typography } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

const TestInstructions = ({ instructions, error, onInstructionsChange }) => {
  return (
    <div>
      <TextArea
        rows={4}
        placeholder={
          'Descreva o que deseja testar, por exemplo:\n' +
          '- Testar login\n' +
          '- Testar cadastro de usuário\n' +
          '- Validar formulários'
        }
        value={instructions}
        onChange={onInstructionsChange}
        status={error ? 'error' : ''}
        maxLength={2000}
        showCount
      />
      {error && (
        <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
          {error}
        </Text>
      )}
    </div>
  );
};

export default TestInstructions;
