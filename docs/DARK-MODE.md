# Dark mode Admin FE

Dark mode hiện chỉ được triển khai trong khu vực Admin, không mở rộng sang
Landing/public, auth người học, onboarding, student hoặc teacher. Không cần API
từ backend.

## Contract

- Theme hợp lệ: `light` hoặc `dark`.
- Mặc định: `light`.
- Lưu tại `localStorage` với key `hocluc.theme`.
- Trạng thái được đặt trên `<html data-theme="...">` khi Admin được mount để cả Radix Portal và màn hình Admin dùng chung token.
- `ThemeProvider` là nguồn trạng thái; `ThemeToggle` là control dùng chung.
- Tôn trọng `prefers-reduced-motion`.

## Vị trí code

- Provider/context: `src/components/common/ThemeProvider.tsx`, `theme-context.ts`, `useTheme.ts`.
- Toggle: `src/components/ui/ThemeToggle.tsx`.
- Token sáng/tối và bridge cho legacy CSS: `src/styles/base/tokens.css`, `theme-overrides.css`.
- Early paint script Admin-only: `index.html`.

Toggle hiện có ở Admin login và Admin `StaffDashboard`. Khi rời Admin, provider
trả document về light mode để không làm thay đổi các surface public chưa triển khai.

## Quy ước khi thêm UI

Ưu tiên token semantic (`bg-surface`, `text-text-heading`, `border-border-subtle`, `text-primary-text`, `text-white` trên nền accent) thay vì màu hex trực tiếp trong Admin. Khi thêm một surface hoặc trạng thái mới trong Admin, kiểm tra cả light/dark ở desktop và mobile; không dùng `--color-surface` làm màu chữ trên nền accent.
