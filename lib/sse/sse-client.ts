import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source';
import { refreshTokenService } from '@lib/api/auth-refresh';
import { devLog } from '@lib/utils';

export interface SseOptions {
  onMessage?: (data: unknown) => void;
  onEvent?: (event: string, data: unknown) => void;
  onError?: (error: unknown) => void;
  onOpen?: (response: Response) => void;
  onClose?: () => void;
  headers?: Record<string, string>;
}

export const createSseConnection = (options: SseOptions) => {
  const { onMessage, onEvent, onError, onOpen, onClose, headers: customHeaders } = options;
  const ctrl = new AbortController();

  // ---- Đường dẫn tương đối để Next.js Rewrites xử lý ----
  const fullUrl = '/api/v1/sse/event';

  const connect = async () => {
    let connectedAt: Date | null = null;

    const elapsedSince = () =>
      connectedAt
        ? `(connected for ${((Date.now() - connectedAt.getTime()) / 1000).toFixed(1)}s)`
        : '(never fully connected)';

    try {
      await fetchEventSource(fullUrl, {
        method: 'GET',
        headers: {
          Accept: EventStreamContentType,
          ...customHeaders,
        },
        credentials: 'include', // Gửi kèm cookies để xác thực
        signal: ctrl.signal,
        openWhenHidden: true,

        async onopen(response) {
          if (
            response.ok &&
            response.headers.get('content-type')?.includes(EventStreamContentType)
          ) {
            connectedAt = new Date();
            devLog(`[SSE] Connected at ${connectedAt.toISOString()}`);
            onOpen?.(response);
            return; // Everything is fine
          }

          if (response.status === 401) {
            devLog('[SSE] Unauthorized (401). Attempting to refresh token...');
            try {
              await refreshTokenService();
              throw new Error('401_UNAUTHORIZED');
            } catch (err) {
              devLog('[SSE] Refresh token failed. Closing connection.');
              throw err; // Ngừng retry nếu refresh fail
            }
          }

          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            // Lỗi client-side khác -> ngừng retry
            throw new Error(`Fatal error: ${response.status}`);
          }
        },

        onmessage(msg) {
          if (!msg.data && !msg.event) return; // heartbeat
          if (msg.event === 'FatalError') {
            throw new Error(msg.data);
          }

          try {
            const data = JSON.parse(msg.data);
            if (msg.event && onEvent) {
              onEvent(msg.event, data);
            } else {
              onMessage?.(data);
            }
          } catch (e) {
            if (msg.event && onEvent) {
              onEvent(msg.event, msg.data);
            } else {
              onMessage?.(msg.data);
            }
          }
        },

        onclose() {
          devLog(`[SSE] Connection CLOSED at ${new Date().toISOString()} ${elapsedSince()}`);
          onClose?.();
        },

        onerror(err) {
          devLog(
            `[SSE] Connection ERROR/DROPPED at ${new Date().toISOString()} ${elapsedSince()}:`,
            err
          );
          if (err instanceof Error && err.message === '401_UNAUTHORIZED') {
            // Đây là lỗi chúng ta chủ động ném để retry sau khi refresh token
            // Trả về mặc định để cho phép retry
            return;
          }
          onError?.(err);
          // throw error để trigger retry logic của fetch-event-source (mặc định exponential backoff)
          throw err;
        },
      });
    } catch (err) {
      if (ctrl.signal.aborted) {
        devLog(`[SSE] Connection aborted for ${fullUrl}`);
        return;
      }
      devLog(`[SSE] Fatal connection drop at ${new Date().toISOString()} ${elapsedSince()}:`, err);
      onError?.(err);
    }
  };

  connect();

  return {
    disconnect: () => {
      ctrl.abort();
    },
  };
};
