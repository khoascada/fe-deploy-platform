/**
 * Refresh auth cookies via `/auth/refresh`.
 * The backend is responsible for rotating tokens and setting cookies.
 */
export const refreshTokenService = async () => {
  const apiClient = (await import('./api-client')).default;
  await apiClient.post('/auth/refresh');
};
