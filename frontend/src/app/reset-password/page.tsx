import ResetPasswordTemplate from "@modules/account/templates/reset-password-template"
import { Suspense } from "react"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordTemplate />
    </Suspense>
  )
} 