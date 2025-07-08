import { isEmpty } from "./isEmpty"
import { DEFAULT_CURRENCY } from "@lib/config/defaults"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  locale = "en-IN",
}: ConvertToLocaleParams) => {
  // Handle invalid inputs
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "Price unavailable"
  }
  
  // Handle zero amount
  if (amount === 0) {
    return "Contact for price"
  }
  
  if (!currency_code || isEmpty(currency_code)) {
    currency_code = DEFAULT_CURRENCY // Use dynamic default currency
  }
  
  // Normalize currency code to uppercase to avoid formatting errors
  currency_code = currency_code.toUpperCase()
  
  // We're now handling prices that are 100x larger, so no need to warn about high values
  // Instead, ensure the amount is a proper number without floating point issues
  amount = Math.round(amount * 100) / 100
  
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency_code,
      currencyDisplay: currency_code.toUpperCase() === 'USD' ? 'code' : 'symbol',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return `${amount.toFixed(2)} ${currency_code}`
  }
}
