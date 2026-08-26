'use client'

/**
 * This file contains client-side actions that can be used in client components
 * without causing "server component" errors.
 */

import { redirect } from 'next/navigation'

/**
 * Client-side signout function that triggers a server action
 * @param countryCode The country code for redirecting after signout
 */
export async function handleSignout(countryCode: string) {
  try {
    // Make a fetch request to a server endpoint that will handle the signout
    await fetch(`/api/auth/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    // Redirect to the account page
    window.location.href = `/${countryCode}/account`
  } catch (error: unknown) {
    console.error('Error signing out:', error)
  }
}

/**
 * Client-side signup function that triggers a server action
 */
export async function handleSignup(formData: FormData) {
  try {
    const response = await fetch(`/api/auth/signup`, {
      method: 'POST',
      body: formData,
    })
    
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return { success: false, error: "Registration failed. If you already have an account, please sign in." }
    }
  } catch (error: unknown) {
    console.error('Error signing up:', error)
    return { success: false, error: 'Unable to connect to server. Please try again.' }
  }
}

/**
 * Client-side login function that triggers a server action
 */
export async function handleLogin(formData: FormData) {
  try {
    const response = await fetch(`/api/auth/login`, {
      method: 'POST',
      body: formData,
    })
    
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return { success: false, error: "Invalid email or password. Please verify your credentials or create a new account." }
    }
  } catch (error: unknown) {
    console.error('Error logging in:', error)
    return { success: false, error: 'Unable to connect to server. Please try again.' }
  }
}

/**
 * Client-side update customer function that triggers a server action
 */
export async function handleUpdateCustomer(customerData: any) {
  try {
    const response = await fetch(`/api/customers/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    })
    
    return await response.json()
  } catch (error: unknown) {
    console.error('Error updating customer:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: errorMessage };
  }
}

/**
 * Client-side transfer cart function that triggers a server action
 */
export async function handleTransferCart() {
  try {
    const response = await fetch(`/api/cart/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    return await response.json()
  } catch (error: unknown) {
    console.error('Error transferring cart:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: errorMessage };
  }
}

/**
 * Client-side authentication functions
 * These functions are used in client components to handle authentication
 * They call server actions through API routes
 */

// Login the user
export const loginUser = async (token: string): Promise<void> => {
  await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })
}

// Logout the user
export const logoutUser = async (): Promise<void> => {
  await fetch('/api/auth/logout', {
    method: 'POST',
  })
}

// Get the cart ID
export const getCartId = async (): Promise<string | null> => {
  const response = await fetch('/api/cart/id')
  const data = await response.json()
  return data.cartId || null
}

// Set the cart ID
export const setCartId = async (cartId: string): Promise<void> => {
  await fetch('/api/cart/id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cartId }),
  })
}

// Remove the cart ID
export const removeCartId = async (): Promise<void> => {
  await fetch('/api/cart/id', {
    method: 'DELETE',
  })
}

/** Password reset: request link */
export async function requestPasswordReset(email: string) {
  try {
    const res = await fetch(`/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
      },
      body: JSON.stringify({ email }),
    })
    return await res.json()
  } catch (e) {
    console.error("password reset request error", e)
    return { error: "Unable to request reset link" }
  }
}

/** Password reset: submit new password */
export async function submitNewPassword(token: string, password: string) {
  try {
    const res = await fetch(`/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
      },
      body: JSON.stringify({ token, password }),
    })
    return await res.json()
  } catch (e) {
    console.error("reset password error", e)
    return { error: "Unable to reset password" }
  }
} 