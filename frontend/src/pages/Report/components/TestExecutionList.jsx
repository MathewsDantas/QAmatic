import { Collapse, Typography, Flex, Tag, Image } from 'antd';
import { CheckCircle2, XCircle, MinusCircle, Clock } from 'lucide-react';

const { Text } = Typography;

const statusIcon = {
  passed: <CheckCircle2 size={16} color="#22C55E" />,
  failed: <XCircle size={16} color="#EF4444" />,
  skipped: <MinusCircle size={16} color="#9CA3AF" />,
};

const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

const StepRow = ({ step }) => (
  <div
    style={{
      padding: '8px 12px',
      borderRadius: 6,
      backgroundColor: step.status === 'failed' ? '#FEF2F2' : 'transparent',
      marginBottom: 4,
    }}
  >
    <Flex align="center" gap={10}>
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>
        {statusIcon[step.status] || statusIcon.skipped}
      </span>
      <Text style={{ flex: 1, fontSize: 13 }}>
        {step.description || `${step.action} ${step.selector || ''}`}
      </Text>
      <Flex align="center" gap={6} style={{ flexShrink: 0 }}>
        <Clock size={12} color="#9CA3AF" />
        <Text
          type="secondary"
          style={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {formatDuration(step.duration)}
        </Text>
      </Flex>
    </Flex>
    {step.status === 'failed' && step.error && (
      <Text
        type="danger"
        style={{
          display: 'block',
          fontSize: 12,
          marginTop: 4,
          marginLeft: 26,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {step.error}
      </Text>
    )}
    {step.screenshot && (
      <div style={{ marginTop: 6, marginLeft: 26 }}>
        <Image
          src={`/api/screenshots/${step.screenshot}`}
          alt={step.description}
          width={160}
          style={{ borderRadius: 4 }}
        />
      </div>
    )}
  </div>
);

const TestExecutionList = ({ execution }) => {
  if (!execution?.results?.length) return null;

  const items = execution.results.map((testCase) => ({
    key: testCase.id,
    label: (
      <Flex align="center" gap={10}>
        <span style={{ display: 'inline-flex' }}>
          {testCase.status === 'passed' ? (
            <CheckCircle2 size={16} color="#22C55E" />
          ) : (
            <XCircle size={16} color="#EF4444" />
          )}
        </span>
        <Text strong style={{ flex: 1 }}>
          {testCase.name}
        </Text>
        <Tag color={testCase.status === 'passed' ? 'success' : 'error'}>
          {testCase.summary.passed}/{testCase.summary.total} steps
        </Tag>
      </Flex>
    ),
    children: (
      <div>
        {testCase.steps.map((step, idx) => (
          <StepRow key={idx} step={step} />
        ))}
      </div>
    ),
  }));

  return (
    <Collapse
      items={items}
      bordered={false}
      style={{ background: 'transparent' }}
    />
  );
};

export default TestExecutionList;
