"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";

const QUICK_TAGS = [
  { id: "ontime",     label: "On time",          positive: true },
  { id: "clean",      label: "Clean bus",         positive: true },
  { id: "friendly",   label: "Friendly driver",   positive: true },
  { id: "comfortable",label: "Comfortable seats", positive: true },
  { id: "delayed",    label: "Delayed",           positive: false },
  { id: "uncomfortable", label: "Uncomfortable seats", positive: false },
  { id: "noaircon",   label: "Aircon not working",positive: false },
  { id: "staff",      label: "Unhelpful staff",   positive: false },
];

export default function RateTripPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useApp();
  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (t: string) =>
    setSelectedTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const handleSubmit = () => {
    if (stars === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      showToast("Thanks for your feedback! 🎉");
      router.push("/my-bookings");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-28">
      <TopBar title="Rate Your Trip" back={`/booking-detail/${id}`} />

      <div className="px-4 pt-6 space-y-5">
        {/* Stars */}
        <div className="bg-white rounded-card shadow-card p-6 text-center">
          <p className="text-base font-bold font-poppins text-text-primary mb-1">How was your trip?</p>
          <p className="text-xs text-text-secondary mb-5">Tap a star to rate</p>
          <div className="flex justify-center gap-3 mb-3">
            {[1,2,3,4,5].map((s) => (
              <button key={s}
                className="star-btn"
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setStars(s)}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={s <= (hoveredStar || stars) ? "#F4B400" : "#E9D0F3"}
                    stroke={s <= (hoveredStar || stars) ? "#F4B400" : "#B797C4"}
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}
          </div>
          {stars > 0 && (
            <p className="text-sm font-semibold text-text-secondary animate-fade-in">
              {["","Terrible 😞","Poor 😕","Okay 😐","Good 😊","Excellent! 🌟"][stars]}
            </p>
          )}
        </div>

        {/* Quick tags */}
        <div className="bg-white rounded-card shadow-card p-4">
          <p className="text-sm font-bold font-poppins text-text-primary mb-3">What stood out?</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map((tag) => {
              const active = selectedTags.includes(tag.id);
              return (
                <button key={tag.id} onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 border ${
                    active
                      ? tag.positive
                        ? "bg-[#E8F5E9] border-success/40 text-success"
                        : "bg-red-50 border-danger/30 text-danger"
                      : "bg-surface-off border-gray-200 text-text-secondary"
                  }`}>
                  {tag.positive && active ? "✓ " : ""}{tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <div className="bg-white rounded-card shadow-card p-4">
          <p className="text-sm font-bold font-poppins text-text-primary mb-2">Additional comments</p>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience... (optional)"
            rows={4}
            className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-surface-off text-sm text-text-primary placeholder:text-gray-400 resize-none" />
          <p className="text-[11px] text-text-secondary mt-1 text-right">{comment.length}/300</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-40">
        <button onClick={handleSubmit} disabled={stars === 0 || submitted}
          className="w-full h-14 rounded-btn text-white font-bold font-poppins active:scale-95 transition-transform disabled:opacity-40 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(90deg,#401551,#4C2A72)" }}>
          {submitted ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Submitting...
            </>
          ) : "Submit Rating"}
        </button>
      </div>
    </div>
  );
}
