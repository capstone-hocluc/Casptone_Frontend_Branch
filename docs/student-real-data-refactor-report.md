# Báo cáo (bản sửa) — Student Area: đổi nguồn dữ liệu Mock → API, GIỮ NGUYÊN UI

Bản này thay thế báo cáo trước. Lần trước tôi hiểu sai: "backend không có API → xóa UI". Đúng phải là: **UI trước phase Mock→API là hợp đồng thiết kế**; chỉ thay nguồn dữ liệu ở mức field. Không commit / push / đổi branch. Không cài dependency, không tạo endpoint.

## 1. Cái gì đã bị mất ở lần trước (đối chiếu `git diff HEAD`)

HEAD = commit `d6ad802` (trạng thái Student trước phase Mock→API).

| UI / file bị xóa hoặc thay | Trạng thái nay |
|---|---|
| Dashboard nguyên bản (mục tiêu hôm nay, bài học gần nhất, kế hoạch ôn thi, carousel khóa học, hồ sơ năng lực, tổng quan ôn luyện, luyện đề) → tôi thay bằng bản đơn giản | **Khôi phục** đúng bố cục, cắm API theo field |
| Learning Profile 3 tab (Tổng quan / Học tập / Luyện tập, biểu đồ, hoạt động, thành tựu, phân tích AI, nhận xét GV…) → tôi thay bằng trang mới | **Khôi phục** đủ 3 tab, cắm API theo field |
| `LearningActivity`, `VideoLearningPage`, `CourseDetail` (student) + route | **Khôi phục** page + route |
| `data/studentDashboard.ts`, `learningProfile.ts`, `courseDetail.ts`, `courseLookup.ts`, `supplementaryCourseDetails.ts` | **Khôi phục** (trừ vài export thật sự chết, mục 5) |
| Streak + chuông thông báo trên Topbar (mock) | **Khôi phục** (chỉ tên/ảnh là API) |
| ~4.900 dòng CSS của các trang trên | **Khôi phục** (mục 6) |

## 2. Giữ nguyên (không revert)

`StudentLayout`/`Topbar`/`Sidebar`, `StudentRoutes`, `studentRoutes`/`studentNav`, hydrate current user bằng `GET /users/profiles` (single-flight, 1 request sau F5, Topbar hiện tên/ảnh thật, không còn mock name/avatar), `usePageResource`/`ResourceState`, service layer, refactor Assessment/Placement/Lesson/Course Study, `Field`/`AccountPanel` cho Account Profile (Tailwind), `StudentToast`, các component Tailwind/Radix dùng chung.

## 3. Bảng field: nguồn trước → sau

| UI field / section | Trước | Sau | UI giữ nguyên? |
|---|---|---|---|
| Tên / ảnh user (Topbar, Learning Profile "Hi, …") | mock → API (đã làm đúng) | **API** `GET /users/profiles` | Có |
| Streak, badge chuông (Topbar) | mock | mock — BE chưa có | Có |
| **Dashboard** – Khóa học của tôi (tên, loại, danh sách) | mock | **API** `/courses/my` | Có |
| Dashboard – tiến độ trên thẻ khóa ("Đã học x/y bài học") | mock | **API** `/courses/{id}/study` (`completedLessons/totalLessons`) | Có |
| Dashboard – số bên cạnh cúp trên thẻ khóa | mock ("18/20 câu") | **API** `progressPercentage` (không có endpoint điểm theo khóa; không ghép mock của khóa khác vào khóa thật) | Có (đổi nội dung ô này) |
| Dashboard – Bài học gần nhất: tên bài, tên khóa, "x/y bài học", số thứ tự | mock | **API** `/courses/{id}/study` (`continueLessonId/Title`) | Có |
| Dashboard – Bài học gần nhất: "18/20 câu đúng" | mock | mock — BE chưa có | Có |
| Dashboard – nút "Tiếp tục học", thẻ khóa, "Xem tất cả" | toast "đang phát triển" | điều hướng thật tới Lesson / Study / My Courses | Có |
| Dashboard – Hồ sơ năng lực: giá trị "Hiện tại" | mock | **API** `/assessments/results/me` (category khớp tên môn) | Có (4 hàng gốc) |
| Dashboard – "Dự đoán", "Mục tiêu", hàng môn không có trong kết quả | mock | mock — BE chưa có | Có |
| Dashboard – Bài học đã hoàn thành | mock (12) | **API** tổng `completedLessons` các khóa | Có |
| Dashboard – Tổng thời lượng, Đề đã làm, Điểm cao nhất, Chuỗi học tập | mock | mock — BE chưa có | Có |
| Dashboard – Mục tiêu hôm nay, Kế hoạch ôn thi, Luyện đề (5 đề), | mock | mock — BE chưa có | Có |
| **Learning Profile** – mục tiêu (kỳ thi, điểm mục tiêu) | mock | **API** `studentProfile.targetExam/targetScore` | Có |
| LP – "Độ chính xác" từng môn (Tổng quan + tab Học tập) | mock | **API** phần trăm category placement (khớp tên môn) | Có |
| LP – điểm mạnh / cần cải thiện | mock | **API** `strong/weakCategoryName` (placement) → tự khai báo trong hồ sơ → mock | Có |
| LP – tiến độ khóa học, "Bài học hoàn thành" | mock | **API** `/courses/my`, `/courses/{id}/study` | Có |
| LP – điểm hiện tại/gần nhất, biểu đồ xu hướng điểm | mock | mock — **chưa map có chủ đích**: thang điểm của `score` trong BE chưa rõ, UI là thang 0–1200 | Có |
| LP – so sánh kỳ, luyện tập, lịch sử học, thống kê, phân tích AI, nhận xét GV, thành tựu, heatmap | mock | mock — BE chưa có | Có |
| **Video Learning** – tiêu đề bài, video, thời lượng, bài trước/sau, danh sách bài (drawer), tên khóa | mock | **API** `/lessons/{id}` + `/courses/{id}/study` khi id là bài học thật; id mẫu vẫn dùng mock | Có |
| Video Learning – điều khiển giả, Teacher AI, gợi ý nhanh | mock | mock — BE chưa có endpoint AI | Có |
| **Learning Activity**, **Course Detail (student)** | mock | mock (prototype, id mẫu) — không có field API map được 1-1 | Có |

## 4. Phân loại

**API-BACKED:** user (tên/ảnh), khóa học + tiến độ, bài học gần nhất, năng lực theo môn (placement), mục tiêu học tập, điểm mạnh/yếu, số bài học hoàn thành, dữ liệu bài học ở Video Learning.

**MOCK TEMPORARILY RETAINED** (đều nằm trong `data/studentDashboard.ts`, `data/learningProfile.ts`, `data/courseDetail.ts`… có ghi chú `TODO API`; chỗ trộn API nằm ở `lib/studentViewModel.ts`, tìm chữ `MOCK`): streak, thông báo, mục tiêu hôm nay, kế hoạch ôn thi, danh sách đề luyện, thời lượng học, đề đã làm, điểm cao nhất, điểm bài học, dự đoán/mục tiêu từng môn, điểm hiện tại/xu hướng điểm, so sánh theo kỳ, lịch sử/thống kê học tập, phân tích AI, nhận xét giáo viên, thành tựu, heatmap, Teacher AI, toàn bộ Course Detail/Learning Activity mẫu.

**STATIC CONTENT:** cấu hình sidebar, nhãn UI, danh sách trường/ngành/môn của Onboarding, chuỗi hướng dẫn/empty state.

**ACTUALLY DEAD** (đã xóa, không UI nào dùng): trong `data/studentDashboard.ts` — `myCourses` (thay bằng API), `upcomingSchedule`, `pendingTasks`, `recommendedCourses`, `activityFrequency` (bản dashboard, không ai import); các trường `studentName`, `avatar`, `weeklyTarget`, `overallProgress`, `completedCourses`, `completedTopics`, `targetScore` của `dashboardSummary` (danh tính giờ chỉ lấy từ API). Ngoài ra `account-profile.css` (Account đã là Tailwind). Không còn file data nào khác bị xóa.

## 5. Thiết kế kỹ thuật

- `services/studentService.ts`: `loadStudentSnapshot()` chỉ ghép endpoint có sẵn (`/courses/my`, `/courses/{id}/study` từng khóa, `/assessments/results/me`; chưa có kết quả → `null`).
- `lib/studentViewModel.ts`: `buildDashboardViewModel`, `buildLearningProfileViewModel`, `buildRealVideoSource` — hợp nhất API lên mock theo từng field, comment `API:`/`MOCK:` ở từng dòng. Trang chỉ nhận view-model.
- Learning Profile: các tab đọc dữ liệu qua `LearningProfileDataProvider` (mặc định là mock) thay vì import mock trực tiếp.
- `VideoLearningPage`: id có trong dữ liệu mẫu → mock; id khác → tải bài học thật (`<video>` thật khi có `videoUrl`); lỗi/không phải video → màn "Không tìm thấy".
- Đối chiếu OpenAPI: type FE khớp schema BE (chỉ `Course.imageUrl` không có trong BE).

## 6. CSS — nói thẳng

| File | HEAD | Sau lần sửa sai | Hiện tại |
|---|---|---|---|
| `student-app.css` | 4.875 | 143 | **4.875** |
| `student-app-responsive.css` | 551 | 75 | **551** |
| `account-profile.css` | 475 | xóa | xóa (Account là Tailwind) |

Để bảo đảm đúng UI, tôi khôi phục CSS gốc của 5 màn hình (profile ≈2.430 dòng, activity ≈860, dashboard ≈790, course-detail ≈540, video ≈520). Phân tích dead-CSS xác nhận 0 selector chết (tất cả đều đang được dùng). **Yêu cầu "giảm CSS" cho các trang này CHƯA đạt** — tôi chưa chuyển chúng sang Tailwind, vì viết lại ~5.200 dòng CSS mà vẫn pixel-đúng là việc lớn cần làm tuần tự từng trang. Đề xuất thứ tự: Video (nhỏ nhất, đã có Tailwind một phần) → Dashboard → Course Detail → Learning Activity → Learning Profile; mỗi trang so ảnh với `final2`.

## 7. Kiểm tra

- **Typecheck:** sạch. **Build:** thành công. **Lint:** 4 lỗi + 8 cảnh báo (mốc trước: 4 lỗi + 9 cảnh báo) — không thêm lỗi mới.
- **So ảnh với UI trước phase Mock→API** (1440/1024/768/390): Learning Profile khác ≈0,65% ở mọi độ rộng (chỉ do tên/ảnh Topbar và số liệu API); kích thước trang Dashboard trùng khít, phần khác là nội dung dữ liệu thật. Đã xem thủ công: Dashboard, Learning Profile, Course Detail, Video (mock và bài học thật). Không section nào biến mất.
- **Luồng (API mock, có token):** F5 hydrate → đúng 1 `GET /users/profiles`, Topbar "QN"; Dashboard → My Courses → Study → Lesson → quay lại; Study → Quiz → nộp (1 `answers` + 1 `submit`) → Review; Placement → Kết quả → Review; URL cũ chuyển đúng; guest xem `/courses` vẫn Public. Không lỗi console.
- **Backend thật:** kiểm tra hợp đồng OpenAPI, endpoint công khai và hành vi chưa đăng nhập (401 → `/login`). **Không đăng nhập được** (không có tài khoản test, không đoán mật khẩu) nên **chưa test** Login → Dashboard → Study → Lesson → Quiz → Result → Review bằng API thật.

## 8. Cần xác nhận / hạn chế

1. Thang điểm của `score` (placement result/attempt) — cần BE xác nhận trước khi map vào "Điểm hiện tại/gần nhất/xu hướng" (UI 0–1200).
2. Tên `categoryName` của placement phải khớp tên môn trong UI ("Toán học", "Ngôn ngữ", "Tư duy khoa học", …) thì mới ghi đè được từng hàng; môn không khớp giữ mock.
3. `GET /assessments/results/me` khi chưa có kết quả: FE coi mọi lỗi là "chưa có kết quả" (hàng năng lực giữ mock).
4. Dashboard gọi thêm `GET /courses/{id}/study` cho **từng** khóa đã đăng ký (để lấy số bài đã học). Nếu số khóa lớn nên có endpoint tổng hợp.
5. `CourseDetail`/`LearningActivity` chỉ mở được bằng id mẫu (như trước); id khóa thật cho "Không tìm thấy khóa học" (giống HEAD).
6. Onboarding vẫn ngoài shell với `onboarding.css` (858 dòng), chưa chuyển Tailwind.
