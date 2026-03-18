import { Tag } from "antd";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  AlertOctagon,
} from "lucide-react";

const statusConfig = {
  approved: {
    color: "success",
    icon: <CheckCircle2 size={14} />,
    label: "Aprovado",
  },
  rejected: {
    color: "error",
    icon: <XCircle size={14} />,
    label: "Reprovado",
  },
  needs_attention: {
    color: "warning",
    icon: <AlertTriangle size={14} />,
    label: "Atenção",
  },
  analyzing: {
    color: "processing",
    icon: <Loader2 size={14} className="spin-icon" />,
    label: "Analisando",
  },
  error: {
    color: "error",
    icon: <AlertOctagon size={14} />,
    label: "Erro",
  },
  completed: {
    color: "success",
    icon: <CheckCircle2 size={14} />,
    label: "Concluído",
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.analyzing;

  return (
    <Tag
      icon={
        <span style={{ display: "inline-flex", marginRight: 4 }}>
          {config.icon}
        </span>
      }
      color={config.color}
      style={{
        fontSize: 13,
        gap: 4,
        padding: "2px 10px",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
      }}
    >
      {config.label}
    </Tag>
  );
};

export default StatusBadge;
