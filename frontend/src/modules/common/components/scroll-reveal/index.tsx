"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { useScrollAnimation } from "@lib/hooks/use-scroll-animation"
import { scrollReveal } from "@lib/util/animations"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  once?: boolean
}

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  threshold = 0.2,
  once = true,
}: ScrollRevealProps) => {
  const { ref, isInView } = useScrollAnimation({
    once,
    threshold,
  })

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={scrollReveal}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        delay,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal 