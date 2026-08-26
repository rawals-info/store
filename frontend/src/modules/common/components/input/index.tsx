import { Label } from "@medusajs/ui"
import React, { useEffect, useImperativeHandle, useState } from "react"
import clsx from "clsx"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, className, errors, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    const errorMessage = errors
      ? (typeof errors[name] === "string" ? errors[name] : null) ||
        (typeof errors[name.replace("shipping_address.", "")] === "string" ? errors[name.replace("shipping_address.", "")] : null) ||
        (typeof errors[name.replace("billing_address.", "")] === "string" ? errors[name.replace("billing_address.", "")] : null)
      : null

    const hasError = Boolean(errorMessage)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 text-gray-700/80 text-sm">{topLabel}</Label>
        )}
        <div className="flex relative z-0 w-full txt-compact-medium">
          <input
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            className={clsx(
              "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-white border rounded-xl appearance-none focus:outline-none focus:ring-0 transition-colors luxury-input",
              hasError
                ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:bg-white"
                : "border-slate-200 focus:border-petha-amber",
              className
            )}
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className={clsx(
              "flex items-center justify-start mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 truncate max-w-[85%] pointer-events-none",
              hasError ? "text-rose-500" : "text-gray-700/70"
            )}
          >
            <span className="truncate">{label}</span>
            {required && <span className="text-rose-500 ml-0.5 flex-shrink-0">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-4 focus:outline-none transition-all duration-150 outline-none absolute right-0 top-3 text-gray-700/50 focus:text-yellow-600"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
        {hasError && (
          <p className="text-[11px] text-rose-600 font-semibold font-jakarta mt-1 flex items-center gap-1 animate-fadeIn">
            <span>⚠️</span>
            <span>{errorMessage as string}</span>
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
