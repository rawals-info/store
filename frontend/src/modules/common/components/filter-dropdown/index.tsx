"use client"

import { useState } from "react"
import { Popover, Checkbox, Text } from "@medusajs/ui"
import { ChevronDown } from "lucide-react"

type FilterItem = {
  id: string
  name: string
  count?: number
}

type FilterDropdownProps = {
  title: string
  items: FilterItem[]
  selectedItems: string[]
  handleChange: (id: string) => void
  "data-testid"?: string
}

const FilterDropdown = ({
  title,
  items,
  selectedItems,
  handleChange,
  "data-testid": dataTestId,
}: FilterDropdownProps) => {
  const [open, setOpen] = useState(false)
  
  if (!items.length) {
    return null
  }

  const selectedCount = selectedItems.length
  const selectedNames = selectedItems
    .map(id => items.find(item => item.id === id)?.name || "")
    .filter(Boolean)
    .join(", ")
  
  const displayText = selectedCount > 0
    ? selectedCount > 1
      ? `${selectedCount} selected`
      : selectedNames
    : "All"

  return (
    <div className="flex flex-col gap-y-1.5">
      <Text className="font-jakarta font-bold text-[11px] text-slate-500 tracking-wider uppercase">
        {title}
      </Text>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="px-3 py-2 border border-slate-200 hover:border-petha-amber bg-white shadow-sm w-full flex items-center justify-between text-left rounded-xl transition-all group cursor-pointer"
            data-testid={dataTestId}
          >
            <span className="text-xs font-jakarta font-semibold text-slate-800 group-hover:text-petha-amber transition-colors truncate">
              {displayText}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 ${open ? "rotate-180" : "rotate-0"} transition-transform duration-200 text-slate-400 group-hover:text-petha-amber`}
            />
          </button>
        </Popover.Trigger>
        <Popover.Content
          className="w-full min-w-[220px] p-2.5 border border-slate-200 shadow-xl bg-white rounded-2xl z-50"
          side="bottom"
          align="start"
          sideOffset={6}
        >
          <div className="flex flex-col gap-y-1 max-h-[250px] overflow-auto no-scrollbar">
            {items.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-x-2.5 py-1.5 px-2 hover:bg-amber-50/70 rounded-xl transition-colors cursor-pointer"
              >
                <Checkbox
                  id={`filter-${title}-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleChange(item.id)}
                  className="data-[state=checked]:bg-petha-amber data-[state=checked]:border-petha-amber rounded-md"
                />
                <span className="text-xs font-jakarta text-slate-700 select-none flex-1 truncate">
                  {item.name}
                </span>
                {item.count !== undefined && (
                  <span className="text-[10px] font-mono text-slate-400">
                    ({item.count})
                  </span>
                )}
              </label>
            ))}
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default FilterDropdown