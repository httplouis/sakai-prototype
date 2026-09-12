"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";
import PaymentLogo from "@/components/PaymentLogo";
import type { PaymentMethodType } from "@/lib/BookingContext";

const METHODS: { id: PaymentMethodType; label: string; sub: string }[] = [
  { id: "gcash",      label: "GCash",        sub: "Pay via GCash e-wallet" },
  { id: "maya",       label: "Maya",         sub: "Pay via Maya (PayMaya)" },
  { id: "visa",       label: "Visa Card",    sub: "Credit / debit card" },
  { id: "mastercard", label: "Mastercard",   sub: "Credit / debit card" },
  { id: "bank",       label: "Bank Transfer",sub: "Online / over-the-counter" },
];

export default function PaymentMethodPage() {
  const router = useRouter();
  const { booking, setPaymentMethod, paymentMethods } = useApp();
  const [selected, setSelected] = useState<PaymentMethodType | null>(booking.paymentMethod);

  const handleContinue = () => {
    if (!selected) return;
    setPaymentMethod(selected);
    router.push("/payment-details");
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-28">
      <TopBar title="Payment Method" back="/passenger-info" />

      <div className="px-4 pt-4 space-y-4">
        {/* Total */}
        <div className="bg-white rounded-card shadow-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary">Amount to pay</p>
            <p className="text-2xl font-bold text-violet-primary font-poppins">
              ₱{booking.totalFare > 0 ? booking.totalFare.toLocaleString() : (booking.selectedTrip?.fare ?? 880).toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-light flex items-center justify-center">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="2" y="5" width="20" height="14" rx="3" stroke="#4C2A72" strokeWidth="2"/>
              <path d="M2 10h20" stroke="#4C2A72" strokeWidth="2"/>
              <rect x="5" y="14" width="4" height="2" rx="1" fill="#4C2A72"/>
            </svg>
          </div>
        </div>

        {/* Saved payment methods */}
        {paymentMethods.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Saved Methods</p>
              <Link href="/profile/payment-methods" className="text-xs font-semibold text-violet-primary">
                Manage
              </Link>
            </div>
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <button key={pm.id}
                  onClick={() => setSelected(pm.type as PaymentMethodType)}
                  className={`w-full flex items-center gap-3 bg-white rounded-card p-4 shadow-card transition-all tap-card ${selected === pm.type ? "ring-2 ring-violet-primary" : ""}`}>
                  <PaymentLogo type={pm.type} size={36} />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-text-primary">{pm.label}</p>
                    <p className="text-xs text-text-secondary">{pm.maskedNumber}</p>
                  </div>
                  {pm.isDefault && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#E9D0F3", color: "#4C2A72" }}>Default</span>
                  )}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected === pm.type ? "bg-violet-primary border-violet-primary" : "border-gray-300"}`}>
                    {selected === pm.type && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All payment options */}
        <div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 px-1">All Payment Options</p>
          <div className="space-y-2">
            {METHODS.map((m) => (
              <button key={m.id}
                onClick={() => setSelected(m.id)}
                className={`w-full flex items-center gap-3 bg-white rounded-card p-4 shadow-card transition-all tap-card ${selected === m.id ? "ring-2 ring-violet-primary" : ""}`}>
                <PaymentLogo type={m.id} size={36} />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-text-primary">{m.label}</p>
                  <p className="text-xs text-text-secondary">{m.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected === m.id ? "bg-violet-primary border-violet-primary" : "border-gray-300"}`}>
                  {selected === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button onClick={handleContinue} disabled={!selected}
          className="w-full h-14 rounded-btn text-white font-bold font-poppins active:scale-95 transition-transform disabled:opacity-40"
          style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
          Continue →
        </button>
      </div>
    </div>
  );
}
