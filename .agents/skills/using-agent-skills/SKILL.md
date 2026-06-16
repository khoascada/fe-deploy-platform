---
name: using-agent-skills
description: Discovers and invokes agent skills. Use when starting a session or when you need to discover which skill applies to the current task. This is the meta-skill that governs how all other skills are discovered and invoked.
---

# Using Agent Skills

## Overview

Agent Skills là tập các workflow theo từng loại công việc trong repo starter này. Mục tiêu của meta-skill là route đúng task sang đúng skill, không kéo theo assumption cũ của project trước.

## Skill Discovery

Khi task tới, xác định nó đang nằm ở pha nào rồi route theo cây dưới đây. Chỉ route tới những skill thực sự đang có trong repo.

```text
Task arrives
    |
    |-- Ask mơ hồ, thiếu who/why/success? ------------------> interview-me
    |-- Có concept thô, cần variants hoặc stress-test? -----> idea-refine
    |-- Change lớn, chưa có spec rõ? ------------------------> spec-driven-development
    |
    |-- Implementing code?
    |   |-- Business logic / API / hooks / services / state -> code-conventions
    |   |-- UI visual / design system -----------------------> frontend-design
    |   |-- UI engineering / a11y / state / architecture ---> frontend-ui-engineering
    |   |-- Component API / composition ---------------------> vercel-composition-patterns
    |   `-- Performance / data fetching / bundle -----------> vercel-react-best-practices
    |
    `-- Review UI / a11y / UX --------------------------------> web-design-guidelines
```

## FE skill role split

Khi `frontend-design` và `frontend-ui-engineering` cùng áp dụng:

- `frontend-design` là nguồn hướng dẫn cho visual direction, token usage, layout rhythm và tính nhất quán của giao diện.
- `frontend-ui-engineering` là nguồn hướng dẫn cho accessibility, state management, component architecture, loading/empty/error states và interaction behavior.

Khi có xung đột về visual, ưu tiên design system thực tế đang tồn tại trong repo hiện tại thay vì áp một style mặc định từ skill.

## Core Operating Behaviors

### 1. Surface Assumptions

Với task không trivial, nêu rõ assumption trước khi lao vào implementation nếu assumption đó ảnh hưởng kiến trúc, scope hoặc hành vi.

### 2. Manage Confusion Actively

Nếu gặp mâu thuẫn giữa docs, code và yêu cầu:

1. Dừng lại.
2. Nêu rõ điểm mâu thuẫn.
3. Đưa tradeoff hoặc câu hỏi làm rõ.
4. Chỉ tiếp tục khi đã có hướng xử lý hợp lý.

### 3. Push Back When Warranted

Không “yes-machine”. Nếu hướng đi có rủi ro rõ ràng, nói thẳng, giải thích ngắn gọn, và đề xuất phương án tốt hơn.

### 4. Enforce Simplicity

Ưu tiên giải pháp ít abstraction, dễ đọc, dễ maintain. Không thêm complexity chỉ vì “có thể”.

### 5. Maintain Scope Discipline

Chỉ sửa trong phạm vi task. Không tự ý dọn dẹp, refactor lan rộng hoặc xoá những thứ chưa chắc chắn chỉ vì trông có vẻ cũ.

### 6. Verify, Don't Assume

Task chỉ hoàn tất khi đã có bước verify phù hợp: test, type-check, lint, build, search validation hoặc bằng chứng runtime tương ứng với loại thay đổi.

## Lifecycle Sequence

Một flow phổ biến:

```text
1. interview-me
2. idea-refine
3. spec-driven-development
4. Implement:
     - code-conventions
     - frontend-design
     - frontend-ui-engineering
     - vercel-composition-patterns / vercel-react-best-practices
5. web-design-guidelines
```

Không phải task nào cũng cần đủ mọi skill. Chỉ dùng tập skill tối thiểu nhưng đúng vấn đề.
