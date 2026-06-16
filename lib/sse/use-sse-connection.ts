'use client';

import { devLog } from '@lib/utils';
import { useEffect } from 'react';
import { createSseConnection } from './sse-client';
import { sseEventBus } from './sse-event-bus';

export const useSseConnection = () => {
  // ---- SSE Lifecycle ----
  useEffect(() => {
    devLog('[useSseConnection] Mở kết nối SSE trung tâm...');

    const { disconnect } = createSseConnection({
      onEvent: (eventName, data) => {
        devLog(`[useSseConnection] Nhận event: ${eventName}`, data);
        sseEventBus.emit(eventName, data);
      },

      onOpen: () => devLog('[useSseConnection] Kết nối SSE thành công.'),

      onMessage: (data) => {
        devLog('[useSseConnection] Nhận message không có event name:', data);
        // Message mặc định có shape { type, data } — narrow từ unknown trước khi dùng.
        if (data && typeof data === 'object' && 'type' in data) {
          const { type, data: dataMessage } = data as { type: string; data: unknown };
          sseEventBus.emit(type, dataMessage);
        }
      },

      onError: (error) => {
        devLog('[useSseConnection] Lỗi kết nối SSE:', error);
      },
    });

    return () => {
      devLog('[useSseConnection] Đóng kết nối SSE trung tâm.');
      disconnect();
    };
  }, []);
};
