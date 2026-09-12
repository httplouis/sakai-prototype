"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";

const STEPS = [
  { id: "requested",  label: "Refund Requested",   sub: "Your cancellation was confirmed." },
  { id: "processing", label: "Processing",          sub: "Refund is being reviewed by our team." },
  { id: "refunded",   label: "Refunded",            sub: "Funds sent back to original payment method." },
];

export default function RefundStatusPage() {
  const { id } = useParams<{ id: string }>();
  const { bookings } = useApp();
  const booking = bookings.find((b) => b.id === id);
  const currentStep = 1; // "Processing" for demo

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-8">
      <TopBar title="Refund Status" back={`/booking-detail/${id}`} />

      <div className="px-4 pt-4 space-y-4">
        {/* Amount */}
        <div className="bg-white rounded-card shadow-card p-5 text-center">
          <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Refund Amount</p>
          <p className="text-4xl font-bold text-violet-primary font-poppins mb-1">
            ₱{booking ? Math.round(booking.totalFare * 0.8).toLocaleString() : "704"}
          </p>
          <p className="text-xs text-text-secondary">80% of total fare (₱{booking?.totalFare.toLocaleString() ?? "880"})</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "#FFF9E6", border: "1px solid #F4B40040" }}>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-700">Processing · 3–7 business days</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-card shadow-card p-5">
          <h3 className="text-sm font-bold font-poppins text-text-primary mb-4">Refund Progress</h3>
          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <div key={step.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all z-10 ${done ? "bg-success border-success" : active ? "bg-white border-violet-primary" : "bg-white border-gray-200"}`}>
                      {done ? (
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : active ? (
                        <div className="w-3 h-3 rounded-full bg-violet-primary animate-pulse" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                      )}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`w-0.5 h-10 mt-0 ${done ? "bg-success" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className={`text-sm font-semibold ${done ? "text-success" : active ? "text-violet-primary" : "text-text-secondary"}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">{step.sub}</p>
                    {active && (
                      <p className="text-xs text-violet-primary font-medium mt-1">
                        Est. 3–7 business days
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking ref */}
        {booking && (
          <div className="bg-white rounded-card shadow-card p-4 flex justify-between items-center">
            <span className="text-xs text-text-secondary">Booking Reference</span>
            <span className="text-xs font-bold font-mono text-text-primary">{booking.referenceNumber}</span>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm font-semibold text-blue-800 mb-1">Need help with your refund?</p>
          <p className="text-xs text-blue-700 mb-2">Our support team is available 24/7 to assist you.</p>
          <Link href="/ai-assistant" className="text-xs font-bold text-blue-700 underline">
            Chat with us →
          </Link>
        </div>

        <Link href="/my-bookings"
          className="block text-center text-sm text-violet-primary font-semibold py-3">
          ← Back to My Bookings
        </Link>
      </div>
    </div>
  );
}
