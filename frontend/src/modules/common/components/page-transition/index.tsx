"use client"

import { AnimatePresence, motion } from "framer-motion"
import { pageTransition } from "@lib/util/animations"
import { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition 