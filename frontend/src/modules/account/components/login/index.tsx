"use client"

import { handleLogin } from "@lib/data/client-actions"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, ArrowRight } from "lucide-react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const result = await handleLogin(formData)
      
      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        router.push("/account")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5" data-testid="login-page">
      <div className="text-center space-y-1">
        <h2 className="font-cormorant text-2xl font-bold text-slate-900">
          Welcome Back to Taj Petha
        </h2>
        <p className="text-xs text-slate-500">
          Sign in to view your orders and track live sweet dispatches.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
              data-testid="email-input"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-petha-amber hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
              data-testid="password-input"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-petha-amber hover:bg-petha-saffron text-white py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          data-testid="sign-in-button"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Don't have a profile yet?{" "}
          <button
            type="button"
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="font-bold text-petha-amber hover:underline cursor-pointer"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
