"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/BookingContext";
import SocialLoginButtons from "@/components/SocialLoginButtons";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [logoIn, setLogoIn] = useState(false);
  const [cardIn, setCardIn] = useState(false);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLogoIn(true), 150);
    const t2 = setTimeout(() => setCardIn(true), 850);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email)    return setError("Please enter your email or mobile number.");
    if (!password) return setError("Please enter your password.");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login("Juan dela Cruz", email);
    router.push("/home");
  };

  const handleSocial = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login("Juan dela Cruz", "juan@gmail.com");
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(175deg,#0F0C22 0%,#1A1533 55%,#2D1B56 100%)" }}>

      {/* ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 55% at 50% 35%, rgba(76,42,114,0.45) 0%, transparent 70%)" }} />

      {/* ── TOP — logo ───────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center relative z-10" style={{ minHeight: "36vh" }}>
        <div
          className="flex flex-col items-center"
          style={{
            opacity:    logoIn ? 1 : 0,
            transform:  logoIn ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}>
          <div className="relative w-20 h-20 mb-4">
            <Image
              src="/images/sakai logo.png"
              alt="SakAi"
              fill
              className="object-contain rounded-[20px]"
              priority
            />
            <div className="absolute inset-0 -z-10 blur-2xl opacity-50"
              style={{ background: "radial-gradient(circle,#6B3FA0,transparent)", transform: "scale(1.8)" }} />
          </div>
          <h1 className="text-[42px] font-bold text-white font-poppins tracking-tight leading-none">
            Sak<span style={{ color: "#F4B400" }}>Ai</span>
          </h1>
        </div>
      </div>

      {/* ── BOTTOM — form slides up ───────────────────────────────────── */}
      <div
        className="relative z-20"
        style={{
          transform:  cardIn ? "translateY(0)"   : "translateY(100%)",
          opacity:    cardIn ? 1                 : 0,
          transition: "transform 680ms cubic-bezier(0.32, 0.72, 0, 1), opacity 400ms ease-out",
        }}>

        {/* Smooth wave */}
        <svg
          viewBox="0 0 430 44"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 44, marginBottom: -1 }}>
          <path
            d="M0 44 L0 28 C215 -12 215 64 430 20 L430 44 Z"
            fill="#F7F5FA"
          />
        </svg>

        <div className="bg-[#F7F5FA] px-6 pt-2 pb-10">
          <h2 className="text-[24px] font-bold font-poppins text-text-primary mb-0.5">Welcome back</h2>
          <p className="text-sm text-text-secondary mb-5">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5 block">
                Email or Mobile
              </label>
              <input
                type="text" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@email.com or 09XX"
                className="w-full h-12 px-4 rounded-[12px] border border-gray-200 bg-white text-sm text-text-primary placeholder:text-gray-400 shadow-sm"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 px-4 pr-12 rounded-[12px] border border-gray-200 bg-white text-sm text-text-primary placeholder:text-gray-400 shadow-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary p-1 active:scale-90">
                  {showPw
                    ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    : <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#D64545" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="#D64545" strokeWidth="2" strokeLinecap="round"/></svg>
                <p className="text-danger text-xs font-medium">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-violet-primary font-semibold">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-14 rounded-[14px] text-white font-bold font-poppins active:scale-[0.97] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
              style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
              {loading
                ? <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
                : "Login"
              }
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-text-secondary font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <SocialLoginButtons onGoogle={handleSocial} onFacebook={handleSocial} onApple={handleSocial} />

          <p className="text-center text-sm text-text-secondary mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-violet-primary font-bold">Sign up</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
