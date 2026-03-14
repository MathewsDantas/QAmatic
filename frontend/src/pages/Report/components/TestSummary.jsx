import { Card, Statistic, Flex } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

const TestSummary = ({ consolidated }) => {
  const { summary } = consolidated;

  return (
    <Card title="Resumo da Execução" size="small">
      <Flex wrap="wrap" gap="large">
        <Statistic
          title="Total"
          value={summary.totalTestCases}
          prefix={<PlayCircleOutlined />}
        />
        <Statistic
          title="Passou"
          value={summary.passed}
          valueStyle={{ color: '#52c41a' }}
          prefix={<CheckCircleOutlined />}
        />
        <Statistic
          title="Falhou"
          value={summary.failed}
          valueStyle={{ color: '#ff4d4f' }}
          prefix={<CloseCircleOutlined />}
        />
        <Statistic
          title="Steps"
          value={`${summary.stepsPassed}/${summary.totalSteps}`}
          prefix={<MinusCircleOutlined />}
        />
      </Flex>
    </Card>
  );
};

export default TestSummary;
