import { Progress } from 'antd';

const getColor = (score) => {
  if (score >= 80) return '#22C55E';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
};

const ScoreCircle = ({ score, size = 80 }) => {
  return (
    <Progress
      type="circle"
      percent={score}
      size={size}
      strokeColor={getColor(score)}
      format={(val) => (
        <span style={{ fontSize: size * 0.28, fontWeight: 700 }}>{val}</span>
      )}
    />
  );
};

export default ScoreCircle;
