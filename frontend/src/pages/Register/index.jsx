import { Typography, Card } from 'antd';
import { Link } from 'react-router-dom';
import useRegister from './useRegister';
import RegisterForm from './components/RegisterForm';

const { Title, Paragraph } = Typography;

const Register = () => {
  const { loading, handleRegister } = useRegister();

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: '0 16px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>QAmatic</Title>
      <Paragraph type="secondary" style={{ textAlign: 'center' }}>
        Crie sua conta para começar.
      </Paragraph>
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
