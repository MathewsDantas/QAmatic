import { Typography, Card, Flex } from 'antd';
import { FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import useLogin from './useLogin';
import LoginForm from './components/LoginForm';

const { Title, Paragraph } = Typography;

const Login = () => {
  const { loading, handleLogin } = useLogin();

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: '0 16px' }}>
      <Flex vertical align="center" gap={4} style={{ marginBottom: 24 }}>
        <FlaskConical size={36} color="#2563EB" />
        <Title level={2} style={{ textAlign: 'center', margin: 0 }}>
          QAmatic
        </Title>
        <Paragraph type="secondary" style={{ textAlign: 'center', margin: 0 }}>
          Faça login para continuar.
        </Paragraph>
      </Flex>
      <Card>
        <LoginForm loading={loading} onFinish={handleLogin} />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Paragraph>
            Não tem uma conta? <Link to="/register">Cadastre-se</Link>
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default Login;
