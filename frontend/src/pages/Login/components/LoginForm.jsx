import { Form, Input, Button } from 'antd';
import { Mail, Lock } from 'lucide-react';

const LoginForm = ({ loading, onFinish }) => {
  return (
    <Form layout="vertical" onFinish={onFinish} size="large">
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Informe seu email.' },
          { type: 'email', message: 'Email inválido.' },
        ]}
      >
        <Input prefix={<Mail size={16} color="#9CA3AF" />} placeholder="seu@email.com" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Senha"
        rules={[{ required: true, message: 'Informe sua senha.' }]}
      >
        <Input.Password prefix={<Lock size={16} color="#9CA3AF" />} placeholder="Senha" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Entrar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
