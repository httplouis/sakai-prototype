"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── PH bus terminal data with coordinates ────────────────────────────────────
const PH_TERMINALS = [
  // Manila
  { label: "Manila (Cubao)",  detail: "EDSA cor. New York St, Quezon City",  lat: 14.6196, lng: 121.0526 },
  { label: "Manila (Pasay)",  detail: "PITX, Parañaque City",               lat: 14.5024, lng: 120.9979 },
  { label: "Manila (Sampaloc)", detail: "España Blvd, Manila",              lat: 14.6042, lng: 120.9986 },
  // Baguio
  { label: "Baguio City",     detail: "Slaughter House Terminal",           lat: 16.4023, lng: 120.5960 },
  { label: "Baguio City",     detail: "Dangwa Terminal, Magsaysay Ave",     lat: 16.4120, lng: 120.5930 },
  // North Luzon
  { label: "Vigan City",      detail: "Mestizo Terminal, Ilocos Sur",       lat: 17.5747, lng: 120.3869 },
  { label: "Laoag City",      detail: "Ilocos Norte Bus Terminal",          lat: 18.1979, lng: 120.5937 },
  { label: "San Fernando",    detail: "La Union Bus Terminal",              lat: 16.6159, lng: 120.3169 },
  { label: "Dagupan City",    detail: "Pangasinan Terminal",                lat: 16.0433, lng: 120.3333 },
  { label: "Alaminos City",   detail: "Hundred Islands Terminal, Pangasinan", lat: 16.1547, lng: 119.9798 },
  { label: "Urdaneta City",   detail: "Pangasinan",                         lat: 15.9757, lng: 120.5712 },
  { label: "Tarlac City",     detail: "Central Luzon Bus Terminal",         lat: 15.4755, lng: 120.5960 },
  { label: "Angeles City",    detail: "Pampanga Bus Terminal",              lat: 15.1450, lng: 120.5887 },
  { label: "Olongapo City",   detail: "Zambales Terminal",                  lat: 14.8335, lng: 120.2827 },
  { label: "Cabanatuan City", detail: "Nueva Ecija Terminal",               lat: 15.4900, lng: 120.9700 },
];

const PH_SUGGESTIONS = PH_TERMINALS.map((t) => `${t.label} — ${t.detail}`);

type Terminal = typeof PH_TERMINALS[number];

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  label?: string; // "From" | "To" — for map modal title
};

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          AutocompleteService: new () => {
            getPlacePredictions: (
              req: { input: string; componentRestrictions: { country: string } },
              cb: (results: { description: string }[] | null, status: string) => void
            ) => void;
          };
          PlacesServiceStatus: { OK: string };
        };
      };
    };
  }
}

// ─── Map Modal ────────────────────────────────────────────────────────────────
function MapModal({
  onSelect,
  onClose,
  label,
}: {
  onSelect: (t: Terminal) => void;
  onClose: () => void;
  label?: string;
}) {
  const [selected, setSelected] = useState<Terminal | null>(null);
  const [search, setSearch] = useState("");

  const filtered = PH_TERMINALS.filter(
    (t) =>
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.detail.toLowerCase().includes(search.toLowerCase())
  );

  // Center of Luzon Philippines
  const MAP_CENTER = { lat: 16.0, lng: 120.5 };
  const ZOOM = 7;

  // Build static map URL (works without API key for low usage, or use Maps Embed)
  // We'll use Leaflet-style open map via iframe from openstreetmap
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=117.5%2C12.5%2C124.0%2C20.5&layer=mapnik&marker=${MAP_CENTER.lat}%2C${MAP_CENTER.lng}`;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative flex flex-col bg-white rounded-t-[24px] mt-auto w-full max-w-[430px] mx-auto animate-slide-up"
        style={{ height: "90svh" }}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div>
            <h2 className="text-base font-bold font-poppins text-text-primary">
              {label ? `Pick ${label} Location` : "Pick Location"}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Tap a terminal pin or select from the list
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="#6B6570" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Map — OpenStreetMap embed, free, no API key */}
        <div className="relative mx-4 mb-3 rounded-[16px] overflow-hidden shrink-0" style={{ height: "38%" }}>
          <iframe
            src={mapSrc}
            title="Philippines Map"
            className="w-full h-full border-0"
            loading="lazy"
            style={{ filter: "saturate(0.9) contrast(1.05)" }}
          />

          {/* Terminal pin overlays — positioned over the iframe using absolute */}
          <div className="absolute inset-0 pointer-events-none">
            {/* We show pins as a visual overlay; actual selection is via list below */}
            {[
              { label: "Cubao",  x: "57%", y: "68%" },
              { label: "Pasay",  x: "55%", y: "72%" },
              { label: "Baguio", x: "50%", y: "42%" },
              { label: "Vigan",  x: "44%", y: "22%" },
              { label: "Laoag",  x: "43%", y: "10%" },
            ].map((pin) => (
              <div key={pin.label}
                className="absolute flex flex-col items-center pointer-events-none"
                style={{ left: pin.x, top: pin.y, transform: "translate(-50%, -100%)" }}>
                <div className="bg-violet-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-lg whitespace-nowrap">
                  {pin.label}
                </div>
                <div className="w-2 h-2 bg-violet-primary rotate-45 -mt-0.5 shadow-sm" />
              </div>
            ))}
          </div>

          {/* Tap-to-select hint */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <span className="bg-black/60 text-white text-[10px] font-medium px-3 py-1 rounded-full backdrop-blur-sm">
              Select from list below
            </span>
          </div>
        </div>

        {/* Search + list */}
        <div className="px-4 pb-2 shrink-0">
          <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-surface-off border border-gray-200">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="#6B6570" strokeWidth="2"/>
              <path d="M21 21l-3.5-3.5" stroke="#6B6570" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terminals or cities..."
              className="flex-1 text-[13px] bg-transparent text-text-primary placeholder:text-gray-400 outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Terminal list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5">
          {filtered.map((t, i) => {
            const isSelected = selected?.label === t.label && selected?.detail === t.detail;
            return (
              <button key={i}
                onClick={() => setSelected(t)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-[14px] text-left transition-all tap-card ${isSelected ? "ring-2 ring-violet-primary" : "bg-surface-off hover:bg-purple-light/30"}`}
                style={{ background: isSelected ? "#E9D0F3" : undefined }}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-violet-primary" : "bg-white"}`}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      fill={isSelected ? "white" : "#4C2A72"} opacity={isSelected ? "1" : "0.7"}/>
                    <circle cx="12" cy="9" r="2.5" fill={isSelected ? "#E9D0F3" : "white"}/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-semibold truncate ${isSelected ? "text-violet-primary" : "text-text-primary"}`}>
                    {t.label}
                  </p>
                  <p className="text-[11px] text-text-secondary truncate mt-0.5">{t.detail}</p>
                </div>
                {isSelected && (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#4C2A72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Confirm button */}
        <div className="px-4 pt-2 pb-6 shrink-0 border-t border-gray-100">
          <button
            disabled={!selected}
            onClick={() => { if (selected) { onSelect(selected); onClose(); } }}
            className="w-full h-13 py-3.5 rounded-[14px] text-white font-bold font-poppins active:scale-95 transition-transform disabled:opacity-40"
            style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
            {selected ? `Use ${selected.label}` : "Select a terminal"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main LocationInput component ─────────────────────────────────────────────
export default function LocationInput({ value, onChange, placeholder, icon, label }: Props) {
  const [query, setQuery]       = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [dropOpen, setDropOpen] = useState(false);
  const [mapOpen, setMapOpen]   = useState(false);
  const [focused, setFocused]   = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback((q: string) => {
    if (!q || q.length < 2) { setSuggestions([]); setDropOpen(false); return; }
    if (
      typeof window !== "undefined" &&
      window.google?.maps?.places?.AutocompleteService
    ) {
      const svc = new window.google.maps.places.AutocompleteService();
      svc.getPlacePredictions(
        { input: q, componentRestrictions: { country: "ph" } },
        (results, status) => {
          if (status === window.google!.maps!.places!.PlacesServiceStatus.OK && results) {
            setSuggestions(results.slice(0, 6).map((r) => r.description));
            setDropOpen(true);
          } else { localFallback(q); }
        }
      );
    } else { localFallback(q); }
  }, []);

  const localFallback = (q: string) => {
    const lower = q.toLowerCase();
    const filtered = PH_SUGGESTIONS.filter((s) =>
      s.toLowerCase().includes(lower)
    ).slice(0, 6);
    setSuggestions(filtered);
    setDropOpen(filtered.length > 0);
  };

  const handleChange = (v: string) => {
    setQuery(v);
    onChange(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(v), 200);
  };

  const handleSelect = (s: string) => {
    const clean = s.split(" — ")[0].trim();
    setQuery(clean);
    onChange(clean);
    setSuggestions([]);
    setDropOpen(false);
  };

  const handleMapSelect = (t: Terminal) => {
    setQuery(t.label);
    onChange(t.label);
    setSuggestions([]);
    setDropOpen(false);
  };

  return (
    <>
      <div ref={containerRef} className="relative">
        <div className={`flex items-center gap-2.5 h-11 px-3 rounded-xl border transition-all ${focused ? "border-violet-primary bg-white" : "border-gray-100 bg-surface-off"}`}>
          {icon}
          <input
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => { setFocused(true); if (query.length >= 2) fetchSuggestions(query); }}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            autoComplete="off"
            className="flex-1 text-[13px] bg-transparent text-text-primary placeholder:text-gray-400 outline-none"
          />

          {/* Clear button */}
          {query && (
            <button type="button"
              onMouseDown={(e) => { e.preventDefault(); handleChange(""); }}
              className="text-gray-300 hover:text-gray-500 transition-colors p-0.5">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          {/* Map pin button */}
          <button type="button"
            onMouseDown={(e) => { e.preventDefault(); setDropOpen(false); setMapOpen(true); }}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all active:scale-90 ${mapOpen ? "bg-violet-primary" : "bg-purple-light hover:bg-purple-secondary/30"}`}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill={mapOpen ? "white" : "#4C2A72"} opacity="0.9"/>
              <circle cx="12" cy="9" r="2.5" fill={mapOpen ? "#E9D0F3" : "white"}/>
            </svg>
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {dropOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-card-lg border border-gray-100 overflow-hidden z-50 animate-scale-in">
            {suggestions.map((s, i) => (
              <button key={i} type="button"
                onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-off active:bg-purple-light transition-colors ${i < suggestions.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "#F0EAF7" }}>
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                      fill="#4C2A72"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary truncate">{s.split(" — ")[0]}</p>
                  {s.includes(" — ") && (
                    <p className="text-[11px] text-text-secondary truncate">{s.split(" — ")[1]}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map modal */}
      {mapOpen && (
        <MapModal
          label={label}
          onSelect={handleMapSelect}
          onClose={() => setMapOpen(false)}
        />
      )}
    </>
  );
}
