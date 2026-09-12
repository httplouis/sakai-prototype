"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Trip, Passenger, SavedPaymentMethod, Booking } from "./mockData";
import { MOCK_BOOKINGS, SAVED_PAYMENT_METHODS, SAVED_PASSENGERS } from "./mockData";

export type PaymentMethodType = "gcash" | "maya" | "visa" | "mastercard" | "bank";

export type BookingState = {
  selectedTrip: Trip | null;
  selectedSeats: string[];
  passengers: Passenger[];
  addons: { insurance: boolean; meal: boolean; priorityBoarding: boolean };
  paymentMethod: PaymentMethodType | null;
  promoCode: string;
  promoDiscount: number;
  totalFare: number;
};

export type AppContextType = {
  // Booking flow
  booking: BookingState;
  setSelectedTrip: (trip: Trip) => void;
  toggleSeat: (seatId: string) => void;
  setPassengers: (passengers: Passenger[]) => void;
  setAddons: (addons: BookingState["addons"]) => void;
  setPaymentMethod: (method: PaymentMethodType) => void;
  applyPromo: (code: string, discount: number) => void;
  clearBooking: () => void;

  // Bookings list (persisted in localStorage)
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;

  // Saved passengers
  savedPassengers: typeof SAVED_PASSENGERS;
  addSavedPassenger: (p: Passenger) => void;
  removeSavedPassenger: (id: string) => void;

  // Payment methods
  paymentMethods: SavedPaymentMethod[];
  addPaymentMethod: (pm: SavedPaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  // User
  user: { name: string; email: string; phone: string };
  isLoggedIn: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;

  // Notification/language settings
  notifSettings: Record<string, boolean>;
  toggleNotif: (key: string) => void;
  language: "en" | "fil";
  setLanguage: (lang: "en" | "fil") => void;

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
};

const defaultBooking: BookingState = {
  selectedTrip: null,
  selectedSeats: [],
  passengers: [],
  addons: { insurance: false, meal: false, priorityBoarding: false },
  paymentMethod: null,
  promoCode: "",
  promoDiscount: 0,
  totalFare: 0,
};

const AppContext = createContext<AppContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(defaultBooking);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [savedPassengers, setSavedPassengers] = useState(SAVED_PASSENGERS);
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>(SAVED_PAYMENT_METHODS);
  const [user, setUser] = useState({ name: "Juan dela Cruz", email: "juan@email.com", phone: "0917-456-7890" });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [notifSettings, setNotifSettings] = useState({
    bookingReminders: true,
    promoAlerts: true,
    aiSuggestions: true,
    paymentConfirmations: true,
  });
  const [language, setLanguage] = useState<"en" | "fil">("en");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const setSelectedTrip = (trip: Trip) => {
    setBooking((b) => ({
      ...b,
      selectedTrip: trip,
      selectedSeats: [],
      totalFare: trip.fare,
    }));
  };

  const toggleSeat = (seatNumber: string) => {
    setBooking((b) => {
      const exists = b.selectedSeats.includes(seatNumber);
      const next = exists
        ? b.selectedSeats.filter((s) => s !== seatNumber)
        : [...b.selectedSeats, seatNumber];
      const baseFare = b.selectedTrip ? b.selectedTrip.fare * next.length : 0;
      const addonsExtra =
        (b.addons.insurance ? 50 : 0) +
        (b.addons.meal ? 80 : 0) +
        (b.addons.priorityBoarding ? 30 : 0);
      return {
        ...b,
        selectedSeats: next,
        totalFare: Math.max(0, baseFare + addonsExtra * next.length - b.promoDiscount),
      };
    });
  };

  const setPassengers = (passengers: Passenger[]) =>
    setBooking((b) => ({ ...b, passengers }));

  const setAddons = (addons: BookingState["addons"]) => {
    setBooking((b) => {
      const baseFare = b.selectedTrip ? b.selectedTrip.fare * Math.max(1, b.selectedSeats.length) : 0;
      const extra =
        (addons.insurance ? 50 : 0) +
        (addons.meal ? 80 : 0) +
        (addons.priorityBoarding ? 30 : 0);
      const seats = Math.max(1, b.selectedSeats.length);
      return { ...b, addons, totalFare: Math.max(0, baseFare + extra * seats - b.promoDiscount) };
    });
  };

  const setPaymentMethod = (method: PaymentMethodType) =>
    setBooking((b) => ({ ...b, paymentMethod: method }));

  const applyPromo = (code: string, discount: number) =>
    setBooking((b) => {
      // Recalculate from base fare so promos never double-stack
      const baseFare = b.selectedTrip
        ? b.selectedTrip.fare * Math.max(1, b.selectedSeats.length)
        : 0;
      const addonsExtra =
        (b.addons.insurance ? 50 : 0) +
        (b.addons.meal ? 80 : 0) +
        (b.addons.priorityBoarding ? 30 : 0);
      const seats = Math.max(1, b.selectedSeats.length);
      const newTotal = Math.max(0, baseFare + addonsExtra * seats - discount);
      return {
        ...b,
        promoCode: code,
        promoDiscount: discount,
        totalFare: newTotal,
      };
    });

  const clearBooking = () => setBooking(defaultBooking);

  const addBooking = (b: Booking) => {
    setBookings((prev) => [b, ...prev]);
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
    );
  };

  const addSavedPassenger = (p: Passenger) =>
    setSavedPassengers((prev) => [...prev, p]);

  const removeSavedPassenger = (id: string) =>
    setSavedPassengers((prev) => prev.filter((p) => p.id !== id));

  const addPaymentMethod = (pm: SavedPaymentMethod) =>
    setPaymentMethods((prev) => [...prev, pm]);

  const removePaymentMethod = (id: string) =>
    setPaymentMethods((prev) => prev.filter((p) => p.id !== id));

  const setDefaultPaymentMethod = (id: string) =>
    setPaymentMethods((prev) =>
      prev.map((p) => ({ ...p, isDefault: p.id === id }))
    );

  const login = (name: string, email: string) => {
    setUser((u) => ({ ...u, name, email }));
    setIsLoggedIn(true);
  };

  const logout = () => setIsLoggedIn(false);

  const toggleNotif = (key: string) =>
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  return (
    <AppContext.Provider
      value={{
        booking,
        setSelectedTrip,
        toggleSeat,
        setPassengers,
        setAddons,
        setPaymentMethod,
        applyPromo,
        clearBooking,
        bookings,
        addBooking,
        cancelBooking,
        savedPassengers,
        addSavedPassenger,
        removeSavedPassenger,
        paymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        user,
        isLoggedIn,
        login,
        logout,
        notifSettings,
        toggleNotif,
        language,
        setLanguage,
        toast,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] toast">
          <div className="bg-[#1F1B24] text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg whitespace-nowrap">
            {toast}
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within BookingProvider");
  return ctx;
}
