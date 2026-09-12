// Monochrome SVG icons for support categories
export default function SupportIcon({ id }: { id: string }) {
  const props = { width: 22, height: 22, fill: "none", viewBox: "0 0 24 24" } as const;

  if (id === "booking") return (
    <svg {...props}>
      <rect x="3" y="4" width="18" height="18" rx="3" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M8 2v4M16 2v4M3 10h18" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 15l2 2 4-4" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  if (id === "refund") return (
    <svg {...props}>
      <path d="M3 12a9 9 0 009 9 9 9 0 000-18 9 9 0 00-6.364 2.636L3 9"
        stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M3 4v5h5" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7v5l3 3" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );

  if (id === "eticket") return (
    <svg {...props}>
      <rect x="5" y="2" width="14" height="20" rx="3" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M9 7h6M9 11h6M9 15h4" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="8" y="14" width="4" height="4" rx="1" stroke="#4C2A72" strokeWidth="1.5"/>
    </svg>
  );

  if (id === "account") return (
    <svg {...props}>
      <circle cx="12" cy="8" r="4" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );

  if (id === "bus") return (
    <svg {...props}>
      <rect x="2" y="5" width="20" height="13" rx="3" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M2 11h20" stroke="#4C2A72" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="7" cy="19" r="1.5" stroke="#4C2A72" strokeWidth="1.5"/>
      <circle cx="17" cy="19" r="1.5" stroke="#4C2A72" strokeWidth="1.5"/>
      <path d="M7 5V3M17 5V3" stroke="#4C2A72" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  if (id === "ai") return (
    <svg {...props}>
      <path d="M12 2C6.477 2 2 6.277 2 11.5c0 2.304.87 4.408 2.3 6.02L3 22l4.8-1.56A10.14 10.14 0 0012 21c5.523 0 10-4.277 10-9.5S17.523 2 12 2z"
        stroke="#4C2A72" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      <circle cx="8.5" cy="11.5" r="1" fill="#4C2A72"/>
      <circle cx="12" cy="11.5" r="1" fill="#4C2A72"/>
      <circle cx="15.5" cy="11.5" r="1" fill="#4C2A72"/>
    </svg>
  );

  // fallback
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="9" stroke="#4C2A72" strokeWidth="1.8"/>
      <path d="M12 8v1M12 11v5" stroke="#4C2A72" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
