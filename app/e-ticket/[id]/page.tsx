"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";
import OperatorLogo from "@/components/OperatorLogo";

function QRCode({ value }: { value: string }) {
  // Inline SVG QR-like pattern (decorative but recognizable)
  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const r = Math.floor(i / 21), c = i % 21;
    // Corner finder patterns
    if ((r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)) {
      if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) return true;
    }
    return (seed * (i + 1) * 2654435761) % 2 === 0;
  });

  return (
    <div className="bg-white p-3 rounded-2xl shadow-sm inline-block">
      <svg width="140" height="140" viewBox="0 0 21 21">
        {cells.map((filled, i) => filled ? (
          <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="0.9" height="0.9" fill="#1F1B24" />
        ) : null)}
      </svg>
    </div>
  );
}

export default function ETicketPage() {
  const { id } = useParams<{ id: string }>();
  const { booking, bookings, showToast } = useApp();

  // Try to find from bookings list first, fall back to current booking
  const storedBooking = bookings.find((b) => b.referenceNumber === id || b.id === id);
  const trip = storedBooking?.trip ?? booking.selectedTrip;
  const seats = storedBooking?.seats ?? booking.selectedSeats;
  const passengers = storedBooking?.passengers ?? booking.passengers;
  const refNum = storedBooking?.referenceNumber ?? id;
  const operatorId = trip?.operatorId ?? "victory";

  const handleSave = () => showToast("E-Ticket saved to gallery! 📱");

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-8">
      <TopBar title="E-Ticket" back="/my-bookings"
        right={
          <button onClick={handleSave} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-95 transition-transform">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="#4C2A72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        }
      />

      <div className="px-4 pt-4">
        {/* Ticket card */}
        <div className="bg-white rounded-[20px] shadow-card-lg overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-5 pb-4" style={{ background: "linear-gradient(135deg, #1A1533, #3D2B6B)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <OperatorLogo operatorId={operatorId} size="sm" />
                <div>
                  <p className="text-white text-sm font-semibold">{trip?.operator.name ?? "Victory Liner"}</p>
                  <p className="text-[#B797C4] text-xs">{trip?.busType ?? "Deluxe"}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                style={{ background: "rgba(46,158,91,0.2)", color: "#4ADE80", border: "1px solid rgba(46,158,91,0.3)" }}>
                ✓ CONFIRMED
              </span>
            </div>
            {/* Route */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white font-poppins">{trip?.departure ?? "08:30"}</p>
                <p className="text-[#B797C4] text-xs mt-0.5">{trip?.fromCode ?? "QC"}</p>
                <p className="text-white text-xs font-medium mt-0.5">{trip?.from.split("(")[0].trim() ?? "Manila Cubao"}</p>
              </div>
              <div className="flex flex-col items-center mx-2">
                <p className="text-[#B797C4] text-[10px] mb-1">{trip?.duration ?? "5h 45m"}</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B797C4]" />
                  <div className="w-12 border-t border-dashed border-[#B797C4]/50" />
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="#B797C4">
                    <path d="M1 5h8M5 1l4 4-4 4"/>
                  </svg>
                </div>
                <p className="text-[#B797C4] text-[10px] mt-1">Direct</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white font-poppins">{trip?.arrival ?? "02:15"}</p>
                <p className="text-[#B797C4] text-xs mt-0.5">{trip?.toCode ?? "BGO"}</p>
                <p className="text-white text-xs font-medium mt-0.5">{trip?.to.split(" ")[0] ?? "Baguio"}</p>
              </div>
            </div>
          </div>

          {/* Tear line */}
          <div className="relative flex items-center">
            <div className="w-6 h-6 rounded-full -ml-3 bg-surface-off" />
            <div className="flex-1 border-t-2 border-dashed border-gray-200" />
            <div className="w-6 h-6 rounded-full -mr-3 bg-surface-off" />
          </div>

          {/* Details */}
          <div className="px-5 pt-3 pb-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <p className="text-[10px] text-text-secondary uppercase tracking-wide">Date</p>
                <p className="text-sm font-semibold text-text-primary mt-0.5">{trip?.date ?? "Sep 15, 2026"}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-secondary uppercase tracking-wide">Seats</p>
                <p className="text-sm font-semibold text-text-primary mt-0.5">{seats.length > 0 ? seats.join(", ") : "3A, 3B"}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-secondary uppercase tracking-wide">Pax</p>
                <p className="text-sm font-semibold text-text-primary mt-0.5">{passengers.length > 0 ? passengers.length : 1}</p>
              </div>
            </div>

            {passengers.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] text-text-secondary uppercase tracking-wide mb-1.5">Passenger(s)</p>
                <div className="space-y-1">
                  {passengers.map((p, i) => (
                    <p key={i} className="text-sm font-medium text-text-primary">
                      {p.firstName} {p.lastName}
                      <span className="text-xs text-text-secondary ml-1 capitalize">· {p.type}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* QR */}
            <div className="flex flex-col items-center py-3">
              <QRCode value={refNum} />
              <p className="text-xs font-mono font-bold text-text-secondary mt-2 tracking-wider">{refNum}</p>
              <p className="text-[10px] text-text-secondary mt-1">Show at terminal counter</p>
            </div>
          </div>
        </div>

        {/* Save button */}
        <button onClick={handleSave}
          className="w-full h-13 py-3.5 rounded-btn text-white font-semibold font-poppins mt-4 active:scale-95 transition-transform flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Save to Gallery
        </button>

        <Link href="/my-bookings"
          className="block text-center text-sm text-violet-primary font-semibold mt-3 py-2">
          ← Back to My Bookings
        </Link>
      </div>
    </div>
  );
}
