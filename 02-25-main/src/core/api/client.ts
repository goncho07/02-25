import { ApiEndpoint, ApiHeaders } from '@/core/constants/types';

interface RequestConfig extends RequestInit {
  timeout?: number;
}

interface ApiClientConfig {
  baseURL: string;
  headers?: ApiHeaders;
  timeout?: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: ApiHeaders;
  private defaultTimeout: number;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers,
    };
    this.defaultTimeout = config.timeout || 30000;
  }

  private async request<T>(endpoint: ApiEndpoint, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    const timeoutDuration = config.timeout || this.defaultTimeout;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    try {
      const response = await fetch(url, {
        ...config,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = {
          message: 'Request failed',
          status: response.status,
        };

        try {
          error.data = await response.json();
        } catch {
          // Si no podemos parsear el error, usamos el mensaje por defecto
        }

        throw error;
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeoutDuration}ms`);
        }
        throw error;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public async get<T>(endpoint: ApiEndpoint, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }

  public async post<T>(
    endpoint: ApiEndpoint,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async put<T>(
    endpoint: ApiEndpoint,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async patch<T>(
    endpoint: ApiEndpoint,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  public async delete<T>(endpoint: ApiEndpoint, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE',
    });
  }

  public setAuthToken(token: string) {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  public clearAuthToken() {
    delete this.defaultHeaders.Authorization;
  }
}