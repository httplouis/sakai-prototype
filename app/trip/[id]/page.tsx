"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTripById } from "@/lib/mockData";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";
import OperatorLogo from "@/components/OperatorLogo";

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { setSelectedTrip } = useApp();
  const trip = getTripById(id);

  if (!trip) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-off px-6">
      <div className="w-16 h-16 rounded-full bg-purple-light flex items-center justify-center">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="#4C2A72" strokeWidth="2"/>
          <path d="M21 21l-3.5-3.5" stroke="#4C2A72" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-text-secondary text-sm text-center">Trip not found.</p>
      <Link href="/search" className="text-violet-primary font-semibold text-sm">← Back to Search</Link>
    </div>
  );

  const handleSelect = () => {
    setSelectedTrip(trip);
    router.push("/addons");
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-28 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(150deg, #1A1533 0%, #3D2B6B 100%)" }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #B797C4, transparent)", transform: "translate(30%, -30%)" }} />
        <TopBar back="/search" light transparent />
        <div className="px-5 pb-10 pt-1">
          {trip.isBestMatch && (
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-3"
              style={{ background: "rgba(244,180,0,0.2)", color: "#F4B400", border: "1px solid rgba(244,180,0,0.3)" }}>
              ✨ AI BEST MATCH
            </span>
          )}
          <div className="flex items-center gap-3 mb-5">
            <OperatorLogo operatorId={trip.operatorId} size="lg" />
            <div>
              <h1 className="text-white font-bold font-poppins text-lg leading-tight">{trip.operator.name}</h1>
              <p className="text-[#B797C4] text-sm mt-0.5">{trip.busType} · {trip.operator.rating}/5</p>
            </div>
          </div>
          {/* Route card */}
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-center min-w-[90px]">
                <p className="text-2xl font-bold text-white font-poppins">{trip.departure}</p>
                <p className="text-[#B797C4] text-xs mt-0.5">{trip.fromCode}</p>
                <p className="text-white/80 text-xs font-medium mt-0.5 leading-tight">{trip.from.split("(")[0].trim()}</p>
              </div>
              <div className="flex-1 flex flex-col items-center mx-3">
                <p className="text-[#B797C4] text-xs mb-2">{trip.duration}</p>
                <div className="w-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full border-2 border-[#B797C4]" />
                  <div className="flex-1 border-t border-dashed border-[#B797C4]/50" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="#B797C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-[#B797C4] text-[10px] mt-2">Direct · No stops</p>
              </div>
              <div className="text-center min-w-[90px]">
                <p className="text-2xl font-bold text-white font-poppins">{trip.arrival}</p>
                <p className="text-[#B797C4] text-xs mt-0.5">{trip.toCode}</p>
                <p className="text-white/80 text-xs font-medium mt-0.5 leading-tight">{trip.to}</p>
              </div>
            </div>
            <div className="border-t border-white/10 mt-3 pt-3 flex items-center justify-between">
              <span className="text-[#B797C4] text-xs">{trip.date}</span>
              <span className="text-[#B797C4] text-xs">{trip.seatsLeft} seats left</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-surface-off rounded-t-[20px]" />
      </div>

      <div className="px-5 pt-2 space-y-3">
        {/* Price card */}
        <div className="bg-white rounded-card shadow-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary mb-0.5">Fare per person</p>
            <p className="text-3xl font-bold text-violet-primary font-poppins">₱{trip.fare.toLocaleString()}</p>
            <p className="text-xs text-text-secondary mt-0.5">{trip.seatsLeft} of {trip.totalSeats} seats available</p>
          </div>
          <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5 ${trip.seatsLeft < 10 ? "bg-red-50" : "bg-[#E9D0F3]"}`}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="6" width="8" height="10" rx="2" stroke={trip.seatsLeft < 10 ? "#D64545" : "#4C2A72"} strokeWidth="2"/>
              <rect x="13" y="6" width="8" height="10" rx="2" stroke={trip.seatsLeft < 10 ? "#D64545" : "#4C2A72"} strokeWidth="2"/>
              <path d="M5 16v2M9 16v2M15 16v2M19 16v2" stroke={trip.seatsLeft < 10 ? "#D64545" : "#4C2A72"} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className={`text-[10px] font-bold ${trip.seatsLeft < 10 ? "text-danger" : "text-violet-primary"}`}>
              {trip.seatsLeft < 10 ? "Almost!" : "Open"}
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-card shadow-card p-4">
          <h3 className="text-sm font-bold font-poppins text-text-primary mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {trip.amenities.map((a) => (
              <div key={a} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#2E9E5B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xs text-text-secondary">{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trip details */}
        <div className="bg-white rounded-card shadow-card p-4">
          <h3 className="text-sm font-bold font-poppins text-text-primary mb-3">Trip Info</h3>
          <div className="space-y-2.5">
            {[
              { label: "Travel Date", value: trip.date },
              { label: "Bus Type", value: trip.busType },
              { label: "Total Seats", value: `${trip.totalSeats} seats` },
              { label: "Operator", value: trip.operator.name },
              { label: "Cancellation", value: "80% refund if cancelled 24h+ before" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start">
                <span className="text-xs text-text-secondary shrink-0">{label}</span>
                <span className="text-xs font-semibold text-text-primary text-right ml-4 max-w-[180px]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operator card */}
        <div className="bg-white rounded-card shadow-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <OperatorLogo operatorId={trip.operatorId} size="sm" />
            <div>
              <h3 className="text-sm font-bold font-poppins text-text-primary">{trip.operator.name}</h3>
              <p className="text-xs text-text-secondary">{trip.operator.rating}/5 · Est. 1960s</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            One of the Philippines' leading intercity bus operators serving major Luzon routes. Known for safety, on-time performance, and comfortable rides.
          </p>
        </div>

        {/* Safety note */}
        <div className="bg-[#E8F5E9] rounded-xl p-3 flex items-start gap-2">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#2E9E5B" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <p className="text-xs text-success leading-relaxed font-medium">
            All operators on SakAi are LTO-accredited and regularly safety-inspected.
          </p>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-text-secondary">Total for 1 passenger</p>
            <p className="text-xl font-bold text-violet-primary font-poppins">₱{trip.fare.toLocaleString()}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${trip.seatsLeft < 10 ? "bg-red-50 text-danger" : "bg-[#E8F5E9] text-success"}`}>
            {trip.seatsLeft} seats left
          </span>
        </div>
        <button onClick={handleSelect}
          className="w-full h-14 rounded-btn text-white font-bold font-poppins active:scale-95 transition-transform text-base"
          style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
          Select Seats →
        </button>
      </div>
    </div>
  );
}
