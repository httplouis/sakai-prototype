"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SLIDES = [
  {
    bg: "linear-gradient(145deg,#1A1533,#3D2B6B)",
    accent: "#B797C4",
    icon: (
      <svg width="96" height="96" fill="none" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="44" fill="rgba(76,42,114,0.2)" />
        <circle cx="48" cy="48" r="34" fill="rgba(76,42,114,0.15)" />
        {/* Bus body */}
        <rect x="22" y="38" width="52" height="28" rx="8" fill="white" opacity="0.12" stroke="white" strokeWidth="2"/>
        <rect x="26" y="44" width="10" height="8" rx="2" fill="#B797C4" opacity="0.8"/>
        <rect x="40" y="44" width="10" height="8" rx="2" fill="#B797C4" opacity="0.8"/>
        <rect x="54" y="44" width="10" height="8" rx="2" fill="#B797C4" opacity="0.8"/>
        <circle cx="32" cy="68" r="5" fill="white" opacity="0.9"/>
        <circle cx="64" cy="68" r="5" fill="white" opacity="0.9"/>
        {/* Arrow */}
        <path d="M48 18 L48 30" stroke="#F4B400" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 24 L48 18 L54 24" stroke="#F4B400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: "4 Operators",
    title: "Every Major Bus Line\nin One App",
    sub: "Victory Liner, Genesis, Partas, Solid North — real-time seats, real ₱ fares, one checkout.",
  },
  {
    bg: "linear-gradient(145deg,#1A1533,#2D3A6B)",
    accent: "#F4B400",
    icon: (
      <svg width="96" height="96" fill="none" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="44" fill="rgba(244,180,0,0.08)" />
        {/* Chat bubble */}
        <rect x="18" y="24" width="60" height="40" rx="12" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
        {/* Dots */}
        <circle cx="34" cy="44" r="4" fill="#F4B400"/>
        <circle cx="48" cy="44" r="4" fill="#B797C4"/>
        <circle cx="62" cy="44" r="4" fill="rgba(255,255,255,0.4)"/>
        {/* Tail */}
        <path d="M32 64 L24 76 L44 68" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Sparkle */}
        <path d="M70 20 L72 26 L78 28 L72 30 L70 36 L68 30 L62 28 L68 26 Z" fill="#F4B400" opacity="0.9"/>
      </svg>
    ),
    tag: "Agentic AI",
    title: "AI That Acts —\nNot Just Chats",
    sub: "Tell it your budget and time. It searches every trip, picks the best match, and takes you straight to checkout.",
  },
  {
    bg: "linear-gradient(145deg,#132B1A,#1A4A2A)",
    accent: "#4ADE80",
    icon: (
      <svg width="96" height="96" fill="none" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="44" fill="rgba(46,158,91,0.1)" />
        {/* Phone */}
        <rect x="30" y="18" width="36" height="60" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
        {/* Screen lines */}
        <rect x="36" y="30" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.3)"/>
        <rect x="36" y="37" width="18" height="3" rx="1.5" fill="rgba(255,255,255,0.2)"/>
        {/* QR */}
        <rect x="34" y="46" width="28" height="20" rx="4" fill="rgba(46,158,91,0.25)" stroke="#4ADE80" strokeWidth="1.5"/>
        <rect x="38" y="50" width="6" height="6" rx="1" fill="#4ADE80" opacity="0.8"/>
        <rect x="52" y="50" width="6" height="6" rx="1" fill="#4ADE80" opacity="0.8"/>
        <rect x="38" y="58" width="6" height="6" rx="1" fill="#4ADE80" opacity="0.8"/>
        <rect x="46" y="54" width="4" height="4" rx="1" fill="#4ADE80" opacity="0.6"/>
        <rect x="52" y="58" width="6" height="6" rx="1" fill="#4ADE80" opacity="0.8"/>
        {/* Check circle */}
        <circle cx="68" cy="30" r="10" fill="#2E9E5B"/>
        <path d="M63 30 L66 33 L73 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tag: "Digital-first",
    title: "Board With Your\nPhone — No Print",
    sub: "E-ticket with QR code lives right in the app. Show it at the terminal. Done.",
  },
];

export default function OnboardingPage() {
  const [slide, setSlide] = useState(0);
  const router = useRouter();
  const s = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  const next = () => {
    if (!isLast) setSlide(slide + 1);
    else router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: s.bg, transition: "background 400ms ease" }}>

      {/* Skip */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <div className="w-10" />
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 24 : 8,
                height: 8,
                background: i === slide ? s.accent : "rgba(255,255,255,0.25)",
              }} />
          ))}
        </div>
        <Link href="/login" className="text-sm font-semibold px-2 py-1 rounded-full"
          style={{ color: "rgba(255,255,255,0.5)" }}>
          Skip
        </Link>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center" key={slide}>
        <div className="mb-8 animate-scale-in">{s.icon}</div>

        <span className="inline-block text-[11px] font-bold px-3 py-1.5 rounded-full mb-5"
          style={{ background: `${s.accent}22`, color: s.accent, border: `1px solid ${s.accent}44` }}>
          {s.tag}
        </span>

        <h2 className="text-[26px] font-bold text-white font-poppins leading-tight mb-4 whitespace-pre-line">
          {s.title}
        </h2>
        <p className="text-sm leading-relaxed max-w-[280px]" style={{ color: "rgba(255,255,255,0.55)" }}>
          {s.sub}
        </p>
      </div>

      {/* CTA */}
      <div className="px-6 pb-14 space-y-3">
        <button onClick={next}
          className="w-full h-14 rounded-[14px] font-bold text-[15px] font-poppins active:scale-95 transition-transform shadow-xl flex items-center justify-center gap-2"
          style={{ background: s.accent === "#F4B400" ? "linear-gradient(90deg,#F4B400,#FFCA28)" : `linear-gradient(90deg,${s.accent}cc,${s.accent})`,
                   color: s.accent === "#F4B400" ? "#1A1533" : "white" }}>
          {isLast ? "Get Started" : "Next"}
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" stroke={s.accent === "#F4B400" ? "#1A1533" : "white"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {isLast && (
          <Link href="/login"
            className="block text-center text-sm font-medium py-1"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            Already have an account?{" "}
            <span className="font-bold" style={{ color: s.accent }}>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
