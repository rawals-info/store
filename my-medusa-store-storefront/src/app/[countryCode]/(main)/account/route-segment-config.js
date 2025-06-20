// This file configures the rendering behavior for the account section
// It applies to all pages within the account directory

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

// Skip generating static params for account pages
export async function generateStaticParams() {
  return []
} 