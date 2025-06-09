"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  // Early conditional return - must be before any hooks
  if (min === max) {
    return null
  }

  // Initialize with props but don't update on every prop change
  const [localValue, setLocalValue] = useState<[number, number]>(value)
  // Store the input values as strings to allow proper editing
  const [inputValues, setInputValues] = useState<[string, string]>([
    value[0].toString(),
    value[1].toString(),
  ])
  const sliderRef = useRef<HTMLDivElement>(null)
  const initialRenderRef = useRef(true)
  
  // Format price based on currency code
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  // Only set local value from props on first render
  useEffect(() => {
    if (initialRenderRef.current) {
      setLocalValue(value)
      setInputValues([value[0].toString(), value[1].toString()])
      initialRenderRef.current = false
    }
  }, [value])

  // Validate and handle min input change
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the string input value first
    const newInputValue = e.target.value
    setInputValues([newInputValue, inputValues[1]])
  }
  
  // Handle min input blur to validate and commit changes
  const handleMinBlur = () => {
    // Parse the input value, default to min if invalid
    let newValue = parseInt(inputValues[0])
    if (isNaN(newValue)) {
      newValue = min
    }
    
    // Enforce min/max boundaries
    if (newValue < min) {
      newValue = min
    }
    
    // Ensure min is at least 10 less than max
    if (newValue > localValue[1] - 10) {
      newValue = localValue[1] - 10
    }
    
    const updatedValues: [number, number] = [newValue, localValue[1]]
    setLocalValue(updatedValues)
    setInputValues([newValue.toString(), inputValues[1]])
    handleChange(updatedValues)
  }
  
  // Validate and handle max input change
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the string input value first
    const newInputValue = e.target.value
    setInputValues([inputValues[0], newInputValue])
  }
  
  // Handle max input blur to validate and commit changes
  const handleMaxBlur = () => {
    // Parse the input value, default to max if invalid
    let newValue = parseInt(inputValues[1])
    if (isNaN(newValue)) {
      newValue = max
    }
    
    // Enforce min/max boundaries
    if (newValue > max) {
      newValue = max
    }
    
    // Ensure max is at least 10 more than min
    if (newValue < localValue[0] + 10) {
      newValue = localValue[0] + 10
    }
    
    const updatedValues: [number, number] = [localValue[0], newValue]
    setLocalValue(updatedValues)
    setInputValues([inputValues[0], newValue.toString()])
    handleChange(updatedValues)
  }

  // Handler for completing a value change
  const handleCommit = useCallback((newValues: [number, number]) => {
    // Ensure values are within valid range before committing
    const validMin = Math.max(min, Math.min(newValues[0], max))
    const validMax = Math.min(max, Math.max(newValues[1], min))
    
    const validatedValues: [number, number] = [
      validMin,
      Math.max(validMin + 10, validMax)
    ]
    
    setLocalValue(validatedValues)
    setInputValues([validatedValues[0].toString(), validatedValues[1].toString()])
    handleChange(validatedValues)
  }, [min, max, handleChange])

  // Handle input key press to commit changes on Enter
  const handleKeyPress = (e: React.KeyboardEvent, isMin: boolean) => {
    if (e.key === 'Enter') {
      if (isMin) {
        handleMinBlur()
      } else {
        handleMaxBlur()
      }
    }
  }
  
  // Handle click on the slider track
  const handleTrackClick = (e: React.MouseEvent) => {
    if (!sliderRef.current) return
    
    // Get click position relative to the track
    const rect = sliderRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const percentage = (offsetX / rect.width) * 100
    
    // Calculate the value based on percentage
    const clickValue = Math.round(((percentage / 100) * (max - min)) + min)
    
    // Determine which handle to move based on proximity
    const distToMin = Math.abs(clickValue - localValue[0])
    const distToMax = Math.abs(clickValue - localValue[1])
    
    let newValues: [number, number]
    
    if (distToMin <= distToMax) {
      // Move min handle if it's closer or equidistant
      if (clickValue < localValue[1] - 10) {
        newValues = [clickValue, localValue[1]]
      } else {
        newValues = [localValue[1] - 10, localValue[1]]
      }
    } else {
      // Move max handle if it's closer
      if (clickValue > localValue[0] + 10) {
        newValues = [localValue[0], clickValue]
      } else {
        newValues = [localValue[0], localValue[0] + 10]
      }
    }
    
    setLocalValue(newValues)
    setInputValues([newValues[0].toString(), newValues[1].toString()])
    handleChange(newValues)
  }

  // Calculate percentage of position for min/max range
  const minPos = ((localValue[0] - min) / (max - min)) * 100
  const maxPos = ((localValue[1] - min) / (max - min)) * 100
  
  return (
    <div className="flex flex-col gap-y-4 w-full max-w-full" data-testid={dataTestId}>
      <Text className="text-serif font-medium text-sm text-luxury-charcoal tracking-wide uppercase">Price Range</Text>
      
      {/* Price display */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-serif text-luxury-gold">
          {formatPrice(localValue[0])}
        </span>
        <span className="text-xs font-serif text-luxury-gold">
          {formatPrice(localValue[1])}
        </span>
      </div>
      
      {/* Custom range slider */}
      <div 
        ref={sliderRef}
        className="relative h-1.5 bg-luxury-gold/20 rounded-full mb-6 w-full cursor-pointer"
        onClick={handleTrackClick}
      >
        {/* Track fill */}
        <div 
          className="absolute h-full bg-luxury-gold rounded-full" 
          style={{ 
            left: `${minPos}%`, 
            width: `${maxPos - minPos}%` 
          }}
        ></div>
        
        {/* Min handle */}
        <div 
          className="absolute w-4 h-4 bg-luxury-gold border-2 border-luxury-ivory shadow-sm rounded-full -mt-[0.3125rem] -ml-2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
          style={{ left: `${minPos}%` }}
          onMouseDown={(e) => {
            e.preventDefault() // Prevent text selection during drag
            e.stopPropagation() // Prevent track click
            
            const handleDrag = (e: MouseEvent) => {
              if (!sliderRef.current) return
              const rect = sliderRef.current.getBoundingClientRect()
              const width = rect.width
              const offsetX = Math.max(0, Math.min(width, e.clientX - rect.left))
              const percentage = (offsetX / width) * 100
              const newVal = Math.round(((percentage / 100) * (max - min)) + min)
              
              if (newVal < localValue[1] - 10) {
                const updatedValue = Math.max(min, newVal)
                setLocalValue([updatedValue, localValue[1]])
                setInputValues([updatedValue.toString(), inputValues[1]])
              }
            }
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleDrag)
              document.removeEventListener('mouseup', handleMouseUp)
              
              // Immediately commit the change when drag ends
              handleCommit(localValue)
            }
            
            document.addEventListener('mousemove', handleDrag)
            document.addEventListener('mouseup', handleMouseUp)
          }}
        ></div>
        
        {/* Max handle */}
        <div 
          className="absolute w-4 h-4 bg-luxury-gold border-2 border-luxury-ivory shadow-sm rounded-full -mt-[0.3125rem] -ml-2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
          style={{ left: `${maxPos}%` }}
          onMouseDown={(e) => {
            e.preventDefault() // Prevent text selection during drag
            e.stopPropagation() // Prevent track click
            
            const handleDrag = (e: MouseEvent) => {
              if (!sliderRef.current) return
              const rect = sliderRef.current.getBoundingClientRect()
              const width = rect.width
              const offsetX = Math.max(0, Math.min(width, e.clientX - rect.left))
              const percentage = (offsetX / width) * 100
              const newVal = Math.round(((percentage / 100) * (max - min)) + min)
              
              if (newVal > localValue[0] + 10) {
                const updatedValue = Math.min(max, newVal)
                setLocalValue([localValue[0], updatedValue])
                setInputValues([inputValues[0], updatedValue.toString()])
              }
            }
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleDrag)
              document.removeEventListener('mouseup', handleMouseUp)
              
              // Immediately commit the change when drag ends
              handleCommit(localValue)
            }
            
            document.addEventListener('mousemove', handleDrag)
            document.addEventListener('mouseup', handleMouseUp)
          }}
        ></div>
      </div>
      
      <div className="flex gap-x-4 items-center w-full">
        <div className="flex flex-col gap-y-1 flex-1">
          <input 
            type="text" 
            value={inputValues[0]}
            onChange={handleMinChange}
            onBlur={handleMinBlur}
            onKeyPress={(e) => handleKeyPress(e, true)}
            className="w-full bg-luxury-ivory border border-luxury-gold/30 p-2 text-luxury-charcoal text-xs rounded-sm focus:border-luxury-gold focus:outline-none shadow-sm font-serif"
            aria-label="Minimum price"
          />
        </div>
        <div className="h-px w-4 bg-luxury-gold/40"></div>
        <div className="flex flex-col gap-y-1 flex-1">
          <input 
            type="text" 
            value={inputValues[1]}
            onChange={handleMaxChange}
            onBlur={handleMaxBlur}
            onKeyPress={(e) => handleKeyPress(e, false)}
            className="w-full bg-luxury-ivory border border-luxury-gold/30 p-2 text-luxury-charcoal text-xs rounded-sm focus:border-luxury-gold focus:outline-none shadow-sm font-serif"
            aria-label="Maximum price"
          />
        </div>
      </div>
    </div>
  )
}

export default PriceRange 