import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import useAnalysisStore from '../../store/useAnalysisStore';
import useLoadingStore from '../../store/useLoadingStore';
import useHistoryStore from '../../store/useHistoryStore';
import {
  startAnalysis as startAnalysisApi,
  getAnalysis as getAnalysisApi,
} from '../../services/analysis.service';

const URL_REGEX = /^https?:\/\/.+\..+/;
const POLL_INTERVAL = 5000;

const useAnalysis = () => {
  const [url, setUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  const [errors, setErrors] = useState({});
  const pollRef = useRef(null);
  const navigate = useNavigate();

  const { status, analysis, startAnalysis, completeAnalysis, failAnalysis, reset } =
    useAnalysisStore();
  const isLoading = useLoadingStore((state) => state.isLoading);
  const addHistoryEntry = useHistoryStore((state) => state.addEntry);
  const updateHistoryEntry = useHistoryStore((state) => state.updateEntry);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (analysisId) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const response = await getAnalysisApi(analysisId);
          const data = response.data;

          if (data.status === 'completed') {
            stopPolling();
            completeAnalysis(data);
            const ai = data.result?.aiAnalysis;
            updateHistoryEntry(analysisId, {
              status: 'completed',
              overallScore: ai?.overallScore ?? null,
              overallStatus: ai?.overallStatus ?? null,
              findingsCount: ai?.findings?.length ?? 0,
              summary: ai?.summary ?? null,
            });
            notification.success({
              message: 'Análise concluída',
              description: 'O relatório está pronto para visualização.',
            });
            navigate(`/report/${analysisId}`);
          } else if (data.status === 'error') {
            stopPolling();
            failAnalysis(data.errorMessage);
            updateHistoryEntry(analysisId, { status: 'error' });
            notification.error({
              message: 'Erro na análise',
              description: data.errorMessage || 'Ocorreu um erro durante a análise.',
            });
          }
        } catch {
          // silently retry on next interval
        }
      }, POLL_INTERVAL);
    },
    [stopPolling, completeAnalysis, failAnalysis, updateHistoryEntry, navigate],
  );

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const validateUrl = useCallback((value) => {
    if (!value || !value.trim()) {
      return 'Informe a URL do sistema a ser testado.';
    }
    if (!URL_REGEX.test(value.trim())) {
      return 'Informe uma URL válida (ex: https://meusistema.com).';
    }
    return '';
  }, []);

  const validateInstructions = useCallback((value) => {
    if (!value || !value.trim()) {
      return 'Descreva o que deseja testar.';
    }
    return '';
  }, []);

  const handleUrlChange = useCallback((e) => {
    setUrl(e.target.value);
    setErrors((prev) => ({ ...prev, url: '' }));
  }, []);

  const handleInstructionsChange = useCallback((e) => {
    setInstructions(e.target.value);
    setErrors((prev) => ({ ...prev, instructions: '' }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const urlError = validateUrl(url);
    const instructionsError = validateInstructions(instructions);

    if (urlError || instructionsError) {
      setErrors({ url: urlError, instructions: instructionsError });
      return;
    }

    setErrors({});
    startAnalysis();

    try {
      const response = await startAnalysisApi({
        url: url.trim(),
        instructions: instructions.trim(),
      });
      const analysisData = response.data;
      addHistoryEntry({
        id: analysisData.id,
        url: url.trim(),
        instructions: instructions.trim(),
        status: 'analyzing',
        createdAt: analysisData.createdAt,
      });
      notification.info({
        message: 'Análise iniciada',
        description: 'Aguarde enquanto os testes são executados...',
      });
      startPolling(analysisData.id);
    } catch {
      failAnalysis();
    }
  }, [url, instructions, validateUrl, validateInstructions, startAnalysis, failAnalysis, addHistoryEntry, startPolling]);

  const handleReset = useCallback(() => {
    stopPolling();
    setUrl('');
    setInstructions('');
    setErrors({});
    reset();
  }, [reset, stopPolling]);

  return {
    url,
    instructions,
    errors,
    status,
    analysis,
    isLoading,
    handleUrlChange,
    handleInstructionsChange,
    handleSubmit,
    handleReset,
  };
};

export default useAnalysis;
