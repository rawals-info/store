"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  className?: string
  inline?: boolean
}

export default function CountdownTimer({ className = "", inline = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Calculate time until end of Sunday (or next Sunday if today is past Sunday)
    const calculateTimeLeft = () => {
      const now = new Date()
      const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.
      
      // Calculate days until next Sunday (0)
      let daysUntilSunday = (7 - dayOfWeek) % 7
      if (daysUntilSunday === 0 && now.getHours() >= 23 && now.getMinutes() >= 59) {
        daysUntilSunday = 7 // If it's Sunday and past 11:59 PM, target next Sunday
      }
      
      // Set target to next Sunday at 11:59:59 PM
      const targetDate = new Date(now)
      targetDate.setDate(now.getDate() + daysUntilSunday)
      targetDate.setHours(23, 59, 59, 999)
      
      const difference = targetDate.getTime() - now.getTime()
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Calculate immediately
    calculateTimeLeft()
    
    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(interval)
  }, [])

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

