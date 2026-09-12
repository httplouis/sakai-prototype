"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";
import OperatorLogo from "@/components/OperatorLogo";

export default function BookingSummaryPage() {
  const router = useRouter();
  const { booking } = useApp();
  const { selectedTrip, selectedSeats, addons, totalFare, promoDiscount } = booking;

  const trip = selectedTrip;
  if (!trip) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-text-secondary">No trip selected.</p>
      <Link href="/search" className="text-violet-primary font-semibold text-sm">Search Trips</Link>
    </div>
  );

  const baseTotal = trip.fare * Math.max(1, selectedSeats.length);
  const addonsExtra = (addons.insurance ? 50 : 0) + (addons.meal ? 80 : 0) + (addons.priorityBoarding ? 30 : 0);
  const addonsTotal = addonsExtra * Math.max(1, selectedSeats.length);
  const grandTotal = baseTotal + addonsTotal - promoDiscount;

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-28">
      <TopBar title="Booking Summary" back="/seats" />

      <div className="px-4 pt-4 pb-4 space-y-3">
        {/* Trip Card */}
        <div className="bg-white rounded-card shadow-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold font-poppins text-text-primary">Trip Details</h3>
            <Link href="/seats" className="text-xs font-semibold text-violet-primary">Edit</Link>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <OperatorLogo operatorId={trip.operatorId} size="sm" />
            <div>
              <p className="text-sm font-semibold text-text-primary">{trip.operator.name}</p>
              <p className="text-xs text-text-secondary">{trip.busType} · {trip.date}</p>
            </div>
          </div>
          <div className="bg-surface-off rounded-xl p-3 flex items-center justify-between">
            <div className="text-center">
              <p className="text-base font-bold text-text-primary font-poppins">{trip.departure}</p>
              <p className="text-[11px] text-text-secondary">{trip.from.split("(")[0].trim()}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-[10px] text-text-secondary mb-1">{trip.duration}</p>
              <div className="w-16 border-t border-dashed border-purple-secondary/50" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-text-primary font-poppins">{trip.arrival}</p>
              <p className="text-[11px] text-text-secondary">{trip.to.split(" ")[0]}</p>
            </div>
          </div>
        </div>

        {/* Seats */}
        <div className="bg-white rounded-card shadow-card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold font-poppins text-text-primary">Selected Seats</h3>
            <Link href="/seats" className="text-xs font-semibold text-violet-primary">Edit</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.length > 0 ? selectedSeats.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-lg text-sm font-bold text-violet-primary"
                style={{ background: "#E9D0F3" }}>
                {s}
              </span>
            )) : (
              <p className="text-xs text-text-secondary">No seats selected.</p>
            )}
          </div>
        </div>

        {/* Passengers placeholder */}
        <div className="bg-white rounded-card shadow-card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold font-poppins text-text-primary">Passenger Info</h3>
            <Link href="/passenger-info" className="text-xs font-semibold text-violet-primary">Edit</Link>
          </div>
          {booking.passengers.length > 0 ? (
            <div className="space-y-1.5">
              {booking.passengers.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-light flex items-center justify-center text-xs font-bold text-violet-primary">
                    {p.firstName[0]}
                  </div>
                  <span className="text-sm text-text-primary">{p.firstName} {p.lastName}</span>
                  <span className="text-xs text-text-secondary capitalize">· {p.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-secondary">Passenger details will be entered next.</p>
          )}
        </div>

        {/* Add-ons */}
        {(addons.insurance || addons.meal || addons.priorityBoarding) && (
          <div className="bg-white rounded-card shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold font-poppins text-text-primary">Add-ons</h3>
              <Link href="/addons" className="text-xs font-semibold text-violet-primary">Edit</Link>
            </div>
            <div className="space-y-1.5">
              {addons.insurance && <div className="flex justify-between text-sm"><span className="text-text-secondary">Travel Insurance</span><span className="font-medium">₱{50 * Math.max(1, selectedSeats.length)}</span></div>}
              {addons.meal && <div className="flex justify-between text-sm"><span className="text-text-secondary">Packed Meal</span><span className="font-medium">₱{80 * Math.max(1, selectedSeats.length)}</span></div>}
              {addons.priorityBoarding && <div className="flex justify-between text-sm"><span className="text-text-secondary">Priority Boarding</span><span className="font-medium">₱{30 * Math.max(1, selectedSeats.length)}</span></div>}
            </div>
          </div>
        )}

        {/* Fare Breakdown */}
        <div className="bg-white rounded-card shadow-card p-4">
          <h3 className="text-sm font-bold font-poppins text-text-primary mb-3">Fare Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Base fare × {Math.max(1, selectedSeats.length)}</span>
              <span className="text-text-primary font-medium">₱{baseTotal.toLocaleString()}</span>
            </div>
            {addonsTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Add-ons</span>
                <span className="text-text-primary font-medium">₱{addonsTotal.toLocaleString()}</span>
              </div>
            )}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-success">Promo discount</span>
                <span className="text-success font-medium">-₱{promoDiscount}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between items-center">
              <span className="text-sm font-bold text-text-primary">Total</span>
              <span className="text-xl font-bold text-violet-primary font-poppins">₱{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button onClick={() => router.push("/passenger-info")}
          className="w-full h-14 rounded-btn text-white font-bold font-poppins active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
          Continue to Passenger Info →
        </button>
      </div>
    </div>
  );
}
