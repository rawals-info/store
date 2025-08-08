import { Shield, Truck, CreditCard, Award, Clock, RefreshCw } from "lucide-react"

interface TrustBadge {
  icon: React.ReactNode
  title: string
  description: string
}

const trustBadges: TrustBadge[] = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "100% Freshness Guaranteed",
    description: "Made fresh daily with traditional recipes"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Hygienically Packed",
    description: "Sealed in food-grade containers for safety"
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Secure Payments",
    description: "Safe & encrypted payment processing"
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Same Day Dispatch",
    description: "Orders before 2 PM shipped same day"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Quick Delivery",
    description: "1-4 days delivery across India"
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Easy Returns",
    description: "7-day return policy for peace of mind"
  }
]

interface TrustBadgesProps {
  variant?: 'default' | 'compact' | 'minimal'
  showAll?: boolean
  className?: string
}

export default function TrustBadges({ 
  variant = 'default', 
  showAll = false,
  className = "" 
}: TrustBadgesProps) {
  const displayBadges = showAll ? trustBadges : trustBadges.slice(0, 3)

  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
        {displayBadges.map((badge, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 text-sm text-luxury-charcoal/80"
          >
            <div className="text-luxury-gold">
              {badge.icon}
            </div>
            <span className="font-medium">{badge.title}</span>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
        {displayBadges.map((badge, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 p-3 bg-luxury-cream/50 rounded-base border border-luxury-gold/10 hover:border-luxury-gold/20 transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-luxury-gold/10 rounded-base flex items-center justify-center text-luxury-gold">
              {badge.icon}
            </div>
            <div>
              <h4 className="font-medium text-luxury-charcoal text-sm">{badge.title}</h4>
              <p className="text-xs text-luxury-charcoal/60">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {displayBadges.map((badge, index) => (
        <div 
          key={index}
          className="group bg-white rounded-xl p-6 border border-luxury-gold/10 hover:border-luxury-gold/20 hover:shadow-lg hover:shadow-luxury-gold/5 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-luxury-gold/10 to-luxury-gold/5 rounded-xl flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform duration-200">
              {badge.icon}
            </div>
            <div>
              <h4 className="font-semibold text-luxury-charcoal mb-1">{badge.title}</h4>
              <p className="text-sm text-luxury-charcoal/70">{badge.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Compact horizontal version for product pages
export function ProductTrustBadges({ className = "" }: { className?: string }) {
  const compactBadges = [
    {
      icon: <Award className="w-5 h-5" />,
      title: "100% Fresh"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Hygienic Packing"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Secure Payments"
    }
  ]

  return (
    <div className={`flex items-center justify-center gap-6 py-4 px-6 bg-luxury-cream/30 rounded-base border border-luxury-gold/10 ${className}`}>
      {compactBadges.map((badge, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="text-luxury-gold">
            {badge.icon}
          </div>
          <span className="text-sm font-medium text-luxury-charcoal">
            {badge.title}
          </span>
        </div>
      ))}
    </div>
  )
} 