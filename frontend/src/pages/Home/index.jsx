import { Spin, Typography } from 'antd';
import useHome from './useHome';

const { Title, Paragraph } = Typography;

const Home = () => {
  const { loading } = useHome();

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <Title>QAmatic</Title>
      <Paragraph>AI-powered QA automation platform</Paragraph>
    </div>
  );
};

export default Home;
