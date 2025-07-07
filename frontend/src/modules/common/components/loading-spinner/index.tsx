"use client"

import { motion } from "framer-motion"
import { spinnerAnimation } from "@lib/util/animations"

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
  color?: "primary" | "secondary" | "gold"
}

const LoadingSpinner = ({ size = "medium", color = "gold" }: LoadingSpinnerProps) => {
  const sizeMap = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  const colorMap = {
    primary: "border-ui-fg-base border-t-ui-fg-subtle",
    secondary: "border-ui-fg-subtle border-t-ui-fg-base",
    gold: "border-amber-300 border-t-amber-600",
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`rounded-full border-2 ${sizeMap[size]} ${colorMap[color]}`}
        variants={spinnerAnimation}
        animate="animate"
      />
    </div>
  )
}

export default LoadingSpinner 