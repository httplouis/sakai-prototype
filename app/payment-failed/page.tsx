"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";

export default function PaymentFailedPage() {
  const router = useRouter();
  const { booking } = useApp();
  const method = booking.paymentMethod ?? "gcash";

  return (
    <div className="min-h-screen bg-surface-off flex flex-col">
      <TopBar title="Payment Failed" back="/payment-details" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "#FFF0F0", border: "2px solid #FECACA" }}>
          <svg width="44" height="44" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#D64545" strokeWidth="2"/>
            <path d="M15 9l-6 6M9 9l6 6" stroke="#D64545" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        <h2 className="text-2xl font-bold font-poppins text-text-primary mb-2">Payment Failed</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-[280px] mb-2">
          We couldn&apos;t process your payment.
        </p>
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-8 text-sm text-danger max-w-[280px]">
          {method === "gcash" && "Please check your GCash balance or ensure your account is active."}
          {method === "maya" && "Please check your Maya balance or try a different number."}
          {(method === "visa" || method === "mastercard") && "Your card was declined. Please check the card details or contact your bank."}
          {method === "bank" && "Bank transfer could not be verified. Please check your reference number."}
        </div>

        <div className="w-full space-y-3">
          <button onClick={() => router.push("/payment-details")}
            className="w-full h-14 rounded-btn text-white font-bold font-poppins active:scale-95 transition-transform"
            style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
            Retry Payment
          </button>
          <Link href="/payment"
            className="block w-full h-12 rounded-btn text-violet-primary font-semibold text-center leading-[48px] text-sm border border-violet-primary/30"
            style={{ background: "#F5EEFF" }}>
            Choose Different Method
          </Link>
          <Link href="/home"
            className="block text-center text-sm text-text-secondary font-medium py-2">
            Cancel & Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
