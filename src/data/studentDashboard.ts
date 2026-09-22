// MOCK - backend has no endpoint for daily goal, study plan, practice-test list, streak,
// study time, activity frequency, tests-done count or best score.
// Fields the API does provide (courses, progress, recent lesson, competency, lessons
// completed) are overlaid in lib/studentViewModel.ts (buildDashboardViewModel).
// TODO API: replace the remaining fields here as backend endpoints appear.
// The signed-in user's name/avatar come from the API (useCurrentUser), never from here.
export const dashboardSummary = {
  studyTime: '34 phút',
  completedTests: 4,
  bestScore: 842,
  currentStreak: 6,
  notificationCount: 0,
}

export const learningProfile = {
  program: 'ĐGNL',
  dimensions: [
    {
      title: 'Ngôn ngữ',
      current: 68,
      predicted: 74,
      target: 85,
    },
    {
      title: 'Toán học',
      current: 62,
      predicted: 70,
      target: 88,
    },
    {
      title: 'Tư duy khoa học',
      current: 55,
      predicted: 64,
      target: 82,
    },
    {
      title: 'Giải quyết vấn đề',
      current: 72,
      predicted: 78,
      target: 90,
    },
  ],
}

export const todaysGoal = {
  title: 'Ôn chuyên đề Hàm số',
  description: 'Hoàn thành 20 câu Toán định lượng và rà soát lỗi sai sau khi làm bài',
  lockedNote: 'Hoàn thành nhiệm vụ chính để mở khóa bài luyện đề tự chọn',
}

export const recentLesson = {
  title: 'Chuyên đề Hàm số và đồ thị',
  course: 'Toán ĐGNL - Nền tảng',
  meta: '4/12 bài học',
  score: '18/20 câu đúng',
  lessonNo: '03',
}

export const studyPlan = {
  title: 'Bạn chưa khởi tạo kế hoạch ôn thi ĐGNL',
  description:
    'Kế hoạch cá nhân hóa sẽ giúp bạn biết nên học chuyên đề nào trước và luyện đề theo nhịp phù hợp.',
}

export const testPractice = [
  {
    id: 'dgnl-practice-01',
    title: 'Đề thi thử ĐGNL #01',
    questions: '120 câu',
    duration: '150 phút',
    status: 'Đã hoàn thành',
    score: '842 điểm',
    badge: 'ĐÃ LÀM',
    tone: 'red',
  },
  {
    id: 'dgnl-september-full',
    title: 'Đề tổng hợp tháng 9',
    questions: '120 câu',
    duration: '150 phút',
    status: 'Chưa làm',
    score: 'Chưa có điểm',
    badge: 'MỚI',
    tone: 'pink',
  },
  {
    id: 'dgnl-math-mini-test',
    title: 'Mini Test - Toán học',
    questions: '20 câu',
    duration: '25 phút',
    status: 'Đang luyện',
    score: '16/20 câu',
    badge: 'GỢI Ý',
    tone: 'rose',
  },
  {
    id: 'dgnl-science-mini-test',
    title: 'Mini Test - Tư duy khoa học',
    questions: '30 câu',
    duration: '40 phút',
    status: 'Chưa làm',
    score: 'Chưa có điểm',
    badge: 'ĐỀ XUẤT',
    tone: 'blue',
  },
  {
    id: 'dgnl-language-speed-test',
    title: 'Luyện tốc độ Ngôn ngữ',
    questions: '25 câu',
    duration: '30 phút',
    status: 'Chưa làm',
    score: 'Chưa có điểm',
    badge: 'MỚI',
    tone: 'green',
  },
]
