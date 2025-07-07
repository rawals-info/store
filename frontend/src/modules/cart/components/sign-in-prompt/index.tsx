import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between px-6">
      <div>
        <h2 className="font-display text-xl text-luxury-charcoal">
          Already have an account?
        </h2>
        <p className="text-luxury-charcoal/70 text-sm mt-1">
          Sign in for a better experience.
        </p>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button 
            className="border border-luxury-gold/50 bg-transparent hover:bg-luxury-cream text-luxury-gold px-6 py-2 text-sm font-medium tracking-wide transition-colors duration-200" 
            data-testid="sign-in-button"
          >
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
