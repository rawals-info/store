import { Metadata } from "next"
import NotFoundView from "@modules/common/components/not-found-view"

export const metadata: Metadata = {
  title: "404 - Page Not Found | Taj Petha",
  description: "The page you're looking for doesn't exist. Explore our authentic Agra petha and namkeen collection.",
}

export default function NotFound() {
  return <NotFoundView />
}
