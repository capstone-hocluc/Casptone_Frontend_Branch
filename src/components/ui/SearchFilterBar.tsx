import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, Search } from 'lucide-react'

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
        <Select.Root value={filter} onValueChange={onFilterChange}>
          <Select.Trigger className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[9px] border border-border-primary bg-surface px-3 text-sm font-semibold text-text-label outline-none">
            <Select.Value />
            <Select.Icon>
              <ChevronDown size={15} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className="z-90 overflow-hidden rounded-[10px] border border-border-primary bg-surface shadow-[0_14px_34px_rgba(17,24,58,0.14)]"
              position="popper"
              sideOffset={6}
            >
              <Select.Viewport>
                {filterOptions.map((option) => (
                  <Select.Item
                    key={option}
                    value={option}
                    className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold text-text-heading-soft outline-none data-[highlighted]:bg-[#f3f6ff] data-[highlighted]:text-primary"
                  >
                    <Select.ItemText>{option}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check size={14} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
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
