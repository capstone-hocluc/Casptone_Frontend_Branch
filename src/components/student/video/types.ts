import type { VideoActivity, VideoLessonItem } from '../../../lib/studentViewModel'

export type { VideoActivity, VideoLessonItem }

// What the video screen renders: the current item + its course. Built either
// from the prototype course data or from a real lesson (see VideoLearningPage).
export interface VideoContext extends VideoLessonItem {
  course: { title: string }
}
