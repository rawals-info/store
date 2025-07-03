import { Container } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import clsx from "clsx"

type CategoryHeroProps = {
  category: HttpTypes.StoreProductCategory
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ category }) => {
  const hasImage = Boolean(category.metadata?.hero_image)

  return (
    <div
      className={clsx(
        "relative h-96 w-full border-b border-ui-border-base overflow-hidden",
        {
          "bg-gradient-to-br from-luxury-ivory via-stone-100 to-luxury-gold/30": !hasImage,
        }
      )}
    >
      {/* Background */}
      {hasImage && (
        <Image
          src={category.metadata!.hero_image as string}
          alt={category.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      )}

      {/* Overlay */}
      <div
        className={clsx(
          "absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10",
          {
            "bg-black/40 text-white": hasImage,
            "text-luxury-charcoal": !hasImage,
          }
        )}
      >
        <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-wide drop-shadow-sm">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-base md:text-lg">
            {category.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default CategoryHero 