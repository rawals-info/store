import { Container } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type CategoryHeroProps = {
  category: HttpTypes.StoreProductCategory
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ category }) => {
  return (
    <div className="relative h-96 w-full border-b border-ui-border-base">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-4xl font-bold">{category.name}</h1>
        <p className="mt-2 text-lg">{category.description}</p>
      </div>
      {category.metadata?.hero_image && (
        <Image
          src={category.metadata.hero_image as string}
          alt={category.name}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
      )}
    </div>
  )
}

export default CategoryHero 