"use client"

import { XMarkMini } from "@medusajs/icons"
import { Button } from "@medusajs/ui"

type FilterTagProps = {
  label: string
  onClick: () => void
  "data-testid"?: string
}

const FilterTag = ({
  label,
  onClick,
  "data-testid": dataTestId,
}: FilterTagProps) => {
  return (
    <Button
      variant="secondary"
      className="flex items-center gap-x-1.5 px-3 py-1.5 border border-luxury-gold/40 bg-luxury-ivory shadow-sm text-luxury-charcoal hover:border-luxury-gold hover:bg-luxury-cream/10 transition-colors rounded-sm group"
      onClick={onClick}
      data-testid={dataTestId}
    >
      <span className="text-xs font-serif group-hover:text-luxury-gold/90 transition-colors">{label}</span>
      <XMarkMini className="w-3 h-3 text-luxury-gold" />
    </Button>
  )
}

export default FilterTag 