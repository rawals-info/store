import { ArrowUpRightMini } from "@medusajs/icons"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
  className?: string
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  className = "",
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className={`flex gap-x-1 items-center group ${className}`}
      href={href}
      onClick={onClick}
      {...props}
    >
      <span className="text-[var(--color-luxury-gold)] group-hover:text-[var(--color-luxury-darkgold)] transition-colors duration-150">{children}</span>
      <ArrowUpRightMini
        className="group-hover:rotate-45 ease-in-out duration-150 text-[var(--color-luxury-gold)] group-hover:text-[var(--color-luxury-darkgold)]"
      />
    </LocalizedClientLink>
  )
}

export default InteractiveLink
