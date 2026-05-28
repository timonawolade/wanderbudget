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
    emoji: "🎒",
    desc: "Hostels, street food, buses",
    dailyRange: "$30–60/day",
  },
  {
    id: "comfort",
    label: "Comfort",
    emoji: "🏨",
    desc: "3-star hotels, restaurants, mixed transport",
    dailyRange: "$80–150/day",
  },
  {
    id: "luxury",
    label: "Luxury",
    emoji: "✨",
    desc: "4-5 star hotels, fine dining, private transfers",
    dailyRange: "$200–500+/day",
  },
];

export const VIBES = [
  { id: "beach", emoji: "🏖️", label: "Beach & Relax" },
  { id: "culture", emoji: "🏛️", label: "Culture & History" },
  { id: "adventure", emoji: "🧗", label: "Adventure" },
  { id: "food", emoji: "🍜", label: "Food & Culinary" },
  { id: "nightlife", emoji: "🌃", label: "Nightlife" },
  { id: "nature", emoji: "🌿", label: "Nature & Wildlife" },
  { id: "city", emoji: "🏙️", label: "City Explorer" },
  { id: "romantic", emoji: "💕", label: "Romantic Getaway" },
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
  "Scanning the globe for your perfect match...",
  "Comparing flights, hotels & hidden gems...",
  "Crunching numbers across time zones...",
  "Handcrafting your day-by-day itinerary...",
  "Almost there — polishing your adventure...",
];
