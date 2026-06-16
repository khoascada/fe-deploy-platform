type SseEventHandler = (data: unknown) => void;
type SseHandlerMap = Map<string, Set<SseEventHandler>>;

// ---- Singleton Event Bus ----
// Đây là một bộ "đường ống nội bộ" thuần JavaScript, không phụ thuộc React.
// Nó dùng để phân phối các event nhận được từ kết nối SSE trung tâm
// đến bất kỳ subscriber nào đang lắng nghe.
const handlerMap: SseHandlerMap = new Map();

export const sseEventBus = {
  // Đăng ký lắng nghe một event. Trả về hàm hủy đăng ký.
  on: (eventName: string, handler: SseEventHandler): (() => void) => {
    if (!handlerMap.has(eventName)) {
      handlerMap.set(eventName, new Set());
    }
    handlerMap.get(eventName)!.add(handler);

    return () => {
      handlerMap.get(eventName)?.delete(handler);
    };
  },

  // Phát event đến tất cả subscriber đang lắng nghe eventName đó.
  emit: (eventName: string, data: unknown): void => {
    handlerMap.get(eventName)?.forEach((handler) => handler(data));
  },
};
