"use client";
import Link from "next/link";

// Inline markdown renderer (same as main app)
function InlineText({ text }) {
  if (!text) return null;
  const parts = [];
  const regex = /\*\*(.+?)\*\*/g;
  let match, lastIndex = 0, k = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex)
      parts.push(<span key={k++}>{text.slice(lastIndex, match.index)}</span>);
    parts.push(<strong key={k++} className="text-dark font-semibold">{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(<span key={k++}>{text.slice(lastIndex)}</span>);
  return <>{parts}</>;
}

function MarkdownView({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let listItems = [];
  let idx = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${idx++}`} className="pl-5 my-2 space-y-1">
          {listItems.map((li, i) => (
            <li key={i} className="list-disc"><InlineText text={li} /></li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={`h-${idx++}`} className="text-lg font-bold mt-5 mb-2 text-accent font-display">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={`h-${idx++}`} className="text-xl font-bold mt-6 mb-2 text-dark border-b-2 border-orange-200 pb-1.5 font-display">{line.slice(3)}</h2>);
    } else if (line.startsWith("# ")) {
      flushList();
      elements.push(<h1 key={`h-${idx++}`} className="text-2xl font-extrabold mt-6 mb-3 text-dark font-display">{line.slice(2)}</h1>);
    } else if (/^[-•*]\s/.test(line)) {
      listItems.push(line.replace(/^[-•*]\s/, ""));
    } else if (/^\d+\.\s/.test(line)) {
      flushList();
      elements.push(<p key={`ol-${idx++}`} className="my-1 pl-5"><InlineText text={line} /></p>);
    } else if (line.startsWith("---")) {
      flushList();
      elements.push(<hr key={`hr-${idx++}`} className="border-none border-t-2 border-dashed border-orange-200 my-4" />);
    } else if (line.trim() === "") {
      flushList();
      elements.push(<div key={`sp-${idx++}`} className="h-2" />);
    } else {
      flushList();
      elements.push(<p key={`p-${idx++}`} className="my-1.5 leading-relaxed"><InlineText text={line} /></p>);
    }
  }
  flushList();
  return <>{elements}</>;
}

export default function TripView({ trip, error, tripId }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-mid to-dark-deep text-cream font-body">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="pt-8 pb-4 text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-3 mb-2 no-underline">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-xl shadow-md shadow-accent/30">🧭</div>
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-cream to-orange-200 bg-clip-text text-transparent">Orbit Vacations</h1>
        </Link>
        <p className="text-cream/40 text-sm">A shared travel itinerary</p>
      </div>

      <div className="max-w-xl mx-auto px-4 pb-10">
        {error || !trip ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center mt-8">
            <div className="text-5xl mb-4">🧭</div>
            <h2 className="font-display text-2xl mb-2">Trip not found</h2>
            <p className="text-cream/50 mb-6">This trip link may have expired or doesn't exist.</p>
            <Link href="/" className="inline-block py-3 px-8 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white font-bold no-underline">
              Plan Your Own Trip →
            </Link>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Summary pills */}
            <div className="flex gap-2.5 mb-5 flex-wrap">
              {[
                { label: "Budget", val: `${trip.currencySymbol}${Number(trip.budget).toLocaleString()}` },
                { label: "Style", val: trip.style?.split(" ")[0] || "—" },
                { label: "From", val: trip.origin },
                ...(trip.destination ? [{ label: "To", val: trip.destination }] : []),
              ].map((item, i) => (
                <div key={i} className="flex-1 min-w-[100px] bg-accent/10 border border-accent/20 rounded-2xl py-3 px-3.5 text-center">
                  <div className="text-[10px] uppercase tracking-widest text-cream/40 mb-1">{item.label}</div>
                  <div className="font-display text-base font-semibold">{item.val}</div>
                </div>
              ))}
            </div>

            {trip.hasLiveData && (
              <div className="flex items-center justify-center gap-2 mb-4 bg-green-500/10 border border-green-500/25 rounded-full py-2.5 px-5 mx-auto w-fit">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-green-300">Live prices fetched from the web · Powered by Nimble</span>
              </div>
            )}

            <div className="bg-[#fffbf8] rounded-3xl p-7 md:p-8 text-[#2a2a3a] shadow-2xl leading-relaxed text-[15px]">
              <MarkdownView text={trip.plan} />
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="inline-block py-4 px-10 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white font-bold no-underline shadow-lg shadow-accent/30">
                🧭 Plan Your Own Trip
              </Link>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center py-6 text-cream/20 text-xs">
        Orbit Vacations © 2026 — orbit.vacations
      </footer>
    </div>
  );
}
