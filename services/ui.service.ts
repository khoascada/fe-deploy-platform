import apiClient from '@lib/api/api-client';
import { UI } from '@/types/ui';

export const uiApi = {
  updateSetting: async (payload: UI) => {
    await apiClient.patch('/user/me/setting', payload);
  },
};
