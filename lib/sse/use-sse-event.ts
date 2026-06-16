import { useEffect } from 'react';
import { sseEventBus } from './sse-event-bus';

// ---- Hook đăng ký lắng nghe một SSE event cụ thể ----
// Sử dụng trong các Observer component để nhận event từ kết nối SSE trung tâm.
// Tự động hủy đăng ký khi component unmount.
export const useSseEvent = (eventName: string, handler: (data: unknown) => void) => {
  useEffect(() => {
    const unsubscribe = sseEventBus.on(eventName, handler);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName]);
};
