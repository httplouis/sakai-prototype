"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";

export default function AddCardPage() {
  const router = useRouter();
  const { addPaymentMethod, showToast } = useApp();
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };

  const cardType = (): "visa" | "mastercard" => {
    const clean = num.replace(/\s/g, "");
    return clean.startsWith("5") ? "mastercard" : "visa";
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (num.replace(/\s/g, "").length < 16) e.num = "Enter a valid 16-digit card number.";
    if (exp.length < 5) e.exp = "Enter expiry as MM/YY.";
    if (cvv.length < 3) e.cvv = "Enter 3–4 digit CVV.";
    if (!name.trim()) e.name = "Enter cardholder name.";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    const last4 = num.replace(/\s/g, "").slice(-4);
    const type = cardType();
    addPaymentMethod({
      id: `pm-${Date.now()}`,
      type,
      label: type === "visa" ? "Visa" : "Mastercard",
      maskedNumber: `•••• ${last4}`,
      isDefault,
    });
    showToast("Card saved successfully! 💳");
    router.push("/profile/payment-methods");
  };

  const field = (key: string, label: string, input: React.ReactNode) => (
    <div key={key}>
      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">{label}</label>
      {input}
      {errors[key] && <p className="text-danger text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-28">
      <TopBar title="Add New Card" back="/profile/payment-methods" />

      <div className="px-4 pt-4 space-y-4">
        {/* Card preview */}
        <div className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#1A1533,#4C2A72)", aspectRatio: "1.6/1" }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle,#B797C4,transparent)", transform: "translate(20%,-30%)" }} />
          <p className="text-[#B797C4] text-xs font-semibold mb-6">DEBIT / CREDIT CARD</p>
          <p className="text-white text-lg font-mono tracking-widest mb-4">
            {num || "•••• •••• •••• ••••"}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[#B797C4] text-[10px]">CARDHOLDER</p>
              <p className="text-white text-sm font-semibold mt-0.5">{name || "YOUR NAME"}</p>
            </div>
            <div className="text-right">
              <p className="text-[#B797C4] text-[10px]">EXPIRES</p>
              <p className="text-white text-sm font-semibold mt-0.5">{exp || "MM/YY"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card shadow-card p-4 space-y-4">
          {field("num", "Card Number",
            <input value={num} onChange={(e) => { setNum(fmtCard(e.target.value)); setErrors((p) => ({ ...p, num: "" })); }}
              placeholder="1234 5678 9012 3456" maxLength={19}
              className={`w-full h-12 px-4 rounded-btn border font-mono bg-surface-off text-sm text-text-primary placeholder:font-sans placeholder:text-gray-400 ${errors.num ? "border-danger" : "border-gray-200"}`} />
          )}
          <div className="grid grid-cols-2 gap-3">
            {field("exp", "Expiry",
              <input value={exp} onChange={(e) => { setExp(fmtExp(e.target.value)); setErrors((p) => ({ ...p, exp: "" })); }}
                placeholder="MM/YY" maxLength={5}
                className={`w-full h-12 px-4 rounded-btn border bg-surface-off text-sm ${errors.exp ? "border-danger" : "border-gray-200"}`} />
            )}
            {field("cvv", "CVV",
              <input value={cvv} onChange={(e) => { setCvv(e.target.value.replace(/\D/g,"").slice(0,4)); setErrors((p) => ({ ...p, cvv: "" })); }}
                placeholder="•••" type="password" maxLength={4}
                className={`w-full h-12 px-4 rounded-btn border bg-surface-off text-sm ${errors.cvv ? "border-danger" : "border-gray-200"}`} />
            )}
          </div>
          {field("name", "Cardholder Name",
            <input value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
              placeholder="Juan dela Cruz"
              className={`w-full h-12 px-4 rounded-btn border bg-surface-off text-sm ${errors.name ? "border-danger" : "border-gray-200"}`} />
          )}
          <button onClick={() => setIsDefault(!isDefault)} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isDefault ? "bg-violet-primary border-violet-primary" : "border-gray-300"}`}>
              {isDefault && <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span className="text-sm text-text-secondary">Set as default payment method</span>
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button onClick={handleSave}
          className="w-full h-14 rounded-btn text-white font-bold font-poppins active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
          Save Card
        </button>
      </div>
    </div>
  );
}
