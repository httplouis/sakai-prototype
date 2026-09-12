"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/BookingContext";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "SKI-XXXXXXXX";
  const { booking, clearBooking } = useApp();
  const trip = booking.selectedTrip;
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-surface-off flex flex-col items-center justify-between px-5 py-10">

      {/* ── Success animation ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full">

        {/* Circle + checkmark */}
        <div className="relative mb-8">
          {drawn && (
            <>
              <div className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: "#2E9E5B", transform: "scale(1.4)" }} />
              <div className="absolute inset-0 rounded-full opacity-10"
                style={{ background: "#2E9E5B", transform: "scale(1.6)" }} />
            </>
          )}
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 ${drawn ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
            style={{ background: "linear-gradient(135deg, #D4EDDA, #A8D5B5)" }}>
            <svg width="56" height="56" fill="none" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="26" stroke="#2E9E5B" strokeWidth="2.5" fill="white"/>
              {drawn && (
                <path
                  className="check-path"
                  d="M16 28 L24 36 L40 20"
                  stroke="#2E9E5B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"
                />
              )}
            </svg>
          </div>

          {/* Confetti dots */}
          {drawn && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div key={i}
                  className="absolute w-2 h-2 rounded-full animate-bounce-in"
                  style={{
                    background: ["#F4B400","#4C2A72","#2E9E5B","#B797C4","#F4B400","#4C2A72","#2E9E5B","#B797C4"][i],
                    top:  `${[10,5,15,20,70,75,80,60][i]}%`,
                    left: `${[10,50,80,30,20,60,85,5][i]}%`,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </div>{/* end .relative mb-8 */}

        <h1 className="text-2xl font-bold font-poppins text-text-primary mb-2">Booking Confirmed!</h1>
        <p className="text-text-secondary text-sm mb-1">Your trip has been booked successfully.</p>
        <p className="text-xs text-text-secondary mb-6">A confirmation has been sent to your email.</p>

        {/* Booking reference card */}
        <div className="w-full bg-white rounded-card shadow-card p-5 text-left mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wide">Reference No.</span>
            <span className="text-sm font-bold text-violet-primary font-mono">{ref}</span>
          </div>

          {trip && (
            <>
              <div className="border-t border-dashed border-gray-200 pt-3 mt-1">
                <p className="text-xs text-text-secondary mb-1">Route</p>
                <p className="text-base font-semibold text-text-primary">
                  {trip.from.split("(")[0].trim()} → {trip.to}
                </p>
              </div>
              <div className="flex gap-4 mt-3">
                <div>
                  <p className="text-xs text-text-secondary">Departure</p>
                  <p className="text-sm font-bold text-text-primary">{trip.departure}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Date</p>
                  <p className="text-sm font-bold text-text-primary">{trip.date}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Seats</p>
                  <p className="text-sm font-bold text-text-primary">
                    {booking.selectedSeats.length > 0 ? booking.selectedSeats.join(", ") : "—"}
                  </p>
                </div>
              </div>
              <div className="border-t border-dashed border-gray-200 mt-3 pt-3 flex justify-between items-center">
                <span className="text-sm text-text-secondary">Total Paid</span>
                <span className="text-lg font-bold text-violet-primary font-poppins">
                  ₱{(booking.totalFare > 0 ? booking.totalFare : trip.fare).toLocaleString()}
                </span>
              </div>
            </>
          )}

          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs font-semibold text-success">Payment Confirmed</span>
          </div>
        </div>

        {/* Boarding tip */}
        <div className="w-full bg-purple-light rounded-xl p-3 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <rect x="5" y="2" width="14" height="20" rx="3" stroke="#4C2A72" strokeWidth="1.8"/>
              <path d="M9 6h6M9 10h6M9 14h4" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <p className="text-xs font-semibold text-violet-primary">Boarding tip</p>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Show your QR code at the terminal counter. Arrive at least 30 minutes before departure. Save your e-ticket offline just in case.
          </p>
        </div>

      </div>{/* end .flex-1 */}

      {/* ── CTAs ──────────────────────────────────────────────────── */}
      <div className="w-full space-y-3 pt-6">
        <Link href={`/e-ticket/${ref}`}
          className="block w-full h-14 rounded-btn text-white font-bold font-poppins text-center leading-[56px] active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
          View E-Ticket
        </Link>
        <Link href="/home" onClick={() => clearBooking()}
          className="block w-full h-12 rounded-btn text-violet-primary font-semibold text-center leading-[48px] text-sm border border-violet-primary/30"
          style={{ background: "#F5EEFF" }}>
          Back to Home
        </Link>
      </div>

    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
