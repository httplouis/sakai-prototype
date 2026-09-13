"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/BookingContext";
import { generateSeats, type Seat } from "@/lib/mockData";
import TopBar from "@/components/TopBar";

export default function SeatsPage() {
  const router = useRouter();
  const { booking, toggleSeat } = useApp();
  const { selectedTrip, selectedSeats } = booking;

  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (selectedTrip) {
      setSeats(generateSeats(selectedTrip.totalSeats, selectedTrip.seatsLeft));
    } else {
      setSeats(generateSeats(54, 28));
    }
  }, [selectedTrip]);

  const handleSeatTap = (seat: Seat) => {
    if (seat.status === "taken") return;
    // Store seat.number (e.g. "3A") in context, not seat.id (e.g. "seat-3A")
    const isAlreadySelected = selectedSeats.includes(seat.number);
    const newStatus = isAlreadySelected ? "available" : "selected";
    setSeats((prev) =>
      prev.map((s) => s.id === seat.id ? { ...s, status: newStatus } : s)
    );
    toggleSeat(seat.number);
  };

  const rows = Array.from({ length: Math.ceil(seats.length / 4) }, (_, i) =>
    seats.slice(i * 4, i * 4 + 4)
  );

  const fare = selectedTrip?.fare ?? 880;
  const total = selectedSeats.length * fare;

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-28">
      <TopBar title="Select Seats" back={booking.selectedTrip ? `/trip/${booking.selectedTrip.id}` : "/search"} />

      {/* Legend */}
      <div className="bg-white border-b border-gray-100 px-5 py-2.5 flex items-center justify-center gap-5">
        {[
          { color: "#F7F5FA", border: "#E0D8EF", label: "Available" },
          { color: "#E9D0F3", border: "#4C2A72", label: "Selected" },
          { color: "#F0F0F0", border: "#D0D0D0", label: "Taken" },
        ].map(({ color, border, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md" style={{ background: color, border: `2px solid ${border}` }} />
            <span className="text-[11px] text-text-secondary font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Bus layout */}
      <div className="px-5 pt-4 pb-4">
        {/* Driver */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="#6B6570" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="9" stroke="#6B6570" strokeWidth="1.5"/>
              <path d="M8 14h8" stroke="#6B6570" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[11px] text-text-secondary font-medium">Driver</span>
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_1fr_20px_1fr_1fr] gap-1 mb-2 px-1">
          {["A", "B", "", "C", "D"].map((l, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-text-secondary">{l}</div>
          ))}
        </div>

        {/* Seat rows */}
        <div className="space-y-1.5">
          {rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-[1fr_1fr_20px_1fr_1fr] gap-1 items-center">
              {[0, 1].map((col) => {
                const seat = row[col];
                if (!seat) return <div key={col} />;
                const isSelected = selectedSeats.includes(seat.number);
                const isTaken = seat.status === "taken";
                return (
                  <button key={seat.id}
                    onClick={() => handleSeatTap(seat)}
                    disabled={isTaken}
                    className={`seat-btn h-9 rounded-lg text-[11px] font-bold border-2 transition-all
                      ${isTaken
                        ? "bg-[#F0F0F0] border-[#D0D0D0] text-[#C0C0C0] cursor-not-allowed"
                        : isSelected
                          ? "bg-[#E9D0F3] border-[#4C2A72] text-[#4C2A72] shadow-sm scale-[1.02]"
                          : "bg-white border-[#E0D8EF] text-text-secondary hover:border-violet-primary/50"
                      }`}>
                    {seat.number}
                  </button>
                );
              })}
              {/* Aisle */}
              <div className="flex items-center justify-center">
                <span className="text-[9px] text-gray-300 font-medium">{ri + 1}</span>
              </div>
              {[2, 3].map((col) => {
                const seat = row[col];
                if (!seat) return <div key={col} />;
                const isSelected = selectedSeats.includes(seat.number);
                const isTaken = seat.status === "taken";
                return (
                  <button key={seat.id}
                    onClick={() => handleSeatTap(seat)}
                    disabled={isTaken}
                    className={`seat-btn h-9 rounded-lg text-[11px] font-bold border-2 transition-all
                      ${isTaken
                        ? "bg-[#F0F0F0] border-[#D0D0D0] text-[#C0C0C0] cursor-not-allowed"
                        : isSelected
                          ? "bg-[#E9D0F3] border-[#4C2A72] text-[#4C2A72] shadow-sm scale-[1.02]"
                          : "bg-white border-[#E0D8EF] text-text-secondary hover:border-violet-primary/50"
                      }`}>
                    {seat.number}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        {selectedSeats.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-text-secondary">{selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected</p>
              <p className="text-sm font-bold text-text-primary">{selectedSeats.join(", ")}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-secondary">Subtotal</p>
              <p className="text-lg font-bold text-violet-primary font-poppins">₱{total.toLocaleString()}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => router.push("/addons")}
          disabled={selectedSeats.length === 0}
          className="w-full h-14 rounded-btn text-white font-bold font-poppins active:scale-95 transition-transform disabled:opacity-40"
          style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
          {selectedSeats.length === 0 ? "Select at least 1 seat" : "Continue to Add-ons →"}
        </button>
      </div>
    </div>
  );
}
