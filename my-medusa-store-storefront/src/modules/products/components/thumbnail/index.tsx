"use client"

import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React, { useState } from "react"

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
  const initialImage = thumbnail || images?.[0]?.url

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
      <ImageOrPlaceholder image={initialImage} size={size} isFeatured={isFeatured} />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  isFeatured,
}: Pick<ThumbnailProps, "size" | "isFeatured"> & { image?: string }) => {
  const [isLoading, setIsLoading] = useState(true)

  // Define appropriate sizes for different screens and component sizes
  const imageSizes = 
    size === "small" ? "180px" :
    size === "medium" ? "290px" :
    size === "large" ? "440px" :
    size === "full" ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" :
    "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"

  return image ? (
    <Image
      src={image}
      alt="Product thumbnail"
      className={`absolute inset-0 object-cover object-center ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      draggable={false}
      quality={isFeatured ? 80 : 65} // Lower quality for non-featured images
      sizes={imageSizes}
      fill
      priority={isFeatured ? true : false}
      loading={isFeatured ? "eager" : "lazy"}
      onLoadingComplete={() => setIsLoading(false)}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
      fetchPriority={isFeatured ? "high" : "auto"}
      style={{
        // Minimize Cumulative Layout Shift
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-luxury-ivory/50">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
