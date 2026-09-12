"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TopBarProps = {
  title?: string;
  back?: string | boolean; // href string or true for router.back()
  right?: React.ReactNode;
  transparent?: boolean;
  light?: boolean; // light text (for dark backgrounds)
};

export default function TopBar({ title, back, right, transparent, light }: TopBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof back === "string") router.push(back);
    else router.back();
  };

  const textColor = light ? "text-white" : "text-text-primary";
  const iconColor = light ? "white" : "#1F1B24";

  return (
    <div className={`flex items-center justify-between px-4 py-3 ${transparent ? "bg-transparent" : "bg-white"} ${!transparent ? "border-b border-[#F0EAF7]" : ""}`}>
      <div className="w-10">
        {back !== undefined && (
          <button onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" stroke={iconColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {title && (
        <h1 className={`text-[16px] font-semibold ${textColor} font-poppins text-center flex-1`}>
          {title}
        </h1>
      )}
      <div className="w-10 flex justify-end">
        {right}
      </div>
    </div>
  );
}
