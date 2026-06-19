import { env } from '@/env';
import { ERROR_CODES } from '@lib/constants/error-code';
import type { ApiError } from '@lib/types/base';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshTokenService } from './auth-refresh';
import { logoutInvalid } from './auth-session';

// Create axios instance - Direct call to Backend
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Send cookies (RT) automatically
});

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const createApiError = ({
  code = ERROR_CODES.INTERNAL_ERROR,
  details,
  message,
  statusCode,
}: {
  code?: string;
  details?: unknown;
  message: string;
  statusCode: number;
}): ApiError => {
  return {
    success: false,
    error: {
      code,
      message,
      statusCode,
      ...(details !== undefined ? { details } : {}),
    },
    statusCode,
  };
};

// Request interceptor - Add Access Token from Zustand
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Cookies (refreshToken) are automatically sent by browser
    config.withCredentials = true;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally and refresh tokens
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response) {
      const contentType = error.response.headers['content-type'];
      const isHtmlResponse = contentType?.includes('text/html');
      const statusCode = error.response.status;

      let apiError: ApiError;

      if (isHtmlResponse || typeof error.response.data === 'string') {
        apiError = createApiError({
          code: ERROR_CODES.INTERNAL_ERROR,
          message: `API endpoint not found or server error (Status: ${statusCode})`,
          statusCode,
        });
      } else if (error.response.data?.error) {
        apiError = {
          ...error.response.data,
          // Do a light normalization in case the backend response misses some fields.
          success: false,
          statusCode: error.response.data.statusCode ?? statusCode,
          error: {
            ...error.response.data.error,
            code: error.response.data.error.code || ERROR_CODES.INTERNAL_ERROR,
            message: error.response.data.error.message || 'An unexpected error occurred',
            statusCode: error.response.data.error.statusCode ?? statusCode,
          },
        };
      } else {
        apiError = createApiError({
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'An unexpected error occurred',
          statusCode,
        });
      }

      const errorStatusCode = apiError.statusCode ?? apiError.error.statusCode;
      const errorCode = apiError.error.code;
      const errorMessage = apiError.error.message;

      // Handle 401 Unauthorized - Token refresh
      if (errorStatusCode === 401 && errorCode !== ERROR_CODES.INVALID_CREDENTIALS && !originalRequest._retry) {
        // Check if this is a refresh request (avoid infinite loop)
        if (originalRequest.url?.includes('/auth/refresh')) {
          if (typeof window !== 'undefined') {
            await logoutInvalid();
          }
          return Promise.reject(apiError);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const accessToken = await refreshTokenService();

          processQueue(null, accessToken);

          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          if (typeof window !== 'undefined') {
            await logoutInvalid();
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      switch (errorStatusCode) {
        case 403:
          console.error(errorCode, errorMessage);
          break;
        case 404:
          console.error(errorCode, errorMessage);
          break;
        case 500:
          console.error(errorCode, errorMessage);
          break;
      }

      return Promise.reject(apiError);
    }

    if (error.request) {
      const apiError = createApiError({
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'No response from server',
        statusCode: 0,
      });
      return Promise.reject(apiError);
    }

    const apiError = createApiError({
      code: ERROR_CODES.BAD_REQUEST,
      message: error.message || 'An unexpected error occurred',
      statusCode: 0,
    });

    return Promise.reject(apiError);
  }
);

export default apiClient;

