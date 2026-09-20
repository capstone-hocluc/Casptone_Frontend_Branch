import { Search } from 'lucide-react'
import DropdownField from './DropdownField'

// The "search box + status dropdown + result count" row repeated at the top
// of every staff list screen. Pair with the useFilteredList hook: pass its
// query/setQuery/filter/setFilter straight through. Tailwind utility
// classes only - no index.css rule.
function SearchFilterBar({
  query,
  onQueryChange,
  placeholder = 'Tìm kiếm...',
  filter,
  onFilterChange,
  filterOptions,
  resultCount,
  resultLabel,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle px-5 py-4 max-sm:items-stretch">
      <label className="flex min-w-40 flex-1 items-center gap-2 rounded-[9px] border border-border-primary px-2.5 text-text-subtle max-sm:flex-none">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="h-10 w-full border-0 bg-transparent text-[15px] text-text-strong outline-none"
        />
      </label>

      {filterOptions && (
        <DropdownField
          ariaLabel="Bộ lọc"
          className="w-auto"
          options={filterOptions.map((option) => ({ id: option, label: option }))}
          triggerClassName="inline-flex h-10 w-auto cursor-pointer items-center gap-2 rounded-[9px] border border-border-primary bg-surface px-3 text-sm font-semibold text-text-label outline-none"
          value={filter}
          onChange={(value) => {
            if (value !== null) onFilterChange(value)
          }}
        />
      )}

      {resultCount !== undefined && (
        <span className="text-sm font-semibold whitespace-nowrap text-text-muted">
          {resultCount} {resultLabel}
        </span>
      )}
    </div>
  )
}

export default SearchFilterBar
