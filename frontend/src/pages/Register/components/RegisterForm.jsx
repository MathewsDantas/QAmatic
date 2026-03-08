import { Form, Input, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const RegisterForm = ({ loading, onFinish }) => {
  return (
    <Form layout="vertical" onFinish={onFinish} size="large">
      <Form.Item
        name="name"
        label="Nome"
        rules={[{ required: true, message: 'Informe seu nome.' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Seu nome" />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Informe seu email.' },
          { type: 'email', message: 'Email inválido.' },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="seu@email.com" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Senha"
        rules={[
          { required: true, message: 'Informe uma senha.' },
          { min: 6, message: 'Mínimo de 6 caracteres.' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
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
