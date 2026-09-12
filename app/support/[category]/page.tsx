"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SUPPORT_CATEGORIES } from "@/lib/mockData";
import TopBar from "@/components/TopBar";
import SupportIcon from "@/components/SupportIcon";

export default function SupportCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const cat = SUPPORT_CATEGORIES.find((c) => c.id === category);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!cat) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-3">
      <p className="text-text-secondary">Category not found.</p>
      <Link href="/support" className="text-violet-primary font-semibold text-sm">← Help Center</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-8">
      <TopBar title={cat.title} back="/support" />

      <div className="px-4 pt-4 space-y-3">
        {/* Category header */}
        <div className="bg-white rounded-card shadow-card p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "#F0EAF7" }}>
            <SupportIcon id={cat.id} />
          </div>
          <div>
            <h2 className="text-base font-bold font-poppins text-text-primary">{cat.title}</h2>
            <p className="text-xs text-text-secondary">{cat.description}</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {cat.faqs.map((faq, i) => (
            <div key={i} className={`border-b border-gray-50 last:border-0`}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-4 text-left tap-card">
                <span className={`text-sm font-semibold flex-1 pr-3 ${openIndex === i ? "text-violet-primary" : "text-text-primary"}`}>
                  {faq.q}
                </span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
                  className={`shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180 text-violet-primary" : "text-text-secondary"}`}>
                  <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 animate-fade-in">
                  <div className="bg-surface-off rounded-xl p-3">
                    <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="bg-white rounded-card shadow-card p-4 text-center">
          <p className="text-sm font-semibold text-text-primary mb-1">Didn't find what you need?</p>
          <p className="text-xs text-text-secondary mb-3">Our AI assistant can help with anything not covered here.</p>
          <Link href="/ai-assistant"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-btn text-white font-semibold text-sm active:scale-95 transition-transform"
            style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.477 2 2 6.277 2 11.5c0 2.304.87 4.408 2.3 6.02L3 22l4.8-1.56A10.14 10.14 0 0012 21c5.523 0 10-4.277 10-9.5S17.523 2 12 2z" fill="white"/>
            </svg>
            Chat with Us
          </Link>
        </div>
      </div>
    </div>
  );
}
