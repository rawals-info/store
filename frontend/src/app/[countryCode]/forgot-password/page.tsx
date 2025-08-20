import { Suspense } from "react"
import ForgotPasswordTemplate from "@modules/account/templates/forgot-password-template"

export default function ForgotPasswordAlias() {
  return (
    <Suspense fallback={<div className="h-10 w-full bg-luxury-ivory/50 animate-pulse rounded" />}> 
      <ForgotPasswordTemplate />
    </Suspense>
  )
}