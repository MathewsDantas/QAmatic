import { useState, useCallback } from 'react';
import { notification } from 'antd';
import useAnalysisStore from '../../store/useAnalysisStore';
import useLoadingStore from '../../store/useLoadingStore';
import { startAnalysis as startAnalysisApi } from '../../services/analysis.service';

const URL_REGEX = /^https?:\/\/.+\..+/;

const useAnalysis = () => {
  const [url, setUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  const [errors, setErrors] = useState({});

  const { status, analysis, startAnalysis, completeAnalysis, failAnalysis, reset } =
    useAnalysisStore();
  const isLoading = useLoadingStore((state) => state.isLoading);

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
      completeAnalysis(response.data);
      notification.success({
        message: 'Análise iniciada',
        description: 'A análise foi criada com sucesso.',
      });
    } catch {
      failAnalysis();
    }
  }, [url, instructions, validateUrl, validateInstructions, startAnalysis, completeAnalysis, failAnalysis]);

  const handleReset = useCallback(() => {
    setUrl('');
    setInstructions('');
    setErrors({});
    reset();
  }, [reset]);

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
