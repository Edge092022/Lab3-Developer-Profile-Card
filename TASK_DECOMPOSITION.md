# TASK_DECOMPOSITION.md

# Exercise 1 – Semantic Engineer & Pro-Gamer Profile Card

> Cập nhật 30/10/2026 theo các quyết định đã chốt. Danh sách thay đổi so với bản đầu nằm ở mục 15.

## 1. Mục tiêu

Xây dựng hai React components:

- `DeveloperCard`
- `SkillBadge`

Sử dụng React 19 và Vite, dựa trên nội dung Elon Musk Card (Ex 4.4) và User Profile (Ex 4.5), nâng cấp từ các bài cũ (Ex 0.2, 0.3, 4.1, 4.4, 4.5) và áp dụng quy tắc Zero Div-Soup của Lab 2.

Mục tiêu là xây dựng Developer Profile Card có thông tin cá nhân, metrics và danh sách skills, đồng thời tuân thủ các yêu cầu về Semantic HTML, CSS Modules, responsive design và Git.

## 2. Yêu cầu chính thức từ slide

### 2.1. React và cấu trúc component

- Sử dụng React 19 và Vite.
- Xây dựng `DeveloperCard` và `SkillBadge`, đặt trong `src/components/`.
- `DeveloperCard` là functional component theo hướng pure: render không có side effect. Đã chốt: dùng `useState` cho avatar fallback là phù hợp, vì state chỉ được cập nhật trong event handler `onError`, không phải trong lúc render.
- Sử dụng ES6 default parameters cho props.

### 2.2. Semantic HTML – Zero Div-Soup

Trong file `DeveloperCard.jsx`:

- Không được sử dụng bất kỳ thẻ `<div>` nào.
- Dùng `<article>`, `<header>`, `<hgroup>`, `<dl>`, `<dt>`, `<dd>`, `<ul>`, `<li>` và `Fragment` (component của React, bọc cặp `<dt>`/`<dd>` mà không thêm thẻ HTML).

Cấu trúc tham chiếu:

- `<article>` là landmark độc lập, `aria-labelledby='dev-heading'` gắn với `<h2 id='dev-heading'>`.
- `<header>` chứa avatar và `<hgroup>` (tên + chức danh).
- `<dl>` chứa metrics; `<dt>` là tên metric, `<dd>` là giá trị.
- `<ul>` và `<li>` hiển thị skills.

### 2.3. Metrics

Dữ liệu mẫu: `commits: 512`, `vdomNodes: 0`, `a11yScore: 100`.

Dùng `Object.entries(metrics)` và `Fragment key={k}` bọc cặp `<dt>`/`<dd>`. **Đã chốt:** giữ nguyên key làm nhãn hiển thị như code mẫu.

### 2.4. Skills

Dữ liệu mẫu: `{ id: 'sk-1', name: 'React 19 Fiber', tier: 'Core' }`.

Phần mô tả trên slide 14 ghi `{ id, name, level }` và `aria-label='Skills'`, còn code mẫu ghi `tier` và `aria-label='Engineered Skills'`. **Đã chốt:** theo code mẫu.

- Skill object dùng `id`, `name`, `tier`.
- `<ul aria-label='Engineered Skills'>` với `<li key={s.id}>`.
- `SkillBadge` là component riêng, nhận props `name`, `tier`, thẻ gốc `<span>`, hiển thị `name (tier)`.
- Mỗi `<li>` chứa một `<SkillBadge />`; `key` đặt trên `<li>`.

### 2.5. Avatar

Yêu cầu từ slide: thay avatar `http://` không an toàn bằng HTTPS, khai báo `width` và `height` rõ ràng (CLS bằng 0), có fallback initials.

Code mẫu slide 14 chưa có fallback. **Đã chốt (quyết định của người làm bài):** hiển thị initials trong cả hai trường hợp: thiếu `avatarUrl` và ảnh tải thất bại.

### 2.6. CSS và Responsive Design

- Thay inline style của slide 18 (`style={{ background: '#d0f0c0' }}`) bằng `DeveloperCard.module.css` và CSS Custom Properties.
- Chỉ có một file `DeveloperCard.module.css`, dùng chung cho `SkillBadge`; không tạo `SkillBadge.module.css`.
- Hoạt động ở viewport 375px (iPhone SE) và theo project rules từ 375px đến 1440px.
- Không horizontal scroll.

### 2.7. Git

Quy định: tổng số commits từ **10 trở lên** (yêu cầu của bài Lab), trong đó bắt buộc có hai atomic commits với message chính xác theo slide:

1. `feat(ex1): implement semantic DeveloperCard and SkillBadge`
2. `style(ex1): add responsive 375px CSS module`

Không thay đổi hai message này. Các commit còn lại phải phản ánh công việc thật, không có commit rỗng hoặc commit giả. Người làm bài tự chạy mọi lệnh `git commit`.

## 3. Phân tích dữ liệu mẫu từ slide

Giá trị mặc định trong code slide 14:

| Prop        | Giá trị mặc định                                 |
| ----------- | ------------------------------------------------ |
| `fullName`  | `Tran Vinh Khiem`                                |
| `role`      | `Senior Systems Architect • UIT S3T`             |
| `avatarUrl` | Unsplash HTTPS URL                               |
| `metrics`   | `commits: 512`, `vdomNodes: 0`, `a11yScore: 100` |
| `skills`    | Một skill mẫu: `React 19 Fiber`, tier `Core`     |

**Đã chốt:** slide không quy định số lượng card, nên `App` chỉ render một `<DeveloperCard />` dùng default props; không mở rộng thành danh sách card. Id cố định `dev-heading` hợp lệ khi chỉ có một card.

## 4. Quyết định thiết kế đã chốt

| #   | Vấn đề                                 | Quyết định                                                   |
| --- | -------------------------------------- | ------------------------------------------------------------ |
| 1   | Nguồn chuẩn khi mẫu và mô tả khác nhau | Code mẫu slide 14                                            |
| 2   | Data flow                              | `App` → một `<DeveloperCard />`, default props               |
| 3   | Props của SkillBadge                   | `name`, `tier`                                               |
| 4   | Thẻ gốc SkillBadge                     | `<span>`, nội dung `name (tier)`                             |
| 5   | Vị trí logic avatar                    | Trong `DeveloperCard`, không tạo `Avatar`                    |
| 6   | Theo dõi ảnh lỗi                       | `useState` lưu `failedUrl`, không dùng `useEffect`           |
| 7   | Initials                               | Chữ đầu mọi từ (`TVK`), `aria-hidden="true"`, tên rỗng → `?` |
| 8   | CSS                                    | Chỉ `DeveloperCard.module.css`                               |
| 9   | Commit `feat` đầu tiên                 | Kèm CSS Module tối thiểu để build không lỗi                  |
| 10  | Nhãn metrics                           | Giữ nguyên key như code mẫu                                  |
| 11  | Không thêm tính năng                   | Đề xuất cải tiến phải giải thích và hỏi trước                |
| 12  | Nơi đặt project                        | Repo trên máy người làm bài                                  |

## 5. Kiểm tra môi trường dự án (T0)

Project nằm trong repo trên máy người làm bài; trợ lý AI không truy cập được. Người làm bài chạy các lệnh sau trong thư mục dự định làm bài và gửi kết quả:

- `node -v` và `npm -v`
- `git --version`
- `git status` (cho biết đã là Git repo chưa)
- Liệt kê file trong thư mục (`ls` hoặc `dir`) để biết thư mục đã có gì (hiện đã có `project-rules.md` và `TASK_DECOMPOSITION.md`).

Kết quả T0 được ghi vào mục này sau khi có. Chưa biết: phiên bản Node/npm, trạng thái Git repo, phiên bản React mà template Vite sẽ cài (kiểm tra bằng `npm ls react` sau T1).

## 6. Triển khai SkillBadge

Mục tiêu: component `SkillBadge` hiển thị một skill.

- Props `name`, `tier`; thẻ gốc `<span>`; hiển thị `name (tier)`.
- Không có file CSS riêng.

**Tiêu chí hoàn thành:** hoạt động với dữ liệu qua props (`React 19 Fiber`, `Core`); tái sử dụng được; không có chức năng ngoài yêu cầu.

## 7. Triển khai DeveloperCard

Mục tiêu: component chính hiển thị Developer Profile Card.

- Default parameters theo slide 14.
- Cấu trúc `article → header(img + hgroup) + dl + ul` như mục 2.2.
- Avatar HTTPS, `width='64'`, `height='64'`.
- Metrics bằng `Object.entries(metrics)` và `Fragment key={k}`.
- Skills bằng `<ul aria-label='Engineered Skills'>` và `<li key={s.id}><SkillBadge /></li>`.
- Không có `<div>`.

**Tiêu chí hoàn thành:** hiển thị đủ các nhóm thông tin; dữ liệu qua props; không có `<div>` và không có `http://` (hai lệnh grep ở mục 10.1).

## 8. Xử lý Avatar

- Thiếu `avatarUrl`: hiển thị initials, tính trực tiếp khi render, không cần state.
- Có `avatarUrl` nhưng ảnh lỗi: `onError` lưu URL lỗi vào `failedUrl`; hiển thị ảnh khi `avatarUrl` có giá trị và khác `failedUrl`. Không dùng `useEffect`.
- Initials: chữ đầu mọi từ của `fullName`; tên rỗng → `?`; `<span aria-hidden="true">`, kích thước 64×64.

**Tiêu chí hoàn thành:** thử đủ ba trường hợp: ảnh tải được, URL rỗng, URL hỏng; tên rỗng ra `?`; layout không nhảy khi chuyển giữa ảnh và initials.

## 9. CSS Modules và Responsive Design

- Bản tối thiểu của `DeveloperCard.module.css` có trong commit `feat` đầu tiên (có quy tắc thật cho `.card`, `.header`, `.metrics`, `.skills`).
- Style hoàn thiện theo khu vực: header/avatar, metrics/skills, rồi responsive.
- Dùng CSS Custom Properties.
- Kiểm tra 375px, 768px, 1440px; không horizontal scroll.

**Tiêu chí hoàn thành:** style do CSS Module quản lý; hoạt động từ 375px đến 1440px; không horizontal overflow.

## 10. Verification – Kiểm tra kết quả

### 10.1. Source code audit

Slide 13 hiển thị hai lệnh kiểm tra (kèm tiêu đề `ex1-verification-audit.sh`):

```
grep -n '<div>' src/components/DeveloperCard.jsx     # mong đợi: 0 kết quả
grep -n 'http://' src/components/DeveloperCard.jsx   # mong đợi: 0 kết quả
```

Hiện chưa có file script chính thức. Không tự tạo file rồi nhận đó là script của giảng viên; có thể chạy trực tiếp hai lệnh trên.

### 10.2. Accessibility

Chrome DevTools, Elements, Accessibility Tree: `article → header + dl + list`. Người làm bài thực hiện trên Chrome và báo kết quả.

### 10.3. Responsive

Chrome DevTools Device Toolbar, iPhone SE (375px), không horizontal scroll. Người làm bài thực hiện và báo kết quả.

### 10.4. Git

`git log --oneline` có từ 10 commits trở lên, trong đó có hai commit bắt buộc đúng message theo slide.

## 11. Git và tài liệu

Các file tài liệu cần duy trì:

- `project-rules.md`
- `TASK_DECOMPOSITION.md`
- `AI_FAILURE_AUDIT.md`: chỉ ghi lỗi hoặc thất bại thực tế của AI; không ghi lỗi giả định.

Git: xem mục 14.

## 12. Trạng thái các điểm cần xác nhận

| #   | Điểm                               | Trạng thái                                             |
| --- | ---------------------------------- | ------------------------------------------------------ |
| 1   | Số lượng DeveloperCard             | Đã chốt: một card mặc định                             |
| 2   | `tier` hay `level`                 | Đã chốt: `tier`                                        |
| 3   | `aria-label` của skills            | Đã chốt: `Engineered Skills`                           |
| 4   | Avatar fallback                    | Đã chốt: cả thiếu URL và ảnh lỗi                       |
| 5   | Nhãn metrics                       | Đã chốt: giữ nguyên key                                |
| 6   | "Pure" và `useState`               | Đã chốt: giữ `useState` với `failedUrl`                |
| 7   | Nơi đặt project và Git             | Đã chốt: repo trên máy người làm bài                   |
| 8   | Script `ex1-verification-audit.sh` | Không có bản chính thức; dùng hai lệnh grep trên slide |
| 9   | Vị trí file                        | `src/components/` (theo slide 13 và 14)                |

Chưa còn điểm nào mở. Điểm mới phát sinh sẽ được thêm vào đây.

## 13. Tiêu chí hoàn thành Exercise 1

- [ ] Có `DeveloperCard` và `SkillBadge` trong `src/components/`.
- [ ] Sử dụng React 19 và Vite.
- [ ] `DeveloperCard.jsx` không chứa `<div>` (grep ra 0 kết quả).
- [ ] Không có `http://` trong `DeveloperCard.jsx` (grep ra 0 kết quả).
- [ ] Sử dụng Semantic HTML phù hợp.
- [ ] Metrics render bằng `<dl>`, `<dt>`, `<dd>`, `Object.entries()` và `Fragment key={k}`.
- [ ] Skills render bằng `<ul aria-label="Engineered Skills">` và `<li key={s.id}>`.
- [ ] `SkillBadge` nhận `name`, `tier`, thẻ gốc `<span>`, hiển thị `name (tier)`.
- [ ] Avatar dùng HTTPS, có width/height và fallback initials (thiếu URL và ảnh lỗi).
- [ ] Có `DeveloperCard.module.css` và CSS Custom Properties; không còn inline style.
- [ ] Responsive từ 375px đến 1440px, không horizontal scroll.
- [ ] Accessibility Tree có cấu trúc `article → header + dl + list`.
- [ ] Từ 10 commits trở lên, có hai commit bắt buộc đúng message theo slide.
- [ ] Các tài liệu dự án được cập nhật trung thực.

## 14. Kế hoạch triển khai và Git

### 14.1. Thứ tự task và commit

Thứ tự phụ thuộc chính: T0 → T1 → T2 → T6 → T7 → T8 → T9 → T10 → T11 → T12. Task tài liệu T3–T5 làm sau T1. ★ là commit bắt buộc.

| Task | Commit           | Message đề xuất                                              |
| ---- | ---------------- | ------------------------------------------------------------ |
| T0   | (không)          | kiểm tra môi trường                                          |
| T1   | C1               | `chore: scaffold React 19 project with Vite`                 |
| T2   | C2               | `chore: remove Vite template boilerplate`                    |
| T3   | C3               | `docs: add project-rules.md`                                 |
| T4   | C4               | `docs: add TASK_DECOMPOSITION.md`                            |
| T5   | C5               | `docs: add AI_FAILURE_AUDIT.md template`                     |
| T6   | C6 ★             | `feat(ex1): implement semantic DeveloperCard and SkillBadge` |
| T7   | C7               | `feat(ex1): render DeveloperCard in App`                     |
| T8   | C8               | `feat(ex1): add avatar initials fallback`                    |
| T9   | C9               | `style(ex1): style card header and avatar`                   |
| T10  | C10              | `style(ex1): style metrics and skills list`                  |
| T11  | C11 ★            | `style(ex1): add responsive 375px CSS module`                |
| T12  | (không bắt buộc) | chỉ commit nếu kiểm tra phát hiện lỗi cần sửa                |

Tổng: 11 commits chắc chắn. Message ngoài hai commit ★ là đề xuất, có thể chỉnh.

### 14.2. Chi tiết từng task

**T0 – Kiểm tra môi trường**

- Mục tiêu: biết máy đã có Node, npm, Git; thư mục đã là repo chưa.
- Lệnh: xem mục 5. Chỉ đọc, không thay đổi gì.
- Tiêu chí: có kết quả các lệnh; kết quả được ghi vào mục 5.

**T1 – Khởi tạo project React 19 + Vite**

- Mục tiêu: project chạy được.
- File: do template Vite tạo (`package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `.gitignore`...).
- Lệnh cài đặt chỉ chạy sau khi giải thích và được người làm bài đồng ý.
- Tiêu chí: `npm ls react` cho thấy React 19; `npm run dev` chạy được; `npm run build` thành công.

**T2 – Dọn boilerplate của template**

- File: `src/App.jsx`, `src/App.css`, `src/index.css`, `src/assets/*`, `public/*` (xóa hoặc rút gọn phần demo).
- Tiêu chí: `npm run build` vẫn thành công; không còn import tới file đã xóa.

**T3 – `project-rules.md`**

- File: `project-rules.md` (bản đã cập nhật theo quyết định).
- Tiêu chí: khớp các quyết định ở mục 4; không còn câu "đúng hai commit".

**T4 – `TASK_DECOMPOSITION.md`**

- File: `TASK_DECOMPOSITION.md` (bản này).
- Tiêu chí: không còn điểm mở chưa được ghi rõ.

**T5 – Khung `AI_FAILURE_AUDIT.md`**

- File: `AI_FAILURE_AUDIT.md` có 5 mục: đề xuất sai, vì sao sai, cách phát hiện, cách khắc phục, bài học.
- Tiêu chí: không có mục lỗi nào nếu chưa có lỗi thật; lỗi thật được ghi bổ sung khi phát sinh.

**T6 ★ – `SkillBadge` + `DeveloperCard` + CSS Module tối thiểu**

- File tạo: `src/components/SkillBadge.jsx`, `src/components/DeveloperCard.jsx`, `src/components/DeveloperCard.module.css`.
- Kết quả: hai component theo slide 14 và các quyết định ở mục 4.
- Tiêu chí: `npm run build` thành công; hai lệnh grep ở mục 10.1 ra 0 kết quả; metrics dùng `Object.entries()`.

**T7 – `App` render `<DeveloperCard />`**

- File sửa: `src/App.jsx` (có thể `src/main.jsx` nếu cần).
- Tiêu chí: card hiển thị với default props; Console không lỗi.

**T8 – Avatar fallback**

- File sửa: `src/components/DeveloperCard.jsx`, `DeveloperCard.module.css` (chỉ class initials 64×64).
- Tiêu chí: ba trường hợp ảnh OK / URL rỗng / URL hỏng; tên rỗng ra `?`; layout không nhảy.

**T9 – Style header và avatar**

- File sửa: `DeveloperCard.module.css` (CSS Custom Properties, header, avatar, initials).
- Tiêu chí: ảnh và initials cùng kích thước, cân đối.

**T10 – Style metrics và skills**

- File sửa: `DeveloperCard.module.css`.
- Tiêu chí: `<dl>`, `<ul>`, badge đọc rõ trên màn hình rộng.

**T11 ★ – Responsive**

- File sửa: `DeveloperCard.module.css`.
- Tiêu chí: kiểm tra 375px, 768px, 1440px; không horizontal scroll.

**T12 – Kiểm tra cuối**

- Mục tiêu: bằng chứng cho từng mục ở mục 13.
- Tiêu chí: mỗi mục có kết quả kiểm tra cụ thể; lỗi tìm thấy được sửa và ghi vào commit phù hợp.

### 14.3. Cách phối hợp (project nằm trên máy người làm bài)

Với mỗi task: trợ lý nêu mục tiêu, file liên quan và cách làm, rồi đưa code hoặc lệnh. Người làm bài tạo hoặc sửa file trong editor, chạy lệnh trên máy mình và gửi kết quả (output, thông báo lỗi, ảnh chụp trình duyệt) để trợ lý review. Trợ lý không tuyên bố một task hoàn thành khi chưa có kết quả kiểm tra do người làm bài cung cấp. Không chuyển sang task tiếp theo khi task hiện tại chưa được kiểm tra.

### 14.4. Quy trình Git với mỗi commit

Trợ lý không chạy `git commit`. Trước mỗi commit:

1. Trợ lý giải thích lệnh sắp dùng.
2. `git status` để xem file nào đã đổi.
3. `git diff` (và `git diff --staged` sau khi add) để đọc nội dung thay đổi.
4. `git add <từng file>`; không dùng `git add .` để tránh kéo theo file không thuộc commit.
5. Người làm bài xác nhận, rồi tự chạy `git commit -m "..."`.
6. Cuối cùng: `git log --oneline` để kiểm tra lịch sử.

Lưu ý: các file tài liệu (`project-rules.md`, `TASK_DECOMPOSITION.md`) có thể đã nằm trong thư mục trước khi scaffold. Khi chạy `git status` chúng hiện là untracked; chỉ `git add` các file thuộc đúng commit đang làm.

## 15. Thay đổi so với bản đầu

1. Mục 2.7, 10.4, 11, 13: "đúng hai atomic commits" → từ 10 commits trở lên, trong đó có hai commit bắt buộc.
2. Mục 2.1, 8: chốt dùng `useState` với `failedUrl`; không còn cảnh báo mâu thuẫn "pure".
3. Mục 2.4, 6: chốt `name`, `tier`, `<span>`, `name (tier)`, `aria-label="Engineered Skills"`.
4. Mục 2.5, 8: chốt fallback cho cả hai trường hợp.
5. Mục 2.6, 6, 9: bỏ "viết CSS riêng nếu cần"; chốt không có `SkillBadge.module.css`; ghi lại yêu cầu thay inline style của slide 18.
6. Mục 3: chốt một card mặc định.
7. Mục 4: bảng quyết định thiết kế đã chốt.
8. Mục 5: đổi thành kiểm tra môi trường trên máy người làm bài (T0).
9. Mục 10.1: ghi lại hai lệnh grep trên slide 13; không tự tạo script thay giảng viên.
10. Mục 12, 13: bảng trạng thái, sửa lỗi cú pháp checkbox, thêm tiêu chí cho `SkillBadge`, grep và Git.
11. Mục 14: thêm kế hoạch task, kế hoạch 11 commits, cách phối hợp và quy trình Git.
