import { courseDetail } from './courseDetail'
import {
  supplementaryCourseAliases,
  supplementaryCourseDetails,
} from './supplementaryCourseDetails'

export function normalizeCourseId(courseId) {
  return supplementaryCourseAliases[courseId] || courseId
}

export function getStudentCourseDetail(courseId) {
  const normalizedId = normalizeCourseId(courseId)
  if (normalizedId === courseDetail.id) return { kind: 'main', data: courseDetail }

  const supplementary = supplementaryCourseDetails[normalizedId]
  return supplementary ? { kind: 'supplementary', data: supplementary } : null
}

export function getActivityRouteType(activity) {
  const routes = {
    Video: 'lessons',
    'Bài tập': 'exercises',
    'Mini Test': 'mini-tests',
    'Mock Test': 'mock-tests',
    'Buổi giải đề': 'lessons',
  }

  return routes[activity.type] || ''
}

export function findCourseActivity(courseId, activityId) {
  const courseEntry = getStudentCourseDetail(courseId)
  if (!courseEntry) return null

  const course = courseEntry.data
  const activityContexts = getCourseActivityContexts(courseId)

  const found = activityContexts.find((item) => item.activity.id === activityId)
  return found ? { ...found, course, courseKind: courseEntry.kind } : null
}

export function getCourseActivityContexts(courseId) {
  const courseEntry = getStudentCourseDetail(courseId)
  if (!courseEntry) return []

  return courseEntry.kind === 'supplementary'
    ? getSupplementaryActivities(courseEntry.data)
    : getMainCourseActivities(courseEntry.data)
}

export function getAdjacentUnlockedActivities(courseId, activityId) {
  const activities = getCourseActivityContexts(courseId).filter(
    (item) => item.activity.status !== 'locked' && getActivityRouteType(item.activity)
  )
  const currentIndex = activities.findIndex((item) => item.activity.id === activityId)

  return {
    previous: currentIndex > 0 ? activities[currentIndex - 1] : null,
    next:
      currentIndex >= 0 && currentIndex < activities.length - 1
        ? activities[currentIndex + 1]
        : null,
  }
}

function getSupplementaryActivities(course) {
  const activities = course.chapters.flatMap((chapter) =>
    chapter.activities.map((activity) => ({
      activity,
      chapter,
      chapterTitle: chapter.title,
      subjectTitle: course.subject,
    }))
  )

  return [
    ...activities,
    {
      activity: course.finalTest,
      chapter: null,
      chapterTitle: 'Mock Test',
      subjectTitle: course.subject,
    },
  ]
}

function getMainCourseActivities(course) {
  const sectionActivities = course.sections.flatMap((section) =>
    section.groups.flatMap((group) =>
      group.chapters.flatMap((chapter) =>
        chapter.activities.map((activity) => ({
          activity,
          section,
          group,
          chapter,
          sectionTitle: section.title,
          subjectTitle: group.title,
          chapterTitle: chapter.title.replace(/^Chương \d+ - /, ''),
        }))
      )
    )
  )

  return [
    ...sectionActivities,
    ...course.fullMockTests.map((activity) => ({
      activity,
      section: null,
      group: null,
      chapter: null,
      sectionTitle: 'Luyện đề tổng hợp',
      subjectTitle: 'ĐGNL',
      chapterTitle: 'Luyện đề tổng hợp',
    })),
  ]
}
