import { List, Typography, Flex } from 'antd';
import { FileText, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useHistoryStore from '../../../store/useHistoryStore';
import StatusBadge from '../../../components/StatusBadge';
import ScoreCircle from '../../../components/ScoreCircle';
import EmptyState from '../../../components/EmptyState';
import { relativeTime } from '../../../utils/formatDate';

const { Text } = Typography;

const RecentAnalysesList = ({ entries: entriesProp }) => {
  const storeEntries = useHistoryStore((state) => state.entries);
  const entries = entriesProp || storeEntries;
  const navigate = useNavigate();

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="Nenhuma análise recente"
        description="Suas análises aparecerão aqui após a primeira execução."
      />
    );
  }

  return (
    <List
      dataSource={entries.slice(0, 10)}
      renderItem={(entry) => {
        const isClickable = entry.status === 'completed' || entry.status === 'error';

        return (
          <List.Item
            onClick={() => isClickable && navigate(`/report/${entry.id}`)}
            style={{
              cursor: isClickable ? 'pointer' : 'default',
              padding: '14px 16px',
              borderRadius: 8,
              marginBottom: 4,
              transition: 'background 0.2s',
              borderBottom: '1px solid #F1F5F9',
            }}
            onMouseEnter={(e) => {
              if (isClickable) e.currentTarget.style.background = '#F8FAFC';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Flex
              justify="space-between"
              align="center"
              style={{ width: '100%' }}
              gap={16}
            >
              <Flex align="center" gap={12} style={{ flex: 1, minWidth: 0 }}>
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: '#EFF6FF',
                    flexShrink: 0,
                  }}
                >
                  <Globe size={18} color="#2563EB" />
                </Flex>
                <Flex vertical gap={4} style={{ flex: 1, minWidth: 0 }}>
                  <Text strong ellipsis style={{ fontSize: 14 }}>
                    {entry.url}
                  </Text>
                  <Flex gap={8} align="center">
                    <StatusBadge status={entry.overallStatus || entry.status} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {relativeTime(entry.createdAt)}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>

              <Flex align="center" gap={12} style={{ flexShrink: 0 }}>
                {entry.overallScore != null && (
                  <ScoreCircle score={entry.overallScore} size={44} />
                )}
                {isClickable && (
                  <ChevronRight size={16} color="#9CA3AF" />
                )}
              </Flex>
            </Flex>
          </List.Item>
        );
      }}
    />
  );
};

export default RecentAnalysesList;
