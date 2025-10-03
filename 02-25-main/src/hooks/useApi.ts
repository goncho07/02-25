import { useState, useEffect, useCallback } from 'react';
import { api } from '@/core/api';
import { PaginatedResponse, ApiErrorResponse } from '@/core/api/types';

interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiErrorResponse) => void;
  transform?: (data: any) => T;
}

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiErrorResponse | null;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions<T> = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: options.initialData || null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await api.get<T>(endpoint);
      const data = options.transform ? options.transform(response.data) : response.data;
      setState({ data, isLoading: false, error: null });
      options.onSuccess?.(data);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      setState({ data: null, isLoading: false, error: apiError });
      options.onError?.(apiError);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

interface UsePaginationOptions<T> extends UseApiOptions<PaginatedResponse<T>> {
  limit?: number;
  initialPage?: number;
}

export function usePagination<T>(
  endpoint: string,
  options: UsePaginationOptions<T> = {}
) {
  const [page, setPage] = useState(options.initialPage || 1);
  const [limit] = useState(options.limit || 10);

  const { data, isLoading, error, refetch } = useApi<PaginatedResponse<T>>(
    `${endpoint}?page=${page}&limit=${limit}`,
    options
  );

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    data: data?.data || [],
    page,
    limit,
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    goToPage,
    refetch,
  };
}

export function useMutation<T, U = any>(
  endpoint: string,
  options: UseApiOptions<T> = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: options.initialData || null,
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(async (data?: U) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await api.post<T>(endpoint, data);
      const responseData = options.transform ? options.transform(response.data) : response.data;
      setState({ data: responseData, isLoading: false, error: null });
      options.onSuccess?.(responseData);
      return responseData;
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      setState(prev => ({ ...prev, isLoading: false, error: apiError }));
      options.onError?.(apiError);
      throw apiError;
    }
  }, [endpoint]);

  return {
    ...state,
    mutate,
  };
}

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}