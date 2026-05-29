// Nimble Live Web Data Integration
// Fetches real-time hotel prices, flight costs, and attraction info from the live web
// Powers the "Live prices" feature for the Nimble hackathon challenge

const NIMBLE_ENDPOINT = "https://sdk.nimbleway.com/v1/search";

async function nimbleSearch(query, focus = "general", searchDepth = "lite") {
  const apiKey = process.env.NIMBLE_API_KEY;
  if (!apiKey) {
    console.warn("NIMBLE_API_KEY not set — skipping live web data");
    return null;
  }

  try {
    const res = await fetch(NIMBLE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        focus,
        search_depth: searchDepth,
      }),
    });

    if (!res.ok) {
      console.error(`Nimble API error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Nimble search failed:", err.message);
    return null;
  }
}

// Extract readable text from Nimble's response (handles various response shapes)
function extractResultsText(nimbleData, maxChars = 1500) {
  if (!nimbleData) return "";

  // Nimble responses can come in different shapes — handle common ones
  let results = [];
  if (Array.isArray(nimbleData.results)) results = nimbleData.results;
  else if (Array.isArray(nimbleData.data)) results = nimbleData.data;
  else if (Array.isArray(nimbleData)) results = nimbleData;

  const snippets = results
    .slice(0, 5)
    .map((r) => {
      const title = r.title || r.name || "";
      const content = r.content || r.snippet || r.description || r.text || "";
      return `${title}: ${content}`.trim();
    })
    .filter(Boolean)
    .join("\n");

  return snippets.slice(0, maxChars);
}

/**
 * Fetches live travel data for a destination.
 * Runs hotel + flight searches in parallel for speed.
 */
export async function fetchLiveTravelData({ destination, origin, currency }) {
  if (!destination || destination === "surprise") {
    // For "surprise me" mode, we don't know the destination yet, so skip live fetch
    return { hotels: "", flights: "", hasLiveData: false };
  }

  const hotelQuery = `hotel prices per night ${destination} ${new Date().getFullYear()} booking`;
  const flightQuery = `flight cost ${origin} to ${destination} round trip ${new Date().getFullYear()}`;

  // Run both searches in parallel
  const [hotelData, flightData] = await Promise.all([
    nimbleSearch(hotelQuery, "general", "lite"),
    nimbleSearch(flightQuery, "general", "lite"),
  ]);

  const hotels = extractResultsText(hotelData);
  const flights = extractResultsText(flightData);
  const hasLiveData = Boolean(hotels || flights);

  return { hotels, flights, hasLiveData };
}
