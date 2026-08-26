"use client"

import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { handleSignup } from "@lib/data/client-actions"
import { useState } from "react"
import { Lock, Mail, User, Phone, ArrowRight, Sparkles } from "lucide-react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const result = await handleSignup(formData)
      
      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        window.location.href = "/account"
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Registration error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5" data-testid="register-page">
      <div className="text-center space-y-1">
        <h2 className="font-cormorant text-2xl font-bold text-slate-900">
          Create Your Taj Petha Profile
        </h2>
        <p className="text-xs text-slate-500">
          Join our VIP club for instant 20% discount code and order tracking.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="first_name"
                required
                placeholder="First"
                autoComplete="given-name"
                className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
                data-testid="first-name-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
            <input
              type="text"
              name="last_name"
              required
              placeholder="Last"
              autoComplete="family-name"
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
              data-testid="last-name-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
              data-testid="email-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              autoComplete="tel"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
              data-testid="phone-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Create Password *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              name="password"
              required
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-petha-amber focus:bg-white transition-all"
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
          data-testid="register-button"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Create Taj Petha Profile</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Already registered?{" "}
          <button
            type="button"
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className="font-bold text-petha-amber hover:underline cursor-pointer"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register
