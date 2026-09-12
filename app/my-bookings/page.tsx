"use client";
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/BookingContext";
import BottomNav from "@/components/BottomNav";
import OperatorLogo from "@/components/OperatorLogo";
import type { Booking } from "@/lib/mockData";

const TABS = ["upcoming", "completed", "cancelled"] as const;
type Tab = typeof TABS[number];

const STATUS_STYLES: Record<Tab, { bg: string; text: string; label: string }> = {
  upcoming:  { bg: "#E8F5E9", text: "#2E9E5B", label: "Upcoming" },
  completed: { bg: "#E8F0FE", text: "#1B3A8A", label: "Completed" },
  cancelled: { bg: "#FFF0F0", text: "#D64545", label: "Cancelled" },
};

function BookingCard({ booking }: { booking: Booking }) {
  const st = STATUS_STYLES[booking.status];
  return (
    <Link href={`/booking-detail/${booking.id}`}
      className="block bg-white rounded-card shadow-card p-4 tap-card">
      <div className="flex items-start gap-3">
        <OperatorLogo operatorId={booking.trip.operatorId} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: st.bg, color: st.text }}>
              {st.label}
            </span>
            <span className="text-[11px] text-text-secondary font-mono">{booking.referenceNumber}</span>
          </div>
          <p className="text-sm font-semibold text-text-primary">
            {booking.trip.from.split("(")[0].trim()} → {booking.trip.to}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            {booking.trip.date} · {booking.trip.departure} · {booking.trip.operator.name}
          </p>
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex gap-1">
              {booking.seats.map((s) => (
                <span key={s} className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ background: "#E9D0F3", color: "#4C2A72" }}>{s}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-violet-primary">₱{booking.totalFare.toLocaleString()}</span>
              {booking.status === "upcoming" && (
                <Link href={`/e-ticket/${booking.referenceNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full active:scale-95 transition-transform"
                  style={{ background: "linear-gradient(90deg,#401551,#4C2A72)", color: "white" }}>
                  E-Ticket
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyTab({ status }: { status: Tab }) {
  const ICONS: Record<Tab, React.ReactNode> = {
    upcoming: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="3" stroke="#4C2A72" strokeWidth="1.8"/>
        <path d="M8 2v4M16 2v4M3 10h18" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M8 15h4M8 18h2" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    completed: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="#4C2A72" strokeWidth="1.8"/>
        <path d="M8 12l3 3 5-5" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    cancelled: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="#4C2A72" strokeWidth="1.8"/>
        <path d="M15 9l-6 6M9 9l6 6" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  };
  const msgs: Record<Tab, { head: string; sub: string }> = {
    upcoming:  { head: "No upcoming trips",     sub: "Book your next trip and it'll appear here." },
    completed: { head: "No completed trips yet", sub: "Your travel history will show up here." },
    cancelled: { head: "No cancelled trips",     sub: "Great — nothing cancelled so far!" },
  };
  const m = msgs[status];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-8 animate-fade-in">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ background: "#F0EAF7" }}>
        {ICONS[status]}
      </div>
      <h3 className="text-base font-bold font-poppins text-text-primary mb-1">{m.head}</h3>
      <p className="text-sm text-text-secondary mb-6">{m.sub}</p>
      {status === "upcoming" && (
        <Link href="/search"
          className="h-11 px-6 rounded-btn text-white font-semibold font-poppins flex items-center active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
          Book a Trip
        </Link>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  const { bookings } = useApp();
  const [tab, setTab] = useState<Tab>("upcoming");

  const filtered = bookings.filter((b) => b.status === tab);

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-20">
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="px-4 pt-12 pb-0"
          style={{ background: "linear-gradient(155deg,#0F0C22,#1A1533,#3D2B6B)" }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[22px] font-bold text-white font-poppins">My Bookings</h1>
            <Link href="/search"
              className="text-[11px] font-bold px-3 py-1.5 rounded-full active:scale-95"
              style={{ background: "rgba(244,180,0,0.18)", color: "#F4B400", border: "1px solid rgba(244,180,0,0.3)" }}>
              + New Trip
            </Link>
          </div>
          <div className="flex border-b border-white/10">
            {TABS.map((t) => {
              const count = bookings.filter((b) => b.status === t).length;
              return (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-3 text-[13px] font-semibold capitalize transition-all relative ${tab === t ? "text-white" : "text-white/40"}`}>
                  {t}
                  {count > 0 && (
                    <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === t ? "bg-white/20 text-white" : "bg-white/10 text-white/40"}`}>
                      {count}
                    </span>
                  )}
                  {tab === t && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3 animate-fade-in" key={tab}>
        {filtered.length === 0
          ? <EmptyTab status={tab} />
          : filtered.map((b) => <BookingCard key={b.id} booking={b} />)
        }
      </div>

      <BottomNav />
    </div>
  );
}
