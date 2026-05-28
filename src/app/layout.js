import "./globals.css";

export const metadata = {
  title: "Orbit Vacations — AI Travel Budget Planner",
  description:
    "Tell us your budget and we'll plan your perfect trip. AI-powered travel planning that revolves around YOUR budget.",
  keywords: "travel planner, budget travel, AI travel, vacation planner, trip planner",
  openGraph: {
    title: "Orbit Vacations — AI Travel Budget Planner",
    description: "Your budget. Your adventure. Planned by AI.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
