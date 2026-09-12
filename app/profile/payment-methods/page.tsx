"use client";
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";
import PaymentLogo from "@/components/PaymentLogo";

export default function PaymentMethodsPage() {
  const { paymentMethods, removePaymentMethod, setDefaultPaymentMethod, showToast } = useApp();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    removePaymentMethod(id);
    setConfirmDelete(null);
    showToast("Payment method removed.");
  };

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod(id);
    showToast("Default payment method updated.");
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-8">
      <TopBar title="Payment Methods" back="/profile" />

      <div className="px-4 pt-4 space-y-3">
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {paymentMethods.map((pm, i) => (
            <div key={pm.id}
              className={`flex items-center gap-3 px-4 py-3.5 ${i < paymentMethods.length - 1 ? "border-b border-gray-50" : ""}`}>
              <PaymentLogo type={pm.type} size={36} />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-text-primary">{pm.label}</p>
                  {pm.isDefault && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "#E9D0F3", color: "#4C2A72" }}>DEFAULT</span>
                  )}
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{pm.maskedNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                {!pm.isDefault && (
                  <button onClick={() => handleSetDefault(pm.id)}
                    className="text-[11px] font-semibold text-violet-primary px-2 py-1 rounded-lg active:scale-95"
                    style={{ background: "#F0EAF7" }}>
                    Set Default
                  </button>
                )}
                <button onClick={() => setConfirmDelete(pm.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center active:scale-95"
                  style={{ background: "#FFF0F0" }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6" stroke="#D64545" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#D64545" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="#D64545" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {/* Add new */}
          <Link href="/profile/payment-methods/add"
            className="flex items-center gap-3 px-4 py-3.5 border-t border-dashed border-gray-200 tap-card">
            <div className="w-9 h-9 rounded-full border-2 border-dashed border-violet-primary/40 flex items-center justify-center">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="#4C2A72" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-violet-primary">+ Add New Card</span>
          </Link>
        </div>

        <div className="bg-surface-off rounded-xl p-3 border border-gray-200">
          <p className="text-xs text-text-secondary leading-relaxed">
            🔒 Your card details are encrypted and stored securely. SakAi never stores full card numbers.
          </p>
        </div>
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setConfirmDelete(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-[430px] bg-white rounded-t-[24px] px-5 pt-6 pb-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold font-poppins text-text-primary text-center mb-2">Remove payment method?</h3>
            <p className="text-sm text-text-secondary text-center mb-5">This can't be undone. You can add it back anytime.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 h-12 rounded-btn border border-gray-200 text-text-secondary font-semibold text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)}
                className="flex-1 h-12 rounded-btn text-white font-bold text-sm bg-danger">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
