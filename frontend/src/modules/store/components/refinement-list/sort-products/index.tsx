"use client"

import { useState } from "react"
import { Popover } from "@medusajs/ui"
import { ChevronDown, Check } from "lucide-react"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions: { value: SortOptions; label: string }[] = [
  {
    value: "created_at",
    label: "New Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low to High",
  },
  {
    value: "price_desc",
    label: "Price: High to Low",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const [open, setOpen] = useState(false)
  
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
    setOpen(false)
  }
  
  const activeSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Sort by"

  return (
    <div className="flex flex-col gap-y-1">
      <span className="font-jakarta font-bold text-[10px] text-slate-400 tracking-wider uppercase text-right">
        Sort By
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="text-xs font-jakarta font-bold flex items-center gap-x-2 px-3.5 py-2 border border-slate-200 hover:border-petha-amber bg-white text-slate-800 shadow-sm transition-all rounded-xl cursor-pointer group"
            data-testid={dataTestId}
          >
            <span className="truncate">{activeSortLabel}</span>
            <ChevronDown 
              className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 group-hover:text-petha-amber ${open ? "rotate-180" : "rotate-0"}`} 
            />
          </button>
        </Popover.Trigger>
        
        <Popover.Content 
          className="p-1.5 border border-slate-200 shadow-xl bg-white rounded-2xl w-48 z-50" 
          side="bottom"
          align="end"
          sideOffset={6}
        >
          <div className="flex flex-col gap-y-0.5">
            {sortOptions.map((option) => {
              const isActive = option.value === sortBy
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`py-2 px-3 text-left text-xs rounded-xl transition-colors font-jakarta flex items-center justify-between cursor-pointer ${
                    isActive 
                      ? "text-amber-950 font-bold bg-amber-100/80" 
                      : "text-slate-700 hover:bg-amber-50/70"
                  }`}
                  onClick={() => handleChange(option.value)}
                  data-testid="radio-label"
                  data-active={isActive}
                >
                  <span>{option.label}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-petha-amber" />}
                </button>
              )
            })}
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default SortProducts
