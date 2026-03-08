import axios from 'axios';
import { notification } from 'antd';
import useAuthStore from '../store/useAuthStore';
import useLoadingStore from '../store/useLoadingStore';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().increment();

    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    useLoadingStore.getState().decrement();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().decrement();
    return response;
  },
  (error) => {
    useLoadingStore.getState().decrement();

    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      useAuthStore.getState().logout();
      notification.error({
        message: 'Sessão expirada',
        description: message || 'Faça login novamente.',
      });
    } else if (status === 403) {
      notification.error({
        message: 'Acesso negado',
        description: message || 'Você não tem permissão para esta ação.',
      });
    } else if (status === 404) {
      notification.error({
        message: 'Não encontrado',
        description: message || 'O recurso solicitado não foi encontrado.',
      });
    } else if (status === 409) {
      notification.warning({
        message: 'Conflito',
        description: message || 'Este registro já existe.',
      });
    } else if (status === 422) {
      notification.warning({
        message: 'Validação',
        description: message || 'Dados inválidos.',
      });
    } else if (status === 400) {
      notification.warning({
        message: 'Requisição inválida',
        description: message || 'Verifique os dados enviados.',
      });
    } else if (status && status >= 500) {
      notification.error({
        message: 'Erro no servidor',
        description: 'Tente novamente mais tarde.',
      });
    } else if (!error.response) {
      notification.error({
        message: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor.',
      });
    }

    return Promise.reject(error);
  }
);

export default api;
