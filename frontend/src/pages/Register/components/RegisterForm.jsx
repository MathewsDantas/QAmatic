import { Form, Input, Button } from 'antd';
import { User, Mail, Lock } from 'lucide-react';

const RegisterForm = ({ loading, onFinish }) => {
  return (
    <Form layout="vertical" onFinish={onFinish} size="large">
      <Form.Item
        name="name"
        label="Nome"
        rules={[{ required: true, message: 'Informe seu nome.' }]}
      >
        <Input prefix={<User size={16} color="#9CA3AF" />} placeholder="Seu nome" />
      </Form.Item>
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
        rules={[
          { required: true, message: 'Informe uma senha.' },
          { min: 6, message: 'Mínimo de 6 caracteres.' },
        ]}
      >
        <Input.Password prefix={<Lock size={16} color="#9CA3AF" />} placeholder="Senha" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Criar conta
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
