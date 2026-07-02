import { useEffect, useRef } from 'react';
import { sseEventBus } from './sse-event-bus';

interface UseSseEventOptions {
  enabled?: boolean;
}

// ---- Hook đăng ký lắng nghe một SSE event cụ thể ----
// Sử dụng trong các Observer component để nhận event từ kết nối SSE trung tâm.
// Tự động hủy đăng ký khi component unmount.
export const useSseEvent = (
  eventName: string,
  handler: (data: unknown) => void,
  { enabled = true }: UseSseEventOptions = {}
) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const unsubscribe = sseEventBus.on(eventName, (data) => handlerRef.current(data));
    return () => unsubscribe();
  }, [enabled, eventName]);
};
