"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/BookingContext";
import BottomNav from "@/components/BottomNav";
import LocationInput from "@/components/LocationInput";

// ── Monochrome SVG icon components ──────────────────────────────────────────
function IconBookTrip() {
  return (
    <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
      <path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
        stroke="#4C2A72" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M16 2v4M8 2v4M3 10h18" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 15l2 2 4-4" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconBookings() {
  return (
    <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
        stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M9 12h6M9 16h4" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconETicket() {
  return (
    <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M3 10h18" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M7 14h4M15 14h2" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="7" cy="8" r="1" fill="#4C2A72"/>
    </svg>
  );
}
function IconSupport() {
  return (
    <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="0.8" fill="#4C2A72"/>
    </svg>
  );
}
// Popular route icon
function IconBus() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="13" rx="3" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M2 11h20" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="7" cy="19" r="1.5" stroke="#4C2A72" strokeWidth="1.5"/>
      <circle cx="17" cy="19" r="1.5" stroke="#4C2A72" strokeWidth="1.5"/>
      <path d="M7 5V3M17 5V3" stroke="#4C2A72" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const QUICK_ACTIONS = [
  { Icon: IconBookTrip, label: "Book Trip",  href: "/search"      },
  { Icon: IconBookings, label: "Bookings",   href: "/my-bookings" },
  { Icon: IconETicket,  label: "E-Ticket",   href: "/my-bookings" },
  { Icon: IconSupport,  label: "Support",    href: "/support"     },
];

const POPULAR = [
  { from: "Manila (Cubao)", to: "Baguio City", duration: "5h 45m", fromPrice: 760 },
  { from: "Manila (Cubao)", to: "Vigan City",  duration: "10h",    fromPrice: 980 },
  { from: "Manila (Pasay)", to: "Baguio City", duration: "6h",     fromPrice: 860 },
];

export default function HomePage() {
  const { user, bookings } = useApp();
  const router = useRouter();
  const [from, setFrom]             = useState("Manila (Cubao)");
  const [to, setTo]                 = useState("");
  const [date, setDate]             = useState("");
  const [passengers, setPassengers] = useState(1);

  const upcomingBooking = bookings.find((b) => b.status === "upcoming");
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user.name.split(" ")[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from,
      to: to || "Baguio City",
      date: date || "2026-09-13",
      passengers: String(passengers),
    });
    router.push(`/search?${params}`);
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-24">

      {/* ── Hero header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(155deg, #0F0C22 0%, #1A1533 40%, #3D2B6B 100%)" }}>
        <div className="absolute top-0 right-0 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(183,151,196,0.15),transparent 70%)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-surface-off rounded-t-[24px]" />

        {/* Top row */}
        <div className="flex items-center justify-between px-5 pt-12 pb-2">
          <div>
            <p className="text-[#8A7A9E] text-xs font-medium">{greeting} 👋</p>
            <h1 className="text-white text-[22px] font-bold font-poppins mt-0.5 leading-tight">{firstName}!</h1>
          </div>
          <Link href="/profile"
            className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[15px] shadow-lg"
            style={{ background: "linear-gradient(135deg,#4C2A72,#B797C4)", color: "white" }}>
            {firstName[0]}
          </Link>
        </div>

        {/* Search card */}
        <form onSubmit={handleSearch} className="mx-4 mb-8 bg-white rounded-[20px] shadow-card-lg p-4">
          <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-3">
            Where are you headed?
          </p>

          {/* From */}
          <LocationInput
            value={from}
            onChange={setFrom}
            placeholder="From — e.g. Manila Cubao"
            label="From"
            icon={
              <div className="w-2 h-2 rounded-full bg-violet-primary shrink-0" />
            }
          />

          {/* Connector line */}
          <div className="flex items-center pl-[18px] py-1">
            <div className="w-px h-3 bg-purple-secondary/30" />
          </div>

          {/* To */}
          <LocationInput
            value={to}
            onChange={setTo}
            placeholder="To — e.g. Baguio City"
            label="To"
            icon={
              <svg width="12" height="14" fill="none" viewBox="0 0 12 16">
                <path d="M6 1v14M2 11l4 4 4-4" stroke="#F4B400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />

          {/* Date + pax */}
          <div className="flex gap-2 mt-3 mb-3">
            <div className="flex-1 flex items-center gap-2 h-11 px-3 rounded-xl bg-surface-off border border-gray-100">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke="#6B6570" strokeWidth="1.8"/>
                <path d="M8 2v4M16 2v4M3 10h18" stroke="#6B6570" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="flex-1 text-[13px] bg-transparent text-text-primary outline-none min-w-0" />
            </div>
            <div className="flex items-center gap-0.5 h-11 px-2 rounded-xl bg-surface-off border border-gray-100">
              <button type="button" onClick={() => setPassengers(Math.max(1, passengers - 1))}
                className="w-7 h-7 flex items-center justify-center text-violet-primary font-bold text-xl leading-none">−</button>
              <div className="flex items-center gap-1 px-1">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" stroke="#6B6570" strokeWidth="1.8"/>
                  <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#6B6570" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span className="text-sm font-bold text-text-primary w-3 text-center">{passengers}</span>
              </div>
              <button type="button" onClick={() => setPassengers(Math.min(6, passengers + 1))}
                className="w-7 h-7 flex items-center justify-center text-violet-primary font-bold text-xl leading-none">+</button>
            </div>
          </div>

          <button type="submit"
            className="w-full h-12 rounded-[12px] font-bold text-white font-poppins text-[14px] active:scale-95 transition-transform"
            style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
            Search Trips
          </button>
        </form>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="px-4 pt-3 space-y-5">

        {/* Upcoming trip banner */}
        {upcomingBooking && (
          <Link href={`/booking-detail/${upcomingBooking.id}`}
            className="flex items-center gap-3 bg-white rounded-[16px] shadow-card p-4 tap-card border-l-4"
            style={{ borderLeftColor: "#2E9E5B" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#F0EAF7" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke="#4C2A72" strokeWidth="2"/>
                <path d="M8 2v4M16 2v4M3 10h18" stroke="#4C2A72" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-bold text-success bg-[#E8F5E9] px-2 py-0.5 rounded-full">Upcoming</span>
                <span className="text-[10px] text-text-secondary">{upcomingBooking.trip.date}</span>
              </div>
              <p className="text-sm font-bold text-text-primary truncate">
                {upcomingBooking.trip.from.split("(")[0].trim()} → {upcomingBooking.trip.to}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {upcomingBooking.trip.departure} · {upcomingBooking.trip.operator.name}
              </p>
            </div>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" stroke="#B797C4" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>
        )}

        {/* Quick Actions — monochrome icons */}
        <div>
          <h2 className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-3 px-0.5">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-2.5">
            {QUICK_ACTIONS.map(({ Icon, label, href }) => (
              <Link key={label} href={href} className="flex flex-col items-center gap-1.5 tap-card">
                <div className="w-[58px] h-[58px] rounded-[18px] flex items-center justify-center shadow-sm"
                  style={{ background: "#F0EAF7" }}>
                  <Icon />
                </div>
                <span className="text-[11px] font-semibold text-text-secondary text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Banner */}
        <Link href="/ai-assistant"
          className="flex items-center gap-3 rounded-[18px] p-4 tap-card relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0F0C22,#1A1533 40%,#3D2B6B)" }}>
          <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(244,180,0,0.12),transparent 70%)", transform: "translate(20%,-20%)" }} />
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: "rgba(244,180,0,0.15)", border: "1.5px solid rgba(244,180,0,0.3)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#F4B400">
              <path d="M12 2C6.477 2 2 6.277 2 11.5c0 2.304.87 4.408 2.3 6.02L3 22l4.8-1.56A10.14 10.14 0 0012 21c5.523 0 10-4.277 10-9.5S17.523 2 12 2z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-bold font-poppins">Try SakAi AI Assistant</p>
            <p className="text-[#8A7A9E] text-xs mt-0.5">Tell me where — I&apos;ll find the perfect trip.</p>
          </div>
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(244,180,0,0.15)", border: "1px solid rgba(244,180,0,0.3)" }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" stroke="#F4B400" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        </Link>

        {/* Popular Routes — monochrome bus icon */}
        <div>
          <h2 className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-3 px-0.5">Popular Routes</h2>
          <div className="space-y-2">
            {POPULAR.map((r) => (
              <Link key={r.to}
                href={`/search?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}&date=2026-09-13&passengers=1`}
                className="flex items-center justify-between bg-white rounded-[16px] px-4 py-3.5 shadow-card tap-card">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#F0EAF7" }}>
                    <IconBus />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      {r.from.split("(")[0].trim()} → {r.to.split(" ")[0]}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">{r.duration} · From ₱{r.fromPrice}</p>
                  </div>
                </div>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" stroke="#C4A8D8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
