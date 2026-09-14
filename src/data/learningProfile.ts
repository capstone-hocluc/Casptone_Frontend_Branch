export const learningProfilePage = {
  studentName: 'Quỳnh Như',
  exam: 'Đánh giá năng lực ĐHQG TP.HCM',
  currentScore: 720,
  latestScore: 742,
  targetScore: 900,
  maxScore: 1200,
  goalNote: 'Mỗi buổi học là một bước gần hơn tới mục tiêu của bạn.',
  components: [
    {
      key: 'vietnamese',
      name: 'Tiếng Việt',
      score: 218,
      maxScore: 300,
      accuracy: 78,
      trend: 4,
      accent: 'blue',
    },
    {
      key: 'english',
      name: 'Tiếng Anh',
      score: 174,
      maxScore: 300,
      accuracy: 64,
      trend: -2,
      accent: 'amber',
    },
    {
      key: 'math',
      name: 'Toán học',
      score: 186,
      maxScore: 300,
      accuracy: 69,
      trend: 7,
      accent: 'green',
    },
    {
      key: 'science',
      name: 'Tư duy khoa học',
      score: 164,
      maxScore: 300,
      accuracy: 61,
      trend: 3,
      accent: 'violet',
      skills: [
        { name: 'Logic & phân tích số liệu', accuracy: 68 },
        { name: 'Suy luận khoa học', accuracy: 57 },
      ],
    },
  ],
  comparisonRanges: [
    {
      key: '7d',
      label: '7 ngày gần nhất',
      trends: { vietnamese: 4, english: -2, math: 7, science: 3 },
    },
    {
      key: '30d',
      label: '30 ngày gần nhất',
      trends: { vietnamese: 9, english: 3, math: 12, science: 6 },
    },
    {
      key: '3m',
      label: '3 tháng gần nhất',
      trends: { vietnamese: 18, english: 8, math: 21, science: 14 },
    },
    {
      key: '6m',
      label: '6 tháng gần nhất',
      trends: { vietnamese: 31, english: 15, math: 34, science: 22 },
    },
  ],
  scoreAttempts: [
    { label: 'Đề 1', score: 610 },
    { label: 'Đề 2', score: 655 },
    { label: 'Đề 3', score: 702 },
    { label: 'Đề 4', score: 720 },
    { label: 'Đề 5', score: 742 },
  ],
  practiceAttempts: [
    {
      label: '#1',
      type: 'Thi thử',
      score: 610,
      components: { vietnamese: 185, english: 142, math: 158, science: 125 },
    },
    {
      label: '#2',
      type: 'Thi thử',
      score: 655,
      components: { vietnamese: 194, english: 150, math: 170, science: 141 },
    },
    {
      label: '#3',
      type: 'Mini Test',
      score: 702,
      components: { vietnamese: 205, english: 160, math: 181, science: 156 },
    },
    {
      label: '#4',
      type: 'Thi thử',
      score: 680,
      components: { vietnamese: 198, english: 154, math: 178, science: 150 },
    },
    {
      label: '#5',
      type: 'Mini Test',
      score: 742,
      components: { vietnamese: 218, english: 174, math: 186, science: 164 },
    },
    {
      label: '#6',
      type: 'Thi thử',
      score: 790,
      components: { vietnamese: 226, english: 188, math: 202, science: 174 },
    },
  ],
  strengths: ['Đọc hiểu Tiếng Việt', 'Ngữ pháp Tiếng Anh', 'Hàm số'],
  improvements: ['Logic & phân tích số liệu', 'Suy luận khoa học', 'Toán - Xác suất'],
  courseProgress: [
    { name: 'Toán ĐGNL - Nền tảng', progress: 72, status: 'Đang học' },
    { name: 'Tư duy khoa học', progress: 46, status: 'Đang học' },
    { name: 'Tiếng Việt ĐGNL', progress: 85, status: 'Đang học' },
  ],
  learningMetrics: [
    { key: 'lessons', label: 'Bài học hoàn thành', value: '42', tone: 'blue' },
    { key: 'time', label: 'Thời gian học', value: '18 giờ 25 phút', tone: 'amber' },
    { key: 'questions', label: 'Câu hỏi đã luyện', value: '1.280', tone: 'green' },
    { key: 'topics', label: 'Chuyên đề đã học', value: '12', tone: 'violet' },
  ],
  weeklyAccuracy: [
    { key: 'vietnamese', name: 'Tiếng Việt', accuracy: 78, trend: 4 },
    { key: 'english', name: 'Tiếng Anh', accuracy: 64, trend: -2 },
    { key: 'math', name: 'Toán học', accuracy: 69, trend: 7 },
    { key: 'science', name: 'Tư duy khoa học', accuracy: 61, trend: 3 },
  ],
  learningAccuracyPeriods: [
    {
      key: '7d',
      label: '7 ngày gần nhất',
      comparisonLabel: 'So với 7 ngày trước đó',
      values: {
        vietnamese: { accuracy: 78, trend: 4 },
        english: { accuracy: 64, trend: -2 },
        math: { accuracy: 69, trend: 7 },
        science: { accuracy: 61, trend: 3 },
      },
    },
    {
      key: '30d',
      label: '30 ngày gần nhất',
      comparisonLabel: 'So với 30 ngày trước đó',
      values: {
        vietnamese: { accuracy: 81, trend: 6 },
        english: { accuracy: 67, trend: 3 },
        math: { accuracy: 72, trend: 9 },
        science: { accuracy: 65, trend: 5 },
      },
    },
    {
      key: '3m',
      label: '3 tháng gần nhất',
      comparisonLabel: 'So với 3 tháng trước đó',
      values: {
        vietnamese: { accuracy: 84, trend: 11 },
        english: { accuracy: 70, trend: 7 },
        math: { accuracy: 76, trend: 14 },
        science: { accuracy: 68, trend: 9 },
      },
    },
    {
      key: '6m',
      label: '6 tháng gần nhất',
      comparisonLabel: 'So với 6 tháng trước đó',
      values: {
        vietnamese: { accuracy: 86, trend: 18 },
        english: { accuracy: 73, trend: 12 },
        math: { accuracy: 79, trend: 21 },
        science: { accuracy: 71, trend: 16 },
      },
    },
  ],
  learningHistory: [
    {
      date: '09/09',
      title: 'Hàm số và đồ thị',
      meta: 'Hoàn thành bài học · 25 phút',
    },
    {
      date: '08/09',
      title: 'Logic & phân tích số liệu',
      meta: 'Luyện 20 câu · Chính xác 70%',
    },
    {
      date: '07/09',
      title: 'Mini Test - Toán học',
      meta: '16/20 câu đúng · 25 phút',
    },
    {
      date: '06/09',
      title: 'Đọc hiểu văn bản',
      meta: 'Hoàn thành bài học · 18 phút',
    },
    {
      date: '05/09',
      title: 'Ngữ pháp Tiếng Anh',
      meta: 'Luyện 15 câu · Chính xác 73%',
    },
    {
      date: '04/09',
      title: 'Xác suất cơ bản',
      meta: 'Hoàn thành chuyên đề · 32 phút',
    },
    {
      date: '03/09',
      title: 'Suy luận khoa học',
      meta: 'Luyện 18 câu · Chính xác 61%',
    },
  ],
  practiceOverview: [
    { key: 'completed', label: 'Đề đã hoàn thành', value: '8', tone: 'blue' },
    { key: 'latest', label: 'Điểm gần nhất', value: '742 / 1200', tone: 'green' },
    { key: 'best', label: 'Điểm cao nhất', value: '842 / 1200', tone: 'amber' },
    { key: 'average', label: 'Điểm trung bình', value: '716 / 1200', tone: 'violet' },
  ],
  practiceStats: [
    { key: 'accuracy', label: 'Độ chính xác', value: '68%', tone: 'green' },
    { key: 'time', label: 'Thời gian trung bình', value: '132 phút', tone: 'amber' },
    { key: 'questions', label: 'Số câu đã làm', value: '960', tone: 'blue' },
    { key: 'completed', label: 'Đề hoàn thành', value: '8', tone: 'violet' },
  ],
  recommendations: [
    { title: 'Logic & phân tích số liệu', accuracy: 54 },
    { title: 'Suy luận khoa học', accuracy: 61 },
    { title: 'Toán - Xác suất', accuracy: 63 },
  ],
  practiceAiAnalysis: {
    basedOn: 'Dựa trên 6 bài thi gần nhất',
    summary:
      'Các bài luyện đề gần đây cho thấy nhóm tư duy khoa học và bài toán xác suất cần được ưu tiên vì độ chính xác còn dao động khi gặp dữ liệu dài.',
    recommendations: [
      {
        title: 'Logic & phân tích số liệu',
        accuracy: 52,
        priority: 'Cao',
        action: 'Luyện ngay',
        explanation:
          'Tập trung đọc bảng số liệu, nhận diện quy luật và loại trừ phương án nhiễu trước khi tính toán chi tiết.',
      },
      {
        title: 'Suy luận khoa học',
        accuracy: 57,
        priority: 'Cao',
        action: 'Luyện ngay',
        explanation:
          'Nên luyện các câu yêu cầu giải thích thí nghiệm, giả thuyết và kết luận từ dữ kiện cho sẵn.',
      },
      {
        title: 'Toán - Xác suất',
        accuracy: 61,
        priority: 'Trung bình',
        action: 'Luyện ngay',
        explanation:
          'Ôn lại quy tắc đếm, biến cố độc lập và cách chuyển đề bài thành sơ đồ trường hợp.',
      },
      {
        title: 'Quản lý thời gian',
        accuracy: 66,
        priority: 'Trung bình',
        action: 'Luyện ngay',
        explanation:
          'Rèn chiến thuật bỏ qua câu dài, quay lại sau và giữ nhịp làm bài ổn định trong 30 phút cuối.',
      },
    ],
    history: [
      {
        id: 'practice-ai-01',
        createdAt: '10/09/2026',
        basedOn: '6 bài thi gần nhất',
        summary: 'Ưu tiên logic số liệu, suy luận khoa học và xác suất trong 7 ngày tới.',
      },
      {
        id: 'practice-ai-02',
        createdAt: '03/09/2026',
        basedOn: '5 bài thi gần nhất',
        summary: 'Điểm tổng tăng tốt, nhưng thời gian xử lý câu dữ liệu dài còn chậm.',
      },
    ],
  },
  teacherFeedback: [
    {
      id: 'feedback-01',
      teacher: {
        name: 'Nguyễn Văn A',
        role: 'Mentor ĐGNL',
        subject: 'Toán học',
        avatar: null,
      },
      createdAt: '2026-09-10',
      strengths: [
        'Đọc hiểu và xác định ý chính tốt',
        'Tiến bộ rõ ở chuyên đề Hàm số',
        'Tốc độ xử lý câu hỏi tốt hơn',
      ],
      improvements: ['Logic & phân tích số liệu', 'Xác suất', 'Suy luận khoa học'],
      comment:
        'Em nên ưu tiên ôn lại Xác suất và dành thêm thời gian cho nhóm câu Logic & phân tích số liệu trong tuần này.',
    },
    {
      id: 'feedback-02',
      teacher: {
        name: 'Trần Thị B',
        role: 'Giáo viên',
        subject: 'Tiếng Việt',
        avatar: null,
      },
      createdAt: '2026-09-05',
      strengths: [
        'Nắm tốt cấu trúc văn bản',
        'Nhận diện luận điểm chính nhanh',
        'Cách loại trừ phương án nhiễu tốt hơn',
      ],
      improvements: [
        'Câu hỏi suy luận ngữ cảnh',
        'Từ vựng học thuật',
        'Quản lý thời gian đọc văn bản dài',
      ],
      comment:
        'Khả năng đọc hiểu của em đang tiến bộ, nhưng cần luyện thêm câu hỏi suy luận ngữ cảnh và giữ tốc độ ổn định ở phần văn bản dài.',
    },
  ],
  aiAnalysisHistory: [
    {
      id: 'analysis-01',
      createdAt: '10/09/2026',
      basedOn: '5 bài thi gần nhất',
      summary:
        'Điểm số đang tăng đều qua các bài thi thử. Bạn giữ nhịp tốt ở Tiếng Việt và Toán học, nhưng cần củng cố nhóm câu suy luận khoa học để tiến gần mục tiêu 900.',
      strengths: ['Đọc hiểu Tiếng Việt', 'Ngữ pháp Tiếng Anh', 'Hàm số'],
      improvements: ['Logic & phân tích số liệu', 'Suy luận khoa học', 'Toán - Xác suất'],
    },
    {
      id: 'analysis-02',
      createdAt: '02/09/2026',
      basedOn: '4 bài thi gần nhất',
      summary:
        'Năng lực nền tảng ổn định, tốc độ làm bài đã cải thiện. Nên dành thêm thời gian cho bài toán xác suất và câu hỏi phân tích dữ kiện.',
      strengths: ['Đọc hiểu văn bản', 'Từ vựng học thuật', 'Hàm số cơ bản'],
      improvements: ['Phân tích bảng số liệu', 'Xác suất', 'Suy luận thí nghiệm'],
    },
    {
      id: 'analysis-03',
      createdAt: '26/08/2026',
      basedOn: '3 bài thi gần nhất',
      summary:
        'Bạn đã xây được thói quen luyện đề đều đặn. Nhóm câu Tiếng Việt có độ chính xác tốt, trong khi Tư duy khoa học cần luyện chậm và chắc hơn.',
      strengths: ['Đọc hiểu Tiếng Việt', 'Nhận diện ý chính', 'Đại số'],
      improvements: ['Logic & phân tích số liệu', 'Suy luận khoa học', 'Quản lý thời gian'],
    },
  ],
  achievements: [
    {
      id: 'achievement-01',
      title: 'Hoàn thành khóa học Nền tảng Toán học',
      description: 'Hoàn thành toàn bộ bài học cốt lõi của chuyên đề Toán học.',
      date: '12/09',
      tone: 'green',
    },
    {
      id: 'achievement-02',
      title: 'Đạt 700+ điểm trong bài thi thử',
      description: 'Vượt mốc 700 điểm trong bài thi thử ĐGNL gần đây.',
      date: '08/09',
      tone: 'amber',
    },
    {
      id: 'achievement-03',
      title: 'Duy trì học tập 7 ngày liên tiếp',
      description: 'Giữ nhịp học đều trong một tuần liên tục.',
      date: '01/09',
      tone: 'violet',
    },
    {
      id: 'achievement-04',
      title: 'Hoàn thành 50 bài luyện tập',
      description: 'Hoàn thành 50 bài luyện tập trong các chuyên đề ĐGNL.',
      date: '28/08',
      tone: 'blue',
    },
  ],
  activityFrequency: {
    months: ['Thg 6', 'Thg 7', 'Thg 8', 'Thg 9'],
    days: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    totals: [0, 5, 8, 0, 12, 18, 24, 40, 55, 35, 62, 80, 44, 70, 96],
  },
}
