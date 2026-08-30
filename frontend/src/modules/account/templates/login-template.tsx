"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, ShieldCheck, Truck, Lock } from "lucide-react"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  return (
    <div className="w-full flex items-center justify-center py-8 sm:py-14 px-4 sm:px-6 lg:px-8 font-jakarta">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Crest */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden relative shadow-xs">
              <Image src="/logo.webp" alt="Taj Petha" fill className="object-cover" />
            </div>
            <span className="font-cormorant text-2xl font-bold tracking-wider text-slate-900 group-hover:text-petha-amber transition-colors">
              TAJ PETHA
            </span>
          </Link>
          <p className="text-xs text-slate-500 font-medium">
            Authentic Royal Agra Confectioners Since 2013
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl border border-amber-200/60 p-7 sm:p-9 shadow-xs space-y-6">
          
          {/* Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
              className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                currentView === LOGIN_VIEW.SIGN_IN
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
              className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                currentView === LOGIN_VIEW.REGISTER
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Active View */}
          {currentView === LOGIN_VIEW.SIGN_IN ? (
            <Login setCurrentView={setCurrentView} />
          ) : (
            <Register setCurrentView={setCurrentView} />
          )}

        </div>

        {/* Member Perks Strip */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-slate-500 pt-2">
          <div className="flex flex-col items-center gap-1">
            <Sparkles className="w-4 h-4 text-petha-amber" />
            <span>20% Welcome Code</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-4 h-4 text-petha-amber" />
            <span>Live Air Tracking</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Secure Access</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginTemplate
