"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/BookingContext";
import { getTripById } from "@/lib/mockData";
import BottomNav from "@/components/BottomNav";
import OperatorLogo from "@/components/OperatorLogo";

// ─── Types ───────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  recommendation?: RecommendCard;
  chips?: string[];
};

type RecommendCard = {
  tripId: string;
  operatorId: string;
  operatorName: string;
  departure: string;
  fare: number;
  busType: string;
  aircon: boolean;
  seatsLeft: number;
  reason: string;
  reasoning: { ok: boolean; text: string }[];
};

// ─── Scripted demo data ───────────────────────────────────────────────────────
const DEMO_CARD: RecommendCard = {
  tripId: "trip-001",
  operatorId: "victory",
  operatorName: "Victory Liner",
  departure: "08:30 AM",
  fare: 880,
  busType: "Deluxe",
  aircon: true,
  seatsLeft: 28,
  reason: "Best fit — under budget, early morning, aircon included.",
  reasoning: [
    { ok: true,  text: "Within your ₱900 budget (₱880)" },
    { ok: true,  text: "Departs before 9 AM (08:30 AM)" },
    { ok: true,  text: "Has aircon — Deluxe class" },
    { ok: false, text: "Not the cheapest option, but best time match" },
  ],
};

const SCRIPTED: Record<string, { text: string; recommendation?: RecommendCard; chips?: string[] }> = {
  "Trip to Baguio tomorrow morning, under ₱900, with aircon": {
    text: "Naghahanap ng trips na tugma sa budget at oras mo... Found a great match!",
    recommendation: DEMO_CARD,
    chips: ["Show me options", "Cheaper trips", "Later departure"],
  },
  "Show me options": {
    text: "Here are all Baguio trips tomorrow. Sorted by best match for your preferences 👇",
    chips: ["Cheapest first", "Earliest first", "Filter aircon only"],
  },
  "Cheaper trips": {
    text: "The cheapest option is Partas Trans at ₱760 — ₱120 less than Victory Liner. Trade-off: it's a late-night 10:00 PM departure, arriving 4 AM. Still want it?",
    chips: ["Yes, show Partas trip", "Keep morning options", "Compare all"],
  },
  "Later departure": {
    text: "Solid North has an 11:30 PM overnight trip at ₱820 — arrives 5:30 AM in Baguio. Aircon, Deluxe. Good if you prefer sleeping on the bus.",
    chips: ["Book Solid North", "Compare with Victory", "Back to morning"],
  },
  "Yes, show Partas trip": {
    text: "Partas Trans Co. — ₱760, 10:00 PM, Tourist class, aircon, 35 seats available. It's the cheapest on this route. Want me to take you to the booking page?",
    chips: ["Book this trip", "Back to morning options"],
  },
  "Book this trip": {
    text: "Perfect! Tapping below will take you straight to seat selection for this trip. Your details won't need to be re-entered.",
    chips: ["Go to seats", "Actually, show morning trips"],
  },
  "Book Solid North": {
    text: "Solid North 11:30 PM · ₱820 · Deluxe · Aircon. Only 8 seats left — locking in fast. Tap the card below to continue to checkout.",
    chips: ["Confirm booking", "See other options"],
  },
};

const KEYWORD_REPLIES: { keywords: string[]; text: string; recommendation?: RecommendCard; chips?: string[] }[] = [
  {
    keywords: ["baguio", "bagyo", "baguio city"],
    text: "Naghahanap ng trips papuntang Baguio... Found a great match!",
    recommendation: DEMO_CARD,
    chips: ["Show me options", "Cheaper trips", "Later departure"],
  },
  {
    keywords: ["vigan"],
    text: "Trips to Vigan City: Partas Trans (₱1,100, 8 PM) and Solid North (₱980, 7 PM). Both overnight, ~10 hours. Which operator do you prefer?",
    chips: ["Book Partas to Vigan", "Book Solid North to Vigan", "Compare both"],
  },
  {
    keywords: ["mura", "cheap", "budget", "affordable", "pinakamura"],
    text: "Pinakamura sa Baguio route: Partas Trans ₱760 (10 PM, overnight). For morning trips, Victory Liner ₱880 is the best value — aircon Deluxe class.",
    chips: ["Book ₱760 Partas", "Morning options"],
  },
  {
    keywords: ["cancel", "refund", "kansela"],
    text: "Cancellations 24h+ before departure get 80% refund. Cancellations within 24h are non-refundable. Want me to take you to your booking to cancel?",
    chips: ["Go to My Bookings", "Talk to support"],
  },
  {
    keywords: ["aircon", "malamig", "ac"],
    text: "All trips I'm showing you include aircon — Victory Liner and Genesis are Deluxe/Super Deluxe. Partas and Solid North are Tourist class but also have aircon.",
    chips: ["Show all aircon trips", "Compare classes"],
  },
  {
    keywords: ["pasay", "pitx"],
    text: "From Pasay (PITX): Victory Liner departs 9:00 AM → Baguio, ₱860, Deluxe. 22 seats available. Want to book this one?",
    chips: ["Book Pasay → Baguio", "Other Pasay trips"],
  },
];

function getFallback(text: string): { text: string; chips?: string[] } {
  const lower = text.toLowerCase();
  for (const r of KEYWORD_REPLIES) {
    if (r.keywords.some((k) => lower.includes(k))) return r;
  }
  return {
    text: `Interesting! Let me search for options related to "${text}"...\n\nI'd suggest checking routes from Manila Cubao — most operators depart from there. Want me to narrow down by budget or departure time?`,
    chips: ["Under ₱900", "Morning trips only", "Show all routes"],
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
        style={{ background: "linear-gradient(135deg,#1A1533,#4C2A72)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.477 2 2 6.277 2 11.5c0 2.304.87 4.408 2.3 6.02L3 22l4.8-1.56A10.14 10.14 0 0012 21c5.523 0 10-4.277 10-9.5S17.523 2 12 2z"/>
        </svg>
      </div>
      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-card border border-gray-50">
        <div className="flex gap-1.5 items-center h-5">
          <div className="w-2 h-2 rounded-full typing-dot" style={{ background: "#B797C4" }} />
          <div className="w-2 h-2 rounded-full typing-dot" style={{ background: "#B797C4" }} />
          <div className="w-2 h-2 rounded-full typing-dot" style={{ background: "#B797C4" }} />
        </div>
      </div>
    </div>
  );
}

function AIRecommendCard({ card, onTap }: { card: RecommendCard; onTap: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <button onClick={onTap}
      className="w-full text-left mt-2.5 rounded-[18px] overflow-hidden tap-card ai-card-glow"
      style={{ border: "1.5px solid rgba(76,42,114,0.25)", boxShadow: "0 8px 24px rgba(76,42,114,0.15)" }}>

      {/* Dark header */}
      <div className="px-4 pt-4 pb-3"
        style={{ background: "linear-gradient(135deg,#0F0C22 0%,#1A1533 40%,#3D2B6B 100%)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(244,180,0,0.2)", color: "#F4B400", border: "1px solid rgba(244,180,0,0.35)" }}>
            ✦ AI PICK
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.seatsLeft < 10 ? "bg-red-900/40 text-red-300" : "bg-white/10 text-white/60"}`}>
            {card.seatsLeft} seats left
          </span>
        </div>
        <div className="flex items-center gap-3">
          <OperatorLogo operatorId={card.operatorId} size="md" />
          <div className="flex-1">
            <p className="text-white font-bold font-poppins text-[15px]">{card.operatorName}</p>
            <p className="text-[#B797C4] text-xs mt-0.5">
              {card.departure} · {card.busType}{card.aircon ? " · Aircon" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#F4B400] text-[22px] font-bold font-poppins leading-none">₱{card.fare}</p>
            <p className="text-[#8A7A9E] text-[10px] mt-0.5">per person</p>
          </div>
        </div>
      </div>

      {/* White body */}
      <div className="px-4 py-3 bg-white">
        <p className="text-xs text-text-secondary leading-relaxed mb-2.5">{card.reason}</p>

        {/* Why this trip */}
        <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="flex items-center gap-1.5 text-xs font-bold text-violet-primary mb-1 active:opacity-70">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
            <path d="M19 9l-7 7-7-7" stroke="#4C2A72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Why this trip?
        </button>

        {expanded && (
          <div className="mt-2 space-y-1.5 pl-1 animate-fade-in">
            {card.reasoning.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-px ${r.ok ? "bg-[#E8F5E9]" : "bg-amber-50"}`}>
                  {r.ok ? (
                    <svg width="9" height="9" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="#2E9E5B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="9" height="9" fill="none" viewBox="0 0 24 24">
                      <path d="M12 8v5M12 16h.01" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-xs text-text-secondary leading-relaxed">{r.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
          <span className="text-xs font-bold text-violet-primary">Tap to book this trip</span>
          <div className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#401551,#4C2A72)" }}>
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

function ChatBubble({ msg, onCardTap, onChip }: {
  msg: Message;
  onCardTap: (tripId: string) => void;
  onChip: (t: string) => void;
}) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2 mb-4 animate-fade-in ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
          style={{ background: "linear-gradient(135deg,#1A1533,#4C2A72)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.477 2 2 6.277 2 11.5c0 2.304.87 4.408 2.3 6.02L3 22l4.8-1.56A10.14 10.14 0 0012 21c5.523 0 10-4.277 10-9.5S17.523 2 12 2z"/>
          </svg>
        </div>
      )}
      <div className={`max-w-[78%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap
          ${isUser
            ? "rounded-br-md text-white"
            : "rounded-bl-md bg-white text-text-primary border border-gray-100"
          }`}
          style={isUser ? { background: "linear-gradient(135deg,#401551,#4C2A72)" } : {}}>
          {msg.text}
        </div>
        {msg.recommendation && (
          <div className="w-full max-w-[290px]">
            <AIRecommendCard card={msg.recommendation} onTap={() => onCardTap(msg.recommendation!.tripId)} />
          </div>
        )}
        {msg.chips && msg.chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-w-[290px]">
            {msg.chips.map((c) => (
              <button key={c} onClick={() => onChip(c)}
                className="text-xs px-3 py-1.5 rounded-full font-semibold active:scale-95 transition-transform border"
                style={{ color: "#4C2A72", background: "#F5EEFF", border: "1.5px solid rgba(76,42,114,0.25)" }}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const INITIAL: Message[] = [
  {
    id: "w0",
    role: "assistant",
    text: "Kamusta! I'm your SakAi AI assistant. \n\nTell me where you're headed and I'll find the best trip — budget, time, comfort, all considered.",
    chips: [
      "Trip to Baguio tomorrow morning, under ₱900, with aircon",
      "Cheapest trip to Vigan",
      "Cancel my booking",
    ],
  },
];

export default function AIAssistantPage() {
  const router = useRouter();
  const { setSelectedTrip } = useApp();
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: `u${Date.now()}`, role: "user", text: text.trim() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = 650 + Math.random() * 350;
    await new Promise((r) => setTimeout(r, delay));
    setIsTyping(false);

    const scripted = SCRIPTED[text.trim()];
    const reply = scripted ?? getFallback(text.trim());

    const assistantMsg: Message = {
      id: `a${Date.now()}`,
      role: "assistant",
      ...reply,
    };
    setMessages((p) => [...p, assistantMsg]);
  }, [isTyping]);

  const handleCardTap = (tripId: string) => {
    const trip = getTripById(tripId);
    if (trip) {
      setSelectedTrip(trip);
      router.push(`/trip/${tripId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 bg-[#F0ECF7]">

      {/* Header */}
      <div className="sticky top-0 z-30 shadow-sm"
        style={{ background: "linear-gradient(135deg,#0F0C22 0%,#1A1533 50%,#3D2B6B 100%)" }}>
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/home"
            className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg,rgba(76,42,114,0.6),rgba(244,180,0,0.2))", border: "1.5px solid rgba(244,180,0,0.35)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#F4B400">
              <path d="M12 2C6.477 2 2 6.277 2 11.5c0 2.304.87 4.408 2.3 6.02L3 22l4.8-1.56A10.14 10.14 0 0012 21c5.523 0 10-4.277 10-9.5S17.523 2 12 2z"/>
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-white text-[14px] font-bold font-poppins">SakAi Assistant</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-[#8A7A9E] text-[11px]">Online · Powered by SakAi AI</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/search?from=Manila%20(Cubao)&to=Baguio%20City&date=2026-09-13&passengers=1")}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform"
            style={{ background: "rgba(244,180,0,0.18)", color: "#F4B400", border: "1px solid rgba(244,180,0,0.3)" }}>
            Browse →
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-5 overflow-y-auto">
        {/* Date chip */}
        <div className="flex justify-center mb-5">
          <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-white/70 text-text-secondary shadow-sm">
            Today · September 12
          </span>
        </div>

        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} onCardTap={handleCardTap} onChip={sendMessage} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Input */}
      <div className="sticky bottom-16 left-0 right-0 z-20 border-t border-white/60"
        style={{ background: "rgba(240,236,247,0.96)", backdropFilter: "blur(12px)" }}>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex items-center gap-2 px-4 py-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about your next trip..."
            className="flex-1 h-11 px-4 rounded-full text-sm text-text-primary bg-white border border-purple-secondary/30 placeholder:text-gray-400 shadow-sm outline-none"
            style={{ fontFamily: "var(--font-inter)" }}
          />
          <button type="submit" disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#401551,#4C2A72)" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
        <p className="text-center text-[10px] text-text-secondary/60 pb-2 px-4">
          AI may suggest trips based on availability. Always verify before booking.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
