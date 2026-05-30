"use client";
import { useState, useEffect, useRef } from "react";
import {
  CURRENCIES,
  TRAVEL_STYLES,
  VIBES,
  POPULAR_DESTINATIONS,
  LOADING_MESSAGES,
} from "@/lib/constants";

// ── Inline markdown renderer ──
function InlineText({ text }) {
  if (!text) return null;
  const parts = [];
  const regex = /\*\*(.+?)\*\*/g;
  let match, lastIndex = 0, k = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex)
      parts.push(<span key={k++}>{text.slice(lastIndex, match.index)}</span>);
    parts.push(
      <strong key={k++} className="text-dark font-semibold">{match[1]}</strong>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(<span key={k++}>{text.slice(lastIndex)}</span>);
  return <>{parts}</>;
}

// ── Markdown block renderer ──
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
            <li key={i} className="list-disc">
              <InlineText text={li} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={`h-${idx++}`} className="text-lg font-bold mt-5 mb-2 text-accent font-display">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={`h-${idx++}`} className="text-xl font-bold mt-6 mb-2 text-dark border-b-2 border-orange-200 pb-1.5 font-display">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={`h-${idx++}`} className="text-2xl font-extrabold mt-6 mb-3 text-dark font-display">
          {line.slice(2)}
        </h1>
      );
    } else if (/^[-•*]\s/.test(line)) {
      listItems.push(line.replace(/^[-•*]\s/, ""));
    } else if (/^\d+\.\s/.test(line)) {
      flushList();
      elements.push(
        <p key={`ol-${idx++}`} className="my-1 pl-5">
          <InlineText text={line} />
        </p>
      );
    } else if (line.startsWith("---")) {
      flushList();
      elements.push(<hr key={`hr-${idx++}`} className="border-none border-t-2 border-dashed border-orange-200 my-4" />);
    } else if (line.trim() === "") {
      flushList();
      elements.push(<div key={`sp-${idx++}`} className="h-2" />);
    } else {
      flushList();
      elements.push(
        <p key={`p-${idx++}`} className="my-1.5 leading-relaxed">
          <InlineText text={line} />
        </p>
      );
    }
  }
  flushList();
  return <>{elements}</>;
}

// ── Main App ──
export default function Home() {
  const [step, setStep] = useState(-1); // -1 = landing page
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [destMode, setDestMode] = useState(null);
  const [style, setStyle] = useState("");
  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hasLiveData, setHasLiveData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  const TOTAL_STEPS = 5;

  useEffect(() => {
    if (loading) {
      const t = setInterval(
        () => setLoadingMsg((p) => (p + 1) % LOADING_MESSAGES.length),
        3200
      );
      return () => clearInterval(t);
    }
  }, [loading]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const toggleVibe = (id) => {
    setVibes((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const canProceed = () => {
    if (step === 0) return budget && parseFloat(budget) >= 100;
    if (step === 1) return origin.trim().length > 0;
    if (step === 2)
      return destMode === "surprise" || (destMode === "choose" && destination.trim().length > 0);
    if (step === 3) return style !== "";
    if (step === 4) return vibes.length > 0;
    return false;
  };

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    const curr = CURRENCIES[currency];
    const selectedStyle = TRAVEL_STYLES.find((s) => s.id === style);
    const selectedVibes = vibes.map((v) => VIBES.find((vb) => vb.id === v)?.label);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budget,
          currency,
          currencySymbol: curr.symbol,
          origin,
          destination,
          destMode,
          style: `${selectedStyle.label} (${selectedStyle.desc})`,
          vibes: selectedVibes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate plan");
      setResult(data.plan);
      setHasLiveData(data.hasLiveData || false);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else generatePlan();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && canProceed()) handleNext();
  };

  const reset = () => {
    setStep(0);
    setBudget("");
    setOrigin("");
    setDestination("");
    setDestMode(null);
    setStyle("");
    setVibes([]);
    setResult(null);
    setError(null);
    setLoading(false);
    setCopied(false);
    setShareUrl(null);
  };

  const copyItinerary = () => {
    navigator.clipboard?.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveTrip = async () => {
    setSaving(true);
    try {
      const curr = CURRENCIES[currency];
      const selectedStyle = TRAVEL_STYLES.find((s) => s.id === style);
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: result,
          budget,
          currency,
          currencySymbol: curr.symbol,
          origin,
          destination: destMode === "choose" ? destination : "",
          destMode,
          style: selectedStyle?.label || style,
          vibes: vibes.map((v) => VIBES.find((vb) => vb.id === v)?.label),
          hasLiveData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const url = `${window.location.origin}/trip/${data.tripId}`;
      setShareUrl(url);
      navigator.clipboard?.writeText(url);
    } catch (err) {
      console.error("Save failed:", err);
    }
    setSaving(false);
  };

  // ── Landing Page ──
  if (step === -1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark-mid to-dark-deep text-cream font-body">
        <div className="max-w-2xl mx-auto px-5 py-16 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-3xl shadow-lg shadow-accent/30">
              🧭
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold bg-gradient-to-r from-cream to-orange-200 bg-clip-text text-transparent">
              Orbit Vacations
            </h1>
          </div>

          <p className="text-lg text-cream/60 mb-12 animate-fade-in max-w-md mx-auto" style={{ animationDelay: "0.15s" }}>
            AI-powered travel planning that revolves around <span className="text-accent-light font-semibold">your budget</span>.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14 text-left">
            {[
              { emoji: "💰", title: "Budget-First", desc: "Set your budget, we find the perfect trip that fits." },
              { emoji: "🤖", title: "AI-Powered", desc: "Smart itineraries with real hotel & flight estimates." },
              { emoji: "📋", title: "Day-by-Day", desc: "Complete plans you can book today. No guesswork." },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-slide-up"
                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
              >
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="font-semibold text-base mb-1">{f.title}</h3>
                <p className="text-sm text-cream/50">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => setStep(0)}
            className="animate-slide-up bg-gradient-to-r from-accent to-accent-light text-white text-lg font-bold py-4 px-12 rounded-2xl shadow-lg shadow-accent/40 hover:shadow-xl hover:shadow-accent/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ animationDelay: "0.5s" }}
          >
            🧭 Plan My Trip — Free
          </button>

          <p className="text-xs text-cream/30 mt-6">
            No sign-up required. Get a complete itinerary in 30 seconds.
          </p>
        </div>

        <footer className="text-center py-6 text-cream/20 text-xs">
          Orbit Vacations © 2026 — Built by Timon Awolade | DeveloperWeek NY 2026
        </footer>
      </div>
    );
  }

  // ── Main App Flow ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-mid to-dark-deep text-cream font-body">
      {/* Header */}
      <div className="pt-8 pb-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2 cursor-pointer" onClick={() => setStep(-1)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-xl shadow-md shadow-accent/30">
            🧭
          </div>
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-cream to-orange-200 bg-clip-text text-transparent">
            Orbit Vacations
          </h1>
        </div>
        <p className="text-cream/40 text-sm">Your budget. Your adventure. Planned by AI.</p>
      </div>

      {/* Progress */}
      {!result && !loading && (
        <div className="flex items-center justify-center gap-1.5 pb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              onClick={() => i < step && setStep(i)}
              className="h-2.5 rounded-full transition-all duration-400"
              style={{
                width: i === step ? 36 : 10,
                background:
                  i < step
                    ? "#e8613c"
                    : i === step
                    ? "linear-gradient(90deg, #e8613c, #f4845f)"
                    : "rgba(255,255,255,0.08)",
                cursor: i < step ? "pointer" : "default",
                boxShadow: i === step ? "0 0 12px rgba(232,97,60,0.35)" : "none",
              }}
            />
          ))}
          <span className="ml-2.5 text-xs text-cream/30">
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>
      )}

      {/* Main Card */}
      <div className="max-w-xl mx-auto px-4 pb-10">
        {!result && !loading && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 shadow-2xl animate-fade-in">
            {/* Step 0: Budget */}
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl mb-1">What's your travel budget?</h2>
                <p className="text-cream/40 text-sm mb-7">
                  The total amount — flights, hotels, food, everything.
                </p>
                <div className="flex gap-3 mb-5">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="py-3.5 px-3 rounded-xl border border-white/10 bg-white/5 text-cream text-sm font-body outline-none cursor-pointer"
                  >
                    {Object.entries(CURRENCIES).map(([code, c]) => (
                      <option key={code} value={code} className="bg-dark text-cream">
                        {c.symbol} {code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="2,000"
                    autoFocus
                    className="flex-1 py-3.5 px-4 rounded-xl border border-white/10 bg-white/5 text-cream text-3xl font-display outline-none placeholder:text-cream/20"
                  />
                </div>
                {budget && parseFloat(budget) > 0 && parseFloat(budget) < 100 && (
                  <p className="text-yellow-300 text-sm">
                    ⚠️ Minimum budget: {CURRENCIES[currency].symbol}100
                  </p>
                )}
                {budget && parseFloat(budget) >= 100 && (
                  <div className="bg-accent/10 border border-accent/20 rounded-xl py-3 px-4 text-sm text-orange-200">
                    💡 That's roughly{" "}
                    <strong>
                      ${Math.round(parseFloat(budget) / CURRENCIES[currency].rate).toLocaleString()} USD
                    </strong>{" "}
                    — let's find your adventure!
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Origin */}
            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl mb-1">Where are you flying from?</h2>
                <p className="text-cream/40 text-sm mb-7">Helps estimate flight costs accurately</p>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. New York, London, Dubai..."
                  autoFocus
                  className="w-full py-4 px-4 rounded-xl border border-white/10 bg-white/5 text-cream text-lg font-body outline-none placeholder:text-cream/25"
                />
              </div>
            )}

            {/* Step 2: Destination */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl mb-1">Where do you want to go?</h2>
                <p className="text-cream/40 text-sm mb-6">
                  Pick a destination or let AI find the best one for your budget
                </p>

                <div className="flex gap-3 mb-6">
                  {[
                    { mode: "surprise", emoji: "🎲", title: "Surprise Me!", sub: "AI picks the best destination" },
                    { mode: "choose", emoji: "📍", title: "I Know Where", sub: "I have a place in mind" },
                  ].map((opt) => (
                    <div
                      key={opt.mode}
                      onClick={() => {
                        setDestMode(opt.mode);
                        if (opt.mode === "surprise") setDestination("");
                      }}
                      className={`flex-1 p-5 rounded-2xl text-center cursor-pointer transition-all border-2 ${
                        destMode === opt.mode
                          ? "border-accent bg-accent/10"
                          : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="text-3xl mb-2">{opt.emoji}</div>
                      <div className="font-bold text-sm">{opt.title}</div>
                      <div className="text-xs text-cream/40 mt-1">{opt.sub}</div>
                    </div>
                  ))}
                </div>

                {destMode === "choose" && (
                  <div>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a country or city..."
                      autoFocus
                      className="w-full py-3.5 px-4 rounded-xl border border-white/10 bg-white/5 text-cream text-base font-body outline-none placeholder:text-cream/25 mb-4"
                    />
                    <p className="text-xs text-cream/30 mb-3">Or pick a popular destination:</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_DESTINATIONS.map((d) => (
                        <div
                          key={d.value}
                          onClick={() => setDestination(d.value)}
                          className={`py-2 px-3.5 rounded-full text-xs cursor-pointer font-medium transition-all border ${
                            destination === d.value
                              ? "border-accent bg-accent/15 text-orange-200"
                              : "border-white/10 bg-white/[0.03] text-cream hover:bg-white/[0.06]"
                          }`}
                        >
                          {d.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {destMode === "surprise" && (
                  <div className="bg-accent/[0.06] border border-accent/15 rounded-2xl p-5 text-center">
                    <p className="text-sm text-cream/60">
                      🌍 We'll analyze your budget, travel style, and vibes to recommend the{" "}
                      <strong className="text-cream/80">perfect destination</strong> you might not have considered!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Style */}
            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl mb-1">How do you like to travel?</h2>
                <p className="text-cream/40 text-sm mb-7">Shapes your accommodation & dining picks</p>
                <div className="flex flex-col gap-3">
                  {TRAVEL_STYLES.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`p-5 rounded-2xl cursor-pointer flex items-center gap-5 transition-all border-2 ${
                        style === s.id
                          ? "border-accent bg-accent/10"
                          : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="text-4xl">{s.emoji}</span>
                      <div>
                        <div className="font-bold text-base">{s.label}</div>
                        <div className="text-cream/40 text-sm mt-0.5">{s.desc}</div>
                        <div className="text-accent-light text-xs mt-1 font-semibold">{s.dailyRange}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Vibes */}
            {step === 4 && (
              <div>
                <h2 className="font-display text-2xl mb-1">What's your travel vibe?</h2>
                <p className="text-cream/40 text-sm mb-7">Pick up to 3 — shapes your entire itinerary</p>
                <div className="grid grid-cols-2 gap-3">
                  {VIBES.map((v) => {
                    const sel = vibes.includes(v.id);
                    const disabled = vibes.length >= 3 && !sel;
                    return (
                      <div
                        key={v.id}
                        onClick={() => !disabled && toggleVibe(v.id)}
                        className={`py-4 px-3 rounded-2xl text-center transition-all border-2 ${
                          sel
                            ? "border-accent bg-accent/10"
                            : disabled
                            ? "border-white/[0.04] bg-white/[0.01] opacity-30 cursor-not-allowed"
                            : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer"
                        }`}
                      >
                        <div className="text-3xl mb-1.5">{v.emoji}</div>
                        <div className="text-xs font-semibold">{v.label}</div>
                      </div>
                    );
                  })}
                </div>
                {vibes.length > 0 && (
                  <p className="mt-4 text-center text-sm text-cream/40">
                    {vibes.map((v) => VIBES.find((vb) => vb.id === v)?.emoji).join(" ")} ({vibes.length}/3 selected)
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="py-3.5 px-6 rounded-xl border border-white/15 text-cream font-semibold hover:bg-white/5 transition-colors"
                >
                  ←
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-base transition-all ${
                  canProceed()
                    ? "bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 active:scale-[0.98]"
                    : "bg-white/5 text-cream/20 cursor-not-allowed"
                }`}
              >
                {step === TOTAL_STEPS - 1 ? "🧭 Generate My Trip" : "Continue →"}
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 animate-fade-in">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-[3px] border-white/5 border-t-accent animate-[spin_1s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border-2 border-white/[0.03] border-b-accent-light animate-[spin_1.5s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🧭</div>
            </div>
            <p className="font-display text-xl mb-2 min-h-[28px]">{LOADING_MESSAGES[loadingMsg]}</p>
            <p className="text-sm text-cream/30">This usually takes 15–30 seconds</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-7 text-center animate-fade-in">
            <p className="mb-4 text-base">😕 {error}</p>
            <button
              onClick={generatePlan}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white font-bold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div ref={resultRef} className="animate-slide-up">
            {/* Summary pills */}
            <div className="flex gap-2.5 mb-5 flex-wrap">
              {[
                { label: "Budget", val: `${CURRENCIES[currency].symbol}${parseFloat(budget).toLocaleString()}` },
                { label: "Style", val: `${TRAVEL_STYLES.find((s) => s.id === style)?.emoji} ${TRAVEL_STYLES.find((s) => s.id === style)?.label}` },
                { label: "From", val: origin },
                ...(destMode === "choose" ? [{ label: "To", val: destination }] : []),
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[100px] bg-accent/10 border border-accent/20 rounded-2xl py-3 px-3.5 text-center"
                >
                  <div className="text-[10px] uppercase tracking-widest text-cream/40 mb-1">{item.label}</div>
                  <div className="font-display text-base font-semibold">{item.val}</div>
                </div>
              ))}
            </div>

            {/* Live data badge */}
            {hasLiveData && (
              <div className="flex items-center justify-center gap-2 mb-4 bg-green-500/10 border border-green-500/25 rounded-full py-2.5 px-5 mx-auto w-fit">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-green-300">
                  Live prices fetched from the web · Powered by Nimble
                </span>
              </div>
            )}

            {/* Itinerary card */}
            <div className="bg-[#fffbf8] rounded-3xl p-7 md:p-8 text-[#2a2a3a] shadow-2xl leading-relaxed text-[15px]">
              <MarkdownView text={result} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 flex-wrap">
              <button
                onClick={reset}
                className="flex-1 py-4 rounded-xl border border-white/15 text-cream font-semibold hover:bg-white/5 transition-colors"
              >
                🔄 New Trip
              </button>
              <button
                onClick={copyItinerary}
                className="flex-1 py-4 rounded-xl border border-white/15 text-cream font-semibold hover:bg-white/5 transition-colors"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
              <button
                onClick={saveTrip}
                disabled={saving || shareUrl}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white font-bold shadow-lg shadow-accent/30 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {saving ? "💾 Saving..." : shareUrl ? "✅ Saved!" : "💾 Save & Share"}
              </button>
            </div>

            {/* Share URL display */}
            {shareUrl && (
              <div className="mt-4 bg-accent/10 border border-accent/20 rounded-2xl p-4 animate-fade-in">
                <p className="text-xs text-cream/50 mb-2 uppercase tracking-wider">🔗 Shareable link (copied to clipboard)</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    onClick={(e) => e.target.select()}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-sm text-cream font-mono outline-none"
                  />
                  <button
                    onClick={() => { navigator.clipboard?.writeText(shareUrl); }}
                    className="py-2.5 px-4 rounded-lg bg-accent/20 border border-accent/30 text-orange-200 text-sm font-semibold hover:bg-accent/30 transition-colors whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-cream/40 mt-2">Anyone with this link can view your full itinerary — share it with your travel companions!</p>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="text-center py-6 text-cream/20 text-xs">
        Orbit Vacations © 2026 — Built by Timon Awolade | orbit.vacations
      </footer>
    </div>
  );
}
