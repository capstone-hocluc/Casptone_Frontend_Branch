import { useState } from 'react'

// Dedupes the "selected row opens a detail/edit modal" pattern: `open(row)`
// to show it, `close()` to dismiss, `data` holds whatever was passed to open.
export function useModal() {
  const [data, setData] = useState(null)

  return {
    data,
    isOpen: data !== null,
    open: setData,
    close: () => setData(null),
  }
}
