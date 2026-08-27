"use client"

import React, { Component, ReactNode } from "react"
import Link from "next/link"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Luxury Error Boundary Component
 * Catches React errors and presents a premium, graceful fallback UI
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Taj Petha Error Boundary]:", error, errorInfo)
    }
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF8F5] px-4 py-16">
          <div className="max-w-lg w-full bg-white rounded-3xl border border-amber-200/90 shadow-2xl p-8 sm:p-10 text-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-petha-amber/10 rounded-full blur-2xl pointer-events-none" />

            {/* Icon */}
            <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-25" />
              <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-sm flex items-center justify-center text-3xl">
                🍬
              </div>
            </div>

            {/* Headings */}
            <span className="font-jakarta text-xs uppercase tracking-[0.2em] font-bold text-petha-amber inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 mb-3">
              Fresh Batch Assurance
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-3">
              Something Paused in Our Kitchen
            </h2>

            <p className="font-jakarta text-sm text-slate-600 mb-6 leading-relaxed max-w-sm mx-auto">
              We encountered a temporary hiccup preparing this view. Don&apos;t worry, your sweet cart is completely safe.
            </p>

            {/* Developer Details in Development Mode */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-left overflow-x-auto shadow-inner">
                <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Dev Trace
                </div>
                <p className="font-mono text-xs text-slate-200 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer text-center"
              >
                🔄 Refresh &amp; Try Again
              </button>

              <Link
                href="/in"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-slate-800 border border-amber-200 font-jakarta text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
              >
                ← Back to Sweet Store
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
