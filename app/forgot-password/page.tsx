"use client";
import { useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";

export default function ForgotPasswordPage() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col">
      <TopBar title="Forgot Password" back="/login" />

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {sent ? (
          <div className="text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #E9D0F3, #B797C4)" }}>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.26 12a19.79 19.79 0 01-3.07-8.67A2 2 0 013.17 1.13h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 8.27a16 16 0 006.08 6.08l1.44-1.44a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 15z" stroke="#4C2A72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-poppins text-text-primary mb-3">Reset link sent!</h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-[260px] mx-auto mb-8">
              We sent a password reset link to <span className="font-semibold text-text-primary">{value}</span>. Check your inbox or SMS.
            </p>
            <Link href="/login"
              className="inline-block px-8 h-12 leading-[48px] rounded-btn font-semibold text-white"
              style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-sm animate-fade-in">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: "#E9D0F3" }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path d="M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="#4C2A72" strokeWidth="2"/>
                <path d="M4 4l8 8 8-8" stroke="#4C2A72" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold font-poppins text-text-primary mb-2">Reset your password</h2>
            <p className="text-text-secondary text-sm mb-6">Enter your email or mobile number and we&apos;ll send you a reset link.</p>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5 block">
                  Email or Mobile Number
                </label>
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)}
                  placeholder="juan@email.com or 09XX XXX XXXX"
                  className="w-full h-12 px-4 rounded-btn border border-gray-200 bg-white text-sm text-text-primary placeholder:text-gray-400" />
              </div>
              <button type="submit" disabled={loading || !value}
                className="w-full h-14 rounded-btn text-white font-semibold font-poppins active:scale-95 transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(90deg, #401551, #4C2A72)" }}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <p className="text-center text-sm text-text-secondary mt-5">
              <Link href="/login" className="text-violet-primary font-semibold">← Back to Login</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
