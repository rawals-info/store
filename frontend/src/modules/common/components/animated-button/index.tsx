//@ts-nocheck
"use client"

import { motion } from "framer-motion"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { clx } from "@medusajs/ui"
import { luxuryHover } from "@lib/util/animations"

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onDrag">

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "gold" | "outline" | "transparent"
  size?: "small" | "medium" | "large"
  isLoading?: boolean
  className?: string
}

const AnimatedButton = ({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  className = "",
  ...props
}: AnimatedButtonProps) => {
  const variantClasses = {
    primary: "bg-ui-bg-base text-ui-fg-base border border-ui-border-base hover:bg-ui-bg-subtle",
    secondary: "bg-ui-bg-subtle text-ui-fg-base border border-ui-border-base hover:bg-ui-bg-base",
    gold: "bg-luxury-gold text-luxury-charcoal border border-luxury-gold/80 hover:bg-luxury-gold/90 shadow-luxury-sm",
    outline: "bg-transparent text-luxury-charcoal border border-luxury-gold/40 hover:border-luxury-gold hover:bg-luxury-ivory",
    transparent: "bg-transparent text-luxury-charcoal hover:text-luxury-gold",
  }

  const sizeClasses = {
    small: "px-3 py-1.5 text-xs tracking-wider uppercase",
    medium: "px-5 py-2 text-sm tracking-wide",
    large: "px-7 py-3 text-base tracking-wide",
  }

  // Omit onDrag to avoid conflicts with framer-motion
  const { onDrag, ...buttonProps } = props

  return (
    <motion.button
      className={clx(
        "rounded-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:ring-opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      variants={luxuryHover}
      initial="initial"
      whileHover="whileHover"
      whileTap="whileTap"
      disabled={isLoading || props.disabled}
      {...buttonProps}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      ) : (
        <span className="flex items-center justify-center">
          {children}
          {variant === "gold" && (
            <span className="ml-2 opacity-70">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
        </span>
      )}
    </motion.button>
  )
}

export default AnimatedButton 