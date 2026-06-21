import { NextResponse } from "next/server";
import { fetchLiveTravelData } from "@/lib/nimble";

export async function POST(request) {
  try {
    const { budget, currency, currencySymbol, origin, destination, destMode, style, vibes } =
      await request.json();

    if (!budget || !currency || !origin || !style || !vibes?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── STEP 1: Fetch LIVE web data via Nimble (real hotel & flight prices) ──
    const liveData = await fetchLiveTravelData({
      destination: destMode === "choose" ? destination : "surprise",
      origin,
      currency,
    });

    let liveDataBlock = "";
    if (liveData.hasLiveData) {
      liveDataBlock = `

IMPORTANT — USE THIS LIVE WEB DATA (fetched in real-time just now):

LIVE HOTEL PRICING DATA:
${liveData.hotels || "No live hotel data available."}

LIVE FLIGHT PRICING DATA:
${liveData.flights || "No live flight data available."}

Base your hotel and flight cost estimates on this REAL, CURRENT data above. Reference actual prices found. If the live data mentions specific hotels or prices, use them.`;
    }

    const destText =
      destMode === "surprise"
        ? "The user wants you to RECOMMEND the best destination for their budget and preferences. Pick the single best destination that maximizes their experience within budget."
        : `The user wants to travel to: ${destination}. Plan their trip there. If the budget is insufficient for this destination, explain why and suggest the closest alternative that fits.`;

    const prompt = `You are Orbit Vacations, an expert AI travel planner. A user wants to plan a trip.

INPUTS:
- Total Budget: ${currencySymbol}${budget} ${currency} 
- Traveling From: ${origin}
- Destination: ${destText}
- Travel Style: ${style}
- Preferred Vibes: ${vibes.join(", ")}
${liveDataBlock}

Create a COMPLETE travel plan STRICTLY within their budget. Use this EXACT structure:

## 🌍 Your Trip: [Destination Name]

**Duration:** [X days / X nights]
**Best Time to Visit:** [months]
**Budget Breakdown Total:** ${currencySymbol}${budget}

---

## ✈️ Getting There
- Estimated flight/transport cost from ${origin}
- Best booking tips and airlines to consider

---

## 🏨 Where to Stay
- 3 specific hotel/hostel/Airbnb recommendations with estimated nightly rates in ${currency}
- Neighborhood recommendations and why

---

## 📅 Day-by-Day Itinerary

### Day 1: [Theme]
- Morning: [Specific activity with location name]
- Afternoon: [Specific activity with location name]
- Evening: [Specific activity with location name]
- Estimated day cost: ${currencySymbol}[amount]

(Continue for each recommended day)

---

## 💰 Budget Breakdown
- Flights/Transport: ${currencySymbol}[amount]
- Accommodation ([X] nights): ${currencySymbol}[amount]
- Food & Dining: ${currencySymbol}[amount]
- Activities & Experiences: ${currencySymbol}[amount]
- Local Transport: ${currencySymbol}[amount]
- Emergency Buffer (10%): ${currencySymbol}[amount]
- **TOTAL: ${currencySymbol}${budget}**

---

## 💡 Money-Saving Tips
- 5 specific, actionable tips for this destination

---

## ⚠️ Important Notes
- Visa requirements for common nationalities
- Safety tips
- Best apps to download for this destination
- SIM card / connectivity advice

Use REAL place names, REAL hotel suggestions, REAL restaurant areas. Be specific enough that someone could book this trip TODAY. All costs in ${currency}.`;

    // ── STEP 2: Generate the plan with the AI provider ──
    const provider = process.env.AI_PROVIDER || "claude";
    let responseText;

    if (provider === "claude") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error("Claude API error:", res.status, errBody);
        throw new Error(`Claude API error: ${res.status}`);
      }

      const data = await res.json();
      responseText = data.content?.map((c) => c.text || "").join("") || "";
    } else if (provider === "qwen") {
      const res = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: "qwen-plus",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 4000,
        }),
      });

      if (!res.ok) throw new Error(`Qwen API error: ${res.status}`);
      const data = await res.json();
      responseText = data.choices?.[0]?.message?.content || "";
    }

    if (!responseText) {
      throw new Error("No response from AI provider");
    }

    return NextResponse.json({
      plan: responseText,
      hasLiveData: liveData.hasLiveData,
    });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate travel plan. Please try again." },
      { status: 500 }
    );
  }
}
