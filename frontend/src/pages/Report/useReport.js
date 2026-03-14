import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnalysis } from '../../services/analysis.service';

const useReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await getAnalysis(id);
        setReport(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar relatório.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  return { report, loading, error };
};

export default useReport;
