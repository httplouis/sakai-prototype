"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/BookingContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useApp();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "verify">("form");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.includes("@")) e.email = "Enter a valid email address.";
    if (form.phone.length < 11) e.phone = "Enter a valid PH mobile number.";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("verify");
  };

  const handleVerify = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    login(form.name, form.email);
    router.push("/home");
  };

  const f = (k: string) => (v: string) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: "" })); };

  if (step === "verify") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-surface-off">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ background: "linear-gradient(135deg, #E9D0F3, #B797C4)" }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path d="M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="#4C2A72" strokeWidth="2"/>
            <path d="M4 4l8 8 8-8" stroke="#4C2A72" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold font-poppins text-text-primary mb-2 text-center">Check your email</h2>
        <p className="text-text-secondary text-sm text-center mb-8 max-w-[260px]">
          We sent a 6-digit verification code to <span className="font-semibold text-text-primary">{form.email}</span>
        </p>
        <div className="flex gap-2 mb-6">
          {otp.map((v, i) => (
            <input key={i} maxLength={1} value={v}
              onChange={(e) => { const n = [...otp]; n[i] = e.target.value.slice(-1); setOtp(n); if (e.target.value && i < 5) (document.querySelectorAll(".otp-input")[i + 1] as HTMLInputElement)?.focus(); }}
              className="otp-input w-11 h-12 text-center text-lg font-bold border-2 rounded-xl border-gray-200 bg-white focus:border-violet-primary transition-all" />
          ))}
        </div>
        <button onClick={handleVerify} disabled={loading}
          className="w-full h-14 rounded-btn text-white font-semibold font-poppins active:scale-95 transition-all disabled:opacity-70"
          style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
        <button className="mt-4 text-sm text-text-secondary">
          Didn&apos;t receive it? <span className="text-violet-primary font-semibold">Resend</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #1A1533 0%, #3D2B6B 60%, #4C2A72 100%)" }}>
      <div className="flex flex-col items-center pt-14 pb-6 px-6">
        <h1 className="text-3xl font-bold text-white font-poppins">Create account</h1>
        <p className="text-[#B797C4] text-sm mt-1">Join SakAi — it only takes a minute</p>
      </div>

      <div className="flex-1 bg-surface-off rounded-t-[28px] px-6 pt-7 pb-8 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "Juan dela Cruz" },
            { key: "email", label: "Email Address", type: "email", placeholder: "juan@email.com" },
            { key: "phone", label: "Mobile Number", type: "tel", placeholder: "09XX XXX XXXX" },
            { key: "password", label: "Password", type: "password", placeholder: "At least 8 characters" },
            { key: "confirm", label: "Confirm Password", type: "password", placeholder: "Repeat your password" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">{label}</label>
              <input type={type} value={form[key as keyof typeof form]}
                onChange={(e) => f(key)(e.target.value)} placeholder={placeholder}
                className={`w-full h-12 px-4 rounded-btn border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all ${errors[key] ? "border-danger" : "border-gray-200"}`} />
              {errors[key] && <p className="text-danger text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}

          <button type="submit" disabled={loading}
            className="w-full h-14 rounded-btn text-white font-semibold font-poppins active:scale-95 transition-all disabled:opacity-70 mt-2"
            style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
