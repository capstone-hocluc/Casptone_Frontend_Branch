import { createContext, useContext } from 'react'
import { learningProfilePage, type LearningProfileData } from '../../../data/learningProfile'

// The tabs read their data from here instead of importing the mock directly:
// LearningProfile provides the view-model (mock + API overlay); anywhere
// without a provider falls back to the plain mock.
export const LearningProfileDataContext = createContext<LearningProfileData>(learningProfilePage)

export function useLearningProfileData() {
  return useContext(LearningProfileDataContext)
}
