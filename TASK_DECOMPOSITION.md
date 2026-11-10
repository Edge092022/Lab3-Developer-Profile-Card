# TASK DECOMPOSITION – PHÂN RÃ CÔNG VIỆC LAB 03

## 1. Mục tiêu và phạm vi

Phân chia Lab 03 thành các giai đoạn và nhiệm vụ nhỏ để dễ triển khai, theo dõi tiến độ và kiểm tra kết quả.

**Phạm vi:**

- Exercise 1 – DeveloperCard + SkillBadge
- Exercise 2 – ScientistDirectory
- Exercise 3 – PubgMatchTelemetry
- Bonus – SituationshipAnalyzer (bắt buộc làm, không cộng điểm)
- Homework 3 – KRAFTON PUBG VN Airdrop Arena

Homework 1, 2 sẽ được bổ sung thành các giai đoạn riêng trước khi bắt đầu làm.

Nguyên tắc:

- Hoàn thành yêu cầu bắt buộc trước.
- Ưu tiên chức năng đúng trước khi tối ưu giao diện.
- Không thêm tính năng ngoài đề khi chưa hoàn thành yêu cầu chính.
- Mỗi nhiệm vụ cần có kết quả và tiêu chí hoàn thành rõ ràng.

### 1.1. Nhãn nguồn

| Nhãn | Ý nghĩa                                                                                     |
| ---- | ------------------------------------------------------------------------------------------- |
| [ĐỀ] | Yêu cầu từ slide Lab 03 (Task Specifications, Reference Contract, Verification) hoặc rubric |
| [CN] | Quyết định cá nhân của người làm bài, không phải yêu cầu của đề                             |
| [XM] | Chưa xác minh hoặc chưa đủ dữ liệu; không được coi là yêu cầu bắt buộc                      |

Với Exercise 1: khi code mẫu slide 14 khác phần mô tả trên cùng slide, **code mẫu là chuẩn** [CN].

### 1.2. Cấu trúc thư mục đã chốt [CN]

```
Lab3_WD/
├── .vscode/
│   └── settings.json
├── .gitignore
├── AI_FAILURE_AUDIT.md
├── project-rules.md
├── TASK_DECOMPOSITION.md
├── Ex1/
├── Ex2/
├── Ex3/
├── Bonus/
└── HW3/
```

- Mỗi Exercise có một folder riêng chứa source code và các file cần thiết của Exercise đó.
- Các tài liệu dự án và cấu hình chung nằm ở thư mục gốc.
- Đường dẫn trong slide (`src/components/...`) được hiểu là tương đối với folder của Exercise tương ứng:

| Exercise | File chính theo slide                      | Đường dẫn tính từ thư mục gốc                    |
| -------- | ------------------------------------------ | ------------------------------------------------ |
| Ex1      | `src/components/DeveloperCard.jsx`         | `Ex1/src/components/DeveloperCard.jsx`           |
| Ex1      | `src/components/DeveloperCard.module.css`  | `Ex1/src/components/DeveloperCard.module.css`    |
| Ex1      | `src/components/SkillBadge.jsx`            | `Ex1/src/components/SkillBadge.jsx`              |
| Ex2      | `src/components/ScientistDirectory.jsx`    | `Ex2/src/components/ScientistDirectory.jsx`      |
| Ex3      | `src/components/PubgMatchTelemetry.jsx`    | `Ex3/src/components/PubgMatchTelemetry.jsx`      |
| Bonus    | `src/components/SituationshipAnalyzer.jsx` | `Bonus/src/components/SituationshipAnalyzer.jsx` |

### 1.3. Quyền kiểm soát Git [CN]

- Người làm bài quyết định thời điểm commit và push.
- Claude Code không tự commit hoặc push khi chưa có sự cho phép rõ ràng của người làm bài.
- AI chỉ đề xuất commit message và thời điểm commit; chờ người làm bài duyệt trước khi thực hiện.
- Giữ nguyên lịch sử Git hiện tại; không rewrite commit cũ.

## 2. Phân rã công việc

### Giai đoạn 0 – Chuẩn bị dự án

| ID  | Nhiệm vụ                               | Kết quả cần đạt                                                                                                                                                                                                                                            | Nguồn       |
| --- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 0.1 | Kiểm tra cấu trúc thư mục hiện tại     | Đối chiếu cấu trúc hiện tại với cấu trúc đích ở mục 1.2 (`Ex1/`, `Ex2/`, `Ex3/`); kiểm tra các file cấu hình và tài liệu ở thư mục gốc; ghi lại điểm khác biệt. Không tự ý di chuyển, xóa hoặc tạo lại file khi chưa được duyệt                            | [CN]        |
| 0.2 | Kiểm tra `Ex1/` và đề xuất khởi tạo    | Kiểm tra `Ex1/` đã tồn tại hay chưa và có những file gì; xác nhận chưa có project Vite được khởi tạo; đề xuất cấu hình khởi tạo project Vite dùng React 19.x trong `Ex1/` [ĐỀ: React 19 + Vite]. Chưa chạy lệnh khởi tạo hoặc tạo file khi chưa được duyệt | [ĐỀ] + [CN] |
| 0.3 | Xác định cách tổ chức `Ex2/` và `Ex3/` | Xác định cách tổ chức và khởi tạo project cho `Ex2/`, `Ex3/`, thống nhất với cách làm của `Ex1/` (xem mục 4). Chưa tạo folder hoặc chạy lệnh khởi tạo trước khi được duyệt                                                                                 | [CN] + [XM] |
| 0.4 | Kiểm tra `project-rules.md`            | Xác nhận nội dung được giữ nguyên; không chỉnh sửa, bổ sung hoặc viết lại                                                                                                                                                                                  | [CN]        |
| 0.5 | Hoàn thiện `TASK_DECOMPOSITION.md`     | Tài liệu được người làm bài duyệt                                                                                                                                                                                                                          | [CN]        |

Việc khởi tạo project cho từng Exercise là nhiệm vụ riêng (1.0b, 2.0, 3.0, 5.0, 6.0), chỉ thực hiện sau khi phương án ở 0.2 và 0.3 được duyệt [CN].

**Tiêu chí hoàn thành:**

- [ ] Đã kiểm tra và ghi nhận cấu trúc repository hiện tại.
- [ ] Đã thống nhất phương án khởi tạo project Vite React 19.x cho từng Exercise.
- [ ] Đã xác định cách tổ chức `Ex1/`, `Ex2/`, `Ex3/`.
- [ ] `TASK_DECOMPOSITION.md` được người làm bài duyệt.
- [ ] `project-rules.md` được giữ nguyên.

### Giai đoạn 1 – Exercise 1: DeveloperCard và SkillBadge (làm lại từ đầu)

Implementation Exercise 1 cũ đã được người làm bài xóa; xây dựng lại từ đầu, không khôi phục bản cũ và không yêu cầu xóa lại [CN]. Mọi đường dẫn trong giai đoạn này tính từ `Ex1/`.

| ID   | Nhiệm vụ                           | Kết quả cần đạt                                                                                                                                                                                                                          | Nguồn                       |
| ---- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1.0  | Xác nhận trạng thái trước khi làm  | Kiểm tra `git status` và `git diff` để xác nhận, ghi nhận các thay đổi xóa implementation cũ đã thực hiện trước đó; ghi nhận các file còn tham chiếu tới file đã xóa (nếu có). Không tự ý xóa thêm file hoặc khôi phục implementation cũ | [CN]                        |
| 1.0b | Khởi tạo project Vite trong `Ex1/` | Thực hiện theo phương án đã duyệt ở 0.2; `npm ls react` cho React 19.x; `npm run dev` chạy được                                                                                                                                          | [ĐỀ] + [CN]                 |
| 1.1  | Xác định dữ liệu hồ sơ             | Default parameters theo slide 14: `fullName`, `role`, `avatarUrl` (HTTPS), `metrics` (`commits`, `vdomNodes`, `a11yScore`), `skills`                                                                                                     | [ĐỀ]                        |
| 1.2  | Xây dựng SkillBadge                | Component riêng trong `src/components/`; nhận `name`, `tier`; thẻ gốc `<span>`; hiển thị `name (tier)`                                                                                                                                   | [ĐỀ] + [CN]                 |
| 1.3  | Xây dựng DeveloperCard             | `article[aria-labelledby='dev-heading'] → header(img + hgroup) + dl + ul[aria-label='Engineered Skills']`; named export như contract                                                                                                     | [ĐỀ]                        |
| 1.4  | Truyền dữ liệu bằng Props          | ES6 default parameters; không dùng `defaultProps`; `App` render một `<DeveloperCard />`                                                                                                                                                  | [ĐỀ] + [CN]                 |
| 1.4b | Xử lý Avatar                       | HTTPS, `width`/`height` = 64 (CLS 0); fallback initials khi thiếu `avatarUrl` và khi ảnh lỗi; dùng state `failedUrl`, không `useEffect`                                                                                                  | Yêu cầu [ĐỀ], cách làm [CN] |
| 1.6  | Tạo giao diện bằng CSS Modules     | `DeveloperCard.module.css` + CSS Custom Properties; không inline style; chỉ một file CSS Module dùng chung cho SkillBadge                                                                                                                | [ĐỀ] + [CN]                 |
| 1.7  | Kiểm tra Responsive                | iPhone SE (375px) không cuộn ngang                                                                                                                                                                                                       | [ĐỀ]                        |
| 1.5  | Xử lý chọn SkillBadge (bổ sung)    | Hiển thị thông tin kỹ năng được chọn. **Không có trong slide.** Chỉ làm sau 1.7 khi các yêu cầu bắt buộc đã xong và người làm bài đồng ý                                                                                                 | [CN]                        |

Chi tiết đã chốt cho Exercise 1 [CN]:

- Skill object dùng `id`, `name`, `tier` (không dùng `level`); `<li key={s.id}>` chứa một `<SkillBadge />`.
- Metrics dùng `Object.entries(metrics)` và `<Fragment key={k}>` bọc cặp `<dt>`/`<dd>`; giữ nguyên key làm nhãn.
- Initials: chữ đầu mọi từ của `fullName` (`Tran Vinh Khiem` → `TVK`); tên rỗng → `?`; `<span aria-hidden="true">` kích thước 64×64.
- Logic avatar nằm trong `DeveloperCard`, không tạo component `Avatar` riêng.

**Tiêu chí hoàn thành** (các lệnh chạy trong `Ex1/`):

- [ ] `grep -n '<div' src/components/DeveloperCard.jsx` → 0 kết quả [ĐỀ]
- [ ] `grep -n 'http://' src/components/DeveloperCard.jsx` → 0 kết quả [ĐỀ]
- [ ] Chrome DevTools, Accessibility Tree: `article → header + dl + list` [ĐỀ]
- [ ] Device Toolbar, iPhone SE (375px): không cuộn ngang [ĐỀ]
- [ ] Avatar: thử đủ ba trường hợp ảnh tải được, URL rỗng, URL hỏng; layout không nhảy [CN]
- [ ] Có 2 commit đúng message bắt buộc (mục 3) [ĐỀ]

### Giai đoạn 2 – Exercise 2: ScientistDirectory

Mọi đường dẫn trong giai đoạn này tính từ `Ex2/`. Thứ tự xử lý dữ liệu [CN]: Original list → Search → IQ filter → Sort → Display. Dữ liệu hiển thị (`visible`) được tính trực tiếp trong render [ĐỀ].

| ID  | Nhiệm vụ                            | Kết quả cần đạt                                                                                                                                  | Nguồn       |
| --- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 2.0 | Khởi tạo project trong `Ex2/`       | Thực hiện theo phương án đã duyệt ở 0.3, thống nhất với `Ex1/`; React 19.x; project chạy được                                                    | [ĐỀ] + [CN] |
| 2.1 | Chuẩn bị dữ liệu nhà khoa học       | `SMART_PEOPLE` gồm 6 bản ghi `sp-1` … `sp-6` với `id`, `name`, `age`, `iq`                                                                       | [ĐỀ]        |
| 2.2 | Xây dựng giao diện danh sách        | `section[aria-label]`, `form role='search'`, `<ul>` với `key={p.id}`; component tại `src/components/ScientistDirectory.jsx`                      | [ĐỀ]        |
| 2.3 | Xây dựng chức năng Search           | Tìm theo tên, không phân biệt hoa thường, có `trim()`                                                                                            | [ĐỀ]        |
| 2.4 | Xây dựng chức năng Filter           | Lọc **IQ tối thiểu** bằng `e.target.valueAsNumber`; NaN → 0; mặc định 160                                                                        | [ĐỀ]        |
| 2.5 | Xây dựng chức năng Sort             | `sortBy`: `iq-desc` (IQ giảm dần) hoặc Age tăng dần, dùng `.toSorted()`. Dạng control chọn sort: [XM]                                            | [ĐỀ] + [XM] |
| 2.6 | Xây dựng Delete                     | Xóa một mục khỏi state bằng `prev.filter((p) => p.id !== id)`                                                                                    | [ĐỀ]        |
| 2.7 | Xây dựng Reset                      | Khôi phục toàn bộ danh sách gốc. Nguồn khôi phục là `SMART_PEOPLE` hay prop `initialData`: [XM]                                                  | [ĐỀ] + [XM] |
| 2.8 | Ràng buộc kỹ thuật (áp dụng từ 2.2) | Không dùng `useEffect` cho lọc/sắp xếp; mọi input có `<label htmlFor>` + `useId()`; số kết quả trong `<output role='status' aria-live='polite'>` | [ĐỀ]        |

State chỉ gồm các giá trị độc lập: `people`, `query`, `minIq`, `sortBy` [ĐỀ]. Không thêm Trash hoặc Permanent Delete [CN].

**Tiêu chí hoàn thành:**

- [ ] Search, Filter, Sort, Delete và Reset hoạt động đúng; kết hợp các thao tác không làm mất điều kiện tìm kiếm hoặc lọc [CN]
- [ ] React DevTools Profiler: gõ 1 ký tự vào ô tìm kiếm tạo đúng 1 lần render [ĐỀ]
- [ ] Xóa "Johann Goethe" giữ focus và giữ key của các mục còn lại [ĐỀ]. Vị trí focus mong đợi: [XM]
- [ ] Không có `useEffect` trong logic lọc/sắp xếp [ĐỀ]
- [ ] Có 3 commit đúng message bắt buộc (mục 3) [ĐỀ]

### Giai đoạn 3 – Exercise 3: PubgMatchTelemetry

Mọi đường dẫn trong giai đoạn này tính từ `Ex3/`.

| ID  | Nhiệm vụ                           | Kết quả cần đạt                                                                                                                                                                                       | Nguồn              |
| --- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 3.0 | Khởi tạo project trong `Ex3/`      | Thực hiện theo phương án đã duyệt ở 0.3, thống nhất với `Ex1/`; React 19.x; project chạy được                                                                                                         | [ĐỀ] + [CN]        |
| 3.1 | Xác định các trạng thái            | Dữ liệu `PUBG_VN_SQUADS` (CES, TE, GE); state `{ status, data, error }` với `IDLE`, `LOADING`, `SUCCESS`, `ERROR`; component tại `src/components/PubgMatchTelemetry.jsx`                              | [ĐỀ]               |
| 3.2 | Xây dựng giao diện từng trạng thái | Hiển thị đúng theo state; SUCCESS hiển thị tối thiểu tên đội và kills như contract. Giao diện IDLE: [XM]                                                                                              | [ĐỀ] + [XM]        |
| 3.3 | Xây dựng Skeleton UI               | Skeleton cao 220px, hiệu ứng pulse, `aria-busy='true'`; CLS 0.00. Dùng CSS Module hay class thường: [XM]                                                                                              | [ĐỀ] + [XM]        |
| 3.4 | Xử lý yêu cầu bất đồng bộ          | Mô phỏng 35% packet loss cho Erangel/Miramar [ĐỀ]. Cách cài `fetchKraftonPubgTelemetry` (endpoint, schema, độ trễ): đề xuất khi đến Exercise 3, là quyết định cá nhân [CN]. Phạm vi áp dụng 35%: [XM] | [ĐỀ] + [CN] + [XM] |
| 3.5 | Áp dụng AbortController            | Đổi squad thì effect cleanup gọi `controller.abort()`; `AbortError` được bỏ qua, không hiện lỗi giả                                                                                                   | [ĐỀ]               |
| 3.6 | Xây dựng Retry                     | Lỗi hiển thị trong `<section role='alert'>`; nút Retry tăng `retryTick` để chạy lại effect; không dùng `alert()`. Nhãn nút (slide ghi 3 cách khác nhau): [XM]                                         | [ĐỀ] + [XM]        |
| 3.7 | Xây dựng Squad Selector            | Chọn CES / TE / GE để đổi `squadId`. Component nào render selector: [XM]                                                                                                                              | [ĐỀ] + [XM]        |

**Tiêu chí hoàn thành:**

- [ ] Giao diện phản ánh đúng bốn trạng thái [ĐỀ]
- [ ] DevTools Network "Slow 3G": skeleton không gây layout shift (CLS 0.00) [ĐỀ]
- [ ] Bấm nhanh CES → TE → GE: request cũ bị hủy, không hiện lỗi giả [ĐỀ]. Cách quan sát "(canceled)" phụ thuộc cách mô phỏng ở 3.4: [XM]
- [ ] Retry chạy lại request khi lỗi [ĐỀ]
- [ ] Có 2 commit đúng message bắt buộc (mục 3) [ĐỀ]

### Giai đoạn 4 – Kiểm thử và hoàn thiện 3 Exercise

| ID  | Nhiệm vụ                     | Kết quả cần đạt                                                                                                                                                            | Nguồn         |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 4.1 | Kiểm thử các chức năng       | Các chức năng của Exercise 1, 2, 3 hoạt động                                                                                                                               | [ĐỀ]          |
| 4.2 | Kiểm tra Responsive 375px    | Không có tràn ngang ở cả 3 Exercise                                                                                                                                        | [ĐỀ]          |
| 4.3 | Kiểm tra Accessibility       | Label liên kết đúng; mục tiêu WCAG 2.2 AA và Lighthouse Accessibility 100                                                                                                  | [ĐỀ] (rubric) |
| 4.4 | Kiểm tra API bị cấm          | Tìm trong `Ex1/src/`, `Ex2/src/`, `Ex3/src/`, `Bonus/src/`: class component, `ReactDOM.render`, `defaultProps`, `keyCode`, `alert(`, `dangerouslySetInnerHTML` → 0 kết quả | [ĐỀ] (rubric) |
| 4.5 | Kiểm tra và sửa lỗi          | Không còn lỗi đã biết ảnh hưởng chức năng; Console không lỗi                                                                                                               | [CN]          |
| 4.6 | Cập nhật AI_FAILURE_AUDIT.md | Giữ nguyên 2 lỗi đã có; chỉ ghi thêm lỗi AI thực tế phát sinh trong 3 Exercise, ghi ngay khi phát hiện; không tạo lỗi giả, không đặt số lượng tối thiểu                    | [CN]          |
| 4.7 | Kiểm tra Git History         | Đủ 9 commit đúng message bắt buộc [ĐỀ]; mục tiêu cá nhân ít nhất 10 commit có ý nghĩa [CN]; lịch sử cũ được giữ nguyên [CN]                                                | [ĐỀ] + [CN]   |
| 4.8 | Kiểm tra toàn bộ sản phẩm    | Sẵn sàng nộp                                                                                                                                                               | [CN]          |

### Giai đoạn 5 – Bonus: SituationshipAnalyzer

Mọi đường dẫn trong giai đoạn này tính từ `Bonus/`. Bài bắt buộc làm, không cộng điểm [ĐỀ].

Thiết kế FSM đã chốt [CN]:

| Phase hiện tại | Sự kiện                      | Phase tiếp theo   |
| -------------- | ---------------------------- | ----------------- |
| FRIENDS        | Bấm "Bắt đầu hẹn hò"         | DATING_NO_LOVE    |
| DATING_NO_LOVE | Hai bên nghiêm túc           | OFFICIAL_LOVE     |
| DATING_NO_LOVE | Timer 5s hết, seen không rep | GHOSTED_EXIT      |
| DATING_NO_LOVE | Bấm "Dừng lại" (luôn hiện)   | SELF_RESPECT_EXIT |
| Phase kết thúc | Bấm "Làm lại từ đầu"         | FRIENDS           |

- Tách `GHOSTED_EXIT` và `SELF_RESPECT_EXIT` vì hai nghĩa khác nhau: một bên bị bỏ rơi, một bên chủ động rời đi [CN].
- Ba phase `OFFICIAL_LOVE`, `GHOSTED_EXIT`, `SELF_RESPECT_EXIT` là phase kết thúc; nút "Làm lại từ đầu" chỉ để demo [CN].

| ID  | Nhiệm vụ                   | Kết quả cần đạt                                                                                                 | Nguồn       |
| --- | -------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------- |
| 5.0 | Khởi tạo project `Bonus/`  | Thống nhất với `Ex1/`–`Ex3/`; React 19.x; project chạy được                                                     | [ĐỀ] + [CN] |
| 5.1 | Mô hình FSM                | Một state `phase` duy nhất theo bảng trên; không dùng boolean `isDating`/`isLoved`                              | [ĐỀ] + [CN] |
| 5.2 | Derived state bất đối xứng | `myImpact = myTries × 0.1`, `rivalImpact = rivalTries × 50`, `isRedFlag` tính trong render; không `useEffect`   | [ĐỀ]        |
| 5.3 | Timer ghosting             | `useEffect` chỉ chạy khi phase là `DATING_NO_LOVE`; sau 5s chuyển `GHOSTED_EXIT`; cleanup `clearTimeout`        | [ĐỀ]        |
| 5.4 | UI và Accessibility        | Input có `<label htmlFor>` + `useId()`; cảnh báo cờ đỏ trong `<output role='status' aria-live='polite'>`; 375px | [ĐỀ]        |

**Tiêu chí hoàn thành:**

- [ ] Không có tổ hợp boolean mâu thuẫn; UI chỉ ở đúng một phase tại mọi thời điểm [ĐỀ]
- [ ] Đổi phase hoặc unmount trước 5s: timer bị hủy, không chuyển phase sai [ĐỀ]
- [ ] Không có `useEffect` cho phần tính điểm/cờ đỏ [ĐỀ]
- [ ] 375px không cuộn ngang [ĐỀ]
- [ ] Có 2 commit đúng message bắt buộc (mục 3) [ĐỀ]

### Giai đoạn 6 – Homework 3: KRAFTON PUBG VN Airdrop Arena

Mọi đường dẫn trong giai đoạn này tính từ `HW3/`. Dữ liệu leaderboard là dữ liệu mới 5 đội theo `PubgVnSquadStanding` (te, ces, ge = Genius Esports, agg, roy); chỉ giữ cách đặt id/tên đội như Exercise 3; điểm số tự đặt [CN].

Thiết kế phase đã chốt [CN]:

| Phase hiện tại | Sự kiện                | Phase tiếp theo |
| -------------- | ---------------------- | --------------- |
| WARMUP         | Đồng hồ đếm ngược về 0 | AIRDROP_LIVE    |
| AIRDROP_LIVE   | Kho về 0               | LOOTED_OUT      |
| AIRDROP_LIVE   | Hết 5 phút bán         | EXPIRED         |

- Kho về 0 và hết giờ cùng lúc: ưu tiên `EXPIRED`, vì hết giờ là quy tắc chung của cả phiên bán [CN].
- Thời gian đếm ngược và thời gian bán là hằng số; khi demo rút ngắn còn khoảng 30 giây [CN].
- Phase được suy ra từ thời gian và kho trong render, không lưu thành state riêng [CN].
- Mốc hết hạn = `dropEpochMs + SALE_DURATION_MS`; không thêm field mới vào contract [CN].
- 3 crate, drop lệch giờ nhau để demo nhiều phase cùng lúc; reload trang thì đếm lại từ đầu [CN].
- Hằng số thời gian đặt chung trong `src/data/crates.js`, sửa tay khi demo; `serverOffsetMs` cố định bằng 0 [CN].
- Mỗi crate là một `<CrateCard>` gọi hook 2 lần (mốc drop và mốc hết hạn) [CN].

Quyết định cho Claim [CN]:

- Optimistic: bấm Claim thì trừ kho trên UI ngay, rồi mới gửi request.
- Khóa nút khi đang chờ server (in-flight lock) theo từng crate: nhiều crate có thể claim song song, mỗi crate tối đa một request.
- Cha giữ mảng `crates` (cập nhật bằng `map`); `CrateCard` giữ `claimStatus`: `'IDLE' | 'PENDING' | 'CLAIMED'`, không dùng 2 boolean.
- Mỗi crate claim thành công tối đa 1 lần, sau đó hiện "Đã nhận"; server trả thành công sau khi đã `EXPIRED` vẫn tính "Đã nhận".
- Quản lý bằng `useState`, không dùng `useOptimistic`, để tự viết và giải thích được rollback.
- Server giả lập (`src/api/fakeClaimServer.js`) giữ kho riêng, dùng chung nguồn `CRATES` với UI: trễ khoảng 1 giây, còn hàng thì 35% trả 409 (đồng bộ với Exercise 3), kho về 0 thì luôn trả 409.
- Nhận 409: rollback bằng updater cộng lại 1, hiện thông báo trong `role='alert'`.
- Unmount: `AbortController` hủy request, bỏ qua `AbortError`. Không rollback khi unmount giữa chừng vì crate chỉ unmount cùng cả app [CN].

Quyết định UI và file [CN]:

- Đồng hồ hiển thị bằng `<time>`, không đặt trong `aria-live`; `<output role='status'>` chỉ báo khi đổi phase và kết quả claim.
- Leaderboard: `<select>` có label; mọi tiêu chí sắp giảm dần; bằng điểm thì xếp theo Kill rồi theo tên; có cột hạng (#).
- File: `src/hooks/usePubgAirdropTimer.js`, `src/data/crates.js`, `src/data/standings.js`, `src/api/fakeClaimServer.js`, `src/components/AirdropArena.jsx`, `CrateCard.jsx`, `PvsLeaderboard.jsx`, mỗi component kèm một `.module.css`.
- Không làm Virtual Scroller (5 đội không cần).

| ID  | Nhiệm vụ                         | Kết quả cần đạt                                                                                                                                | Nguồn       |
| --- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 6.0 | Khởi tạo project `HW3/`          | Thống nhất với các Exercise; React 19.x; chạy được                                                                                             | [ĐỀ] + [CN] |
| 6.1 | Hook đếm ngược chống trôi        | `usePubgAirdropTimer(targetEpochMs)` tính `target - Date.now()`; có `visibilitychange` để đồng bộ khi mở lại tab; cleanup interval và listener | [ĐỀ]        |
| 6.2 | Phase airdrop                    | 4 phase theo bảng trên, suy ra từ thời gian còn lại và kho                                                                                     | [ĐỀ] + [CN] |
| 6.3 | Claim optimistic và rollback 409 | Trừ kho ngay, khóa nút khi chờ, rollback khi 409; giá hiển thị bằng `Intl.NumberFormat('vi-VN')` (VND)                                         | [ĐỀ] + [CN] |
| 6.4 | Leaderboard                      | Tìm theo tên đội; sắp xếp theo Tổng điểm (mặc định), WWCD, Placement, Kill bằng `.toSorted()`; Tổng điểm là derived state                      | [ĐỀ] + [CN] |
| 6.5 | UI và Accessibility              | Input có `<label htmlFor>` + `useId()`; trạng thái trong `<output role='status'>`; lỗi trong `role='alert'`; 375px                             | [ĐỀ]        |
| 6.6 | Đo performance                   | So sánh thời gian từ lúc bấm Claim tới lúc số vé đổi: optimistic và chờ server. Thao tác đo: [XM]                                              | [CN] + [XM] |

**Tiêu chí hoàn thành:**

- [ ] Ẩn tab 1–2 phút rồi mở lại: đồng hồ vẫn đúng giờ, không bị trôi [ĐỀ]
- [ ] Bấm Claim: số vé đổi ngay; nút bị khóa khi đang chờ [ĐỀ] + [CN]
- [ ] Nhận 409: số vé trả lại đúng giá trị cũ, có thông báo [ĐỀ]
- [ ] Gõ 1 ký tự vào ô tìm: đúng 1 lần render (Profiler); không `useEffect` cho lọc/sắp xếp [ĐỀ]
- [ ] Mọi timer/listener có cleanup [ĐỀ]
- [ ] 375px không cuộn ngang; Lighthouse Accessibility 100 [ĐỀ]
- [ ] Ghi lỗi AI thực tế phát sinh vào `AI_FAILURE_AUDIT.md` [ĐỀ]

## 3. Commit bắt buộc theo đề

Các message dưới đây giữ nguyên chính xác [ĐỀ]. Chỉ commit sau khi phần việc tương ứng đã được triển khai và kiểm thử [CN].

| #   | Exercise | Message                                                            | Nhiệm vụ liên quan                          |
| --- | -------- | ------------------------------------------------------------------ | ------------------------------------------- |
| 1   | Ex1      | `feat(ex1): implement semantic DeveloperCard and SkillBadge`       | 1.0, **1.0b (khởi tạo Vite)**, 1.1 – 1.4b   |
| 2   | Ex1      | `style(ex1): add responsive 375px CSS module`                      | 1.6 – 1.7                                   |
| 3   | Ex2      | `feat(ex2): normalize smartPeople schema with stable IDs`          | **2.0 (khởi tạo Vite)**, 2.1                |
| 4   | Ex2      | `feat(ex2): add search, IQ filter & toSorted`                      | 2.2 – 2.5, 2.8                              |
| 5   | Ex2      | `feat(ex2): add delete/reset & live status`                        | 2.6 – 2.7, 2.8                              |
| 6   | Ex3      | `feat(ex3): implement PUBG VN 4-state telemetry & AbortController` | **3.0 (khởi tạo Vite)**, 3.1, 3.4, 3.5, 3.7 |
| 7   | Ex3      | `feat(ex3): add skeleton UI & retry alert`                         | 3.2, 3.3, 3.6                               |
| 8   | Bonus    | `feat(fsm): model HenHoKhongYeu state machine`                     | **5.0 (khởi tạo Vite)**, 5.1                |
| 9   | Bonus    | `feat(ui): add derived red-flag meter & ghosting cleanup`          | 5.2 – 5.4                                   |
| 10  | HW3      | `feat(hw3): add anti-drift airdrop timer hook`                     | **6.0 (khởi tạo Vite)**, 6.1, 6.2           |
| 11  | HW3      | `feat(hw3): add optimistic claim with 409 rollback`                | 6.3                                         |
| 12  | HW3      | `feat(hw3): add PVS leaderboard filter & sort`                     | 6.4, 6.5                                    |

Commit 10–12 do người làm bài tự đặt vì slide không cho sẵn message cho HW3 [CN].

Quy tắc [CN]:

- Phần khởi tạo project Vite (1.0b, 2.0, 3.0, 5.0, 6.0) được gộp vào commit bắt buộc đầu tiên của Exercise tương ứng; không tạo commit riêng chỉ để khởi tạo project.
- Ranh giới commit theo các message bắt buộc ở trên; nhiệm vụ nhỏ là đơn vị làm và kiểm tra, không phải đơn vị commit.
- Commit khác chỉ tạo khi có thay đổi thực tế nằm ngoài các commit bắt buộc; không tạo commit để đạt số lượng.
- Trước mỗi commit: `git status`, `git diff`, `git add <file>` đúng phạm vi.
- Quyền commit và push thuộc về người làm bài (mục 1.3).

## 4. Điểm cần xác minh

| #   | Điểm                                                                                                                                    | Trạng thái   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | Cách tổ chức và khởi tạo `Ex2/`, `Ex3/`: mỗi folder là một project Vite riêng (có `package.json` riêng) hay cách khác; quyết định ở 0.3 | [XM]         |
| 1b  | Commit chứa phần khởi tạo project (1.0b, 2.0, 3.0): gộp vào commit bắt buộc đầu tiên của Exercise tương ứng, không tạo commit riêng     | Đã chốt [CN] |
| 2   | Lịch sử đã có commit `feat(ex1): implement semantic DeveloperCard and SkillBadge` của bản cũ; commit mới sẽ trùng message               | [XM]         |
| 3   | Việc xóa implementation cũ (đã thực hiện, chưa commit) được đưa vào commit `feat(ex1)` mới hay commit riêng                             | [XM]         |
| 4   | Sau khi khởi tạo: giữ hay dọn các file mẫu của template Vite (CSS toàn cục, asset demo) trong từng Exercise                             | [XM]         |
| 5   | `.gitignore` hiện bỏ qua `.vscode/*` (trừ `extensions.json`), nên `.vscode/settings.json` sẽ không được Git theo dõi                    | [XM]         |
| 6   | Ex2: dạng control chọn sort                                                                                                             | [XM]         |
| 7   | Ex2: Reset khôi phục từ `SMART_PEOPLE` hay `initialData`                                                                                | [XM]         |
| 8   | Ex2: vị trí focus mong đợi sau khi xóa                                                                                                  | [XM]         |
| 9   | Ex3: cách mô phỏng `fetchKraftonPubgTelemetry` (endpoint, schema, độ trễ)                                                               | [XM]         |
| 10  | Ex3: 35% packet loss chỉ áp dụng cho squad ở Erangel/Miramar hay mọi squad                                                              | [XM]         |
| 11  | Ex3: giao diện trạng thái IDLE                                                                                                          | [XM]         |
| 12  | Ex3: nhãn nút Retry ("Reconnect Satellite (Retry)", "Reconnect Telemetry", "Reconnect Satellite")                                       | [XM]         |
| 13  | Ex3: component render squad selector                                                                                                    | [XM]         |
| 14  | Ex3: skeleton dùng CSS Module hay class thường                                                                                          | [XM]         |
| 15  | Rubric ghi 6–8 atomic commits, khác mục tiêu cá nhân ít nhất 10; chưa rõ có ảnh hưởng điểm                                              | [XM]         |

## 5. Quy tắc theo dõi tiến độ

Mỗi nhiệm vụ có một trong ba trạng thái:

- `[ ]` Chưa thực hiện
- `[~]` Đang thực hiện
- `[x]` Hoàn thành và đã kiểm tra

Chỉ đánh dấu hoàn thành khi kết quả đã được kiểm tra, không chỉ khi code đã được viết.

## 6. Nguyên tắc ưu tiên

1. Hoàn thành các yêu cầu bắt buộc của từng Exercise theo thứ tự Exercise 1 → 2 → 3.
2. Dành thời gian kiểm thử, sửa lỗi và chuẩn bị nộp.
3. Phần bổ sung cá nhân (như nhiệm vụ 1.5) chỉ làm khi yêu cầu bắt buộc đã hoàn thành và được đồng ý.

Không bỏ đi chức năng bắt buộc để theo đuổi tính năng bổ sung hoặc giao diện trang trí.
