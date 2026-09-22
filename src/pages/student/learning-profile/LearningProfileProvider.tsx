import type { ReactNode } from 'react'
import type { LearningProfileData } from '../../../data/learningProfile'
import { LearningProfileDataContext } from './learningProfileContext'

export function LearningProfileDataProvider({
  value,
  children,
}: {
  value: LearningProfileData
  children: ReactNode
}) {
  return (
    <LearningProfileDataContext.Provider value={value}>
      {children}
    </LearningProfileDataContext.Provider>
  )
}
