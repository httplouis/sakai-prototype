"use client";
import { useApp } from "@/lib/BookingContext";
import TopBar from "@/components/TopBar";

const NOTIF_ITEMS = [
  { key: "bookingReminders",      label: "Booking Reminders",       sub: "Alerts before your trip departure time." },
  { key: "promoAlerts",           label: "Promo & Discount Alerts",  sub: "Exclusive deals and limited-time offers." },
  { key: "aiSuggestions",         label: "AI Trip Suggestions",      sub: "Personalized trip picks based on your history." },
  { key: "paymentConfirmations",  label: "Payment Confirmations",    sub: "Instant notifications on every transaction." },
];

export default function NotificationSettingsPage() {
  const { notifSettings, toggleNotif } = useApp();

  return (
    <div className="min-h-screen bg-surface-off flex flex-col pb-8">
      <TopBar title="Notification Settings" back="/profile" />

      <div className="px-4 pt-4 space-y-3">
        <p className="text-xs text-text-secondary px-1">Manage which notifications SakAi sends you.</p>

        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {NOTIF_ITEMS.map((item, i) => {
            const on = !!notifSettings[item.key];
            return (
              <div key={item.key}
                className={`flex items-center justify-between px-4 py-4 ${i < NOTIF_ITEMS.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="flex-1 pr-4">
                  <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{item.sub}</p>
                </div>
                {/* Toggle */}
                <button onClick={() => toggleNotif(item.key)}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${on ? "bg-violet-primary" : "bg-gray-200"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform duration-200 ${on ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-purple-light rounded-xl p-3 border border-purple-secondary/20">
          <p className="text-xs text-violet-primary font-medium leading-relaxed">
            📱 Push notifications require your device permissions. Visit your phone settings if you're not receiving alerts.
          </p>
        </div>
      </div>
    </div>
  );
}
