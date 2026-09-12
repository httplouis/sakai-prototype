"use client";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";

// Simple monochrome language icons
function IconEN() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M12 3c-2 4-2 14 0 18M3 12h18" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M5.6 7.5c1.8.8 3.8 1.2 6.4 1.2s4.6-.4 6.4-1.2M5.6 16.5c1.8-.8 3.8-1.2 6.4-1.2s4.6.4 6.4 1.2"
        stroke="#4C2A72" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconFIL() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M12 3c-2 4-2 14 0 18M3 12h18" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="8" cy="12" r="2" stroke="#4C2A72" strokeWidth="1.5"/>
    </svg>
  );
}

const LANGUAGES = [
  { code: "en"  as const, label: "English",  native: "English",  Icon: IconEN  },
  { code: "fil" as const, label: "Filipino", native: "Filipino", Icon: IconFIL },
];

export default function LanguagePage() {
  const { language, setLanguage, showToast } = useApp();

  const handleSelect = (lang: "en" | "fil") => {
    setLanguage(lang);
    showToast(lang === "en" ? "Language set to English" : "Itinakda ang wika sa Filipino");
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-8">
      <TopBar title="Language" back="/profile" />

      <div className="px-4 pt-4 space-y-3">
        <p className="text-xs text-text-secondary px-1">Select your preferred app language.</p>

        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {LANGUAGES.map((lang, i) => {
            const active = language === lang.code;
            return (
              <button key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-4 text-left tap-card ${i < LANGUAGES.length - 1 ? "border-b border-gray-50" : ""} ${active ? "bg-purple-light/40" : ""}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: active ? "#E9D0F3" : "#F0EAF7" }}>
                  <lang.Icon />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${active ? "text-violet-primary" : "text-text-primary"}`}>
                    {lang.label}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">{lang.native}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${active ? "bg-violet-primary border-violet-primary" : "border-gray-300"}`}>
                  {active && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-purple-light rounded-xl p-3 border border-purple-secondary/20">
          <div className="flex items-start gap-2">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="9" stroke="#4C2A72" strokeWidth="1.8"/>
              <path d="M12 8v1M12 11v5" stroke="#4C2A72" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="text-xs text-violet-primary font-medium leading-relaxed">
              Full app localization is coming soon. Selecting Filipino will apply to new screens as they are updated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
