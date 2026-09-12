"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";
import OperatorLogo from "@/components/OperatorLogo";

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { bookings, cancelBooking, showToast } = useApp();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const booking = bookings.find((b) => b.id === id);
  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <p className="text-text-secondary">Booking not found.</p>
      <Link href="/my-bookings" className="text-violet-primary font-semibold text-sm">← My Bookings</Link>
    </div>
  );

  const { trip, seats, passengers, totalFare, status, referenceNumber, paymentMethod, bookingDate } = booking;

  const STATUS_CONFIG = {
    upcoming:  { bg: "#E8F5E9", text: "#2E9E5B", label: "Upcoming" },
    completed: { bg: "#E8F0FE", text: "#1B3A8A", label: "Completed" },
    cancelled: { bg: "#FFF0F0", text: "#D64545", label: "Cancelled" },
  };
  const sc = STATUS_CONFIG[status];

  const handleCancel = () => {
    cancelBooking(id);
    setShowCancelModal(false);
    showToast("Booking cancelled. Refund processing...");
    router.push("/my-bookings");
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-28">
      <TopBar title="Booking Detail" back="/my-bookings" />

      <div className="px-4 pt-4 space-y-3">
        {/* Status + ref */}
        <div className="bg-white rounded-card shadow-card p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: sc.bg, color: sc.text }}>
              {sc.label}
            </span>
            <p className="text-xs text-text-secondary mt-1.5">Booked on {bookingDate}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-text-secondary">Reference</p>
            <p className="text-xs font-bold font-mono text-text-primary">{referenceNumber}</p>
          </div>
        </div>

        {/* Trip info */}
        <div className="bg-white rounded-card shadow-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <OperatorLogo operatorId={trip.operatorId} size="md" />
            <div>
              <p className="text-sm font-bold text-text-primary">{trip.operator.name}</p>
              <p className="text-xs text-text-secondary">{trip.busType} · {trip.operator.rating}/5</p>
            </div>
          </div>
          <div className="bg-surface-off rounded-xl p-3 flex items-center justify-between">
            <div className="text-center">
              <p className="text-lg font-bold text-text-primary font-poppins">{trip.departure}</p>
              <p className="text-[11px] text-text-secondary">{trip.from.split("(")[0].trim()}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[10px] text-text-secondary mb-1">{trip.duration}</p>
              <div className="w-12 border-t border-dashed border-purple-secondary/50" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-text-primary font-poppins">{trip.arrival}</p>
              <p className="text-[11px] text-text-secondary">{trip.to.split(" ")[0]}</p>
            </div>
          </div>
          <div className="flex gap-4 mt-3">
            <div>
              <p className="text-[10px] text-text-secondary">Date</p>
              <p className="text-xs font-semibold text-text-primary">{trip.date}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-secondary">Seats</p>
              <p className="text-xs font-semibold text-text-primary">{seats.join(", ")}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-secondary">Payment</p>
              <p className="text-xs font-semibold text-text-primary capitalize">{paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className="bg-white rounded-card shadow-card p-4">
          <h3 className="text-sm font-bold font-poppins text-text-primary mb-2.5">Passengers</h3>
          <div className="space-y-2">
            {passengers.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-light flex items-center justify-center text-sm font-bold text-violet-primary">
                  {p.firstName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{p.firstName} {p.lastName}</p>
                  <p className="text-[11px] text-text-secondary capitalize">{p.type} · DOB: {p.dob}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fare */}
        <div className="bg-white rounded-card shadow-card p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold font-poppins text-text-primary">Total Fare</span>
            <span className="text-xl font-bold text-violet-primary font-poppins">₱{totalFare.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Contextual Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-4 py-4 z-40 space-y-2">
        {status === "upcoming" && (
          <>
            <Link href={`/e-ticket/${referenceNumber}`}
              className="block w-full h-12 rounded-btn text-white font-semibold text-center leading-[48px] text-sm active:scale-95 transition-transform"
              style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
              View E-Ticket
            </Link>
            <div className="flex gap-2">
              <Link href={`/search?from=${encodeURIComponent(trip.from)}&to=${encodeURIComponent(trip.to)}&date=2026-09-20&passengers=1`}
                className="flex-1 h-11 rounded-btn text-violet-primary font-semibold text-center leading-[44px] text-sm border border-violet-primary/30 active:scale-95 transition-transform"
                style={{ background: "#F5EEFF" }}>
                Rebook
              </Link>
              <button onClick={() => setShowCancelModal(true)}
                className="flex-1 h-11 rounded-btn text-danger font-semibold text-sm border border-red-200 bg-red-50 active:scale-95 transition-transform">
                Cancel Booking
              </button>
            </div>
          </>
        )}
        {status === "completed" && (
          <div className="flex gap-2">
            <Link href={`/rate-trip/${id}`}
              className="flex-1 h-12 rounded-btn text-white font-semibold text-center leading-[48px] text-sm active:scale-95 transition-transform"
              style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
              Rate This Trip
            </Link>
            <Link href={`/search?from=${encodeURIComponent(trip.from)}&to=${encodeURIComponent(trip.to)}&date=2026-09-20&passengers=1`}
              className="flex-1 h-12 rounded-btn text-violet-primary font-semibold text-center leading-[48px] text-sm border border-violet-primary/30 active:scale-95 transition-transform"
              style={{ background: "#F5EEFF" }}>
              Rebook
            </Link>
          </div>
        )}
        {status === "cancelled" && (
          <div className="flex gap-2">
            <Link href={`/refund-status/${id}`}
              className="flex-1 h-12 rounded-btn text-white font-semibold text-center leading-[48px] text-sm active:scale-95 transition-transform"
              style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
              Refund Status
            </Link>
            <Link href={`/search?from=${encodeURIComponent(trip.from)}&to=${encodeURIComponent(trip.to)}&date=2026-09-20&passengers=1`}
              className="flex-1 h-12 rounded-btn text-violet-primary font-semibold text-center leading-[48px] text-sm border border-violet-primary/30 active:scale-95 transition-transform"
              style={{ background: "#F5EEFF" }}>
              Rebook
            </Link>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowCancelModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-[430px] bg-white rounded-t-[24px] px-5 pt-6 pb-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#D64545" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold font-poppins text-text-primary text-center mb-1">Cancel this booking?</h3>
            <p className="text-sm text-text-secondary text-center mb-2 leading-relaxed">
              Refund policy: <span className="font-semibold text-text-primary">80% refund</span> if cancelled 24h+ before departure.
            </p>
            <p className="text-sm text-text-secondary text-center mb-6">
              Estimated refund: <span className="font-bold text-text-primary">₱{Math.round(totalFare * 0.8).toLocaleString()}</span>
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)}
                className="flex-1 h-12 rounded-btn border border-gray-200 text-text-secondary font-semibold text-sm active:scale-95 transition-transform">
                Keep Booking
              </button>
              <button onClick={handleCancel}
                className="flex-1 h-12 rounded-btn text-white font-bold text-sm bg-danger active:scale-95 transition-transform">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
