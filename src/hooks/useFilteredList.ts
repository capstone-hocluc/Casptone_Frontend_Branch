import { useMemo, useState } from 'react'

/**
 * Dedupes the search-box + dropdown-filter + memoized-list pattern repeated
 * across the staff management pages (Invoice/Payment/Tuition/Schedule).
 *
 * `matchFn` should be a pure function of (item, query, filter) - it must not
 * close over other changing state, since it isn't part of the memo deps
 * (matching the original inline behavior these call sites had before).
 */
export function useFilteredList<T>(
  items: T[],
  matchFn: (item: T, query: string, filter: string) => boolean,
  { initialFilter = 'Tất cả' }: { initialFilter?: string } = {}
) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState(initialFilter)

  const list = useMemo(
    () => items.filter((item) => matchFn(item, query, filter)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- matchFn intentionally excluded, see doc comment above
    [items, query, filter]
  )

  return { query, setQuery, filter, setFilter, list }
}
