"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/BookingContext";
import BottomNav from "@/components/BottomNav";

// ── Monochrome SVG icons for menu items ──────────────────────────────────────
const MenuIcons: Record<string, React.ReactNode> = {
  "Saved Passengers": (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <circle cx="9" cy="7" r="4" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "Payment Methods": (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M2 10h20" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="5" y="14" width="4" height="2" rx="1" fill="#4C2A72"/>
    </svg>
  ),
  "Notification Settings": (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
        stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "Language": (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M12 3c-2 4-2 14 0 18M3 12h18" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5.6 7.5c1.8.8 3.8 1.2 6.4 1.2s4.6-.4 6.4-1.2M5.6 16.5c1.8-.8 3.8-1.2 6.4-1.2s4.6.4 6.4 1.2"
        stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  "Help & Support": (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="0.8" fill="#4C2A72"/>
    </svg>
  ),
  "About SakAi": (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M12 8v1M12 11v5" stroke="#4C2A72" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { label: "Saved Passengers", sub: "Quick-fill for future bookings", href: "/profile/saved-passengers" },
      { label: "Payment Methods",  sub: "Cards, GCash, Maya",             href: "/profile/payment-methods" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Notification Settings", sub: "Reminders, promos, AI suggestions", href: "/profile/notifications" },
      { label: "Language",              sub: "English / Filipino",                 href: "/profile/language" },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Help & Support", sub: "FAQs, chat with us",              href: "/support" },
      { label: "About SakAi",    sub: "Version 1.0.0 · Build 20260912",  href: "/support" },
    ],
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, bookings, logout, showToast } = useApp();
  const [showLogout, setShowLogout] = useState(false);

  const upcomingCount  = bookings.filter((b) => b.status === "upcoming").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const firstName = user.name.split(" ")[0];
  const initials  = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    setShowLogout(false);
    showToast("Logged out successfully.");
    router.push("/splash");
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-24">

      {/* Hero */}
      <div className="relative px-5 pt-12 pb-10"
        style={{ background: "linear-gradient(150deg,#0F0C22,#1A1533 50%,#3D2B6B)" }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(183,151,196,0.12),transparent 70%)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-surface-off rounded-t-[20px]" />

        <div className="flex items-center gap-4 relative">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-poppins text-white shadow-lg shrink-0"
            style={{ background: "linear-gradient(135deg,#4C2A72,#B797C4)" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white font-poppins leading-tight">{user.name}</h2>
            <p className="text-[#B797C4] text-sm mt-0.5 truncate">{user.email}</p>
            <p className="text-[#6E5E82] text-xs mt-0.5">{user.phone}</p>
          </div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 shrink-0"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-5 relative">
          {[
            { label: "Upcoming",     value: upcomingCount  },
            { label: "Completed",    value: completedCount },
            { label: "Since",        value: "2026"         },
          ].map(({ label, value }) => (
            <div key={label} className="flex-1 rounded-xl p-2.5 text-center"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-lg font-bold text-white font-poppins">{value}</p>
              <p className="text-[10px] text-[#8A7A9E] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 pt-4 space-y-4">
        {MENU_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2 px-1">
              {section.title}
            </p>
            <div className="bg-white rounded-card shadow-card overflow-hidden">
              {section.items.map((item, i) => (
                <Link key={item.label} href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 tap-card ${i < section.items.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#F0EAF7" }}>
                    {MenuIcons[item.label]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{item.sub}</p>
                  </div>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6" stroke="#C4A8D8" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Logout button */}
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <button onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 tap-card">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#FFF0F0" }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#D64545" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M16 17l5-5-5-5M21 12H9" stroke="#D64545" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-danger">Log Out</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-text-secondary pb-2">
          SakAi v1.0.0 · Made with ❤️ in the Philippines
        </p>
      </div>

      <BottomNav />

      {/* ── Logout modal — rendered at root level, above nav ─────────── */}
      {showLogout && (
        <div
          className="fixed inset-0 z-[200] flex flex-col justify-end items-center"
          onClick={() => setShowLogout(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[430px] bg-white rounded-t-[28px] px-6 pt-6 pb-10 animate-slide-up"
            onClick={(e) => e.stopPropagation()}>
            {/* Drag handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#D64545" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 17l5-5-5-5M21 12H9" stroke="#D64545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h3 className="text-[20px] font-bold font-poppins text-text-primary text-center mb-2">
              Log out of SakAi?
            </h3>
            <p className="text-sm text-text-secondary text-center mb-8 leading-relaxed">
              You&apos;ll need to sign in again to view your bookings and use the AI assistant.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 h-13 py-3.5 rounded-[14px] border-2 border-gray-200 text-text-primary font-semibold text-sm active:scale-95 transition-transform">
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 h-13 py-3.5 rounded-[14px] text-white font-bold text-sm active:scale-95 transition-transform"
                style={{ background: "#D64545" }}>
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
