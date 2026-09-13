"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/home",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
          stroke={active ? "#4C2A72" : "#6B6570"} strokeWidth="2" strokeLinejoin="round"
          fill={active ? "#E9D0F3" : "none"} />
        <path d="M9 22V12h6v10" stroke={active ? "#4C2A72" : "#6B6570"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/my-bookings",
    label: "Bookings",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="3"
          stroke={active ? "#4C2A72" : "#6B6570"} strokeWidth="2"
          fill={active ? "#E9D0F3" : "none"} />
        <path d="M8 2v4M16 2v4M3 10h18" stroke={active ? "#4C2A72" : "#6B6570"} strokeWidth="2" strokeLinecap="round" />
        <circle cx="8" cy="15" r="1.2" fill={active ? "#4C2A72" : "#6B6570"} />
        <circle cx="12" cy="15" r="1.2" fill={active ? "#4C2A72" : "#6B6570"} />
        <circle cx="16" cy="15" r="1.2" fill={active ? "#4C2A72" : "#6B6570"} />
      </svg>
    ),
  },
  { href: "/ai-assistant", label: "AI", icon: null }, // center bubble
  {
    href: "/search",
    label: "Trips",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke={active ? "#4C2A72" : "#6B6570"} strokeWidth="2"
          fill={active ? "#E9D0F3" : "none"} />
        <path d="M21 21l-3.5-3.5" stroke={active ? "#4C2A72" : "#6B6570"} strokeWidth="2" strokeLinecap="round" />
        <path d="M8 11h6M11 8v6" stroke={active ? "#4C2A72" : "#6B6570"} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" stroke={active ? "#4C2A72" : "#6B6570"} strokeWidth="2"
          fill={active ? "#E9D0F3" : "none"} />
        <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
          stroke={active ? "#4C2A72" : "#6B6570"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/home" ? pathname === "/home" : pathname.startsWith(href);

  return (
    <nav className="bottom-nav fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#F0EAF7] z-50">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {navItems.map((item) => {
          if (item.href === "/ai-assistant") {
            return (
              <Link key="ai" href="/ai-assistant" className="flex flex-col items-center -mt-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  style={{
                    background: "linear-gradient(135deg,#401551,#4C2A72)",
                    boxShadow: "0 4px 20px rgba(76,42,114,0.5)",
                  }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    {/* Rounded 4-point star */}
                    <path
                      d="M12 2 C12 2 12.8 7.5 14.5 9.5 C16.2 11.5 22 12 22 12 C22 12 16.2 12.5 14.5 14.5 C12.8 16.5 12 22 12 22 C12 22 11.2 16.5 9.5 14.5 C7.8 12.5 2 12 2 12 C2 12 7.8 11.5 9.5 9.5 C11.2 7.5 12 2 12 2 Z"
                      fill="#F4B400"
                      style={{ filter: "drop-shadow(0 0 3px rgba(244,180,0,0.4))" }}
                    />
                  </svg>
                </div>
                <span className={`text-[10px] mt-1 font-semibold ${isActive("/ai-assistant") ? "text-violet-primary" : "text-text-secondary"}`}>
                  AI
                </span>
              </Link>
            );
          }
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all active:scale-95">
              {item.icon?.(active)}
              <span className={`text-[10px] font-medium ${active ? "text-violet-primary" : "text-text-secondary"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
