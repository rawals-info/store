"use client"

import { useEffect, useState } from "react"

interface FreshBatchTimerProps {
  className?: string
  inline?: boolean
}

/**
 * Clean & Modern Fresh Batch Dispatch Timer
 * Shows time remaining until today's 2 PM dispatch cutoff
 */
export default function CountdownTimer({ className = "", inline = false }: FreshBatchTimerProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    setIsMounted(true)

    const calculateTimeLeft = () => {
      const now = new Date()
      // IST is UTC+5:30
      const istOffset = 5.5 * 60 * 60 * 1000
      const nowIST = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000)

      // Create today's cutoff at 2 PM IST
      const cutoffToday = new Date(nowIST)
      cutoffToday.setHours(14, 0, 0, 0)

      let targetCutoff = cutoffToday

      if (nowIST.getTime() >= cutoffToday.getTime()) {
        targetCutoff = new Date(cutoffToday.getTime() + 24 * 60 * 60 * 1000)
      }

      const diff = targetCutoff.getTime() - nowIST.getTime()

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => String(num).padStart(2, '0')

  if (!isMounted) {
    return (
      <span className={`font-mono text-xs font-bold text-amber-200 ${className}`}>
        --h : --m : --s
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1 font-mono text-xs font-bold text-white ${className}`}>
      <span className="bg-black/20 px-1.5 py-0.5 rounded text-amber-200">
        {formatNumber(timeLeft.hours)}h
      </span>
      <span className="text-white/40">:</span>
      <span className="bg-black/20 px-1.5 py-0.5 rounded text-amber-200">
        {formatNumber(timeLeft.minutes)}m
      </span>
      <span className="text-white/40">:</span>
      <span className="bg-black/20 px-1.5 py-0.5 rounded text-amber-200">
        {formatNumber(timeLeft.seconds)}s
      </span>
    </div>
  )
}
