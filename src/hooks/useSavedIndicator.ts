import { useCallback, useEffect, useRef, useState } from 'react'

// "Saved" flag that switches itself off after a moment (form success badge).
export function useSavedIndicator(duration = 2600) {
  const [saved, setSaved] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const clear = useCallback(() => {
    window.clearTimeout(timer.current)
    setSaved(false)
  }, [])

  const flash = useCallback(() => {
    window.clearTimeout(timer.current)
    setSaved(true)
    timer.current = window.setTimeout(() => setSaved(false), duration)
  }, [duration])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { saved, flash, clear }
}
