// Distinct operator wordmark badges — no generic bus icon
type Props = { operatorId: string; size?: "sm" | "md" | "lg" };

const OPERATORS: Record<string, { bg: string; text: string; accent: string; abbr: string; full: string }> = {
  victory: { bg: "#B22222", text: "white", accent: "#FFD700", abbr: "VL", full: "Victory Liner" },
  genesis:  { bg: "#1B3A8A", text: "white", accent: "#60A5FA", abbr: "GT", full: "Genesis Transport" },
  partas:   { bg: "#1A6B2A", text: "white", accent: "#86EFAC", abbr: "PT", full: "Partas" },
  solidnorth: { bg: "#7B3F00", text: "white", accent: "#FCD34D", abbr: "SN", full: "Solid North" },
};

export default function OperatorLogo({ operatorId, size = "md" }: Props) {
  const op = OPERATORS[operatorId] ?? OPERATORS.victory;
  const sz = size === "sm" ? "w-8 h-8 text-[10px]" : size === "lg" ? "w-14 h-14 text-base" : "w-10 h-10 text-xs";

  return (
    <div className={`${sz} rounded-xl flex items-center justify-center font-bold font-poppins shadow-sm shrink-0`}
      style={{ background: op.bg, color: op.text, border: `2px solid ${op.accent}33` }}>
      {op.abbr}
    </div>
  );
}

export function OperatorBadge({ operatorId }: { operatorId: string }) {
  const op = OPERATORS[operatorId] ?? OPERATORS.victory;
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: op.bg + "18", color: op.bg }}>
      {op.full}
    </span>
  );
}
