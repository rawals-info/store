"use client"

import { useState } from "react"
import Input from "@modules/common/components/input"
import { requestPasswordReset } from "@lib/data/client-actions"

export default function ForgotPasswordTemplate() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string|null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = await requestPasswordReset(email)
    if (result.error) {
      setError(result.error)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="w-full flex flex-col items-center py-20">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gradient-to-r from-[var(--color-luxury-gold)]/10 to-[var(--color-luxury-gold)]/20 border border-[var(--color-luxury-gold)]/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-luxury-darkgold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M5 5l14 14M19 5L5 19"/></svg>
      </div>
      <h1 className="font-display text-2xl text-[var(--color-luxury-charcoal)] mb-2 uppercase tracking-wider text-center">Forgot Password</h1>
      <div className="h-0.5 w-32 gold-gradient mb-6"></div>
      {sent ? (
        <p className="text-[var(--color-luxury-charcoal)]/80 max-w-sm text-center">If an account exists for {email}, you'll receive an email with a link to reset your password.</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <Input
            label="Email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="luxury-input"
          />
          {error && <div className="bg-red-100 mt-4 p-3 text-red-700 rounded">{error}</div>}
          <button type="submit" className="w-full mt-6 luxury-btn">
            Send reset link
          </button>
        </form>
      )}
    </div>
  )
} 