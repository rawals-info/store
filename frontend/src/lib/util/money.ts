import { isEmpty } from "./isEmpty"
import { DEFAULT_CURRENCY } from "@lib/config/defaults"

type ConvertToLocaleParams = {
  amount: number
  currency_code?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const formatIndianPrice = (amount: number, forceDecimals = false): string => {
  if (amount === undefined || amount === null || isNaN(amount)) return "0"
  
  const hasDecimals = Math.abs(amount % 1) > 0.001
  const shouldShowDecimals = forceDecimals || hasDecimals

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: shouldShowDecimals ? 2 : 0,
    maximumFractionDigits: shouldShowDecimals ? 2 : 0,
  }).format(amount)
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-IN",
}: ConvertToLocaleParams) => {
  // Handle invalid inputs
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "Price unavailable"
  }
  
  // Handle zero amount
  if (amount === 0) {
    return "₹0"
  }
  
  if (!currency_code || isEmpty(currency_code)) {
    currency_code = DEFAULT_CURRENCY // Use dynamic default currency
  }
  
  // Normalize currency code to uppercase to avoid formatting errors
  currency_code = currency_code.toUpperCase()
  
  const isINR = currency_code === "INR" || locale === "en-IN"
  const hasDecimals = Math.abs(amount % 1) > 0.001

  const minDigits = minimumFractionDigits !== undefined ? minimumFractionDigits : (hasDecimals ? 2 : 0)
  const maxDigits = maximumFractionDigits !== undefined ? maximumFractionDigits : (hasDecimals ? 2 : 0)
  
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency_code,
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    }).format(amount)
  } catch (error) {
    console.error("Currency formatting error:", error)
    return `${currency_code} ${amount}`
  }
}
