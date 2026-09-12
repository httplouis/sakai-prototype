"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";
import type { Passenger } from "@/lib/mockData";

const PASSENGER_TYPES = [
  { value: "adult", label: "Adult", desc: "12 years and above" },
  { value: "child", label: "Child", desc: "3–11 years" },
  { value: "senior", label: "Senior", desc: "60 years and above" },
  { value: "pwd", label: "PWD", desc: "Person with disability" },
];

const ID_TYPES = ["Philippine Passport", "Driver's License", "SSS ID", "UMID", "PhilHealth ID", "Voter's ID", "School ID"];

function PassengerForm({
  index,
  value,
  onChange,
  savedPassengers,
  onUseSaved,
}: {
  index: number;
  value: Partial<Passenger>;
  onChange: (v: Partial<Passenger>) => void;
  savedPassengers: Passenger[];
  onUseSaved: (p: Passenger) => void;
}) {
  const [showSaved, setShowSaved] = useState(false);

  const f = (key: keyof Passenger) => (val: string) => onChange({ ...value, [key]: val });

  return (
    <div className="bg-white rounded-card shadow-card p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold font-poppins text-text-primary">
          Passenger {index + 1}
        </h3>
        {savedPassengers.length > 0 && (
          <button onClick={() => setShowSaved(!showSaved)}
            className="text-xs font-semibold text-violet-primary px-2 py-1 rounded-lg"
            style={{ background: "#E9D0F3" }}>
            Use Saved
          </button>
        )}
      </div>

      {/* Saved passenger chips */}
      {showSaved && (
        <div className="flex gap-2 flex-wrap mb-3 pb-3 border-b border-gray-100">
          {savedPassengers.map((sp) => (
            <button key={sp.id}
              onClick={() => { onUseSaved(sp); setShowSaved(false); }}
              className="text-xs px-3 py-1.5 rounded-full border border-violet-primary/30 text-violet-primary font-medium active:scale-95 transition-transform"
              style={{ background: "#F5EEFF" }}>
              {sp.firstName} {sp.lastName}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1 block">First Name *</label>
            <input value={value.firstName || ""} onChange={(e) => f("firstName")(e.target.value)}
              placeholder="Juan"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-surface-off text-sm text-text-primary placeholder:text-gray-400" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1 block">Last Name *</label>
            <input value={value.lastName || ""} onChange={(e) => f("lastName")(e.target.value)}
              placeholder="dela Cruz"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-surface-off text-sm text-text-primary placeholder:text-gray-400" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1 block">Date of Birth *</label>
          <input type="date" value={value.dob || ""} onChange={(e) => f("dob")(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-surface-off text-sm text-text-primary" />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">Passenger Type</label>
          <div className="grid grid-cols-4 gap-1.5">
            {PASSENGER_TYPES.map((t) => (
              <button key={t.value} onClick={() => f("type")(t.value)}
                className={`py-2 px-1 rounded-xl text-[11px] font-semibold text-center transition-all border ${value.type === t.value ? "bg-purple-light border-violet-primary/40 text-violet-primary" : "border-gray-200 text-text-secondary bg-surface-off"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-2">
          <div>
            <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1 block">ID Type</label>
            <select value={value.idType || ""} onChange={(e) => f("idType")(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-surface-off text-sm text-text-primary">
              <option value="">Select ID</option>
              {ID_TYPES.map((id) => <option key={id}>{id}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1 block">ID Number</label>
            <input value={value.idNumber || ""} onChange={(e) => f("idNumber")(e.target.value)}
              placeholder="ID number"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-surface-off text-sm text-text-primary placeholder:text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PassengerInfoPage() {
  const router = useRouter();
  const { booking, setPassengers, savedPassengers } = useApp();
  const count = Math.max(1, booking.selectedSeats.length);

  const [forms, setForms] = useState<Partial<Passenger>[]>(
    Array.from({ length: count }, (_, i) => booking.passengers[i] || { type: "adult" })
  );
  const [error, setError] = useState("");

  const updateForm = (i: number, v: Partial<Passenger>) => {
    setForms((prev) => prev.map((f, idx) => idx === i ? v : f));
  };

  const useSaved = (i: number, p: Passenger) => {
    updateForm(i, { ...p });
  };

  const handleContinue = () => {
    const invalid = forms.some((f) => !f.firstName?.trim() || !f.lastName?.trim() || !f.dob);
    if (invalid) return setError("Please fill in all required passenger fields (name & date of birth).");
    setError("");
    setPassengers(forms.map((f, i) => ({
      id: `p${i + 1}`,
      firstName: f.firstName!,
      lastName: f.lastName!,
      dob: f.dob!,
      type: (f.type as Passenger["type"]) || "adult",
      idType: f.idType,
      idNumber: f.idNumber,
    })));
    router.push("/payment");
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-28">
      <TopBar title="Passenger Info" back="/booking-summary" />

      <div className="px-4 pt-4">
        <p className="text-xs text-text-secondary mb-4">
          Please enter accurate details as they appear on your valid government ID.
        </p>

        {forms.map((form, i) => (
          <PassengerForm
            key={i}
            index={i}
            value={form}
            onChange={(v) => updateForm(i, v)}
            savedPassengers={savedPassengers}
            onUseSaved={(p) => useSaved(i, p)}
          />
        ))}

        {error && (
          <div className="bg-red-50 border border-danger/20 rounded-xl px-4 py-3 mb-3">
            <p className="text-xs text-danger font-medium">{error}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button onClick={handleContinue}
          className="w-full h-14 rounded-btn text-white font-bold font-poppins active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}
