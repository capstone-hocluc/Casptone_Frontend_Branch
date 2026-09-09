export const dashboardSummary = {
  studentName: 'Quỳnh Như',
  weeklyTarget: '5 bài học',
  overallProgress: 58,
  studyTime: '34 phút',
  completedLessons: 12,
  completedCourses: 2,
  completedTopics: 10,
  completedTests: 4,
  bestScore: 842,
  targetScore: 950,
  currentStreak: 6,
  notificationCount: 0,
  avatar: '/avatar-minhanh.jpg',
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
  description: 'Kế hoạch cá nhân hóa sẽ giúp bạn biết nên học chuyên đề nào trước và luyện đề theo nhịp phù hợp.',
}

export const myCourses = [
  {
    id: 'dgnl-foundation',
    title: 'Toán ĐGNL - Nền tảng',
    category: 'Toán học',
    progress: 'Đã học 4/12 chuyên đề',
    score: '18/20 câu',
    state: 'active',
  },
  {
    id: 'reading-critical-thinking',
    title: 'Ngôn ngữ và Đọc hiểu',
    category: 'Ngôn ngữ',
    progress: 'Đã học 3/10 chuyên đề',
    score: '15/18 câu',
    state: 'active',
  },
  {
    id: 'science-review',
    title: 'Tư duy khoa học',
    category: 'Khoa học',
    progress: 'Chưa học',
    score: '0/16 câu',
    state: 'new',
  },
  {
    id: 'math-logic-boost',
    title: 'Luyện đề ĐGNL tổng hợp',
    category: 'Luyện đề',
    progress: 'Đã làm 1/8 đề',
    score: '842 điểm',
    state: 'active',
  },
]

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

export const activityFrequency = {
  months: ['Thg 6', 'Thg 7', 'Thg 8', 'Thg 9'],
  days: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  totals: Array.from({ length: 15 }, () => 0),
  activeCell: { row: 2, column: 14 },
}

export const upcomingSchedule = [
  {
    id: 'schedule-1',
    course: 'Toán ĐGNL - Nền tảng',
    lesson: 'Luyện tập Hàm số và đồ thị',
    date: 'Hôm nay',
    time: '19:30',
    status: 'Lớp học trực tiếp',
  },
]

export const pendingTasks = [
  {
    id: 'task-1',
    type: 'Mini Test',
    title: 'Mini Test - Toán định lượng',
    course: 'Toán ĐGNL - Nền tảng',
    deadline: 'Hạn nộp tối nay',
  },
]

export const recommendedCourses = ['science-review', 'reading-critical-thinking']
