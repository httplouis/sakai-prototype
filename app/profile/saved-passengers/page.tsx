"use client";
import { useState } from "react";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";
import type { Passenger } from "@/lib/mockData";

const TYPE_LABELS: Record<string, string> = { adult: "Adult", child: "Child", senior: "Senior", pwd: "PWD" };

function PassengerRow({ passenger, onDelete }: { passenger: Passenger; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 rounded-full bg-purple-light flex items-center justify-center text-sm font-bold text-violet-primary shrink-0">
        {passenger.firstName[0]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-text-primary">{passenger.firstName} {passenger.lastName}</p>
        <p className="text-xs text-text-secondary mt-0.5">DOB: {passenger.dob} · {TYPE_LABELS[passenger.type] ?? passenger.type}</p>
      </div>
      <button onClick={onDelete}
        className="w-8 h-8 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
        style={{ background: "#FFF0F0" }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" stroke="#D64545" strokeWidth="2" strokeLinecap="round"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="#D64545" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

export default function SavedPassengersPage() {
  const { savedPassengers, addSavedPassenger, removeSavedPassenger } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", dob: "", type: "adult" as Passenger["type"] });

  const handleAdd = () => {
    if (!form.firstName || !form.lastName || !form.dob) return;
    addSavedPassenger({ id: `sp-${Date.now()}`, ...form });
    setForm({ firstName: "", lastName: "", dob: "", type: "adult" });
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-8">
      <TopBar title="Saved Passengers" back="/profile" />

      <div className="px-4 pt-4 space-y-3">
        <p className="text-xs text-text-secondary px-1">Tap a saved passenger during booking to auto-fill their details.</p>

        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {savedPassengers.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-text-secondary text-sm">No saved passengers yet.</p>
            </div>
          ) : (
            savedPassengers.map((p) => (
              <PassengerRow key={p.id} passenger={p} onDelete={() => removeSavedPassenger(p.id)} />
            ))
          )}
          {/* Add row */}
          <button onClick={() => setShowAdd(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 border-t border-dashed border-gray-200 tap-card">
            <div className="w-9 h-9 rounded-full border-2 border-dashed border-violet-primary/40 flex items-center justify-center">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="#4C2A72" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-violet-primary">Add Passenger</span>
          </button>
        </div>
      </div>

      {/* Add sheet */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowAdd(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-t-[24px] px-5 pt-5 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold font-poppins text-text-primary mb-4">Add Passenger</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1 block">First Name</label>
                  <input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="Juan" className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-surface-off text-sm" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1 block">Last Name</label>
                  <input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="dela Cruz" className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-surface-off text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1 block">Date of Birth</label>
                <input type="date" value={form.dob} onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-surface-off text-sm" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">Type</label>
                <div className="flex gap-2">
                  {(["adult","child","senior","pwd"] as Passenger["type"][]).map((t) => (
                    <button key={t} onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={`flex-1 h-9 rounded-xl text-xs font-semibold capitalize transition-all border ${form.type === t ? "bg-purple-light border-violet-primary/40 text-violet-primary" : "border-gray-200 text-text-secondary bg-surface-off"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleAdd} disabled={!form.firstName || !form.lastName || !form.dob}
              className="w-full h-12 rounded-btn text-white font-bold mt-5 active:scale-95 transition-transform disabled:opacity-40"
              style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
              Save Passenger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
