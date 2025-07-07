/**
 * Normalizes a path to ensure it uses the correct country code format
 * Prevents nested country codes like /us/in and ensures we use /in directly
 * 
 * @param path The path to normalize
 * @param currentCountry The current country code
 * @returns The normalized path
 */
export function normalizeCountryPath(path: string, currentCountry?: string): string {
  // Handle empty paths
  if (!path || path === '/') {
    return currentCountry ? `/${currentCountry}` : '/'
  }
  
  // Handle absolute URLs
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  // Check if the path already contains a country code
  const countryCodeMatch = normalizedPath.match(/^\/([a-z]{2})($|\/)/)
  
  if (countryCodeMatch) {
    // Extract the country code from the path
    const pathCountryCode = countryCodeMatch[1]
    
    // If the path has a nested country code like /us/in
    const nestedMatch = normalizedPath.match(/^\/[a-z]{2}\/([a-z]{2})($|\/)/)
    if (nestedMatch) {
      // Use the nested country code directly
      const nestedCountryCode = nestedMatch[1]
      const restOfPath = normalizedPath.substring(normalizedPath.indexOf(nestedCountryCode) + 2)
      return `/${nestedCountryCode}${restOfPath}`
    }
    
    // If the path already has a country code, use it as is
    return normalizedPath
  }
  
  // If no country code in the path, add the current country code
  return currentCountry ? `/${currentCountry}${normalizedPath}` : normalizedPath
} 