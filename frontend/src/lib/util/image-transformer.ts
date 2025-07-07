/**
 * Image transformation utility for optimizing images
 * This can be extended to work with image CDNs like Cloudinary, Imgix, etc.
 */

type ImageFormat = 'webp' | 'avif' | 'jpg' | 'png' | 'original';
type ImageQuality = number; // 1-100
type ImageFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

interface ImageTransformOptions {
  width?: number;
  height?: number;
  format?: ImageFormat;
  quality?: ImageQuality;
  fit?: ImageFit;
  blur?: number;
}

/**
 * Checks if a URL is from a known CDN that supports transformations
 */
const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('cloudinary.com');
};

/**
 * Checks if URL is external (not from our domain)
 */
const isExternalUrl = (url: string): boolean => {
  if (!url) return false;
  return url.startsWith('http') || url.startsWith('//');
};

/**
 * Transforms Cloudinary URLs to include optimization parameters
 */
const transformCloudinaryUrl = (url: string, options: ImageTransformOptions): string => {
  // Parse the Cloudinary URL to extract components
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) return url;
  
  const transformations: string[] = [];
  
  // Add width and height if specified
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  
  // Add quality
  if (options.quality) transformations.push(`q_${options.quality}`);
  
  // Add format
  if (options.format && options.format !== 'original') {
    transformations.push(`f_${options.format}`);
  }
  
  // Add fit/crop mode
  if (options.fit) {
    const cropMode = options.fit === 'cover' ? 'fill' : 
                    options.fit === 'contain' ? 'fit' : 
                    options.fit === 'fill' ? 'scale' : 
                    options.fit;
    transformations.push(`c_${cropMode}`);
  }
  
  // Add blur if specified
  if (options.blur) transformations.push(`e_blur:${options.blur}`);
  
  // Construct the transformed URL
  const transformationString = transformations.length > 0 ? 
    transformations.join(',') + '/' : '';
  
  return `${urlParts[0]}/upload/${transformationString}${urlParts[1]}`;
};

/**
 * Transform image URL with optimization parameters
 * Falls back to original URL if no transformations can be applied
 */
export const transformImageUrl = (url: string, options: ImageTransformOptions = {}): string => {
  if (!url) return '';
  
  // Handle relative URLs
  if (!isExternalUrl(url)) {
    // For local images, we rely on Next.js Image component optimization
    return url;
  }
  
  // For Cloudinary URLs
  if (isCloudinaryUrl(url)) {
    return transformCloudinaryUrl(url, options);
  }
  
  // For other external URLs, return as is
  // In a production app, you might want to proxy these through a service like Imgix
  return url;
};

/**
 * Generate responsive image sizes based on breakpoints
 */
export const getResponsiveSizes = (
  defaultSize: number,
  breakpoints: Record<string, number> = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  }
): string => {
  const sizes = Object.entries(breakpoints).map(
    ([breakpoint, width]) => `(max-width: ${width}px) ${Math.min(width, defaultSize)}px`
  );
  
  sizes.push(`${defaultSize}px`);
  return sizes.join(', ');
};

/**
 * Generate a low-quality image placeholder
 * This is a simple implementation - in production you might want to use
 * a more sophisticated approach like SQIP or BlurHash
 */
export const generatePlaceholder = (
  width: number = 10,
  height: number = 10,
  color: string = 'EFEFEF'
): string => {
  // Return a data URL for a simple colored rectangle
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' fill='%23${color}'%3E%3Crect width='${width}' height='${height}' /%3E%3C/svg%3E`;
}; 