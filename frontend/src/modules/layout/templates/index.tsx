import React from "react"

import Footer from "@modules/layout/templates/footer"
import AnimatedHeader from "@modules/layout/components/animated-header"

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div>
      <AnimatedHeader />
      <main className="relative">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
