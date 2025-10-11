"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  className?: string
  inline?: boolean
}

export default function CountdownTimer({ className = "", inline = false }: CountdownTimerProps) {
  // ✅ FIX: Start with null to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // ✅ FIX: Only show timer after client-side mount
    setIsMounted(true)
    
    // ✅ 48-hour rolling countdown that resets every 48 hours
    const calculateTimeLeft = () => {
      const now = new Date()
      
      // Get a consistent reset point every 48 hours
      // Using epoch time divided by 48 hours to get consistent 48-hour windows
      const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000 // 48 hours in milliseconds
      const epochTime = now.getTime()
      const timeSinceLastReset = epochTime % FORTY_EIGHT_HOURS
      const timeUntilNextReset = FORTY_EIGHT_HOURS - timeSinceLastReset
      
      if (timeUntilNextReset > 0) {
        const hours = Math.floor(timeUntilNextReset / (1000 * 60 * 60))
        const minutes = Math.floor((timeUntilNextReset % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeUntilNextReset % (1000 * 60)) / 1000)
        
        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 48, minutes: 0, seconds: 0 })
      }
    }

    // Calculate immediately
    calculateTimeLeft()
    
    // Update every 1 second for accuracy
    const interval = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // ✅ FIX: Don't render anything until mounted on client
  if (!isMounted) {
    // Return placeholder with same structure to prevent layout shift
    if (inline) {
      return <span className={`font-mono font-bold ${className}`}>00:00:00</span>
    }
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="flex items-center bg-luxury-gold/20 px-1.5 py-0.5 rounded border border-luxury-gold/30">
          <span className="font-mono text-xs font-bold text-luxury-gold">00</span>
        </div>
        <span className="text-xs text-luxury-gold">:</span>
        <div className="flex items-center bg-luxury-gold/20 px-1.5 py-0.5 rounded border border-luxury-gold/30">
          <span className="font-mono text-xs font-bold text-luxury-gold">00</span>
        </div>
        <span className="text-xs text-luxury-gold">:</span>
        <div className="flex items-center bg-luxury-gold/20 px-1.5 py-0.5 rounded border border-luxury-gold/30">
          <span className="font-mono text-xs font-bold text-luxury-gold">00</span>
        </div>
      </div>
    )
  }

  // Format number to always show 2 digits
  const formatNumber = (num: number) => String(num).padStart(2, '0')

  if (inline) {
    return (
      <span className={`font-mono font-bold ${className}`}>
        {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
      </span>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center bg-luxury-gold/20 px-1.5 py-0.5 rounded border border-luxury-gold/30">
        <span className="font-mono text-xs font-bold text-luxury-gold">{formatNumber(timeLeft.hours)}</span>
      </div>
      <span className="text-xs text-luxury-gold">:</span>
      <div className="flex items-center bg-luxury-gold/20 px-1.5 py-0.5 rounded border border-luxury-gold/30">
        <span className="font-mono text-xs font-bold text-luxury-gold">{formatNumber(timeLeft.minutes)}</span>
      </div>
      <span className="text-xs text-luxury-gold">:</span>
      <div className="flex items-center bg-luxury-gold/20 px-1.5 py-0.5 rounded border border-luxury-gold/30">
        <span className="font-mono text-xs font-bold text-luxury-gold">{formatNumber(timeLeft.seconds)}</span>
      </div>
    </div>
  )
}

