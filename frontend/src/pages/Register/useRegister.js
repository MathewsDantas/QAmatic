import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useLoadingStore from '../../store/useLoadingStore';
import { register as registerApi } from '../../services/auth.service';

const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isLoading = useLoadingStore((state) => state.isLoading);

  const handleRegister = useCallback(async (values) => {
    try {
      const response = await registerApi(values);
      setAuth(response.data.user, response.data.token);
      navigate('/');
    } catch {
      // erro tratado pelo interceptor
    }
  }, [setAuth, navigate]);

  return { loading: isLoading, handleRegister };
};

export default useRegister;
