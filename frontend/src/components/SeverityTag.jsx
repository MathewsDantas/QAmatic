import { Tag } from 'antd';

const severityConfig = {
  critica: { color: '#EF4444', bg: '#FEF2F2', label: 'Cr\u00edtica' },
  alta: { color: '#F97316', bg: '#FFF7ED', label: 'Alta' },
  media: { color: '#F59E0B', bg: '#FFFBEB', label: 'M\u00e9dia' },
  baixa: { color: '#3B82F6', bg: '#EFF6FF', label: 'Baixa' },
};

const SeverityTag = ({ severity }) => {
  const config = severityConfig[severity] || severityConfig.media;

  return (
    <Tag
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.color}30`,
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 12,
      }}
    >
      {config.label}
    </Tag>
  );
};

export default SeverityTag;
