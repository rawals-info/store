"use client"

import { useEffect, useRef } from "react"

/**
 * Custom magnetic cursor — desktop only, respects prefers-reduced-motion.
 * Uses GSAP quickTo for buttery smooth trailing.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch devices or reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isTouch = window.matchMedia("(hover: none)").matches
    if (prefersReduced || isTouch) return

    let gsap: any = null
    let xTo: any = null
    let yTo: any = null
    let xToRing: any = null
    let yToRing: any = null

    import("gsap").then((mod) => {
      gsap = mod.gsap

      xTo = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "power3" })
      yTo = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "power3" })
      xToRing = gsap.quickTo(ringRef.current, "x", { duration: 0.22, ease: "power3" })
      yToRing = gsap.quickTo(ringRef.current, "y", { duration: 0.22, ease: "power3" })
    })

    const onMouseMove = (e: MouseEvent) => {
      if (!xTo) return
      xTo(e.clientX)
      yTo(e.clientY)
      xToRing(e.clientX)
      yToRing(e.clientY)
    }

    const onMouseEnterInteractive = () => {
      if (!dotRef.current || !ringRef.current || !gsap) return
      gsap.to(ringRef.current, { scale: 1.6, duration: 0.25, ease: "power2.out" })
      gsap.to(dotRef.current, { scale: 0, duration: 0.2, ease: "power2.out" })
    }

    const onMouseLeaveInteractive = () => {
      if (!dotRef.current || !ringRef.current || !gsap) return
      gsap.to(ringRef.current, { scale: 1, duration: 0.3, ease: "power2.out" })
      gsap.to(dotRef.current, { scale: 1, duration: 0.2, ease: "power2.out" })
    }

    document.addEventListener("mousemove", onMouseMove)

    // Attach to all interactive elements
    const attachToInteractive = () => {
      const els = document.querySelectorAll("a, button, [role='button'], input, select, textarea, label")
      els.forEach(el => {
        el.addEventListener("mouseenter", onMouseEnterInteractive)
        el.addEventListener("mouseleave", onMouseLeaveInteractive)
      })
    }
    attachToInteractive()

    // Re-attach on DOM mutations (for dynamic content)
    const observer = new MutationObserver(attachToInteractive)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          background: "#D97706",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          mixBlendMode: "multiply",
          willChange: "transform",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          border: "1.5px solid #D97706",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
          opacity: 0.75,
        }}
      />
    </>
  )
}
