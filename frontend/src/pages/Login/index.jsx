import { Typography, Card } from 'antd';
import { Link } from 'react-router-dom';
import useLogin from './useLogin';
import LoginForm from './components/LoginForm';

const { Title, Paragraph } = Typography;

const Login = () => {
  const { loading, handleLogin } = useLogin();

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: '0 16px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>QAmatic</Title>
      <Paragraph type="secondary" style={{ textAlign: 'center' }}>
        Faça login para continuar.
      </Paragraph>
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
