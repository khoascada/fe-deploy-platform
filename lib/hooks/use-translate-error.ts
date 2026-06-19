import { useTranslations } from 'next-intl';
import { translateErrorCode, getTranslatedErrorMessage } from '@lib/utils/error';
import type { ApiError } from '@lib/types/base';

export function useTranslateError() {
  const t = useTranslations('errors');

  const translateError = (errCode: string | null | undefined, fallbackMessage?: string) => {
    return translateErrorCode(errCode, t, fallbackMessage);
  };

  const getErrorMessage = (error: ApiError | null | undefined) => {
    return getTranslatedErrorMessage(error, t);
  };

  return {
    translateError,
    getErrorMessage,
  };
}
