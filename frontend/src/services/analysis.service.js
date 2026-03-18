import api from './api';

export const startAnalysis = async ({ url, instructions }) => {
  const response = await api.post('/analysis/start', { url, instructions });
  return response.data;
};

export const getAnalysis = async (id) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};

export const listAnalyses = async ({ page = 1, limit = 10 } = {}) => {
  const response = await api.get('/analysis', { params: { page, limit } });
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/analysis/stats');
  return response.data;
};
