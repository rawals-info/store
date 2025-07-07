"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full h-full flex items-center justify-center py-16 luxury-pattern">
      <div className="w-full max-w-[500px] bg-white/90 backdrop-blur-sm border border-[var(--color-luxury-lightgold)]/30 rounded-md p-10 luxury-shadow-md fade-in mx-4">
        {currentView === "sign-in" ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate
