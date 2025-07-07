/**
 * Animation variants for Framer Motion
 * These are used across the site for consistent animations
 */

// Fade in animation
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

// Fade in animation with delay options
export const fadeInWithDelay = (delay: number = 0.2) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay, duration: 0.5 } },
  exit: { opacity: 0 },
})

// Slide up and fade in animation for scroll reveals
export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: {
      duration: 0.4,
    }
  },
}

// Staggered children animation for lists
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Luxury hover effect for interactive elements
export const luxuryHover = {
  initial: { scale: 1 },
  whileHover: { 
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    }
  },
  whileTap: { scale: 0.98 },
}

// Page transition animation
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.4,
    }
  },
}

// Elegant reveal animation for sections
export const elegantReveal = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

// Scroll reveal animation - use with useInView hook
export const scrollReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

// Luxury loading spinner animation
export const spinnerAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1.5,
      ease: "linear",
      repeat: Infinity,
    },
  },
} 