"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

/**
 * A wrapper component for Next.js Image that provides fallback capability
 * if the primary image source fails to load
 */
const FallbackImage = ({ 
  src, 
  fallbackSrc = "/placeholder-image.jpg", 
  alt,
  ...props 
}: FallbackImageProps) => {
  const [imgSrc, setImgSrc] = useState(src)
  
  const handleError = () => {
    setImgSrc(fallbackSrc)
  }

  return (
    <Image 
      {...props} 
      src={imgSrc} 
      alt={alt}
      onError={handleError}
    />
  )
}

export default FallbackImage 