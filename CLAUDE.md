# CLAUDE.md — English Vocabulary App

**MANDATORY trước khi viết/sửa code trong project này:**

1. Đọc file này.
2. Xác định loại task → đọc `using-agent-skills` để route tới skill đúng TRƯỚC khi đề xuất code.
3. Tuân thủ mọi rule trong skill đó. Nếu skill xung đột với yêu cầu user, hỏi lại — không tự ý vi phạm.

---

## Skill routing — nguồn duy nhất

Mọi quyết định "task này dùng skill nào" → đọc [.claude/skills/using-agent-skills/SKILL.md](.claude/skills/using-agent-skills/SKILL.md). Đây là meta-skill chứa decision tree đầy đủ 10 skill của project (interview-me, idea-refine, spec-driven-development, code-conventions, frontend-design, frontend-ui-engineering, vercel-composition-patterns, vercel-react-best-practices, web-design-guidelines) + phần **Core Operating Behaviors** (surface assumptions, manage confusion, push back, enforce simplicity, scope discipline, verify) áp dụng xuyên suốt.

Không duy trì bảng route ở nơi khác — `using-agent-skills` là nguồn duy nhất.

## External skill: `design-taste-frontend` — quy tắc dùng

Skill ngoài duy nhất (lock trong `skills-lock.json`, source GitHub). **Không bật mặc định.** Nó ép aesthetic/font/màu riêng → sẽ xung đột với design system của project (amber `colors.css`, Apple font, `--radius: 0.8rem`, skill nội bộ `frontend-design`).

| Khi nào dùng | Khi nào KHÔNG dùng |
|---|---|
| Chỉ cho trang `(public)/` (landing, marketing). Mượn **bố cục + nguyên tắc a11y/UX**, KHÔNG mượn bảng màu/font. | Trang `(app)/` (product UI: datasets, settings, dashboard...) và `(auth)/`. Skill tự khai báo "not for dashboards/product UI". |

**Hard rule bất biến:** khi dùng skill này, **design system của project (CLAUDE.md + `colors.css` + `frontend-design`) luôn thắng**. Chỉ cho mượn *bố cục, motion pattern, nguyên tắc chống lỗi a11y* (contrast WCAG, label-above-input, không placeholder-as-label, `min-h-[100dvh]`, đủ loading/empty/error state) — KHÔNG cho mượn *màu/font/radius*. Nếu xung đột với màu amber hoặc font Apple → giữ project, bỏ skill.

## Docs registry

- SSR + React Query setup: [.claude/docs/ssr-react-query-setup.md](.claude/docs/ssr-react-query-setup.md)

---

## Hard rules (không bao giờ skip, kể cả khi skill không nhắc)

- **i18n**: không hardcode user-facing strings. Dùng `useTranslations` từ `next-intl`. Cập nhật cả `messages/en.json` và `messages/vi.json`, key dùng kebab-case.
- **File naming**: kebab-case cho mọi file/folder (`user-profile.tsx`, `use-auth.ts`, `auth.service.ts`).
- **Logging**: dùng `devLog` từ `@/lib/utils/devLog`, không dùng `console.log`.
- **File references trong reply (IDE)**: dùng markdown link `[file.ts:42](path/file.ts#L42)`, không dùng backticks ` cho path.
- **Cross-feature imports**: chỉ qua public API (vd `@features/pvp`), không deep import.
- **Intra-feature imports**: relative path (`../../hooks/...`), không dùng alias `@features/...` bên trong cùng feature.
- **Output validation**: dùng `validateResponse` từ `@/lib/utils/validate-response` chỉ cho endpoints có blast radius cao — auth/identity (`getMe`, `login`, `register`), payment, feature flags. Không áp dụng cho list/pagination endpoints. Schemas đặt ở `lib/schemas/`.
- **No `any`**: không dùng `any` cho type chưa rõ (payload từ API, socket, external response). Dùng `unknown` thay thế, sau đó narrow type hoặc định nghĩa interface cụ thể khi biết shape.
- **Router**: luôn dùng `useRouter` từ `@/i18n/navigation`, không dùng `next/navigation`.

---

## Quy trình mỗi turn làm việc

1. Đọc CLAUDE.md (file này) — bắt buộc.
2. Đọc `using-agent-skills` để route tới skill đúng theo task type (decision tree trong đó).
3. Nếu task chạm SSR / React Query → đọc thêm `.claude/docs/ssr-react-query-setup.md`.
4. Thực thi task theo skill rules + hard rules + Core Operating Behaviors.
5. Nếu user yêu cầu trái với skill → hỏi lại trước khi code.
