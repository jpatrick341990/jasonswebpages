window.AsterVineCatalog = {
  note: "Edit this one file to add or remove cards across the floral template.",
  shopFilters: [
    { key: "all", label: "All" },
    { key: "daily", label: "Daily" },
    { key: "gift", label: "Gift" },
    { key: "sympathy", label: "Sympathy" },
    { key: "subscription", label: "Subscription" },
    { key: "event", label: "Event Add-ons" }
  ],
  portfolioFilters: [
    { key: "all", label: "All" },
    { key: "wedding", label: "Weddings" },
    { key: "event", label: "Events" },
    { key: "daily", label: "Daily Flowers" },
    { key: "editorial", label: "Editorial" },
    { key: "workshop", label: "Workshops" }
  ],
  collections: [
    {
      active: true,
      badge: "Daily Flowers",
      title: "Everyday bouquets",
      description: "Gift-ready wraps, same-week flowers, sympathy stems, and quick seasonal edits.",
      image: "assets/images/collection-daily.jpg",
      alt: "Everyday bouquets"
    },
    {
      active: true,
      badge: "Wedding Floral",
      title: "Wedding stories",
      description: "Bridal flowers, ceremony florals, reception tables, and planner-friendly galleries.",
      image: "assets/images/collection-weddings.jpg",
      alt: "Wedding florals"
    },
    {
      active: true,
      badge: "Events",
      title: "Private events",
      description: "Dinners, launches, hospitality flowers, and room-wide floral styling that needs custom quoting.",
      image: "assets/images/collection-events.jpg",
      alt: "Event flowers"
    },
    {
      active: true,
      badge: "Memberships",
      title: "Subscriptions",
      description: "Weekly stems, office flowers, and recurring deliveries for homes, studios, and boutique spaces.",
      image: "assets/images/collection-subscription.jpg",
      alt: "Flower subscriptions"
    }
  ],
  products: [
    {
      active: true,
      home: true,
      badge: "Best seller",
      title: "Signature Garden Wrap",
      description: "Soft seasonal flowers in an airy wrapped bouquet for gifting or home styling.",
      price: "$95",
      detail: "Small / medium",
      image: "assets/images/collection-daily.jpg",
      alt: "Signature bouquet",
      categories: ["daily", "gift"]
    },
    {
      active: true,
      home: false,
      badge: "Vase option",
      title: "Studio Vase Arrangement",
      description: "A fuller vase-ready design for birthdays, thank-yous, and hosted dinners.",
      price: "$145",
      detail: "Vase included",
      image: "assets/images/collection-daily.jpg",
      alt: "Studio vase arrangement",
      categories: ["gift", "daily"]
    },
    {
      active: true,
      home: true,
      badge: "Sympathy",
      title: "Quiet Tribute",
      description: "Neutral florals for sympathy orders, home deliveries, and memorial sending.",
      price: "$125",
      detail: "Delivery-ready",
      image: "assets/images/portfolio-editorial.jpg",
      alt: "Sympathy arrangement",
      categories: ["sympathy"]
    },
    {
      active: true,
      home: true,
      badge: "Recurring",
      title: "Weekly Stem Drop",
      description: "Fresh stems delivered on a weekly schedule for homes, lobbies, or offices.",
      price: "$145",
      detail: "Weekly plan",
      image: "assets/images/collection-subscription.jpg",
      alt: "Flower subscription",
      categories: ["subscription"]
    },
    {
      active: true,
      home: false,
      badge: "Monthly",
      title: "Monthly Floral Membership",
      description: "A gentler recurring option with lower frequency and strong gifting potential.",
      price: "$115",
      detail: "Monthly plan",
      image: "assets/images/collection-subscription.jpg",
      alt: "Monthly flower membership",
      categories: ["subscription", "gift"]
    },
    {
      active: true,
      home: true,
      badge: "Event add-on",
      title: "Dinner Table Flowers",
      description: "Compact centerpieces for hosted dinners, rehearsal tables, and boutique events.",
      price: "$225",
      detail: "Starting rate",
      image: "assets/images/collection-events.jpg",
      alt: "Dinner table flowers",
      categories: ["event"]
    },
    {
      active: true,
      home: false,
      badge: "Hospitality",
      title: "Welcome Arrangement",
      description: "An elevated front-desk or entry flower piece for launches, hotels, and receptions.",
      price: "$185",
      detail: "Reception piece",
      image: "assets/images/collection-events.jpg",
      alt: "Welcome arrangement",
      categories: ["event", "gift"]
    },
    {
      active: true,
      home: false,
      badge: "Premium",
      title: "Large Tonal Bouquet",
      description: "For bigger gifting moments when the order needs more fullness and presence.",
      price: "$175",
      detail: "Large bouquet",
      image: "assets/images/collection-weddings.jpg",
      alt: "Premium bouquet",
      categories: ["daily", "gift"]
    }
  ],
  portfolio: [
    {
      active: true,
      badge: "Wedding",
      title: "Ceremony florals",
      description: "Statement aisle flowers, bridal pieces, and altar styling with room-wide softness.",
      image: "assets/images/collection-weddings.jpg",
      alt: "Ceremony florals",
      categories: ["wedding", "editorial"]
    },
    {
      active: true,
      badge: "Event",
      title: "Private dinner florals",
      description: "Intentional tables and room accents for small hosted evenings and launches.",
      image: "assets/images/collection-events.jpg",
      alt: "Private dinner flowers",
      categories: ["event"]
    },
    {
      active: true,
      badge: "Editorial",
      title: "Signature bouquet study",
      description: "Use close-up flower work to make the craft feel elevated, not generic.",
      image: "assets/images/portfolio-editorial.jpg",
      alt: "Editorial bouquet close-up",
      categories: ["daily", "editorial"]
    },
    {
      active: true,
      badge: "Daily Flowers",
      title: "Wrapped bouquet line",
      description: "Everyday flower stories that still feel premium in the gallery.",
      image: "assets/images/collection-daily.jpg",
      alt: "Wrapped bouquet",
      categories: ["daily"]
    },
    {
      active: true,
      badge: "Workshop",
      title: "Studio workshop table",
      description: "Hands-on floral classes, hosted tables, and community-style studio events.",
      image: "assets/images/portfolio-workshop.jpg",
      alt: "Flower workshop",
      categories: ["workshop"]
    },
    {
      active: true,
      badge: "Installation",
      title: "Large-scale floral installation",
      description: "Entry moments and overhead work for venues, launches, and wedding receptions.",
      image: "assets/images/hero-installation.jpg",
      alt: "Large floral installation",
      categories: ["event", "wedding"]
    }
  ],
  servicePackages: [
    {
      active: true,
      badge: "Daily orders",
      title: "Everyday bouquets",
      price: "From $85",
      buttonLabel: "Order flowers",
      buttonLink: "shop.html",
      items: [
        "Wrapped bouquets and vase arrangements",
        "Gift notes and add-ons",
        "Pickup or local delivery",
        "Seasonal recipe flexibility"
      ]
    },
    {
      active: true,
      featured: true,
      badge: "Most versatile",
      title: "Event flowers",
      price: "From $350",
      buttonLabel: "Book consultation",
      buttonLink: "booking.html",
      items: [
        "Private dinners, showers, small launches",
        "Custom floral palette and room notes",
        "Delivery and on-site styling options",
        "Built for repeat hospitality work too"
      ]
    },
    {
      active: true,
      badge: "Higher ticket",
      title: "Wedding florals",
      price: "Custom quote",
      buttonLabel: "Start inquiry",
      buttonLink: "booking.html",
      items: [
        "Bridal flowers and ceremony pieces",
        "Reception flowers and room styling",
        "Venue, planner, and timeline collaboration",
        "Consultation-first booking flow"
      ]
    }
  ],
  serviceExtras: [
    {
      active: true,
      icon: "↺",
      title: "Subscriptions",
      description: "Recurring stems for homes, offices, boutique retail, or hospitality spaces that want flowers on a schedule."
    },
    {
      active: true,
      icon: "✎",
      title: "Workshops",
      description: "Hosted floral classes, private group sessions, or branded workshop experiences for creative spaces."
    },
    {
      active: true,
      icon: "⌂",
      title: "Installations",
      description: "Entry moments, overhead work, launch styling, and room-scale floral pieces for one-off events."
    }
  ],
  homeFaqs: [
    {
      active: true,
      question: "Do you offer same-day flowers?",
      answer: "Yes, for selected bouquets and delivery zones. Use this answer area to explain order cutoffs and same-day availability."
    },
    {
      active: true,
      question: "How do wedding inquiries work?",
      answer: "Clients fill out the consultation form with date, venue, budget, guest count, and inspiration notes. You can then follow up with a proposal or discovery call."
    },
    {
      active: true,
      question: "Can I order subscriptions or office flowers?",
      answer: "Absolutely. Recurring deliveries are one of the strongest add-on offers for florists because they create repeat revenue without a full ecommerce backend."
    },
    {
      active: true,
      question: "What should the buyer replace first?",
      answer: "Logo, contact info, key photos, delivery areas, and the top three offers. Those swaps usually make the whole site feel personalized fastest."
    }
  ],
  serviceFaqs: [
    {
      active: true,
      question: "Do you have order minimums for events?",
      answer: "Use this answer space for custom project minimums, weekday or weekend differences, and installation thresholds."
    },
    {
      active: true,
      question: "Can clients request exact flowers?",
      answer: "Most florists lead with floral mood and seasonality rather than guaranteeing specific stems. Explain that here."
    },
    {
      active: true,
      question: "How far in advance should weddings book?",
      answer: "List your preferred window and what happens if a client reaches out closer to the date."
    },
    {
      active: true,
      question: "Can the site support workshops or classes?",
      answer: "Yes. The services and booking pages are already broad enough to support hosted classes and private floral sessions."
    }
  ],
  testimonials: [
    {
      active: true,
      quote: "The ordering flow felt easy, the flowers looked exactly like the brand, and the whole process felt polished from the first click.",
      cite: "— Everyday bouquet customer"
    },
    {
      active: true,
      quote: "The consultation page did a lot of work before our call. It made the studio feel established and easy to trust for a larger event.",
      cite: "— Wedding client"
    },
    {
      active: true,
      quote: "Beautiful enough to feel luxury, clear enough to make ordering and event planning feel straightforward.",
      cite: "— Private dinner host"
    }
  ]
};
