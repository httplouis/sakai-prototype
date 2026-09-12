// Real-brand payment logos as inline SVG / styled marks

type Props = { type: string; size?: number };

export default function PaymentLogo({ type, size = 32 }: Props) {
  if (type === "gcash") return <GCashLogo size={size} />;
  if (type === "maya") return <MayaLogo size={size} />;
  if (type === "visa") return <VisaLogo size={size} />;
  if (type === "mastercard") return <MastercardLogo size={size} />;
  if (type === "bank") return <BankLogo size={size} />;
  return null;
}

function GCashLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill="#007DFE" />
      <text x="24" y="30" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">
        GCash
      </text>
    </svg>
  );
}

function MayaLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill="#00B4A0" />
      <text x="24" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Arial, sans-serif">
        maya
      </text>
    </svg>
  );
}

function VisaLogo({ size }: { size: number }) {
  const w = size * 1.6;
  return (
    <svg width={w} height={size} viewBox="0 0 80 48" fill="none">
      <rect width="80" height="48" rx="8" fill="#1434CB" />
      <text x="40" y="32" textAnchor="middle" fill="white" fontSize="22" fontWeight="800"
        fontFamily="Arial, sans-serif" letterSpacing="-1">VISA</text>
    </svg>
  );
}

function MastercardLogo({ size }: { size: number }) {
  return (
    <svg width={size * 1.4} height={size} viewBox="0 0 56 40" fill="none">
      <circle cx="20" cy="20" r="16" fill="#EB001B" />
      <circle cx="36" cy="20" r="16" fill="#F79E1B" />
      <path d="M28 8.4a16 16 0 010 23.2A16 16 0 0128 8.4z" fill="#FF5F00" />
    </svg>
  );
}

function BankLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="10" fill="#2563EB" />
      <path d="M10 34h28M10 22h28" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 14l14 8H10l14-8z" fill="white" />
      <rect x="14" y="22" width="4" height="12" fill="white" />
      <rect x="22" y="22" width="4" height="12" fill="white" />
      <rect x="30" y="22" width="4" height="12" fill="white" />
    </svg>
  );
}
