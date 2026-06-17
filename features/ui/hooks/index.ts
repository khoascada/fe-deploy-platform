import { UI } from '@/types/ui';
import { useAppMutation } from '@lib/hooks';
import { uiApi } from '@services/ui.service';

export function useSetTheme() {
  const mutation = useAppMutation({
    mutationFn: (payload: UI) => uiApi.updateSetting(payload),
  });

  const setTheme = async (payload: UI) => {
    try {
      await mutation.mutateAsync(payload);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    setTheme,
  };
}

export function useSetLanguage() {
  const mutation = useAppMutation({
    mutationFn: (payload: UI) => uiApi.updateSetting(payload),
  });

  const setLanguage = async (payload: UI) => {
    try {
      await mutation.mutateAsync(payload);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    setLanguage,
  };
}
