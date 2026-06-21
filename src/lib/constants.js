export const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", rate: 1 },
  EUR: { symbol: "€", name: "Euro", rate: 0.92 },
  GBP: { symbol: "£", name: "British Pound", rate: 0.79 },
  CAD: { symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  AUD: { symbol: "A$", name: "Australian Dollar", rate: 1.53 },
  NGN: { symbol: "₦", name: "Nigerian Naira", rate: 1550 },
  GEL: { symbol: "₾", name: "Georgian Lari", rate: 2.72 },
};

export const TRAVEL_STYLES = [
  {
    id: "backpacker",
    label: "Backpacker",
    icon: (
      <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 8a5 5 0 0 1 10 0v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8z" />
        <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" />
        <rect x="9.5" y="12" width="5" height="5" rx="1" />
      </svg>
    ),
    desc: "Hostels, street food, buses",
    dailyRange: "$30–60/day",
  },
  {
    id: "comfort",
    label: "Comfort",
    icon: (
      <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 17v-3a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v3" />
        <path d="M2 14h20M2 17v2M22 17v2" />
        <path d="M6 11V9.5A1.5 1.5 0 0 1 7.5 8h3A1.5 1.5 0 0 1 12 9.5V11" />
      </svg>
    ),
    desc: "3-star hotels, restaurants, mixed transport",
    dailyRange: "$80–150/day",
  },
  {
    id: "luxury",
    label: "Luxury",
    icon: (
      <svg className="w-9 h-9 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12l3 6-9 12L3 9z" />
        <path d="M3 9h18M9 3 6 9l6 12M15 3l3 6-6 12" />
      </svg>
    ),
    desc: "4-5 star hotels, fine dining, private transfers",
    dailyRange: "$200–500+/day",
  },
];

export const VIBES = [
  {
    id: "beach",
    label: "Beach & Relax",
    icon: (
      <svg className="w-8 h-8 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3" />
        <path d="M12 2.5V4M16.2 5.8l1-1M19.5 10H21M4.5 10H3M6.8 5.8l-1-1" />
        <path d="M3 15c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
        <path d="M3 19c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />
      </svg>
    ),
  },
  {
    id: "culture",
    label: "Culture & History",
    icon: (
      <svg className="w-8 h-8 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-5 9 5" />
        <path d="M4 9h16" />
        <path d="M6 9v8M10 9v8M14 9v8M18 9v8" />
        <path d="M4 20h16M3 17h18" />
      </svg>
    ),
  },
  {
    id: "adventure",
    label: "Adventure",
    icon: (
      <svg className="w-8 h-8 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 19h18" />
        <path d="M3 19l6-11 4 6.5 2-3 6 7.5" />
        <path d="M7.5 14l1.5-3" />
      </svg>
    ),
  },
  {
    id: "food",
    label: "Food & Culinary",
    icon: (
      <svg className="w-8 h-8 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11h16a8 8 0 0 1-16 0z" />
        <path d="M3 11h18" />
        <path d="M9 4c-1 1-1 2 0 3M12 3c-1 1-1 2 0 3M15 4c-1 1-1 2 0 3" />
      </svg>
    ),
  },
  {
    id: "nightlife",
    label: "Nightlife",
    icon: (
      <svg className="w-8 h-8 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16l-8 8z" />
        <path d="M12 13v6M8.5 19h7" />
      </svg>
    ),
  },
  {
    id: "nature",
    label: "Nature & Wildlife",
    icon: (
      <svg className="w-8 h-8 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 4 13C4 8 8 4 19 4c0 11-4 15-8 16z" />
        <path d="M4 20c2-6 5-9 11-11" />
      </svg>
    ),
  },
  {
    id: "city",
    label: "City Explorer",
    icon: (
      <svg className="w-8 h-8 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 21h20" />
        <path d="M4 21V10l5-3v14" />
        <path d="M9 21V7l6-4v18" />
        <path d="M15 21V11l5 3v7" />
      </svg>
    ),
  },
  {
    id: "romantic",
    label: "Romantic Getaway",
    icon: (
      <svg className="w-8 h-8 mx-auto mb-1.5" viewBox="0 0 24 24" fill="none" stroke="#F3C265" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 15.5 12 20 12 20z" />
      </svg>
    ),
  },
];

export const POPULAR_DESTINATIONS = [
  { name: "🇯🇵 Japan", value: "Japan" },
  { name: "🇮🇹 Italy", value: "Italy" },
  { name: "🇹🇭 Thailand", value: "Thailand" },
  { name: "🇪🇸 Spain", value: "Spain" },
  { name: "🇬🇷 Greece", value: "Greece" },
  { name: "🇲🇽 Mexico", value: "Mexico" },
  { name: "🇵🇹 Portugal", value: "Portugal" },
  { name: "🇹🇷 Turkey", value: "Turkey" },
  { name: "🇮🇩 Bali", value: "Bali, Indonesia" },
  { name: "🇲🇦 Morocco", value: "Morocco" },
  { name: "🇭🇷 Croatia", value: "Croatia" },
  { name: "🇻🇳 Vietnam", value: "Vietnam" },
];

export const LOADING_MESSAGES = [
  "Fetching live hotel & flight prices...",
  "Scanning the globe for your perfect match...",
  "Comparing real prices across the web...",
  "Handcrafting your day-by-day itinerary...",
  "Almost there — polishing your adventure...",
];
