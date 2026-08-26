import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { UserCheck } from "lucide-react"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs font-jakarta">
      <div className="flex items-center gap-2.5">
        <span className="text-base">👋</span>
        <div>
          <span className="font-bold text-slate-800">Returning Sweet Lover? </span>
          <span className="text-slate-600 hidden sm:inline">Sign in for saved delivery addresses &amp; rewards.</span>
        </div>
      </div>
      <LocalizedClientLink
        href="/account"
        className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-petha-amber hover:text-white font-jakarta font-bold text-xs text-slate-800 transition-colors shadow-sm whitespace-nowrap"
        data-testid="sign-in-button"
      >
        Sign In →
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
