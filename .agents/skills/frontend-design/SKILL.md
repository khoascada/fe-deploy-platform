---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build or refine web UI while keeping the result aligned with the repo's local design system instead of generic AI defaults.
license: Complete terms in LICENSE.txt
---

# Frontend Design

Skill này hướng dẫn tạo UI chất lượng cao, có chủ đích, không rơi vào kiểu “AI slop”. Nó không áp sẵn một brand cũ hay bộ màu cứng cho repo này.

## Design Principles

1. Bắt đầu từ design system đang có trong codebase: tokens, spacing scale, typography, radius, shadows, motion.
2. Nếu repo chưa có visual system rõ, tạo một hướng thẩm mỹ nhất quán thay vì vá từng component rời rạc.
3. Ưu tiên hierarchy, spacing và rhythm trước khi thêm hiệu ứng.
4. Visual direction phải phục vụ đúng loại màn hình: marketing, dashboard, settings, data-heavy UI, onboarding, v.v.

## Visual Guidance

### Typography

- Ưu tiên font stack hoặc token đã được repo định nghĩa.
- Không áp font “fancy” chỉ vì đẹp nếu nó làm lệch tính cách sản phẩm.
- Dùng contrast giữa heading, body, label và metadata để tạo hierarchy rõ.

### Color

- Ưu tiên semantic tokens hoặc CSS variables đang có trong repo.
- Không hard-code palette mới nếu hệ thống hiện tại đã có token.
- Nếu cần thêm màu, thêm theo tinh thần của hệ token hiện tại.

### Layout

- Chọn layout phù hợp với nhiệm vụ của màn hình.
- Tránh các pattern AI mặc định như 3 cột bằng nhau lặp lại vô nghĩa, hero vô danh trên gradient chung chung, hoặc card grid không có nhịp điệu.
- Với màn hình data-heavy, độ rõ ràng và scanability quan trọng hơn trang trí.

### Motion

- Chỉ animate các thời điểm có ý nghĩa: page reveal, state transition, feedback, panel open/close.
- Motion nên làm rõ trạng thái, không phải gây nhiễu.

## Component Styling Rules

1. Ưu tiên reuse primitives trong `components/ui`.
2. Tôn trọng dark mode hoặc theme switching nếu repo đã hỗ trợ.
3. Không tạo visual language mâu thuẫn với phần còn lại của ứng dụng.
4. Ưu tiên `min-h-dvh` hoặc `min-h-[100dvh]` cho full-height mobile sections khi phù hợp.

## Do

- Bám local tokens khi chúng đã tồn tại.
- Tạo hierarchy bằng type, spacing, density và contrast.
- Thiết kế loading, empty, error và disabled states đồng bộ với màn hình chính.
- Giữ UI nhất quán giữa desktop và mobile.

## Don't

- Không áp brand cũ, palette cũ hay font cũ từ project khác.
- Không hard-code hiệu ứng hào nhoáng làm giảm readability.
- Không dùng defaults chung chung khiến UI trông interchangeable.
- Không hy sinh accessibility để đổi lấy “đẹp”.
