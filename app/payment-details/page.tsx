"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";
import PaymentLogo from "@/components/PaymentLogo";

function CardForm({ onPay, loading }: { onPay: () => void; loading: boolean }) {
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [save, setSave] = useState(false);

  const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">Card Number</label>
        <input value={num} onChange={(e) => setNum(fmtCard(e.target.value))}
          placeholder="1234 5678 9012 3456" maxLength={19}
          className="w-full h-12 px-4 rounded-btn border border-gray-200 bg-white text-sm text-text-primary font-mono placeholder:text-gray-400 placeholder:font-sans" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">Expiry</label>
          <input value={exp} onChange={(e) => setExp(fmtExp(e.target.value))}
            placeholder="MM/YY" maxLength={5}
            className="w-full h-12 px-4 rounded-btn border border-gray-200 bg-white text-sm text-text-primary placeholder:text-gray-400" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">CVV</label>
          <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="•••" type="password" maxLength={4}
            className="w-full h-12 px-4 rounded-btn border border-gray-200 bg-white text-sm text-text-primary placeholder:text-gray-400" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">Cardholder Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Juan dela Cruz"
          className="w-full h-12 px-4 rounded-btn border border-gray-200 bg-white text-sm text-text-primary placeholder:text-gray-400" />
      </div>
      <button onClick={() => setSave(!save)}
        className="flex items-center gap-2 py-1">
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${save ? "bg-violet-primary border-violet-primary" : "border-gray-300"}`}>
          {save && <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
        <span className="text-sm text-text-secondary">Save this card for future bookings</span>
      </button>
    </div>
  );
}

function WalletForm({ method, amount }: { method: string; amount: number }) {
  const labels: Record<string, { title: string; placeholder: string; hint: string }> = {
    gcash: { title: "GCash Number", placeholder: "09XX XXX XXXX", hint: "Enter your registered GCash mobile number." },
    maya: { title: "Maya Account", placeholder: "09XX XXX XXXX or email", hint: "Enter your registered Maya mobile number or email." },
  };
  const info = labels[method] ?? labels.gcash;
  return (
    <div className="space-y-3">
      <div className="bg-surface-off rounded-xl p-4 text-center">
        <p className="text-sm text-text-secondary mb-1">You will be redirected to</p>
        <div className="flex justify-center my-2">
          <PaymentLogo type={method} size={40} />
        </div>
        <p className="text-lg font-bold text-text-primary font-poppins">₱{amount.toLocaleString()}</p>
        <p className="text-xs text-text-secondary mt-1">A one-time authorization request will be sent.</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">{info.title}</label>
        <input placeholder={info.placeholder}
          className="w-full h-12 px-4 rounded-btn border border-gray-200 bg-white text-sm text-text-primary placeholder:text-gray-400" />
        <p className="text-xs text-text-secondary mt-1">{info.hint}</p>
      </div>
    </div>
  );
}

function BankForm() {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-sm font-semibold text-blue-800 mb-2">Bank Transfer Details</p>
        <div className="space-y-1.5 text-sm">
          {[["Bank", "BDO Unibank"], ["Account Name", "SakAi Inc."], ["Account No.", "0012-3456-7890"], ["Reference", "SKI-AUTO"]].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-text-secondary">{k}</span>
              <span className="font-semibold text-text-primary">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">Upload your proof of payment or enter the reference number below after transferring.</p>
      <div>
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">Reference / Transaction No.</label>
        <input placeholder="From your bank confirmation"
          className="w-full h-12 px-4 rounded-btn border border-gray-200 bg-white text-sm text-text-primary placeholder:text-gray-400" />
      </div>
    </div>
  );
}

export default function PaymentDetailsPage() {
  const router = useRouter();
  const { booking, addBooking, clearBooking } = useApp();
  const [loading, setLoading] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [promoOk, setPromoOk] = useState(false);
  const { applyPromo } = useApp();

  const method = booking.paymentMethod ?? "gcash";
  const amount = booking.totalFare > 0 ? booking.totalFare : (booking.selectedTrip?.fare ?? 880);
  const isCard = method === "visa" || method === "mastercard";
  const isWallet = method === "gcash" || method === "maya";

  const applyCode = () => {
    const PROMOS: Record<string, number> = { FIRSTRIDE10: Math.round(amount * 0.1), BAGUIO50: 50, SAKAI20: 20, LAKBAY15: Math.round(amount * 0.15) };
    const upper = promoInput.toUpperCase();
    if (PROMOS[upper]) {
      applyPromo(upper, PROMOS[upper]);
      setPromoMsg(`✓ Promo applied! You saved ₱${PROMOS[upper]}.`);
      setPromoOk(true);
      setTimeout(() => setShowPromo(false), 1200);
    } else {
      setPromoMsg("Invalid promo code. Try FIRSTRIDE10 or BAGUIO50.");
      setPromoOk(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    // Simulate failure for trip-004 (Solid North — good QA demo path)
    const tripId = booking.selectedTrip?.id ?? "";
    if (tripId.endsWith("4")) {
      setLoading(false);
      router.push("/payment-failed");
      return;
    }
    const refNum = `SKI-${Date.now().toString().slice(-8)}`;
    if (booking.selectedTrip) {
      addBooking({
        id: `bkg-${Date.now()}`,
        tripId: booking.selectedTrip.id,
        trip: booking.selectedTrip,
        seats: booking.selectedSeats.length > 0 ? booking.selectedSeats : ["5A"],
        passengers: booking.passengers.length > 0 ? booking.passengers : [{ id: "p1", firstName: "Juan", lastName: "dela Cruz", dob: "1990-05-15", type: "adult" }],
        totalFare: amount,
        status: "upcoming",
        bookingDate: new Date().toISOString().slice(0, 10),
        paymentMethod: method,
        referenceNumber: refNum,
        promoApplied: booking.promoCode || undefined,
        promoDiscount: booking.promoDiscount || undefined,
      });
    }
    router.push(`/booking-confirmation?ref=${refNum}`);
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-32">
      <TopBar title="Payment Details" back="/payment" />

      <div className="px-4 pt-4 space-y-4">
        {/* Method badge */}
        <div className="bg-white rounded-card shadow-card p-4 flex items-center gap-3">
          <PaymentLogo type={method} size={40} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary capitalize">{method === "visa" ? "Visa Card" : method === "mastercard" ? "Mastercard" : method === "bank" ? "Bank Transfer" : method.charAt(0).toUpperCase() + method.slice(1)}</p>
            <p className="text-xs text-text-secondary">Secure payment · 256-bit SSL</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-success font-medium">Secure</span>
          </div>
        </div>

        {/* Payment form */}
        <div className="bg-white rounded-card shadow-card p-4">
          {isCard && <CardForm onPay={handlePay} loading={loading} />}
          {isWallet && <WalletForm method={method} amount={amount} />}
          {method === "bank" && <BankForm />}
        </div>

        {/* Promo code */}
        <button onClick={() => setShowPromo(true)}
          className="w-full flex items-center justify-between bg-white rounded-card shadow-card p-4 tap-card">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M7 7h.01M3 12l9-9 9 9-9 9-9-9z" stroke={promoOk ? "#2E9E5B" : "#4C2A72"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium text-text-primary">
              {promoOk ? `Promo: ${promoInput.toUpperCase()}` : "Enter Promo Code"}
            </span>
          </div>
          {promoOk
            ? <span className="text-xs font-semibold text-success">Applied ✓</span>
            : <span className="text-xs text-violet-primary font-semibold">Add →</span>}
        </button>

        {/* Order summary */}
        <div className="bg-white rounded-card shadow-card p-4">
          <h3 className="text-sm font-bold font-poppins text-text-primary mb-3">Order Summary</h3>
          {booking.selectedTrip && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">{booking.selectedTrip.from.split("(")[0].trim()} → {booking.selectedTrip.to.split(" ")[0]}</span>
                <span className="font-medium">₱{booking.selectedTrip.fare}</span>
              </div>
              {booking.selectedSeats.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Seats ({booking.selectedSeats.length})</span>
                  <span className="font-medium">{booking.selectedSeats.join(", ")}</span>
                </div>
              )}
              {booking.promoDiscount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Promo discount</span>
                  <span className="font-semibold">-₱{booking.promoDiscount}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
                <span className="text-text-primary">Total</span>
                <span className="text-violet-primary text-lg font-poppins">₱{amount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Promo sheet */}
      {showPromo && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowPromo(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-t-[24px] px-5 pt-5 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold font-poppins text-text-primary mb-1">Enter Promo Code</h3>
            <p className="text-xs text-text-secondary mb-4">Available codes: FIRSTRIDE10, BAGUIO50, SAKAI20</p>
            <div className="flex gap-2 mb-3">
              {["FIRSTRIDE10", "BAGUIO50"].map((c) => (
                <button key={c} onClick={() => setPromoInput(c)}
                  className="text-xs px-3 py-1.5 rounded-full border border-violet-primary/30 text-violet-primary font-semibold"
                  style={{ background: "#F5EEFF" }}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mb-3">
              <input value={promoInput} onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoMsg(""); }}
                placeholder="Enter promo code"
                className="flex-1 h-12 px-4 rounded-btn border border-gray-200 bg-surface-off text-sm font-mono uppercase text-text-primary placeholder:normal-case placeholder:font-sans placeholder:text-gray-400" />
              <button onClick={applyCode}
                className="h-12 px-5 rounded-btn text-white font-semibold active:scale-95 transition-transform"
                style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
                Apply
              </button>
            </div>
            {promoMsg && (
              <p className={`text-xs font-medium ${promoOk ? "text-success" : "text-danger"}`}>{promoMsg}</p>
            )}
          </div>
        </div>
      )}

      {/* Pay Now CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button onClick={handlePay} disabled={loading}
          className="w-full h-14 rounded-btn text-white font-bold font-poppins active:scale-95 transition-transform disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Processing payment...
            </>
          ) : `Pay ₱${amount.toLocaleString()} Now`}
        </button>
        <p className="text-center text-[11px] text-text-secondary mt-2">
          🔒 Secured by 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
}
