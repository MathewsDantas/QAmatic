import { Typography, Card, Flex } from 'antd';
import { FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import useRegister from './useRegister';
import RegisterForm from './components/RegisterForm';

const { Title, Paragraph } = Typography;

const Register = () => {
  const { loading, handleRegister } = useRegister();

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: '0 16px' }}>
      <Flex vertical align="center" gap={4} style={{ marginBottom: 24 }}>
        <FlaskConical size={36} color="#2563EB" />
        <Title level={2} style={{ textAlign: 'center', margin: 0 }}>
          QAmatic
        </Title>
        <Paragraph type="secondary" style={{ textAlign: 'center', margin: 0 }}>
          Crie sua conta para começar.
        </Paragraph>
      </Flex>
      <Card>
        <RegisterForm loading={loading} onFinish={handleRegister} />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Paragraph>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default Register;
