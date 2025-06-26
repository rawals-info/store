"use client"

import { handleLogin } from "@lib/data/client-actions"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Input from "@modules/common/components/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

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
        // Login successful – soft navigate to account page to avoid full reload
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
    <div
      className="w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gradient-to-r from-[var(--color-luxury-gold)]/10 to-[var(--color-luxury-gold)]/20 border border-[var(--color-luxury-gold)]/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-luxury-darkgold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      
      <h1 className="font-display text-2xl text-[var(--color-luxury-charcoal)] mb-2 uppercase tracking-wider text-center">Welcome Back</h1>
      <div className="h-0.5 w-32 gold-gradient mb-6"></div>
      <p className="text-center text-[var(--color-luxury-charcoal)]/70 mb-8 max-w-sm">
        Sign in to access an enhanced shopping experience.
      </p>
      <form className="w-full max-w-sm" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
            className="luxury-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
            className="luxury-input"
          />
        </div>
        {error && (
          <div className="bg-red-100 p-4 rounded mt-4 text-red-700">
            {error}
          </div>
        )}
        <button 
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-[var(--color-luxury-darkgold)] to-[var(--color-luxury-gold)] hover:from-[var(--color-luxury-gold)] hover:to-[var(--color-luxury-darkgold)] text-white px-6 py-3 rounded luxury-btn disabled:opacity-70"
          data-testid="sign-in-button"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="w-full max-w-sm text-right mt-2">
        <a
          href="forgot-password"
          className="text-[var(--color-luxury-gold)] hover:text-[var(--color-luxury-darkgold)] text-sm"
        >
          Forgot password?
        </a>
      </div>
      <div className="w-full max-w-sm flex items-center my-8">
        <div className="flex-grow h-px bg-[var(--color-luxury-lightgold)]/20"></div>
        <span className="px-4 text-[var(--color-luxury-charcoal)]/50 text-sm">OR</span>
        <div className="flex-grow h-px bg-[var(--color-luxury-lightgold)]/20"></div>
      </div>
      <span className="text-center text-[var(--color-luxury-charcoal)]/70">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-[var(--color-luxury-gold)] hover:text-[var(--color-luxury-darkgold)] font-medium"
          data-testid="register-button"
        >
          Join us
        </button>
      </span>
    </div>
  )
}

export default Login
