"use client"

import { useState } from "react"
import { Popover, Button, Text } from "@medusajs/ui"
import { ChevronUpMini } from "@medusajs/icons"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
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
    <div className="flex items-center justify-end">
      <div className="flex flex-col gap-y-2">
        <Text className="text-serif font-medium text-xs text-luxury-charcoal tracking-wide uppercase text-right">Sort By</Text>
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button 
              variant="transparent" 
              className="text-xs flex items-center gap-x-1.5 px-3 py-2 border border-luxury-gold/30 hover:border-luxury-gold bg-luxury-ivory shadow-sm transition-all rounded-sm h-auto group"
              data-testid={dataTestId}
            >
              <span className="text-xs font-serif text-luxury-charcoal group-hover:text-luxury-gold/90 transition-colors">
                {activeSortLabel}
              </span>
              <ChevronUpMini 
                className={`w-3.5 h-3.5 transition-transform duration-300 text-luxury-gold ${open ? "rotate-0" : "rotate-180"}`} 
              />
            </Button>
          </Popover.Trigger>
          
          <Popover.Content 
            className="p-0 border border-luxury-gold/30 shadow-lg bg-luxury-ivory rounded-sm w-52" 
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <div className="flex flex-col">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`py-2.5 px-4 text-left text-xs hover:bg-luxury-cream/10 transition-colors font-serif ${
                    option.value === sortBy 
                      ? "text-luxury-gold font-medium bg-luxury-cream/5 border-l-2 border-luxury-gold" 
                      : "text-luxury-charcoal"
                  }`}
                  onClick={() => handleChange(option.value as SortOptions)}
                  data-testid="radio-label"
                  data-active={option.value === sortBy}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Popover.Content>
        </Popover>
      </div>
    </div>
  )
}

export default SortProducts
