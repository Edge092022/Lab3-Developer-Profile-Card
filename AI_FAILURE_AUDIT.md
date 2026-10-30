## Lỗi AI #1 – Bộ chọn kiểm tra fallback không khớp CSS Modules

- **Đề xuất sai:** Bài kiểm tra browser tìm fallback bằng class `.initials` nguyên bản.
- **Vì sao sai:** CSS Modules đổi tên class khi Vite xử lý stylesheet.
- **Cách phát hiện:** Bộ chọn chờ quá thời hạn dù snapshot accessibility đã hiển thị initials `TVK`.
- **Cách khắc phục:** Kiểm tra qua thuộc tính ngữ nghĩa ổn định `aria-hidden="true"`; xác nhận lại fallback ảnh lỗi và URL rỗng.
- **Bài học:** Không dựa vào tên class CSS Module chưa được biên dịch trong kiểm tra browser.

## Lỗi AI #2 – Import ReactDOM không đúng định dạng module của Vite

- **Đề xuất sai:** Bài kiểm tra browser import ReactDOM từ đường dẫn `node_modules` trực tiếp và giả định `createRoot` là named export.
- **Vì sao sai:** Đường dẫn đó phục vụ module CommonJS; bản prebundle của Vite expose ReactDOM qua default export.
- **Cách phát hiện:** Browser trả lỗi `module is not defined`, sau đó phép đọc named export cho thấy chỉ có default export.
- **Cách khắc phục:** Dùng module prebundle đang được ứng dụng tải và lấy `createRoot` từ default export; chạy lại kiểm tra URL avatar rỗng thành công.
- **Bài học:** Dùng đúng module URL và định dạng export từ runtime thực tế khi kiểm tra component trong browser.