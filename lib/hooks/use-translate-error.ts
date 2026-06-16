import { translateErrorCode, getTranslatedErrorMessage } from '@lib/utils/error';
import type { ApiError } from '@lib/types/base';

const identityTranslate = (key: string) => key;

export function useTranslateError() {
  const translateError = (errCode: string | null | undefined, fallbackMessage?: string) => {
    return translateErrorCode(errCode, identityTranslate, fallbackMessage);
  };

  const getErrorMessage = (error: ApiError | null | undefined) => {
    return getTranslatedErrorMessage(error, identityTranslate);
  };

  return {
    translateError,
    getErrorMessage,
  };
}
