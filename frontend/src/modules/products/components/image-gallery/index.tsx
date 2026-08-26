"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type ImageGalleryProps = {
  images: { id: string; url: string }[]
}

// ✅ Optimized for performance with lazy loading and preloading strategy
const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [imageLoading, setImageLoading] = useState(true)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]))
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    
    setZoomPosition({ x, y })
  }, [isZoomed])
  
  const handleZoomToggle = useCallback(() => {
    setIsZoomed(!isZoomed)
  }, [isZoomed])
  
  const handleImageChange = useCallback((index: number) => {
    if (index === selectedImage) return
    setImageLoading(true)
    setSelectedImage(index)
    setLoadedImages(prev => new Set(prev).add(index))
  }, [selectedImage])
  
  // Reset loading state when image loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoading(false)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [selectedImage])
  
  // Preload adjacent images for smoother navigation
  useEffect(() => {
    if (typeof window === 'undefined' || images.length <= 1) return
    
    const preloadIndexes = [
      selectedImage + 1 < images.length ? selectedImage + 1 : 0,
      selectedImage - 1 >= 0 ? selectedImage - 1 : images.length - 1
    ]
    
    preloadIndexes.forEach(index => {
      if (!loadedImages.has(index)) {
        const img = new window.Image()
        img.src = images[index].url
      }
    })
  }, [selectedImage, images, loadedImages])

  if (!images.length) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-md aspect-square">
        <p className="text-ui-fg-subtle">No images available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div 
        className="relative w-full aspect-square rounded-2xl border border-amber-100/90 bg-amber-50/20 overflow-hidden cursor-zoom-in shadow-xs"
        onClick={handleZoomToggle}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full relative"
          >
            <Image
              src={images[selectedImage].url}
              alt={`Product image ${selectedImage + 1}`}
              fill
              priority={selectedImage === 0}
              loading={selectedImage === 0 ? "eager" : "lazy"}
              sizes="(max-width: 576px) 100vw, (max-width: 768px) 80vw, (max-width: 992px) 60vw, 50vw"
              className={`object-cover ${isZoomed ? 'scale-150' : ''} transition-transform duration-300 ${imageLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'}`}
              style={
                isZoomed 
                  ? { 
                      transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%` 
                    } 
                  : undefined
              }
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              onLoad={() => setImageLoading(false)}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Zoom indicator */}
        {!isZoomed && (
          <div className="absolute bottom-4 right-4 bg-white/80 rounded-full p-2 shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 7V13M7 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2.5">
        {images.map((image, index) => (
          <motion.button
            key={image.id}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              selectedImage === index 
                ? "border-petha-amber ring-2 ring-amber-200/60 shadow-xs" 
                : "border-slate-100 hover:border-amber-300"
            }`}
            onClick={() => handleImageChange(index)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            aria-label={`View product image ${index + 1}`}
          >
            <Image
              src={image.url}
              alt={`Product thumbnail ${index + 1}`}
              fill
              sizes="(max-width: 768px) 25vw, 10vw"
              className="object-cover"
              loading={index < 4 ? "eager" : "lazy"}
              quality={50}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
            />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
