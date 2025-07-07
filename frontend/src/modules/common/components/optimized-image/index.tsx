"use client"

import Image, { ImageProps } from "next/image"
import { useState, useEffect } from "react"

interface OptimizedImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  /**
   * Whether this image should be prioritized for loading
   */
  isPriority?: boolean
  
  /**
   * Whether to show a loading blur effect
   */
  withBlur?: boolean
  
  /**
   * Custom classes for the image container
   */
  containerClassName?: string
}

/**
 * A wrapper around Next.js Image component with optimized defaults
 * for e-commerce use cases.
 */
const OptimizedImage = ({
  src,
  alt,
  className,
  containerClassName,
  fill = false,
  isPriority = false,
  withBlur = true,
  quality,
  sizes,
  placeholder,
  blurDataURL,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  
  // Use effect to simulate image loading
  useEffect(() => {
    // Simulate image loading completion after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [src]);
  
  // Default blur data URL if not provided and withBlur is true
  const defaultBlurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
  
  // Default quality based on priority
  const imageQuality = quality || (isPriority ? 85 : 75)
  
  // Default sizes if not provided
  const imageSizes = sizes || (fill ? "(max-width: 768px) 100vw, 50vw" : "100vw")
  
  // Determine loading strategy
  const loadingStrategy = isPriority ? "eager" : "lazy"
  
  // Determine placeholder strategy
  const placeholderStrategy = withBlur ? "blur" : placeholder || "empty"
  const blurPlaceholder = withBlur ? (blurDataURL || defaultBlurDataURL) : undefined
  
  return (
    <div className={`relative ${containerClassName || ""}`}>
      <Image
        src={src}
        alt={alt}
        className={`${className || ""} ${isLoading && withBlur ? "scale-110 blur-sm" : "scale-100 blur-0"} transition-all duration-300`}
        fill={fill}
        priority={isPriority}
        quality={imageQuality}
        sizes={imageSizes}
        loading={loadingStrategy}
        placeholder={placeholderStrategy as any}
        blurDataURL={blurPlaceholder}
        {...props}
      />
    </div>
  )
}

export default OptimizedImage 