import { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Spin, Flex } from "antd";
import {
  BarChart3,
  CheckCircle2,
  Target,
  AlertTriangle,
  Clock,
} from "lucide-react";
import PageContainer from "../../components/PageContainer";
import RecentAnalysesList from "../Analysis/components/RecentAnalysesList";
import EmptyState from "../../components/EmptyState";
import { listAnalyses, getStats } from "../../services/analysis.service";

const { Title, Text } = Typography;

const MetricCard = ({
  icon: Icon,
  iconColor,
  label,
  value,
  suffix,
  valueColor,
}) => (
  <Card style={{ height: "100%" }} styles={{ body: { padding: "20px 24px" } }}>
    <Flex vertical gap={12}>
      <Flex align="center" gap={8}>
        <Flex
          align="center"
          justify="center"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: `${iconColor}14`,
          }}
        >
          <Icon size={18} color={iconColor} />
        </Flex>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {label}
        </Text>
      </Flex>
      <Flex align="baseline" gap={4}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: valueColor || "#1F2937",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {suffix && (
          <Text type="secondary" style={{ fontSize: 14 }}>
            {suffix}
          </Text>
        )}
      </Flex>
    </Flex>
  </Card>
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analysesRes] = await Promise.all([
          getStats(),
          listAnalyses({ page: 1, limit: 10 }),
        ]);
        setMetrics(statsRes.data);
        setEntries(analysesRes.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <PageContainer maxWidth={1100}>
        <Title level={2}>Dashboard</Title>
        <div style={{ textAlign: "center", padding: 64 }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!metrics || metrics.totalAnalyses === 0) {
    return (
      <PageContainer maxWidth={1100}>
        <Title level={2}>Dashboard</Title>
        <Card>
          <EmptyState
            icon={BarChart3}
            title="Nenhuma análise realizada"
            description="Execute sua primeira análise para ver as métricas aqui."
          />
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth={1100}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={12} sm={6}>
          <MetricCard
            icon={BarChart3}
            iconColor="#2563EB"
            label="Total de Análises"
            value={metrics.totalAnalyses}
          />
        </Col>
        <Col xs={12} sm={6}>
          <MetricCard
            icon={CheckCircle2}
            iconColor="#22C55E"
            label="Concluídas"
            value={metrics.completedAnalyses}
            valueColor="#22C55E"
          />
        </Col>
        <Col xs={12} sm={6}>
          <MetricCard
            icon={Target}
            iconColor="#7C3AED"
            label="Score Médio"
            value={metrics.averageScore}
            suffix="/100"
          />
        </Col>
        <Col xs={12} sm={6}>
          <MetricCard
            icon={AlertTriangle}
            iconColor="#F59E0B"
            label="Problemas"
            value={metrics.totalFindings}
            valueColor="#F59E0B"
          />
        </Col>
      </Row>

      <Flex align="center" gap={8} style={{ marginBottom: 16 }}>
        <Clock size={18} color="#6B7280" />
        <Title level={4} style={{ margin: 0 }}>
          Análises Recentes
        </Title>
      </Flex>
      <Card styles={{ body: { padding: 8 } }}>
        <RecentAnalysesList entries={entries} />
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
