import { Metadata } from "next"
import Link from "next/link"
import { ShoppingCart, Truck, Shield, Star, Clock, Gift, CheckCircle2 } from "lucide-react"

export const dynamic = "force-static"

export async function generateMetadata({ params }: { params: { countryCode: string } }): Promise<Metadata> {
    const { countryCode } = await params
    const canonical = `https://tajpetha.in/${countryCode}/buy-petha-online`

    return {
        title: "Buy Petha Online | Authentic Agra Petha Delivered Fresh | Taj Petha",
        description: "Buy authentic Agra petha online at Taj Petha. Fresh, hand-made petha with same-day dispatch. Kesar, dry, paan, chocolate varieties. Free delivery ₹500+. Order now!",
        keywords: [
            "buy petha online",
            "buy agra petha",
            "order petha online",
            "agra petha online",
            "authentic petha buy",
            "fresh petha order",
            "petha home delivery",
            "buy kesar petha online",
            "buy dry petha online",
            "petha online shopping",
            "agra sweets online order",
            "petha gift box buy",
            "taj petha buy online",
            "best petha online India"
        ],
        openGraph: {
            title: "Buy Petha Online | Fresh Agra Petha Delivered | Taj Petha",
            description: "Order authentic Agra petha online. Same-day dispatch, hygienic packaging, free delivery on orders above ₹500.",
            url: canonical,
            type: "website",
            images: [{ url: "/hero_image.webp", width: 1200, height: 630, alt: "Buy Authentic Agra Petha Online" }]
        },
        twitter: {
            card: "summary_large_image",
            title: "Buy Petha Online | Authentic Agra Petha | Taj Petha",
            description: "Order fresh Agra petha online with same-day dispatch. 50,000+ happy customers!",
            images: ["/hero_image.webp"]
        },
        alternates: { canonical },
        robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
    }
}

// FAQ Schema for rich snippets
const buyPethaFAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How can I buy authentic Agra petha online?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can buy authentic Agra petha online at Taj Petha (tajpetha.in). Simply browse our collection, add items to cart, and checkout. We offer same-day dispatch for orders before 2 PM with delivery across India in 2-5 days."
            }
        },
        {
            "@type": "Question",
            "name": "What types of petha can I buy online?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "At Taj Petha, you can buy Kesar Petha (saffron), Dry Petha (classic), Paan Petha (betel leaf), Chocolate Petha, and Angoori Petha online. All varieties are made fresh with traditional recipes."
            }
        },
        {
            "@type": "Question",
            "name": "Is online petha delivery safe and fresh?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! We use vacuum-sealed, food-grade packaging to ensure freshness. Orders are dispatched same-day and delivered within 2-5 days depending on location. Dry petha stays fresh for 45-60 days."
            }
        },
        {
            "@type": "Question",
            "name": "What is the price of petha online?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Petha prices range from ₹180-₹500+ depending on variety and weight. Dry Petha starts at ₹180/500g, Kesar Petha at ₹280/500g. Free delivery on orders above ₹500."
            }
        },
        {
            "@type": "Question",
            "name": "Do you deliver petha across India?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we deliver petha to all major cities in India including Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune, and more. Delivery takes 2-5 business days."
            }
        }
    ]
}

// Product List Schema
const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Buy Petha Online - Taj Petha Collection",
    "description": "Authentic Agra petha varieties available to buy online with same-day dispatch",
    "numberOfItems": 6,
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "item": {
                "@type": "Product",
                "name": "Dry Petha",
                "description": "Classic Agra dry petha - firm, sweet, 45-60 days shelf life",
                "url": "https://tajpetha.in/in/products/dry-petha"
            }
        },
        {
            "@type": "ListItem",
            "position": 2,
            "item": {
                "@type": "Product",
                "name": "Kesar Petha",
                "description": "Premium saffron-infused petha for gifting and festivals",
                "url": "https://tajpetha.in/in/products/kesar-petha"
            }
        },
        {
            "@type": "ListItem",
            "position": 3,
            "item": {
                "@type": "Product",
                "name": "Chocolate Petha",
                "description": "Modern fusion petha with chocolate coating - kid favorite",
                "url": "https://tajpetha.in/in/products/chocolate-petha"
            }
        }
    ]
}

export default async function BuyPethaOnlinePage({ params }: { params: { countryCode: string } }) {
    const { countryCode } = await params

    const pethaVarieties = [
        { name: "Dry Petha", handle: "dry-petha", price: "₹180", description: "Classic firm texture, longest shelf life", bestseller: true },
        { name: "Kesar Petha", handle: "kesar-petha", price: "₹280", description: "Premium saffron-infused, perfect for gifting", premium: true },
        { name: "Paan Petha", handle: "paan-petha", price: "₹220", description: "Refreshing betel leaf flavor, unique taste" },
        { name: "Chocolate Petha", handle: "chocolate-petha", price: "₹250", description: "Modern twist, kids' favorite" },
        { name: "Angoori Petha", handle: "angoori-petha", price: "₹200", description: "Bite-sized, juicy, extra sweet" },
    ]

    const trustSignals = [
        { icon: Star, title: "50,000+ Orders", desc: "Trusted by families across India" },
        { icon: Truck, title: "Same-Day Dispatch", desc: "Orders before 2 PM shipped same day" },
        { icon: Shield, title: "Hygienic Packing", desc: "Food-grade vacuum-sealed packaging" },
        { icon: Clock, title: "2-5 Day Delivery", desc: "Fast delivery to all major cities" },
    ]

    return (
        <>
            {/* Schema Markup */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buyPethaFAQSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }} />

            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-[#1A1A1A] text-white py-16 md:py-24">
                    <div className="max-w-6xl mx-auto px-4 text-center">
                        <p className="text-[#C9A962] text-sm font-medium tracking-wider mb-4">INDIA'S #1 TRUSTED PETHA STORE</p>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                            Buy Authentic Agra Petha Online
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                            Fresh, hand-crafted petha made with traditional recipes. Same-day dispatch, hygienic packaging, delivered fresh to your doorstep.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={`/${countryCode}/products`}
                                className="inline-flex items-center gap-2 bg-[#C9A962] hover:bg-[#B8983D] text-black font-semibold px-8 py-4 rounded-lg transition-all"
                            >
                                <ShoppingCart size={20} />
                                Shop All Petha
                            </Link>
                            <Link
                                href={`/${countryCode}/products/dry-petha`}
                                className="inline-flex items-center gap-2 border-2 border-[#C9A962] text-[#C9A962] hover:bg-[#C9A962] hover:text-black font-semibold px-8 py-4 rounded-lg transition-all"
                            >
                                Buy Bestseller
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Trust Signals */}
                <section className="py-12 bg-gray-50 border-b">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {trustSignals.map((signal, i) => (
                                <div key={i} className="text-center">
                                    <signal.icon className="w-8 h-8 mx-auto mb-3 text-[#C9A962]" />
                                    <h3 className="font-semibold text-[#1A1A1A]">{signal.title}</h3>
                                    <p className="text-sm text-gray-600">{signal.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A1A1A] mb-4">
                                Choose Your Petha
                            </h2>
                            <p className="text-gray-600 max-w-xl mx-auto">
                                All varieties made fresh in Agra with traditional recipes. Click to buy online with free delivery on orders above ₹500.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pethaVarieties.map((petha) => (
                                <Link
                                    key={petha.handle}
                                    href={`/${countryCode}/products/${petha.handle}`}
                                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-[#C9A962] hover:shadow-lg transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#1A1A1A] group-hover:text-[#C9A962] transition-colors">
                                                {petha.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{petha.description}</p>
                                        </div>
                                        <span className="text-[#C9A962] font-bold">{petha.price}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {petha.bestseller && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Bestseller</span>
                                            )}
                                            {petha.premium && (
                                                <span className="text-xs bg-[#C9A962]/20 text-[#C9A962] px-2 py-1 rounded">Premium</span>
                                            )}
                                        </div>
                                        <span className="text-sm text-[#C9A962] font-medium group-hover:underline">Buy Now →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link
                                href={`/${countryCode}/products`}
                                className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-semibold px-8 py-4 rounded-lg transition-all"
                            >
                                View All Products
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Why Buy From Us */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A1A1A] text-center mb-12">
                            Why Buy Petha from Taj Petha?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                { title: "Made Fresh in Agra", desc: "Every petha is hand-crafted in our Agra facility using traditional recipes passed down through generations." },
                                { title: "Same-Day Dispatch", desc: "Orders placed before 2 PM IST are dispatched the same day for fastest possible delivery." },
                                { title: "Hygienic Packaging", desc: "Vacuum-sealed, food-grade containers keep your petha fresh during transit and storage." },
                                { title: "Pan-India Delivery", desc: "We deliver to all major cities including Delhi, Mumbai, Bangalore, Chennai, Kolkata, and more." },
                                { title: "Quality Guarantee", desc: "If you receive damaged products, contact us within 48 hours for a resolution." },
                                { title: "Bulk & Corporate Orders", desc: "Special pricing for bulk orders, weddings, and corporate gifting. Contact us for custom quotes." },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-[#C9A962] flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-[#1A1A1A] mb-1">{item.title}</h3>
                                        <p className="text-gray-600 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4">
                        <h2 className="text-3xl font-serif font-bold text-[#1A1A1A] text-center mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            {[
                                { q: "How can I buy authentic Agra petha online?", a: "Simply browse our collection at tajpetha.in, add items to your cart, and checkout. We accept all major payment methods including UPI, cards, and net banking." },
                                { q: "What types of petha can I buy online?", a: "We offer Kesar Petha (saffron), Dry Petha (classic), Paan Petha (betel leaf), Chocolate Petha, and Angoori Petha. All made fresh with traditional recipes." },
                                { q: "How long does petha delivery take?", a: "Orders are dispatched same-day (before 2 PM) and typically arrive in 2-5 business days depending on your location." },
                                { q: "Is there free delivery?", a: "Yes! Free delivery on all orders above ₹500. Minimal charges apply for orders below ₹500." },
                                { q: "How long does petha stay fresh?", a: "Dry Petha: 45-60 days. Kesar/Juicy Petha: 20-30 days refrigerated. Store in airtight containers." },
                            ].map((faq, i) => (
                                <div key={i} className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="font-semibold text-[#1A1A1A] mb-2">{faq.q}</h3>
                                    <p className="text-gray-600">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-16 bg-[#1A1A1A] text-white">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <Gift className="w-12 h-12 mx-auto mb-6 text-[#C9A962]" />
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                            Ready to Buy Fresh Agra Petha?
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                            Join 50,000+ happy customers who trust Taj Petha for authentic Agra sweets. Order now and taste the tradition!
                        </p>
                        <Link
                            href={`/${countryCode}/products`}
                            className="inline-flex items-center gap-2 bg-[#C9A962] hover:bg-[#B8983D] text-black font-semibold px-10 py-4 rounded-lg text-lg transition-all"
                        >
                            <ShoppingCart size={22} />
                            Buy Petha Online Now
                        </Link>
                    </div>
                </section>
            </div>
        </>
    )
}
