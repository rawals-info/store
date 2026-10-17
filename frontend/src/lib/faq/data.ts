export type QA = { question: string; answer: string }

// Centralized FAQs for product pages & Google FAQ Rich Snippets.
// Written in clear, high-converting plain English to resolve customer hesitations.
export const CATEGORY_FAQS: Record<string, QA[]> = {
  petha: [
    {
      question: "How fresh will the Agra Petha be when it arrives?",
      answer:
        "Every batch is prepared fresh daily in our Agra kitchen. We use airtight, food-grade vacuum sealing to lock in peak flavor, guaranteeing your petha arrives juicy and fresh with 30-day room-temperature shelf life.",
    },
    {
      question: "Is this original authentic Agra Petha?",
      answer:
        "Yes! Our master halwais handcraft authentic Agra Petha using pure winter melon (ash gourd), sulfur-free cane sugar, and real Kashmiri saffron. Prepared with zero artificial dyes, chemical bleaching, or synthetic preservatives.",
    },
    {
      question: "Is your Petha 100% pure vegetarian and FSSAI certified?",
      answer:
        "Yes, 100% pure vegetarian and certified by the Food Safety and Standards Authority of India (FSSAI Reg. No. 22725113001738). Prepared in dedicated hygienic sweet kitchens with pure natural ingredients.",
    },
    {
      question: "Do you have allergen warnings for nuts or dairy?",
      answer:
        "Our kitchens handle tree nuts (cashews, pistachios, almonds), dairy (khoya/ghee in select items), and seeds. While we follow strict hygiene, products may contain trace allergens. Customers with severe nut or dairy allergies should check descriptions before consuming.",
    },
    {
      question: "What if my sweet box gets damaged in transit?",
      answer:
        "Every consignment is transit-insured by our courier partners. If your parcel arrives damaged, please share a continuous pure unboxing video and photos within 24 hours of delivery. We will lodge an insurance claim with the courier partner and arrange resolution based on the verified survey report.",
    },
  ],

  namkeen: [
    {
      question: "How do you keep Agra Namkeen crispy during delivery?",
      answer:
        "We pack all namkeen in multi-layer moisture-barrier pouches with nitrogen-sealed fresh locking to ensure it arrives super crispy and fresh.",
    },
    {
      question: "What is the shelf life of Namkeen & Dalmoth?",
      answer:
        "Our namkeen and Dalmoth stay fresh and crunchy for 45–60 days when stored in an airtight container away from heat and direct sunlight.",
    },
    {
      question: "Is the namkeen mild or spicy?",
      answer:
        "Our Dalmoth and namkeen are balanced with traditional savory Agra spices. They are perfectly flavorful for daily evening tea and family snacking.",
    },
    {
      question: "Do you offer free delivery across India?",
      answer:
        "Yes, all orders above ₹500 qualify for Free Express Delivery across India with 24-hour kitchen dispatch.",
    },
  ],

  dalmoth: [
    {
      question: "What makes authentic Agra Dalmoth special?",
      answer:
        "Authentic Agra Dalmoth is made with crispy fried whole brown lentils (moth beans), spicy gram flour sev, premium fried cashews, and melon seeds, seasoned with authentic royal spice blend.",
    },
    {
      question: "How long does Dalmoth stay fresh?",
      answer:
        "It stays perfectly crunchy for 45–60 days in an airtight container. We pack each box fresh on the day of dispatch.",
    },
    {
      question: "How fast is shipping to my city?",
      answer:
        "Orders are dispatched within 24 hours using express air delivery, reaching most cities across India in 24 to 48 hours.",
    },
    {
      question: "What if my Dalmoth box gets damaged during transit?",
      answer:
        "All shipments are transit-insured. If your package arrives damaged, share an unboxing video and photos within 24 hours so our team can lodge a claim with the courier partner for investigation and resolution.",
    },
  ],

  default: [
    {
      question: "How fresh will my sweets and snacks be?",
      answer:
        "All products are freshly prepared daily in Agra, vacuum-sealed for 30-day freshness, and dispatched via express air delivery across India.",
    },
    {
      question: "Are your products 100% pure vegetarian?",
      answer:
        "Yes, 100% pure vegetarian, FSSAI certified (Reg. No. 22725113001738), made with pure natural ingredients and zero artificial chemicals.",
    },
    {
      question: "What is your order cancellation window?",
      answer:
        "Orders can only be cancelled within 30 minutes of placement by contacting our WhatsApp desk. After 30 minutes, orders are routed to fresh batch preparation and packing, after which no cancellations or refunds are possible.",
    },
    {
      question: "What is your return and transit damage policy?",
      answer:
        "Because our sweets are freshly prepared and perishable, we do not accept returns or replacements once delivered. All packages are insured against transit damage; if your box arrives damaged, share a continuous unboxing video within 24 hours so our team can lodge an insurance claim with the courier.",
    },
  ],
}