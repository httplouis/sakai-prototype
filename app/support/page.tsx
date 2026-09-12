"use client";
import { useState } from "react";
import Link from "next/link";
import { SUPPORT_CATEGORIES } from "@/lib/mockData";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import SupportIcon from "@/components/SupportIcon";

export default function SupportPage() {
  const [query, setQuery] = useState("");

  const filtered = SUPPORT_CATEGORIES.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-20">
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <TopBar title="Help & Support" back="/home" />
        <div className="px-4 pb-3 pt-1">
          <div className="flex items-center gap-2 h-11 px-3 rounded-xl bg-surface-off border border-gray-200">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="#6B6570" strokeWidth="2"/>
              <path d="M21 21l-3.5-3.5" stroke="#6B6570" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help topics..."
              className="flex-1 text-sm bg-transparent text-text-primary placeholder:text-gray-400 outline-none" />
            {query && (
              <button onClick={() => setQuery("")} className="text-text-secondary">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* AI Chat CTA */}
        <Link href="/ai-assistant"
          className="block rounded-card p-4 tap-card relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#1A1533 0%,#3D2B6B 100%)" }}>
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-full"
            style={{ background: "radial-gradient(circle,#F4B400,transparent)", transform: "translate(20%,-20%)" }} />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(244,180,0,0.15)", border: "1px solid rgba(244,180,0,0.3)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.477 2 2 6.277 2 11.5c0 2.304.87 4.408 2.3 6.02L3 22l4.8-1.56A10.14 10.14 0 0012 21c5.523 0 10-4.277 10-9.5S17.523 2 12 2z" fill="#F4B400"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold font-poppins">Chat with Us</p>
              <p className="text-[#B797C4] text-xs">Get instant help from our AI assistant</p>
            </div>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" stroke="#F4B400" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </Link>

        {/* Categories */}
        <div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 px-1">
            Browse Topics
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-text-secondary text-sm">No topics match "{query}"</p>
              <button onClick={() => setQuery("")} className="text-violet-primary text-sm font-semibold mt-2">
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((cat) => (
                <Link key={cat.id} href={`/support/${cat.id}`}
                  className="flex items-center gap-3 bg-white rounded-card shadow-card px-4 py-3.5 tap-card">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#F0EAF7" }}>
                    <SupportIcon id={cat.id} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">{cat.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{cat.description}</p>
                  </div>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6" stroke="#B797C4" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-card shadow-card p-4">
          <p className="text-sm font-bold font-poppins text-text-primary mb-3">Quick Links</p>
          <div className="space-y-2">
            {[
              { label: "Track my refund", href: "/my-bookings" },
              { label: "View my e-ticket", href: "/my-bookings" },
              { label: "Cancel a booking", href: "/my-bookings" },
              { label: "Report a problem", href: "/ai-assistant" },
            ].map(({ label, href }) => (
              <Link key={label} href={href}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-text-primary">{label}</span>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" stroke="#B797C4" strokeWidth="2" strokeLinecap="round"/>
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
