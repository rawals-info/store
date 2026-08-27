"use client"

import { useState } from "react"
import { submitNewPassword } from "@lib/data/client-actions"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, CheckCircle2, KeyRound, ArrowLeft, ShieldCheck } from "lucide-react"

export default function ResetPasswordTemplate() {
  const search = useSearchParams()
  const token = search?.get("token") ?? null
  const router = useRouter()

  const [pw1, setPw1] = useState("")
  const [pw2, setPw2] = useState("")
  const [showPw1, setShowPw1] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!token) {
    return (
      <div className="bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center py-10 px-4 font-jakarta">
        <div className="w-full max-w-md bg-white rounded-3xl border border-amber-100/90 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="font-cormorant text-2xl font-bold text-slate-900">
            Invalid or Expired Reset Link
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The password reset link is invalid or has expired. Please request a new link to reset your password.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (pw1.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (pw1 !== pw2) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await submitNewPassword(token, pw1)
      if (res.error) {
        setError(res.error)
      } else {
        setDone(true)
        setTimeout(() => router.push("/account"), 2500)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
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
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/70 text-petha-amber flex items-center justify-center mx-auto mb-5 shadow-xs">
          <KeyRound className="w-7 h-7" />
        </div>

        {done ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Password Successfully Updated!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Your account password has been updated. Redirecting you to your account...
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/account"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                Continue to Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <span className="font-jakarta text-[11px] font-bold uppercase tracking-widest text-petha-amber">
                Security Setup
              </span>
              <h1 className="font-cormorant text-3xl font-bold text-slate-900 leading-tight">
                Set New Password
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                Create a strong password with at least 8 characters for your Taj Petha account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPw1 ? "text" : "password"}
                    name="password"
                    required
                    value={pw1}
                    onChange={(e) => setPw1(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw1(!showPw1)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPw1 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPw2 ? "text" : "password"}
                    name="password_confirm"
                    required
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw2(!showPw2)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPw2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                disabled={loading || !pw1 || !pw2}
                className="w-full py-3.5 px-6 rounded-2xl bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Update Password</span>
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
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}