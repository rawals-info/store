"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { requestPasswordReset } from "@lib/data/client-actions"
import { Mail, ArrowLeft, CheckCircle2, KeyRound, Sparkles, Send } from "lucide-react"

export default function ForgotPasswordTemplate() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await requestPasswordReset(email.trim())
      if (result.error) {
        setError(result.error)
      } else {
        setSent(true)
      }
    } catch (err) {
      setError("Unable to process request. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center py-10 px-4 font-jakarta">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-10 shadow-sm"
      >
        {/* Top Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/70 text-petha-amber flex items-center justify-center mx-auto mb-5 shadow-xs">
          <KeyRound className="w-7 h-7" />
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Reset Link Dispatched
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                If an account exists for <strong className="text-slate-900">{email}</strong>, we have sent password recovery instructions to your inbox.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-slate-600 text-left space-y-1.5 mt-4">
              <p className="font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
                Didn&apos;t receive the email?
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                <li>Check your Spam, Junk, or Promotions folder</li>
                <li>Wait 2–3 minutes for delivery</li>
                <li>Make sure the email entered is correct</li>
              </ul>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setSent(false)
                  setEmail("")
                }}
                className="text-xs font-bold text-petha-amber hover:underline block mx-auto cursor-pointer"
              >
                Try another email address
              </button>

              <Link
                href="/account"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <span className="font-jakarta text-[11px] font-bold uppercase tracking-widest text-petha-amber">
                Account Recovery
              </span>
              <h1 className="font-cormorant text-3xl font-bold text-slate-900 leading-tight">
                Forgot Your Password?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                Enter your registered email address and we will send you a secure link to reset it.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-3.5 px-6 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-100">
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-petha-amber transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Remember your password? Sign In</span>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}