# 🧭 Orbit Vacations (WanderBudget)

**AI-powered travel planning that revolves around YOUR budget.**

Built for DeveloperWeek New York 2026 Hackathon & QwenCloud Global AI Hackathon.

## What It Does

Enter your budget, and Orbit Vacations creates a complete, actionable travel plan:
- ✈️ Flight estimates from your origin
- 🏨 Real hotel recommendations within budget
- 📅 Day-by-day itinerary with specific activities
- 💰 Detailed budget breakdown
- 💡 Money-saving tips for your destination

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **AI Engine:** Claude API (swappable to Qwen for QwenCloud hackathon)
- **Deployment:** Vercel

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/timonawolade/wanderbudget.git
cd wanderbudget
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deploys.

**Important:** Add `ANTHROPIC_API_KEY` to your Vercel project's Environment Variables.

## Switching AI Providers

To use Qwen instead of Claude (for QwenCloud hackathon):

1. Add to `.env.local`:
```
AI_PROVIDER=qwen
QWEN_API_KEY=your_key_here
```

2. The API route automatically switches between providers.

## Domain Challenge

This project is built for the **name.com Domain Roulette** challenge using: **orbit.vacations**

"Orbit" represents how destinations revolve around your budget — your budget is the center of gravity, and we find the perfect trips that orbit within it.

## Author

**Timon Awolade**
- Website: [webcraftdom.com](https://www.webcraftdom.com)
- GitHub: [@timonawolade](https://github.com/timonawolade)
- Twitter: [@sirtimi134](https://x.com/sirtimi134)
