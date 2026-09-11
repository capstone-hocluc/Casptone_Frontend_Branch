export const studentCourseTypes = [
  { key: 'main', label: 'Khóa học chính' },
  { key: 'supplementary', label: 'Khóa học bổ trợ' },
]

export const studentCourseSubjects = [
  'Tất cả',
  'Toán học',
  'Tiếng Việt',
  'Tiếng Anh',
  'Tư duy khoa học',
]

export const studentCourses = [
  {
    id: 'dgnl-comprehensive',
    type: 'main',
    subject: 'ĐGNL',
    title: 'Tổng ôn luyện thi Đánh giá năng lực',
    description: 'Lộ trình ôn luyện toàn diện, bao quát các nội dung trọng tâm cho kỳ thi ĐGNL.',
    completedLessons: 28,
    totalLessons: 66,
    progress: 42,
    status: 'in-progress',
    thumbnail: null,
  },
  {
    id: 'logic-data-skills',
    type: 'supplementary',
    subject: 'Tư duy khoa học',
    title: 'Kỹ năng Logic & Phân tích số liệu',
    description: 'Tăng tốc khả năng nhận diện quy luật, đọc biểu đồ và loại trừ phương án nhiễu.',
    completedLessons: 4,
    totalLessons: 12,
    progress: 34,
    status: 'in-progress',
    thumbnail: null,
  },
  {
    id: 'english-vocabulary',
    type: 'supplementary',
    subject: 'Tiếng Anh',
    title: 'Từ vựng Tiếng Anh ĐGNL',
    description: 'Ôn nhóm từ vựng thường gặp trong bài đọc hiểu và câu hỏi ngữ pháp.',
    completedLessons: 0,
    totalLessons: 14,
    progress: 0,
    status: 'not-started',
    thumbnail: null,
  },
  {
    id: 'probability-topic',
    type: 'supplementary',
    subject: 'Toán học',
    title: 'Chuyên đề Xác suất',
    description: 'Ôn quy tắc đếm, biến cố và các dạng bài xác suất thường gặp trong ĐGNL.',
    completedLessons: 10,
    totalLessons: 10,
    progress: 100,
    status: 'completed',
    thumbnail: null,
  },
]
