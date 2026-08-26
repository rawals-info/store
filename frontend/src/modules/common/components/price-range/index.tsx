"use client"

import { useState, useEffect, useRef } from "react"
import { Text } from "@medusajs/ui"

type PriceRangeProps = {
  min: number
  max: number
  value: [number, number]
  handleChange: (value: [number, number]) => void
  currencyCode: string
  "data-testid"?: string
}

const PriceRange = ({
  min,
  max,
  value,
  handleChange,
  currencyCode,
  "data-testid": dataTestId,
}: PriceRangeProps) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value)
  const [inputValues, setInputValues] = useState<[string, string]>([
    value[0].toString(),
    value[1].toString(),
  ])

  if (min === max) {
    return null
  }
  
  const sliderRef = useRef<HTMLDivElement>(null)
  const initialRenderRef = useRef(true)
  
  useEffect(() => {
    if (initialRenderRef.current) {
      setLocalValue(value)
      setInputValues([value[0].toString(), value[1].toString()])
      initialRenderRef.current = false
    }
  }, [value])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues([e.target.value, inputValues[1]])
  }
  
  const handleMinBlur = () => {
    let newValue = parseInt(inputValues[0])
    if (isNaN(newValue) || newValue < min) newValue = min
    if (newValue > localValue[1] - 10) newValue = localValue[1] - 10
    
    const updatedValues: [number, number] = [newValue, localValue[1]]
    setLocalValue(updatedValues)
    setInputValues([newValue.toString(), inputValues[1]])
    handleChange(updatedValues)
  }
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues([inputValues[0], e.target.value])
  }
  
  const handleMaxBlur = () => {
    let newValue = parseInt(inputValues[1])
    if (isNaN(newValue) || newValue > max) newValue = max
    if (newValue < localValue[0] + 10) newValue = localValue[0] + 10
    
    const updatedValues: [number, number] = [localValue[0], newValue]
    setLocalValue(updatedValues)
    setInputValues([inputValues[0], newValue.toString()])
    handleChange(updatedValues)
  }

  const minPos = ((localValue[0] - min) / (max - min)) * 100
  const maxPos = ((localValue[1] - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-y-2.5" data-testid={dataTestId}>
      <Text className="font-jakarta font-bold text-[11px] text-slate-500 tracking-wider uppercase">
        Price Range (₹)
      </Text>
      
      <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700 mb-1">
        <span>₹{localValue[0]}</span>
        <span>₹{localValue[1]}</span>
      </div>
      
      {/* Range Slider Track */}
      <div 
        ref={sliderRef}
        className="relative h-1.5 bg-slate-200 rounded-full mb-3 w-full"
      >
        <div 
          className="absolute h-full bg-petha-amber rounded-full" 
          style={{ 
            left: `${minPos}%`, 
            width: `${maxPos - minPos}%` 
          }}
        />
        
        {/* Min Handle */}
        <div 
          className="absolute w-4 h-4 bg-white border-2 border-petha-amber shadow-md rounded-full -mt-1.5 -ml-2 cursor-pointer transition-transform hover:scale-110"
          style={{ left: `${minPos}%` }}
        />
        
        {/* Max Handle */}
        <div 
          className="absolute w-4 h-4 bg-white border-2 border-petha-amber shadow-md rounded-full -mt-1.5 -ml-2 cursor-pointer transition-transform hover:scale-110"
          style={{ left: `${maxPos}%` }}
        />
      </div>
      
      <div className="flex gap-x-2 items-center w-full">
        <input 
          type="text" 
          value={inputValues[0]}
          onChange={handleMinChange}
          onBlur={handleMinBlur}
          className="w-full bg-white border border-slate-200 px-3 py-1.5 text-slate-800 text-xs font-mono font-bold rounded-xl focus:border-petha-amber focus:outline-none shadow-sm text-center"
          aria-label="Minimum price"
        />
        <span className="text-slate-400 font-bold">—</span>
        <input 
          type="text" 
          value={inputValues[1]}
          onChange={handleMaxChange}
          onBlur={handleMaxBlur}
          className="w-full bg-white border border-slate-200 px-3 py-1.5 text-slate-800 text-xs font-mono font-bold rounded-xl focus:border-petha-amber focus:outline-none shadow-sm text-center"
          aria-label="Maximum price"
        />
      </div>
    </div>
  )
}

export default PriceRange