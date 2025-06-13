"use client"

import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React, { useState, useEffect } from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  // Properly handle image URLs from Medusa backend
  // Medusa can provide URLs in different formats depending on the storage provider
  const getImageUrl = () => {
    // First try the thumbnail directly
    if (thumbnail) {
      return thumbnail;
    }
    
    // If no thumbnail, try to get the first image from images array
    if (images && images.length > 0) {
      // Handle different image object structures
      const firstImage = images[0];
      
      // If the image has a URL property
      if (firstImage.url) {
        return firstImage.url;
      }
      
      // If the image itself is a string URL
      if (typeof firstImage === 'string') {
        return firstImage;
      }
      
      // If the image has a file property with a URL
      if (firstImage.file?.url) {
        return firstImage.file.url;
      }
    }
    
    // Return null if no valid image found
    return null;
  }

  const imageUrl = getImageUrl();
  
  console.log("Thumbnail: Image data", { 
    thumbnail, 
    hasImages: !!images && images.length > 0,
    imageUrl
  });

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[9/16]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={imageUrl} size={size} isFeatured={isFeatured} />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  isFeatured,
}: Pick<ThumbnailProps, "size" | "isFeatured"> & { image?: string | null }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  
  // Use useEffect to set image as loaded after a short delay
  // This is a client-side alternative to onLoad
  useEffect(() => {
    if (image) {
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [image]);

  // Define appropriate sizes for different screens and component sizes
  const imageSizes = 
    size === "small" ? "180px" :
    size === "medium" ? "290px" :
    size === "large" ? "440px" :
    size === "full" ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" :
    "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"

  return image && !hasError ? (
    <Image
      src={image}
      alt="Product image"
      className={`absolute inset-0 object-cover object-center ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      draggable={false}
      quality={isFeatured ? 80 : 65} // Lower quality for non-featured images
      sizes={imageSizes}
      fill
      priority={isFeatured ? true : false}
      loading={isFeatured ? "eager" : "lazy"}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
      fetchPriority={isFeatured ? "high" : "auto"}
      style={{
        // Minimize Cumulative Layout Shift
        objectFit: "cover",
        objectPosition: "center",
      }}
      onError={() => {
        console.error("Image failed to load:", image)
        setHasError(true)
      }}
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-luxury-ivory/50">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
