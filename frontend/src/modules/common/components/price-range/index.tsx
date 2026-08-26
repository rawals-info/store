"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"

type PriceRangeProps = {
  min?: number
  max?: number
  value: [number, number]
  handleChange: (value: [number, number]) => void
  currencyCode?: string
  "data-testid"?: string
}

const PRESETS = [
  { label: "All", min: 0, max: 1500 },
  { label: "Under ₹300", min: 0, max: 300 },
  { label: "₹300–₹500", min: 300, max: 500 },
  { label: "₹500+", min: 500, max: 1500 },
]

const PriceRange = ({
  min = 0,
  max = 1000,
  value,
  handleChange,
  currencyCode = "INR",
  "data-testid": dataTestId,
}: PriceRangeProps) => {
  const BOUND_MIN = 0
  const BOUND_MAX = 1000

  const [minVal, setMinVal] = useState<number>(value[0] || BOUND_MIN)
  const [maxVal, setMaxVal] = useState<number>(value[1] || BOUND_MAX)

  useEffect(() => {
    setMinVal(value[0] || BOUND_MIN)
    setMaxVal(value[1] || BOUND_MAX)
  }, [value])

  const minValRef = useRef(minVal)
  const maxValRef = useRef(maxVal)

  useEffect(() => {
    minValRef.current = minVal
    maxValRef.current = maxVal
  }, [minVal, maxVal])

  // Convert to percentage [0, 100]
  const getPercent = useCallback(
    (val: number) => {
      const pct = ((val - BOUND_MIN) / (BOUND_MAX - BOUND_MIN)) * 100
      return Math.max(0, Math.min(100, Math.round(pct)))
    },
    [BOUND_MIN, BOUND_MAX]
  )

  const minPercent = getPercent(minVal)
  const maxPercent = getPercent(maxVal)

  const applyRange = (newMin: number, newMax: number) => {
    const clampedMin = Math.max(BOUND_MIN, Math.min(newMin, newMax - 20))
    const clampedMax = Math.min(BOUND_MAX, Math.max(newMax, clampedMin + 20))
    setMinVal(clampedMin)
    setMaxVal(clampedMax)
    handleChange([clampedMin, clampedMax])
  }

  return (
    <div className="flex flex-col gap-y-3 w-full" data-testid={dataTestId}>
      <div className="flex justify-between items-center">
        <span className="font-jakarta font-bold text-[10px] text-slate-400 tracking-wider uppercase">
          Price Filter
        </span>
        <span className="text-[11px] font-mono font-bold text-petha-amber bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
          ₹{minVal} — ₹{maxVal}
        </span>
      </div>

      {/* Quick 1-Tap Preset Pills */}
      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
        {PRESETS.map((preset) => {
          const isActive =
            (preset.label === "All" && minVal <= BOUND_MIN && maxVal >= BOUND_MAX) ||
            (preset.label === "Under ₹300" && minVal <= BOUND_MIN && maxVal === 300) ||
            (preset.label === "₹300–₹500" && minVal === 300 && maxVal === 500) ||
            (preset.label === "₹500+" && minVal === 500 && maxVal >= BOUND_MAX)

          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyRange(preset.min, preset.max)}
              className={`px-2 py-1 rounded-lg text-[10px] font-jakarta font-bold transition-all text-center cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 hover:bg-amber-50 text-slate-600 border border-slate-200"
              }`}
            >
              {preset.label}
            </button>
          )
        })}
      </div>

      {/* Dual Thumb Range Slider Track */}
      <div className="relative w-full h-8 flex items-center mt-1">
        {/* Gray Background Line */}
        <div className="absolute w-full h-1.5 bg-slate-100 rounded-full" />

        {/* Colored Active Fill */}
        <div
          className="absolute h-1.5 bg-gradient-to-r from-amber-500 to-petha-amber rounded-full pointer-events-none"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        {/* Min Thumb Input */}
        <input
          type="range"
          min={BOUND_MIN}
          max={BOUND_MAX}
          step={10}
          value={minVal}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), maxVal - 30)
            setMinVal(val)
          }}
          onMouseUp={() => applyRange(minVal, maxVal)}
          onTouchEnd={() => applyRange(minVal, maxVal)}
          className="thumb-range-input pointer-events-none absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer z-20"
        />

        {/* Max Thumb Input */}
        <input
          type="range"
          min={BOUND_MIN}
          max={BOUND_MAX}
          step={10}
          value={maxVal}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), minVal + 30)
            setMaxVal(val)
          }}
          onMouseUp={() => applyRange(minVal, maxVal)}
          onTouchEnd={() => applyRange(minVal, maxVal)}
          className="thumb-range-input pointer-events-none absolute w-full h-1.5 bg-transparent appearance-none cursor-pointer z-30"
        />
      </div>

      {/* Mini Min / Max Input Fields */}
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-jakarta">₹</span>
          <input
            type="number"
            min={BOUND_MIN}
            max={maxVal - 20}
            step={10}
            value={minVal}
            onChange={(e) => setMinVal(Number(e.target.value))}
            onBlur={() => applyRange(minVal, maxVal)}
            onKeyDown={(e) => e.key === "Enter" && applyRange(minVal, maxVal)}
            className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-petha-amber focus:outline-none transition-all text-center"
            placeholder="Min"
          />
        </div>

        <span className="text-slate-300 font-bold text-xs">—</span>

        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-jakarta">₹</span>
          <input
            type="number"
            min={minVal + 20}
            max={BOUND_MAX}
            step={10}
            value={maxVal}
            onChange={(e) => setMaxVal(Number(e.target.value))}
            onBlur={() => applyRange(minVal, maxVal)}
            onKeyDown={(e) => e.key === "Enter" && applyRange(minVal, maxVal)}
            className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:bg-white focus:border-petha-amber focus:outline-none transition-all text-center"
            placeholder="Max"
          />
        </div>
      </div>

      <style jsx>{`
        .thumb-range-input {
          -webkit-appearance: none;
          appearance: none;
        }
        .thumb-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d97706;
          border: 2.5px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          cursor: grab;
          transition: transform 0.15s ease, background-color 0.15s ease;
        }
        .thumb-range-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          background: #b45309;
        }
        .thumb-range-input::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.2);
        }
        .thumb-range-input::-moz-range-thumb {
          pointer-events: auto;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #d97706;
          border: 2.5px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          cursor: grab;
          transition: transform 0.15s ease;
        }
        .thumb-range-input::-moz-range-thumb:hover {
          transform: scale(1.15);
          background: #b45309;
        }
      `}</style>
    </div>
  )
}

export default PriceRange