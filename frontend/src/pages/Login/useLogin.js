import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useLoadingStore from '../../store/useLoadingStore';
import { login as loginApi } from '../../services/auth.service';

const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isLoading = useLoadingStore((state) => state.isLoading);

  const handleLogin = useCallback(async (values) => {
    try {
      const response = await loginApi(values);
      setAuth(response.data.user, response.data.token);
      navigate('/');
    } catch {
      // erro tratado pelo interceptor
    }
  }, [setAuth, navigate]);

  return { loading: isLoading, handleLogin };
};

export default useLogin;
