import { Metadata } from "next"
import NotFoundView from "@modules/common/components/not-found-view"
import AnimatedHeader from "@modules/layout/components/animated-header"
import Footer from "@modules/layout/templates/footer"

export const metadata: Metadata = {
  title: "404 - Page Not Found | Taj Petha",
  description: "The page you're looking for doesn't exist. Explore our authentic Agra petha and namkeen collection.",
}

export default function NotFound() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#FAF8F5]">
      <AnimatedHeader />
      <main className="flex-1">
        <NotFoundView />
      </main>
      <Footer />
    </div>
  )
}
