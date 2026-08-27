export type QA = { question: string; answer: string }

// Centralized FAQs for product pages & Google FAQ Rich Snippets.
// Written in clear, high-converting plain English to resolve customer hesitations.
export const CATEGORY_FAQS: Record<string, QA[]> = {
  petha: [
    {
      question: "How fresh will the Agra Petha be when it arrives?",
      answer:
        "Every batch is prepared fresh daily in our Agra kitchen. We use airtight, food-grade vacuum sealing with moisture absorbers to guarantee your petha arrives soft, juicy, and with 30-day fresh taste.",
    },
    {
      question: "Is this original authentic Agra Petha?",
      answer:
        "Yes! Our master halwais handcraft authentic Agra Petha using pure winter melon (ash gourd), sulfur-free cane sugar, and real Kashmiri saffron. No artificial syrups or preservatives.",
    },
    {
      question: "Is your Petha 100% pure vegetarian?",
      answer:
        "Yes, 100% pure vegetarian and FSSAI food-safety certified. Prepared in a dedicated hygienic sweet kitchen with pure natural ingredients.",
    },
    {
      question: "How long does delivery take and is shipping free?",
      answer:
        "We dispatch orders daily via express air cargo. Deliveries to Delhi NCR take 24 hours; other cities take 24–48 hours. All orders above ₹500 get Free Express Shipping across India.",
    },
    {
      question: "What if my sweet box gets damaged in transit?",
      answer:
        "We provide a 100% Damage-Proof Replacement Guarantee. If your box is damaged by the courier, we will immediately send you a free fresh replacement or a full refund — zero hassle.",
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
        "Authentic Agra Dalmoth is made with crispy fried whole brown lentils (moth beans), spicy gram flour sev, and premium fried cashews, seasoned with authentic royal spice blend.",
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
      question: "What is your damage replacement guarantee?",
      answer:
        "If your package arrives damaged or unsealed, contact our support team and we will send a free replacement box immediately.",
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
        "Yes, 100% pure vegetarian, FSSAI certified, made with pure natural ingredients and zero artificial chemicals.",
    },
    {
      question: "Do you offer free delivery?",
      answer:
        "Yes! Free express shipping is automatically applied to all orders above ₹500 at checkout.",
    },
    {
      question: "What is your return and replacement policy?",
      answer:
        "We have a 100% fresh guarantee. If your order arrives damaged or unsatisfactory, we offer immediate free replacements or full refunds.",
    },
  ],
}