"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
  product?: HttpTypes.StoreProduct
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-jakarta">
        Select {title}:
      </span>
      <div
        className="flex flex-wrap gap-2.5"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const isSelected = v === current
          return (
            <button
              type="button"
              onClick={() => updateOption(option.id, v)}
              key={v}
              disabled={disabled}
              className={clx(
                "px-4 py-2.5 rounded-2xl text-xs font-jakarta font-bold transition-all duration-200 cursor-pointer shadow-sm",
                isSelected
                  ? "bg-amber-100/90 border-2 border-petha-amber text-slate-900 ring-2 ring-petha-amber/20"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              )}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
