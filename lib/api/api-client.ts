import { ERROR_CODES, type ErrorCode } from '@lib/constants/error-code';
import type { ApiError } from '@lib/types/base';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { logoutInvalid } from './auth-session';
import { env } from '@/env';
import { refreshTokenService } from './auth-refresh';

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

    const mapStatusCodeToErrCode = (statusCode: number): ErrorCode | null => {
      switch (statusCode) {
        case 400:
          return ERROR_CODES.BAD_REQUEST;
        case 401:
          return ERROR_CODES.UNAUTHORIZE;
        case 403:
          return ERROR_CODES.FORBIDDEN;
        case 404:
          return ERROR_CODES.NOT_FOUND;
        case 500:
        case 502:
        case 503:
        case 504:
          return ERROR_CODES.INTERNAL_SERVER_ERROR;
        default:
          return null;
      }
    };

    // Handle different error scenarios
    if (error.response) {
      // Check if response is HTML (404 page) instead of JSON
      const contentType = error.response.headers['content-type'];
      const isHtmlResponse = contentType?.includes('text/html');

      // Extract API error from response data
      let apiError: ApiError;

      if (isHtmlResponse || typeof error.response.data === 'string') {
        // Backend returned HTML or string (e.g. 404 page)
        apiError = {
          message: `API endpoint not found or server error (Status: ${error.response.status})`,
          statusCode: error.response.status,
          errCode:
            mapStatusCodeToErrCode(error.response.status) || ERROR_CODES.INTERNAL_SERVER_ERROR,
        };
      } else {
        // Backend returned JSON error response
        apiError = error.response.data || {
          message: 'An unexpected error occurred',
          statusCode: error.response.status,
        };

        // Ensure statusCode is set from response
        apiError.statusCode = error.response.status;
      }

      // Handle 401 Unauthorized - Token refresh
      if (error.response.status === 401 && !originalRequest._retry) {
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
          // Call centralized refresh service
          const accessToken = await refreshTokenService();

          // Process queued requests
          processQueue(null, accessToken);

          // Retry original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout
          processQueue(refreshError, null);

          if (typeof window !== 'undefined') {
            await logoutInvalid();
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle specific status codes
      switch (error.response.status) {
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
      }

      return Promise.reject(apiError);
    } else if (error.request) {
      // Request was made but no response (network error, timeout, etc.)
      const apiError: ApiError = {
        message: 'No response from server',
        statusCode: 0,
        errCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      };
      return Promise.reject(apiError);
    } else {
      // Something else happened (request setup error, etc.)
      const apiError: ApiError = {
        message: error.message || 'An unexpected error occurred',
        statusCode: 0,
        errCode: ERROR_CODES.BAD_REQUEST,
      };
      return Promise.reject(apiError);
    }
  }
);

export default apiClient;
