import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnalysis } from '../../services/analysis.service';
import useHistoryStore from '../../store/useHistoryStore';

const useReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const updateEntry = useHistoryStore((state) => state.updateEntry);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await getAnalysis(id);
        const data = response.data;
        setReport(data);

        if (data.status === 'completed' && data.result?.aiAnalysis) {
          const ai = data.result.aiAnalysis;
          updateEntry(id, {
            status: 'completed',
            overallScore: ai.overallScore ?? null,
            overallStatus: ai.overallStatus ?? null,
            findingsCount: ai.findings?.length ?? 0,
            summary: ai.summary ?? null,
          });
        } else if (data.status === 'error') {
          updateEntry(id, { status: 'error' });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar relatório.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, updateEntry]);

  return { report, loading, error };
};

export default useReport;
