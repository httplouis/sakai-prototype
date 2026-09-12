"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { TRIPS, type Trip } from "@/lib/mockData";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";
import OperatorLogo from "@/components/OperatorLogo";
import BottomNav from "@/components/BottomNav";

// ─── Inner component — safe to call useSearchParams here inside Suspense ─────
function SearchInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSelectedTrip } = useApp();

  const fromQ = searchParams.get("from") || "Manila (Cubao)";
  const toQ   = searchParams.get("to")   || "Baguio City";
  const dateQ = searchParams.get("date") || "2026-09-13";

  const [sortBy, setSortBy]         = useState<"price" | "time" | "rating">("price");
  const [filterAircon, setFilterAircon] = useState(false);
  const [filterWifi, setFilterWifi]     = useState(false);
  const [maxPrice, setMaxPrice]         = useState(2000);
  const [showSort, setShowSort]         = useState(false);
  const [showFilter, setShowFilter]     = useState(false);

  // Match from / to loosely
  const fromKey = fromQ.toLowerCase().split("(")[0].trim();
  const toKey   = toQ.toLowerCase().split(" ")[0];

  const allTrips = TRIPS.filter(
    (t) =>
      t.from.toLowerCase().includes(fromKey) &&
      t.to.toLowerCase().includes(toKey)
  );

  const filtered = allTrips
    .filter(
      (t) =>
        (!filterAircon || t.aircon) &&
        (!filterWifi   || t.wifi)   &&
        t.fare <= maxPrice
    )
    .sort((a, b) =>
      sortBy === "price"  ? a.fare - b.fare :
      sortBy === "time"   ? a.departure.localeCompare(b.departure) :
      b.operator.rating - a.operator.rating
    );

  const handleSelect = (trip: Trip) => {
    setSelectedTrip(trip);
    router.push(`/trip/${trip.id}`);
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-20">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <TopBar
          title={`${fromQ.split("(")[0].trim()} → ${toQ.split(" ")[0]}`}
          back="/home"
          right={<span className="text-[11px] text-text-secondary font-medium">{dateQ}</span>}
        />
        {/* Count + controls bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <p className="text-xs text-text-secondary font-medium">
            <span className="text-violet-primary font-bold">{filtered.length}</span> trip{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowFilter(true); setShowSort(false); }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all active:scale-95 ${filterAircon || filterWifi || maxPrice < 2000 ? "border-violet-primary bg-purple-light text-violet-primary" : "border-gray-200 bg-surface-off text-text-primary"}`}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Filter
              {(filterAircon || filterWifi || maxPrice < 2000) && <span className="w-1.5 h-1.5 rounded-full bg-violet-primary" />}
            </button>
            <button
              onClick={() => { setShowSort(true); setShowFilter(false); }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 bg-surface-off text-text-primary active:scale-95 transition-all">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path d="M3 8l4-4 4 4M7 4v16M21 16l-4 4-4-4M17 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {sortBy === "price" ? "Price" : sortBy === "time" ? "Time" : "Rating"}
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 px-8 text-center py-20 animate-fade-in">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5" style={{ background: "#E9D0F3" }}>
            <svg width="44" height="44" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="#4C2A72" strokeWidth="2"/>
              <path d="M21 21l-3.5-3.5" stroke="#4C2A72" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 11h6" stroke="#B797C4" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold font-poppins text-text-primary mb-2">No trips found</h3>
          <p className="text-sm text-text-secondary mb-6">Try adjusting your filters — or let AI find alternatives.</p>
          <Link href="/ai-assistant"
            className="h-12 px-6 rounded-btn text-white font-semibold font-poppins flex items-center gap-2 active:scale-95 transition-transform mb-3"
            style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.477 2 2 6.277 2 11.5c0 2.304.87 4.408 2.3 6.02L3 22l4.8-1.56A10.14 10.14 0 0012 21c5.523 0 10-4.277 10-9.5S17.523 2 12 2z"/>
            </svg>
            Ask AI Assistant
          </Link>
          <button onClick={() => { setFilterAircon(false); setFilterWifi(false); setMaxPrice(2000); }}
            className="text-sm font-semibold text-violet-primary">
            Clear Filters
          </button>
        </div>
      )}

      {/* Trip list */}
      {filtered.length > 0 && (
        <div className="px-4 pt-3 pb-4 space-y-3">
          {filtered.map((trip, i) => (
            <button key={trip.id} onClick={() => handleSelect(trip)}
              className="w-full text-left bg-white rounded-card shadow-card p-4 tap-card animate-fade-in block"
              style={{ animationDelay: `${i * 50}ms` }}>

              {/* Best match badge */}
              {trip.isBestMatch && (
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "#FEF9E7", color: "#B8860B", border: "1px solid #F4B40040" }}>
                    BEST MATCH
                  </span>
                  <span className="text-[10px] text-text-secondary">AI recommended</span>
                </div>
              )}

              <div className="flex items-start gap-3">
                <OperatorLogo operatorId={trip.operatorId} size="md" />
                <div className="flex-1 min-w-0">
                  {/* Operator + rating */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-text-secondary">{trip.operator.name}</span>
                    <div className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#F4B400">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-[11px] font-semibold text-text-secondary">{trip.operator.rating}</span>
                    </div>
                  </div>

                  {/* Times */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-[17px] font-bold font-poppins text-text-primary">{trip.departure}</span>
                    <div className="flex-1 flex items-center gap-1">
                      <div className="flex-1 h-px bg-purple-secondary/25" />
                      <span className="text-[10px] text-text-secondary whitespace-nowrap px-1">{trip.duration}</span>
                      <div className="flex-1 h-px bg-purple-secondary/25" />
                    </div>
                    <span className="text-[17px] font-bold font-poppins text-text-primary">{trip.arrival}</span>
                  </div>

                  {/* Tags + price */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-off text-text-secondary border border-gray-100">{trip.busType}</span>
                      {trip.aircon && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">❄ Aircon</span>}
                      {trip.wifi  && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">📶 Wi-Fi</span>}
                    </div>
                    <div className="text-right ml-2 shrink-0">
                      <p className="text-[18px] font-bold text-violet-primary font-poppins leading-none">₱{trip.fare}</p>
                      <p className={`text-[10px] mt-0.5 font-medium ${trip.seatsLeft < 10 ? "text-danger" : "text-text-secondary"}`}>
                        {trip.seatsLeft < 10 ? `⚠ ${trip.seatsLeft} left` : `${trip.seatsLeft} seats`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* AI promo */}
          <Link href="/ai-assistant"
            className="flex items-center gap-3 rounded-card p-4 tap-card"
            style={{ background: "linear-gradient(135deg,#1A1533,#3D2B6B)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(244,180,0,0.15)", border: "1px solid rgba(244,180,0,0.3)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#F4B400">
                <path d="M12 2C6.477 2 2 6.277 2 11.5c0 2.304.87 4.408 2.3 6.02L3 22l4.8-1.56A10.14 10.14 0 0012 21c5.523 0 10-4.277 10-9.5S17.523 2 12 2z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Not sure which to pick?</p>
              <p className="text-[#B797C4] text-xs mt-0.5">Ask AI to compare and recommend the best one for you.</p>
            </div>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" stroke="#F4B400" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>
      )}

      {/* ── Sort sheet ─────────────────────────────────────────────────── */}
      {showSort && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowSort(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-t-[24px] px-5 pt-5 pb-10 animate-slide-up max-w-[430px] w-full mx-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold font-poppins text-text-primary mb-4">Sort by</h3>
            {(["price", "time", "rating"] as const).map((opt) => (
              <button key={opt} onClick={() => { setSortBy(opt); setShowSort(false); }}
                className={`w-full flex items-center justify-between h-13 px-4 py-3 rounded-xl mb-2 transition-all tap-card ${sortBy === opt ? "bg-purple-light border border-violet-primary/30" : "bg-surface-off border border-transparent"}`}>
                <span className="text-sm font-medium text-text-primary">
                  {opt === "price" ? "Lowest Price First" : opt === "time" ? "Earliest Departure" : "Highest Rating"}
                </span>
                {sortBy === opt && (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#4C2A72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter sheet ───────────────────────────────────────────────── */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowFilter(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-t-[24px] px-5 pt-5 pb-10 animate-slide-up max-w-[430px] w-full mx-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold font-poppins text-text-primary mb-4">Filter Trips</h3>
            <div className="space-y-5">
              {/* Price range */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Max Price</span>
                  <span className="text-sm font-bold text-violet-primary">₱{maxPrice.toLocaleString()}</span>
                </div>
                <input type="range" min={500} max={2000} step={50} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-violet-primary" />
                <div className="flex justify-between text-xs text-text-secondary mt-1">
                  <span>₱500</span><span>₱2,000</span>
                </div>
              </div>
              {/* Amenity toggles */}
              <div>
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide block mb-2">Amenities</span>
                <div className="flex gap-3">
                  <button onClick={() => setFilterAircon(!filterAircon)}
                    className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-all border ${filterAircon ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-surface-off border-gray-200 text-text-secondary"}`}>
                    ❄ Aircon Only
                  </button>
                  <button onClick={() => setFilterWifi(!filterWifi)}
                    className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-all border ${filterWifi ? "bg-green-50 border-green-200 text-green-700" : "bg-surface-off border-gray-200 text-text-secondary"}`}>
                    📶 Wi-Fi Only
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setFilterAircon(false); setFilterWifi(false); setMaxPrice(2000); }}
                className="flex-1 h-12 rounded-btn border border-gray-200 text-text-secondary font-semibold text-sm active:scale-95 transition-transform">
                Clear
              </button>
              <button onClick={() => setShowFilter(false)}
                className="flex-1 h-12 rounded-btn text-white font-bold active:scale-95 transition-transform"
                style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
                Show {filtered.length} trips
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

// ─── Page export — wraps inner in Suspense for useSearchParams ────────────────
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-off flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-violet-primary border-t-transparent animate-spin" />
          <p className="text-sm text-text-secondary">Finding trips...</p>
        </div>
      </div>
    }>
      <SearchInner />
    </Suspense>
  );
}
