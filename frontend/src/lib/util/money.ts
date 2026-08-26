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
  const hasPaise = Math.round(amount * 100) % 100 !== 0
  const minDigits = forceDecimals ? 2 : (hasPaise ? 2 : 0)
  
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits = 2,
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
  
  // Check if amount has paise / cents
  const hasPaise = Math.round(amount * 100) % 100 !== 0
  const minDigits = minimumFractionDigits !== undefined ? minimumFractionDigits : (hasPaise ? 2 : 0)
  
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency_code,
      currencyDisplay: currency_code.toUpperCase() === 'USD' ? 'code' : 'symbol',
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maximumFractionDigits ?? 2,
    }).format(amount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return `${amount.toFixed(hasPaise ? 2 : 0)} ${currency_code}`
  }
}
