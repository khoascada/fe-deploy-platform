# SSE Module

## Kiến trúc

```
BE SSE stream
     │ HTTP/SSE
     ▼
sse-client.ts          — mở kết nối, nhận raw data
     │ onEvent / onMessage
     ▼
sse-event-bus.ts       — phân phối nội bộ (pub/sub)
     │ emit → on
     ▼
use-sse-event.ts       — feature subscribe theo tên event
```

---

## 4 file & vai trò

| File                    | Vai trò                                                       | Biết về React? |
| ----------------------- | ------------------------------------------------------------- | -------------- |
| `sse-client.ts`         | Mở/đóng HTTP SSE connection, xử lý 401/retry                  | Không          |
| `sse-event-bus.ts`      | Singleton pub/sub — `emit` để gửi, `on` để nhận               | Không          |
| `use-sse-connection.ts` | Hook khởi động 1 kết nối duy nhất, forward data vào event bus | Có             |
| `use-sse-event.ts`      | Hook cho feature đăng ký lắng nghe 1 event cụ thể             | Có             |

---

## Luồng dữ liệu

**1. Khởi tạo** — mount ở `(app)/layout.tsx`:

```ts
useSseConnection();
// → createSseConnection() → fetchEventSource('/api/v1/sse/event')
```

**2. BE emit named event:**

```
event: invitation-received
data: {"roomId":"abc"}
```

→ `onEvent('invitation-received', { roomId: 'abc' })`
→ `sseEventBus.emit('invitation-received', data)`

**3. BE emit generic message** (không có event name):

```
data: {"type":"notification-new","data":{...}}
```

→ `onMessage(data)` → unpack `type` → `sseEventBus.emit('notification-new', data)`

**4. Feature lắng nghe:**

```ts
useSseEvent('invitation-received', (data) => {
  /* xử lý */
});
```

---

## Nguyên tắc thiết kế

- **1 kết nối duy nhất** — `use-sse-connection` mount 1 lần ở layout, không tạo nhiều connection.
- **Fan-out qua event bus** — nhiều feature cùng lắng nghe, không ai biết đến nhau.
- **Feature không biết SSE tồn tại** — chỉ gọi `useSseEvent('tên-event', handler)` là đủ.
