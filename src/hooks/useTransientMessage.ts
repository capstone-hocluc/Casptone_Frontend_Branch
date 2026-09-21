import { useCallback, useEffect, useRef, useState } from 'react'

// Short-lived notice ("feature coming soon", "saved"...). Showing a new
// message restarts the timer, and the timer is cleared on unmount.
export function useTransientMessage(duration = 2400) {
  const [message, setMessage] = useState('')
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback(
    (text: string) => {
      window.clearTimeout(timer.current)
      setMessage(text)
      timer.current = window.setTimeout(() => setMessage(''), duration)
    },
    [duration]
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { message, show }
}
