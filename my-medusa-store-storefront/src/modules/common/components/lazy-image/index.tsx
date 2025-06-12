"use client"

import { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"
import useLazyImage from "@lib/hooks/use-lazy-image"
import { transformImageUrl } from "@lib/util/image-transformer"

interface LazyImageProps extends Omit<ImageProps, "onLoad"> {
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
  
  /**
   * Root margin for the intersection observer
   */
  rootMargin?: string
  
  /**
   * Threshold for the intersection observer
   */
  threshold?: number | number[]
}

/**
 * A lazy-loaded image component that only loads when it comes into view
 */
const LazyImage = ({
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
  rootMargin = "200px 0px",
  threshold = 0.1,
  ...props
}: LazyImageProps) => {
  const [imageError, setImageError] = useState(false)
  
  // Use our lazy loading hook
  const { ref, isVisible, isLoaded, handleImageLoad } = useLazyImage({
    rootMargin,
    threshold,
    disabled: isPriority, // Disable lazy loading for priority images
  })
  
  // Use effect to simulate image loading when visible
  useEffect(() => {
    if (isVisible || isPriority) {
      // Simulate image load event after a short delay
      const timer = setTimeout(() => {
        handleImageLoad();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, isPriority, handleImageLoad]);
  
  // Default blur data URL if not provided and withBlur is true
  const defaultBlurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
  
  // Default quality based on priority
  const imageQuality = quality || (isPriority ? 85 : 75)
  
  // Default sizes if not provided
  const imageSizes = sizes || (fill ? "(max-width: 768px) 100vw, 50vw" : "100vw")
  
  // Transform image URL if needed (e.g., for CDN optimizations)
  const optimizedSrc = typeof src === 'string' ? transformImageUrl(src, {
    quality: imageQuality as number,
    format: 'webp',
  }) : src
  
  // Handle image loading error
  const handleError = () => {
    setImageError(true)
  }
  
  return (
    <div 
      ref={ref} 
      className={`relative ${containerClassName || ""} ${!fill ? "overflow-hidden" : ""}`}
    >
      {(isVisible || isPriority) && (
        <Image
          src={imageError ? "/placeholder.jpg" : optimizedSrc}
          alt={alt}
          className={`
            ${className || ""} 
            ${(isVisible && !isLoaded && withBlur) ? "scale-110 blur-sm" : "scale-100 blur-0"} 
            transition-all duration-300
          `}
          fill={fill}
          priority={isPriority}
          quality={imageQuality}
          sizes={imageSizes}
          loading={isPriority ? "eager" : "lazy"}
          placeholder={withBlur ? "blur" : placeholder || "empty"}
          blurDataURL={withBlur ? (blurDataURL || defaultBlurDataURL) : undefined}
          onError={handleError}
          {...props}
        />
      )}
      
      {/* Show skeleton while loading */}
      {(!isVisible && !isPriority) && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}

export default LazyImage 