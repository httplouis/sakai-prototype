"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SplashPage() {
  const [logoIn, setLogoIn] = useState(false);
  const [cardIn, setCardIn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLogoIn(true), 150);
    const t2 = setTimeout(() => setCardIn(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(175deg,#0F0C22 0%,#1A1533 55%,#2D1B56 100%)" }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 55% at 50% 40%, rgba(76,42,114,0.45) 0%, transparent 70%)" }} />

      {/* ── TOP: logo ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            opacity:    logoIn ? 1 : 0,
            transform:  logoIn ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}>
          <div className="relative w-28 h-28 mb-5">
            <Image src="/images/sakai logo.png" alt="SakAi" fill
              className="object-contain rounded-[24px]" priority />
            <div className="absolute inset-0 -z-10 blur-3xl opacity-50"
              style={{ background: "radial-gradient(circle,#6B3FA0,transparent)", transform: "scale(1.8)" }} />
          </div>
          <h1 className="text-[52px] font-bold text-white font-poppins tracking-tight leading-none">
            Sak<span style={{ color: "#F4B400" }}>Ai</span>
          </h1>
        </div>
      </div>

      {/* ── BOTTOM: white card slides up ──────────────────────────────── */}
      <div
        className="relative z-20"
        style={{
          transform:  cardIn ? "translateY(0)" : "translateY(110%)",
          opacity:    cardIn ? 1 : 0,
          transition: "transform 680ms cubic-bezier(0.32,0.72,0,1), opacity 350ms ease-out",
        }}>

        {/* Smooth wave — transparent background, one clean S-curve */}
        <svg
          viewBox="0 0 430 44"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 44, marginBottom: -1 }}>
          <path
            d="M0 44 L0 28 C215 -12 215 64 430 20 L430 44 Z"
            fill="#F7F5FA"
          />
        </svg>

        {/* White section */}
        <div className="bg-[#F7F5FA] px-6 pt-1 pb-12">
          <p className="text-center text-[13px] text-text-secondary mb-7">
            Your AI-powered intercity travel companion
          </p>

          <div className="space-y-3">
            <Link
              href="/onboarding"
              className="flex items-center justify-center gap-2 w-full h-14 rounded-[14px] text-[15px] font-bold font-poppins active:scale-[0.97] transition-transform"
              style={{ background: "linear-gradient(90deg,#F4B400,#FFCA28)", color: "#1A1533" }}>
              Get Started
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="#1A1533" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <Link
              href="/login"
              className="flex items-center justify-center w-full h-14 rounded-[14px] text-[15px] font-semibold active:scale-[0.97] transition-transform border-2"
              style={{ color: "#4C2A72", borderColor: "rgba(76,42,114,0.2)", background: "white" }}>
              Log In
            </Link>
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-5">
            By continuing you agree to our{" "}
            <span className="text-gray-500 underline">Terms &amp; Privacy Policy</span>
          </p>
        </div>
      </div>

    </div>
  );
}
