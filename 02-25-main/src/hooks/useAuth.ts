import { useState, useEffect, useCallback } from 'react';
import { ROLES } from '@/core/constants';

interface User {
  id: string;
  name: string;
  email: string;
  role: keyof typeof ROLES;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(initialState);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Aquí iría la llamada a la API de autenticación
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const user = await response.json();
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Guardar el token en localStorage
      localStorage.setItem('auth_token', user.token);
      
      return user;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error de autenticación',
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setState(initialState);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setState({ ...initialState, isLoading: false });
        return;
      }

      // Aquí iría la llamada a la API para validar el token
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      const user = await response.json();
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      localStorage.removeItem('auth_token');
      setState({
        ...initialState,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error de autenticación',
      });
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    ...state,
    login,
    logout,
    checkAuthStatus,
  };
};

export default useAuth;