# PROJECT RULES – DEVELOPER PROFILE CARD

## 1. Tổng quan dự án (Project Overview)

- **Tên dự án:** Developer Profile Card (Exercise 1).
- **Mục tiêu:** Xây dựng giao diện thẻ hồ sơ Developer bằng React 19.
- **Mục đích học tập:** Thực hành xây dựng React Components, Semantic HTML, Accessibility và Responsive Design.
- **Phạm vi:** Chỉ tập trung vào giao diện hồ sơ cá nhân, không phát triển thành hệ thống quản lý tài khoản hoặc mạng xã hội.
- **Số lượng card:** Đề không quy định. `App` chỉ render một `<DeveloperCard />` dùng default props; không mở rộng thành danh sách nhiều card.

Hai component chính:

- `DeveloperCard`: Hiển thị thông tin tổng quan của Developer.
- `SkillBadge`: Hiển thị từng kỹ năng của Developer.

## 2. Công nghệ sử dụng

- React 19: Xây dựng giao diện bằng Components.
- Vite: Khởi tạo và chạy môi trường phát triển (theo yêu cầu slide).
- JavaScript: Xử lý dữ liệu và logic.
- CSS Modules và CSS Custom Properties: Quản lý CSS.
- Git: Quản lý phiên bản và theo dõi quá trình phát triển.

Không tự ý bổ sung thư viện hoặc công nghệ không cần thiết cho phạm vi bài tập.

## 3. Quy tắc kiến trúc

- Sử dụng Functional Components.
- Tách riêng `DeveloperCard` và `SkillBadge`; cả hai nằm trong `src/components/`.
- Sử dụng Props để truyền dữ liệu giữa các component; dùng ES6 default parameters theo code mẫu.
- Khi code mẫu slide 14 khác phần mô tả, **code mẫu là chuẩn**.
- Không thêm tính năng, thư viện hay yêu cầu ngoài đề. Muốn đề xuất cải tiến thì phải giải thích và hỏi trước.
- Không lặp lại code không cần thiết.
- Không xây dựng kiến trúc phức tạp vượt quá quy mô bài tập.

## 4. Quy tắc HTML

- File `DeveloperCard.jsx` không được chứa thẻ `<div>`.
- Sử dụng `<article>` cho nội dung hồ sơ độc lập, gắn `aria-labelledby='dev-heading'` với `<h2 id='dev-heading'>`.
- Sử dụng `<header>` cho phần giới thiệu (avatar + `<hgroup>`).
- Sử dụng `<hgroup>` nhóm tên và chức danh.
- Sử dụng `<dl>`, `<dt>`, `<dd>` cho metrics, bọc từng cặp bằng `Fragment` có `key`.
- Sử dụng `<ul aria-label='Engineered Skills'>` và `<li key={s.id}>` cho danh sách kỹ năng.
- Đảm bảo thứ bậc tiêu đề hợp lý.
- Không sử dụng thẻ HTML chỉ nhằm mục đích trang trí khi có thẻ ngữ nghĩa phù hợp.

## 5. Quy tắc giao diện

- Sử dụng CSS Modules; style của cả `DeveloperCard` và `SkillBadge` nằm trong `DeveloperCard.module.css`. Không tạo `SkillBadge.module.css`.
- Sử dụng CSS Custom Properties.
- Không dùng inline styles; không dùng Tailwind CSS hoặc framework CSS khác.
- Giao diện phải Responsive trong khoảng chiều rộng từ 375px đến 1440px.
- Không để nội dung bị tràn ngang (kiểm tra iPhone SE 375px, không horizontal scroll).
- Đảm bảo văn bản dễ đọc và bố cục nhất quán.

## 6. Quy tắc xử lý dữ liệu và hình ảnh

- Skill object gồm `id`, `name`, `tier` (không dùng `level`).
- `SkillBadge` nhận props `name`, `tier`; thẻ gốc là `<span>`; hiển thị `name (tier)`. Mỗi `<li>` chứa một `<SkillBadge />`.
- Sử dụng `Object.entries()` cho Metrics; giữ nguyên key `commits`, `vdomNodes`, `a11yScore` làm nhãn như code mẫu.
- Danh sách Skills dùng `key={s.id}`, không dùng index.
- Ảnh Avatar chỉ sử dụng HTTPS, khai báo `width` và `height`.
- Fallback initials khi **thiếu `avatarUrl`** và khi **ảnh tải thất bại**:
  - Dùng `useState` lưu `failedUrl`, không dùng `useEffect`.
  - Initials lấy chữ đầu của mọi từ trong `fullName` (`Tran Vinh Khiem` → `TVK`); tên rỗng hiển thị `?`.
  - Initials là `<span>` có `aria-hidden="true"`, cùng kích thước 64×64 với ảnh.
- Logic avatar nằm trong `DeveloperCard`, không tạo component `Avatar` riêng.

## 7. Quy tắc sử dụng AI

- Không giao AI tự thực hiện toàn bộ dự án từ đầu đến cuối.
- AI chỉ hỗ trợ các task cụ thể đã được xác định, mỗi lần một phạm vi rõ ràng.
- Người làm bài tự chạy lệnh trên máy mình và gửi kết quả để AI review; AI không tự commit.
- Phải hiểu yêu cầu và luồng xử lý trước khi yêu cầu AI viết code.
- Không sao chép nguyên kết quả AI mà không kiểm tra.
- Không chấp nhận giải pháp AI đề xuất nếu vi phạm Project Rules.
- Ghi nhận các lỗi AI thực sự phát sinh trong `AI_FAILURE_AUDIT.md`; không ghi lỗi giả định.

## 8. Quy tắc kiểm tra

Trước khi xác nhận hoàn thành một task, cần:

- Kiểm tra cấu trúc component.
- Kiểm tra Semantic HTML.
- Kiểm tra Accessibility.
- Kiểm tra Responsive Design.
- Kiểm tra lỗi trên Browser Console.
- Kiểm tra kết quả hiển thị thực tế.
- Kiểm tra các thay đổi trong Git.

Các kiểm tra theo slide 13:

- `grep -n '<div>' src/components/DeveloperCard.jsx` → 0 kết quả.
- `grep -n 'http://' src/components/DeveloperCard.jsx` → 0 kết quả.
- Chrome DevTools, Accessibility Tree: `article → header + dl + list`.
- Device Toolbar, iPhone SE (375px): không horizontal scroll.
- `git log`: có hai commit bắt buộc đúng message.

Chỉ đánh dấu task hoàn thành khi đã có bằng chứng kiểm tra. Hiện chưa có file `ex1-verification-audit.sh` chính thức; không dùng script tự tạo như thể là script của giảng viên.

## 9. Quy tắc Git

- Sử dụng Git để quản lý lịch sử phát triển; người làm bài tự chạy `git commit`.
- Tổng số commits cho Exercise 1 phải **từ 10 trở lên** (theo yêu cầu bài Lab).
- Bắt buộc có hai commit với message chính xác theo slide:
  1. `feat(ex1): implement semantic DeveloperCard and SkillBadge`
  2. `style(ex1): add responsive 375px CSS module`
- Các commit còn lại phải phản ánh công việc thật, được chia nhỏ hợp lý, message rõ ràng.
- Không tạo commit rỗng hoặc commit giả để đủ số lượng.
- Không gộp nhiều thay đổi không liên quan vào cùng một commit.
- Trước mỗi commit: kiểm tra `git status`, `git diff`, chọn file bằng `git add <file>`.
