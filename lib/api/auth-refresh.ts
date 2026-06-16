/**
 * Minimal refresh helper for the starter skeleton.
 * Returns the refreshed access token when the backend supports `/auth/refresh`.
 */
export const refreshTokenService = async () => {
  const apiClient = (await import('./api-client')).default;
  const response = await apiClient.get('/auth/refresh');

  return response.data.data.accessToken as string;
};
