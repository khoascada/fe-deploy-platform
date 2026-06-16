import axios from 'axios';
import { env } from '@/env';
import { devError } from '@lib/utils/logger';

export const logoutInvalid = async () => {
  try {
    await axios.post(`${env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    devError('Logout invalid error:', error);
  } finally {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
};
