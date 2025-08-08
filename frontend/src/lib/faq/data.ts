export type QA = { question: string; answer: string }

// Centralized FAQs for product pages. Keys should match category or collection handles (lowercase).
// These answers are written in plain text for maximum SEO friendliness and FAQ rich results.
export const CATEGORY_FAQS: Record<string, QA[]> = {
  petha: [
    {
      question: "How should I serve petha?",
      answer:
        "Enjoy petha as a dessert after meals, a chilled snack, or as a sweet accompaniment to evening tea. Kesar and Angoori variants pair well with warm milk.",
    },
    {
      question: "What is the shelf life and how do I store it?",
      answer:
        "Unopened petha stays fresh for 10–12 days in a cool, dry place. After opening, refrigerate in an airtight container and consume within 5–7 days for best taste.",
    },
    {
      question: "What packaging do you use?",
      answer:
        "Eco‑friendly, food‑grade plastic with tamper‑evident sealing. The packaging is designed to prevent moisture and preserve freshness during transit.",
    },
    {
      question: "Do you offer fast shipping?",
      answer:
        "Yes. Orders placed before noon are typically dispatched the same day. Expedited and express delivery options are available at checkout across India.",
    },
  ],

  namkeen: [
    {
      question: "What is the best way to enjoy namkeen?",
      answer:
        "Namkeen is perfect with evening chai, as a light snack, or alongside sweets like petha to balance flavors at small gatherings and parties.",
    },
    {
      question: "How spicy is it?",
      answer:
        "Most variants are medium‑spiced for everyday snacking. Mild and extra‑spicy options are clearly labeled on the pack and product page.",
    },
    {
      question: "How do you keep namkeen crisp during shipping?",
      answer:
        "We use eco‑friendly moisture‑barrier pouches and nitrogen flushing where applicable. Keep sealed and store in a cool, dry place to retain crunch.",
    },
    {
      question: "What are the shipping timelines?",
      answer:
        "Same‑day dispatch on most orders. Expedited shipping options are available; exact timelines are shown at checkout based on your pincode.",
    },
  ],

  dalmoth: [
    {
      question: "How long does Dalmoth stay fresh?",
      answer:
        "Dalmoth stays crisp for 30–45 days when stored in an airtight container away from heat, sunlight, and moisture.",
    },
    {
      question: "Is Dalmoth spicy?",
      answer:
        "It has a balanced heat profile with a savory spice blend. If you prefer milder options, look for the mild label on select variants.",
    },
    {
      question: "What packaging is used?",
      answer:
        "Eco‑friendly, nitrogen‑flushed packs help maintain crunch and flavor during storage and delivery.",
    },
    {
      question: "Do you offer express delivery?",
      answer:
        "Yes. We provide same‑day dispatch on business days and offer expedited shipping during checkout.",
    },
  ],

  combo1: [
    {
      question: "What’s included in the combo?",
      answer:
        "Carefully curated petha and namkeen combinations for gifting and personal use. Exact items are listed on the product page under ‘In the Box’.",
    },
    {
      question: "Is it suitable for gifting?",
      answer:
        "Absolutely. Combos are packed securely with protective cushioning and can include a personalized message on request.",
    },
    {
      question: "How soon can a gift combo be delivered?",
      answer:
        "Same‑day dispatch for orders placed before noon, with expedited shipping options at checkout for faster delivery.",
    },
    {
      question: "How should I store the contents?",
      answer:
        "Keep petha refrigerated after opening and namkeen sealed in a cool, dry place. Refer to each pack for detailed instructions.",
    },
  ],

  // Fallback FAQs used when no specific category/collection match is found
  default: [
    {
      question: "Do you offer same‑day dispatch?",
      answer:
        "Yes, orders placed before 12 PM IST are usually dispatched the same business day, subject to availability.",
    },
    {
      question: "Is expedited shipping available?",
      answer:
        "We provide multiple express options at checkout. Estimated delivery time is shown after you enter your pincode.",
    },
    {
      question: "What packaging do you use?",
      answer:
        "Eco‑friendly, food‑safe packaging designed to maintain freshness and prevent damage during transit.",
    },
    {
      question: "What is your return or replacement policy?",
      answer:
        "In the rare event of transit damage or quality issues, we offer quick replacements. Please see the Returns page for full details.",
    },
  ],
} 