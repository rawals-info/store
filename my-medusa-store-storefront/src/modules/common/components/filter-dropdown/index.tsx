"use client"

import { useState } from "react"
import { Popover, Checkbox, Text, Label, Button } from "@medusajs/ui"
import { ChevronUpMini } from "@medusajs/icons"

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
  
  // Only show if we have items
  if (!items.length) {
    return null
  }

  const selectedCount = selectedItems.length
  const selectedNames = selectedItems
    .map(id => items.find(item => item.id === id)?.name || "")
    .filter(Boolean)
    .join(", ")
  
  // Truncate selected names if too long
  const displayText = selectedCount > 0
    ? selectedCount > 1
      ? `${selectedCount} selected`
      : selectedNames
    : "Select"

  return (
    <div className="flex flex-col gap-y-2">
      <Text className="text-serif font-medium text-sm text-luxury-charcoal tracking-wide uppercase">{title}</Text>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Button
            variant="transparent"
            className="px-3 py-2 border border-luxury-gold/30 hover:border-luxury-gold bg-luxury-ivory shadow-sm w-full flex items-center justify-between text-left h-auto transition-all rounded-sm group"
            data-testid={dataTestId}
          >
            <span className="text-xs font-serif text-luxury-charcoal group-hover:text-luxury-gold/90 transition-colors truncate">
              {displayText}
            </span>
            <ChevronUpMini
              className={`${open ? "rotate-0" : "rotate-180"} transition-transform duration-300 text-luxury-gold`}
            />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="w-full min-w-[240px] p-4 border border-luxury-gold/30 shadow-lg bg-luxury-ivory rounded-sm"
          side="bottom"
          align="start"
          sideOffset={4}
        >
          <div className="flex flex-col gap-y-1 max-h-[300px] overflow-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-x-2 py-1.5 px-1.5 hover:bg-luxury-cream/10 rounded-sm transition-colors">
                <Checkbox
                  id={`filter-${title}-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleChange(item.id)}
                  className="text-luxury-gold border-luxury-gold/50 hover:border-luxury-gold focus:border-luxury-gold data-[state=checked]:bg-luxury-gold data-[state=checked]:text-luxury-ivory"
                />
                <Label
                  htmlFor={`filter-${title}-${item.id}`}
                  className="text-luxury-charcoal text-sm cursor-pointer flex justify-between w-full"
                >
                  <span className="font-serif">{item.name}</span>
                  {item.count !== undefined && (
                    <span className="text-luxury-gold/70 text-xs ml-2 font-serif">({item.count})</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default FilterDropdown 