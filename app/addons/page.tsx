"use client";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";

// Monochrome SVG icons for each add-on
function InsuranceIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M12 2l7 3v6c0 4.5-3 8.7-7 10-4-1.3-7-5.5-7-10V5l7-3z"
        stroke="#4C2A72" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function MealIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M3 11l19-9-9 19-2-8-8-2z" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function BoardingIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const ADDON_LIST = [
  {
    key: "insurance" as const,
    Icon: InsuranceIcon,
    title: "Travel Insurance",
    description: "Coverage for trip cancellations, delays, and medical emergencies.",
    price: 50,
    badge: "Recommended",
    badgeColor: "#2E9E5B",
  },
  {
    key: "meal" as const,
    Icon: MealIcon,
    title: "Packed Meal",
    description: "Pre-ordered packed Filipino meal served onboard.",
    price: 80,
    badge: null,
    badgeColor: "",
  },
  {
    key: "priorityBoarding" as const,
    Icon: BoardingIcon,
    title: "Priority Boarding",
    description: "Board first, choose your seat from available options.",
    price: 30,
    badge: "Popular",
    badgeColor: "#4C2A72",
  },
];

export default function AddonsPage() {
  const router = useRouter();
  const { booking, setAddons } = useApp();
  const { addons, selectedTrip } = booking;

  const toggle = (key: keyof typeof addons) => {
    setAddons({ ...addons, [key]: !addons[key] });
  };

  const addonsTotal = (addons.insurance ? 50 : 0) + (addons.meal ? 80 : 0) + (addons.priorityBoarding ? 30 : 0);

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-28">
      <TopBar title="Add-ons" back={selectedTrip ? `/trip/${selectedTrip.id}` : "/search"} />

      <div className="px-4 pt-4 pb-4">
        <p className="text-xs text-text-secondary mb-4">Enhance your journey with optional add-ons. You can skip these.</p>

        <div className="space-y-3">
          {ADDON_LIST.map((addon) => {
            const isSelected = addons[addon.key];
            return (
              <button key={addon.key} onClick={() => toggle(addon.key)}
                className={`w-full text-left bg-white rounded-card p-4 shadow-card transition-all active:scale-[0.98] ${isSelected ? "ring-2 ring-violet-primary" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: isSelected ? "#E9D0F3" : "#F0EAF7" }}>
                    <addon.Icon />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-text-primary">{addon.title}</span>
                      {addon.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: addon.badgeColor + "18", color: addon.badgeColor }}>
                          {addon.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{addon.description}</p>
                    <p className="text-sm font-bold text-violet-primary mt-1.5">
                      +₱{addon.price} <span className="text-xs font-normal text-text-secondary">/ person</span>
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${isSelected ? "bg-violet-primary" : "border-2 border-gray-200 bg-white"}`}>
                    {isSelected && (
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {addonsTotal > 0 && (
          <div className="mt-4 bg-purple-light rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Add-ons total</span>
            <span className="text-sm font-bold text-violet-primary">+₱{addonsTotal} / person</span>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button onClick={() => router.push("/seats")}
          className="w-full h-14 rounded-btn text-white font-bold font-poppins active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
          Continue to Seat Selection →
        </button>
        <button onClick={() => router.push("/seats")}
          className="w-full text-center text-sm text-text-secondary font-medium mt-2 py-1">
          Skip add-ons
        </button>
      </div>
    </div>
  );
}
