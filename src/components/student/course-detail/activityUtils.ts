import type { CourseActivity } from './types'

export function getActivityMeta(activity: CourseActivity) {
  return [
    activity.questionCount ? `${activity.questionCount} câu` : '',
    activity.duration || '',
    activity.deadline ? `Hạn ${activity.deadline}` : '',
    activity.instructor ? `Giảng viên ${activity.instructor}` : '',
    activity.date ? `${activity.date}${activity.time ? ` · ${activity.time}` : ''}` : '',
  ].filter(Boolean)
}

export function getActivityMessage(activity: CourseActivity) {
  if (activity.status === 'locked') return 'Nội dung này đang được khóa theo lộ trình học.'
  if (activity.type === 'Video') return 'Trình phát video đang được phát triển.'
  if (activity.type === 'Buổi giải đề') return 'Buổi giải đề đang được chuẩn bị.'
  if (activity.type === 'Bài tập') return 'Bài tập sẽ được mở ở bước tiếp theo.'
  if (activity.type === 'Mini Test' || activity.type === 'Mock Test')
    return 'Chức năng làm bài đang được phát triển.'
  return 'Tính năng này đang được phát triển.'
}
