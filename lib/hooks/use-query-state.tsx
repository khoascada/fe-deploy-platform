// hooks này để hiển thị lỗi khi load data
import { HTTP_STATUS } from '@lib/constants';
import ErrorLoadData from '@components/status-page/error-load-data';
import ForbiddenPage from '@components/status-page/forbidden';
import Loading from '@components/status-page/loading';

interface Props<T> {
  data: T | undefined;
  isError: boolean;
  error?: { statusCode?: number } | null;
}

export function useQueryState<T>({ data, isError, error }: Props<T>) {
  const canAccess = error?.statusCode !== HTTP_STATUS.FORBIDDEN;

  // Trả về component nếu cần render trạng thái đặc biệt
  const renderState = () => {
    if (isError) {
      if (!canAccess) return <ForbiddenPage />;
      return <ErrorLoadData />;
    }

    if (!data) {
      return <Loading />;
    }

    return null; // Không cần render trạng thái đặc biệt
  };

  return {
    isReady: !isError && !!data,
    data: data as T,
    renderState,
  };
}
