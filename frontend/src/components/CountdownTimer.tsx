"use client"

import { useEffect, useState } from "react"

interface FreshBatchTimerProps {
  className?: string
  inline?: boolean
}

/**
 * Premium "Fresh Batch Ships" timer
 * Shows time until next shipping cutoff (2 PM IST daily)
 * Feels authentic and tied to actual business operations
 */
export default function CountdownTimer({ className = "", inline = false }: FreshBatchTimerProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isNextDay, setIsNextDay] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const calculateTimeLeft = () => {
      const now = new Date()

      // Shipping cutoff is 2 PM IST (14:00)
      // IST is UTC+5:30
      const istOffset = 5.5 * 60 * 60 * 1000
      const nowIST = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000)

      // Create today's cutoff at 2 PM IST
      const cutoffToday = new Date(nowIST)
      cutoffToday.setHours(14, 0, 0, 0)

      let targetCutoff = cutoffToday
      let nextDay = false

      // If we're past 2 PM, target tomorrow's cutoff
      if (nowIST.getTime() >= cutoffToday.getTime()) {
        targetCutoff = new Date(cutoffToday.getTime() + 24 * 60 * 60 * 1000)
        nextDay = true
      }

      const diff = targetCutoff.getTime() - nowIST.getTime()

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
        setIsNextDay(nextDay)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isMounted) {
    if (inline) {
      return <span className={`font-mono font-medium ${className}`}>--:--:--</span>
    }
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <TimeBlock value="--" />
        <Separator />
        <TimeBlock value="--" />
        <Separator />
        <TimeBlock value="--" />
      </div>
    )
  }

  const formatNumber = (num: number) => String(num).padStart(2, '0')

  if (inline) {
    return (
      <span className={`font-mono font-medium ${className}`}>
        {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
      </span>
    )
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <TimeBlock value={formatNumber(timeLeft.hours)} label="hrs" />
      <Separator />
      <TimeBlock value={formatNumber(timeLeft.minutes)} label="min" />
      <Separator />
      <TimeBlock value={formatNumber(timeLeft.seconds)} label="sec" />
    </div>
  )
}

// Elegant time block component
function TimeBlock({ value, label }: { value: string; label?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-luxury-charcoal/90 text-white px-2.5 py-1.5 rounded-sm min-w-[40px] text-center">
        <span className="font-mono text-sm font-semibold tracking-wide">{value}</span>
      </div>
      {label && (
        <span className="text-[9px] uppercase tracking-wider text-luxury-charcoal/60 mt-1">{label}</span>
      )}
    </div>
  )
}

function Separator() {
  return <span className="text-luxury-charcoal/40 font-light text-lg pb-3">:</span>
}
