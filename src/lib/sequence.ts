// Backend lists (phases, chapters, lessons, questions, options) carry a
// `sequence`; every screen renders them in that order.
export function bySequence<T extends { sequence?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
}
