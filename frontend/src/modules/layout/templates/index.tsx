import React from "react"

import Footer from "@modules/layout/templates/footer"
import AnimatedHeader from "@modules/layout/components/animated-header"
import CustomCursor from "@components/cursor"
import WhatsAppFloat from "@components/whatsapp-float"

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div>
      {/* Custom magnetic cursor — desktop only, touch-safe */}
      <CustomCursor />

      <AnimatedHeader />
      <main className="relative">{children}</main>
      <Footer />

      {/* Floating WhatsApp CTA */}
      <WhatsAppFloat />
    </div>
  )
}

export default Layout
