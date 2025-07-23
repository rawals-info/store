import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import Image from "next/image"
import { clx } from "@medusajs/ui"

type CategorySectionProps = {
  category: HttpTypes.StoreProductCategory
  className?: string
}

const CategorySection = ({ category, className }: CategorySectionProps) => {
  return (
    <div
      className={clx(
        "relative w-full h-96 flex items-center justify-center text-white",
        className
      )}
    >
      {category.metadata?.image ? (
        <Image
          src={category.metadata.image as string}
          alt={category.name}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
      ) : null}
      <div className="absolute inset-0 bg-black opacity-40 z-10" />
      <div className="relative z-20 text-center">
        <h2 className="text-3xl font-bold">{category.name}</h2>
        <p className="text-lg mt-2">{category.description}</p>
        {/* @ts-ignore */}
        <Link href={`/categories/${category.handle}`} legacyBehavior>
          <a className="mt-4 inline-block bg-white text-black py-2 px-4 rounded">
            View products
          </a>
        </Link>
      </div>
    </div>
  )
}

export default CategorySection 