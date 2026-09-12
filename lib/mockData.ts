// ─── Types ───────────────────────────────────────────────────────────────────

export type Operator = {
  id: string;
  name: string;
  shortName: string;
  logoColor: string; // used for operator badge bg
  accentColor: string;
  rating: number;
};

export type Trip = {
  id: string;
  operatorId: string;
  operator: Operator;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departure: string; // "08:30 AM"
  arrival: string;   // "02:00 PM"
  duration: string;  // "5h 30m"
  fare: number;
  busType: string;   // "Deluxe", "Super Deluxe", "Tourist"
  aircon: boolean;
  wifi: boolean;
  meals: boolean;
  seatsLeft: number;
  totalSeats: number;
  date: string;      // "2026-09-13"
  isBestMatch?: boolean;
  amenities: string[];
};

export type Seat = {
  id: string;
  number: string;
  row: number;
  col: number;
  status: "available" | "taken" | "selected" | "reserved";
};

export type Booking = {
  id: string;
  tripId: string;
  trip: Trip;
  seats: string[];
  passengers: Passenger[];
  totalFare: number;
  status: "upcoming" | "completed" | "cancelled";
  bookingDate: string;
  paymentMethod: string;
  referenceNumber: string;
  promoApplied?: string;
  promoDiscount?: number;
};

export type Passenger = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  type: "adult" | "child" | "senior" | "pwd";
  idType?: string;
  idNumber?: string;
};

export type SavedPaymentMethod = {
  id: string;
  type: "visa" | "mastercard" | "gcash" | "maya" | "bank";
  label: string;
  maskedNumber: string;
  isDefault: boolean;
};

export type SupportCategory = {
  id: string;
  icon: string;
  title: string;
  description: string;
  faqs: { q: string; a: string }[];
};

// ─── Operators ───────────────────────────────────────────────────────────────

export const OPERATORS: Operator[] = [
  {
    id: "victory",
    name: "Victory Liner",
    shortName: "Victory",
    logoColor: "#B22222",
    accentColor: "#FFD700",
    rating: 4.3,
  },
  {
    id: "genesis",
    name: "Genesis Transport",
    shortName: "Genesis",
    logoColor: "#1B3A8A",
    accentColor: "#E8F0FE",
    rating: 4.5,
  },
  {
    id: "partas",
    name: "Partas Trans Co.",
    shortName: "Partas",
    logoColor: "#1A6B2A",
    accentColor: "#E8F5E9",
    rating: 4.1,
  },
  {
    id: "solidnorth",
    name: "Solid North",
    shortName: "Solid North",
    logoColor: "#7B3F00",
    accentColor: "#FFF3E0",
    rating: 4.0,
  },
];

const getOp = (id: string) => OPERATORS.find((o) => o.id === id)!;

// ─── Trips ───────────────────────────────────────────────────────────────────

export const TRIPS: Trip[] = [
  // Manila (Cubao) → Baguio
  {
    id: "trip-001",
    operatorId: "victory",
    operator: getOp("victory"),
    from: "Manila (Cubao)",
    fromCode: "QC",
    to: "Baguio City",
    toCode: "BGO",
    departure: "08:30 AM",
    arrival: "02:15 PM",
    duration: "5h 45m",
    fare: 880,
    busType: "Deluxe",
    aircon: true,
    wifi: false,
    meals: false,
    seatsLeft: 28,
    totalSeats: 54,
    date: "2026-09-13",
    isBestMatch: true,
    amenities: ["Aircon", "Reclining Seats", "USB Charging", "Restroom"],
  },
  {
    id: "trip-002",
    operatorId: "genesis",
    operator: getOp("genesis"),
    from: "Manila (Cubao)",
    fromCode: "QC",
    to: "Baguio City",
    toCode: "BGO",
    departure: "06:00 AM",
    arrival: "11:45 AM",
    duration: "5h 45m",
    fare: 950,
    busType: "Super Deluxe",
    aircon: true,
    wifi: true,
    meals: false,
    seatsLeft: 12,
    totalSeats: 42,
    date: "2026-09-13",
    amenities: ["Aircon", "Wi-Fi", "Reclining Seats", "USB Charging", "Restroom", "Entertainment"],
  },
  {
    id: "trip-003",
    operatorId: "partas",
    operator: getOp("partas"),
    from: "Manila (Cubao)",
    fromCode: "QC",
    to: "Baguio City",
    toCode: "BGO",
    departure: "10:00 PM",
    arrival: "04:00 AM",
    duration: "6h 00m",
    fare: 760,
    busType: "Tourist",
    aircon: true,
    wifi: false,
    meals: false,
    seatsLeft: 35,
    totalSeats: 54,
    date: "2026-09-13",
    amenities: ["Aircon", "Reclining Seats"],
  },
  {
    id: "trip-004",
    operatorId: "solidnorth",
    operator: getOp("solidnorth"),
    from: "Manila (Cubao)",
    fromCode: "QC",
    to: "Baguio City",
    toCode: "BGO",
    departure: "11:30 PM",
    arrival: "05:30 AM",
    duration: "6h 00m",
    fare: 820,
    busType: "Deluxe",
    aircon: true,
    wifi: false,
    meals: false,
    seatsLeft: 8,
    totalSeats: 46,
    date: "2026-09-13",
    amenities: ["Aircon", "Reclining Seats", "USB Charging"],
  },
  // Manila (Pasay) → Baguio
  {
    id: "trip-005",
    operatorId: "victory",
    operator: getOp("victory"),
    from: "Manila (Pasay)",
    fromCode: "PAS",
    to: "Baguio City",
    toCode: "BGO",
    departure: "09:00 AM",
    arrival: "03:00 PM",
    duration: "6h 00m",
    fare: 860,
    busType: "Deluxe",
    aircon: true,
    wifi: false,
    meals: false,
    seatsLeft: 22,
    totalSeats: 54,
    date: "2026-09-13",
    amenities: ["Aircon", "Reclining Seats", "USB Charging"],
  },
  // Manila → Vigan
  {
    id: "trip-006",
    operatorId: "partas",
    operator: getOp("partas"),
    from: "Manila (Cubao)",
    fromCode: "QC",
    to: "Vigan City",
    toCode: "VGN",
    departure: "08:00 PM",
    arrival: "06:00 AM",
    duration: "10h 00m",
    fare: 1100,
    busType: "Super Deluxe",
    aircon: true,
    wifi: false,
    meals: false,
    seatsLeft: 18,
    totalSeats: 46,
    date: "2026-09-13",
    amenities: ["Aircon", "Reclining Seats", "Restroom"],
  },
  {
    id: "trip-007",
    operatorId: "solidnorth",
    operator: getOp("solidnorth"),
    from: "Manila (Cubao)",
    fromCode: "QC",
    to: "Vigan City",
    toCode: "VGN",
    departure: "07:00 PM",
    arrival: "05:30 AM",
    duration: "10h 30m",
    fare: 980,
    busType: "Tourist",
    aircon: true,
    wifi: false,
    meals: false,
    seatsLeft: 31,
    totalSeats: 54,
    date: "2026-09-13",
    amenities: ["Aircon", "Reclining Seats"],
  },
];

export const getTripById = (id: string): Trip | undefined =>
  TRIPS.find((t) => t.id === id);

export const searchTrips = (from: string, to: string): Trip[] =>
  TRIPS.filter(
    (t) =>
      t.from.toLowerCase().includes(from.toLowerCase()) &&
      t.to.toLowerCase().includes(to.toLowerCase())
  );

// ─── Seat Layout Generator ────────────────────────────────────────────────────

export const generateSeats = (totalSeats: number = 54, seatsLeft: number = 28): Seat[] => {
  const seats: Seat[] = [];
  const takenCount = totalSeats - seatsLeft;
  const takenIndices = new Set<number>();
  while (takenIndices.size < takenCount) {
    takenIndices.add(Math.floor(Math.random() * totalSeats));
  }
  let idx = 0;
  for (let row = 1; row <= Math.ceil(totalSeats / 4); row++) {
    for (let col = 0; col < 4; col++) {
      if (idx >= totalSeats) break;
      // Skip middle aisle (col 2 gets gap visually, not in data)
      const seatLetter = ["A", "B", "C", "D"][col];
      seats.push({
        id: `seat-${row}${seatLetter}`,
        number: `${row}${seatLetter}`,
        row,
        col,
        status: takenIndices.has(idx) ? "taken" : "available",
      });
      idx++;
    }
  }
  return seats;
};

// ─── Mock Bookings ────────────────────────────────────────────────────────────

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "bkg-001",
    tripId: "trip-001",
    trip: { ...TRIPS[0], date: "2026-09-15" },
    seats: ["3A", "3B"],
    passengers: [
      { id: "p1", firstName: "Juan", lastName: "dela Cruz", dob: "1990-05-15", type: "adult" },
      { id: "p2", firstName: "Maria", lastName: "dela Cruz", dob: "1993-08-22", type: "adult" },
    ],
    totalFare: 1760,
    status: "upcoming",
    bookingDate: "2026-09-12",
    paymentMethod: "GCash",
    referenceNumber: "SKI-20260912-4821",
  },
  {
    id: "bkg-002",
    tripId: "trip-002",
    trip: { ...TRIPS[1], date: "2026-08-20" },
    seats: ["7C"],
    passengers: [
      { id: "p1", firstName: "Juan", lastName: "dela Cruz", dob: "1990-05-15", type: "adult" },
    ],
    totalFare: 950,
    status: "completed",
    bookingDate: "2026-08-18",
    paymentMethod: "Maya",
    referenceNumber: "SKI-20260818-3397",
  },
  {
    id: "bkg-003",
    tripId: "trip-005",
    trip: { ...TRIPS[4], date: "2026-07-10" },
    seats: ["12A"],
    passengers: [
      { id: "p1", firstName: "Juan", lastName: "dela Cruz", dob: "1990-05-15", type: "adult" },
    ],
    totalFare: 860,
    status: "cancelled",
    bookingDate: "2026-07-08",
    paymentMethod: "Visa",
    referenceNumber: "SKI-20260708-2241",
  },
];

export const getBookingById = (id: string): Booking | undefined =>
  MOCK_BOOKINGS.find((b) => b.id === id);

// ─── Saved Passengers ─────────────────────────────────────────────────────────

export const SAVED_PASSENGERS: Passenger[] = [
  { id: "sp1", firstName: "Juan", lastName: "dela Cruz", dob: "1990-05-15", type: "adult" },
  { id: "sp2", firstName: "Maria", lastName: "dela Cruz", dob: "1993-08-22", type: "adult" },
  { id: "sp3", firstName: "Jose", lastName: "dela Cruz", dob: "2015-03-10", type: "child" },
];

// ─── Saved Payment Methods ────────────────────────────────────────────────────

export const SAVED_PAYMENT_METHODS: SavedPaymentMethod[] = [
  { id: "pm1", type: "visa", label: "Visa", maskedNumber: "•••• 4821", isDefault: true },
  { id: "pm2", type: "gcash", label: "GCash", maskedNumber: "0917•••4567", isDefault: false },
  { id: "pm3", type: "mastercard", label: "Mastercard", maskedNumber: "•••• 9934", isDefault: false },
];

// ─── Promo Codes ──────────────────────────────────────────────────────────────

export const PROMO_CODES: Record<string, number> = {
  FIRSTRIDE10: 10,  // 10% off
  BAGUIO50: 50,     // ₱50 off
  SAKAI20: 20,      // ₱20 off
  LAKBAY15: 15,     // 15% off
};

export const validatePromo = (code: string, total: number): { valid: boolean; discount: number; message: string } => {
  const upper = code.toUpperCase();
  if (!PROMO_CODES[upper]) return { valid: false, discount: 0, message: "Invalid promo code. Please try again." };
  const val = PROMO_CODES[upper];
  // Percentage codes (FIRSTRIDE10=10%, LAKBAY15=15%) vs flat codes (BAGUIO50=₱50, SAKAI20=₱20)
  const isPercent = upper === "FIRSTRIDE10" || upper === "LAKBAY15";
  const discount = isPercent ? Math.round((val / 100) * total) : val;
  return { valid: true, discount, message: `Promo applied! You saved ₱${discount}.` };
};

// ─── Support Categories ───────────────────────────────────────────────────────

export const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: "booking",
    icon: "🎫",
    title: "Booking & Payment",
    description: "Questions about booking trips and payment methods",
    faqs: [
      {
        q: "How do I book a trip on SakAi?",
        a: "Simply tap 'Book a Trip' or use the search card on Home. Enter your origin, destination, and travel date, then select from the available trips. You can also ask our AI Assistant to find the best trip for you!",
      },
      {
        q: "What payment methods are accepted?",
        a: "SakAi accepts GCash, Maya (PayMaya), Visa, Mastercard, and bank transfers. All transactions are secured with 256-bit SSL encryption.",
      },
      {
        q: "Can I pay in installments?",
        a: "Installment options are available for select credit cards (Visa/Mastercard). Check your card's terms during checkout.",
      },
      {
        q: "Is my payment information safe?",
        a: "Yes. SakAi uses PCI-DSS compliant payment processing. We never store full card numbers on our servers.",
      },
      {
        q: "Can I use multiple promo codes?",
        a: "Only one promo code can be applied per booking. Promo codes cannot be combined with other ongoing discounts.",
      },
    ],
  },
  {
    id: "cancellation",
    icon: "🔄",
    title: "Cancellation & Refunds",
    description: "Policies on cancellations and getting your money back",
    faqs: [
      {
        q: "What is the cancellation policy?",
        a: "Cancellations made 24 hours or more before departure are eligible for an 80% refund. Cancellations within 24 hours are non-refundable.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are processed within 3–7 business days for GCash and Maya, and 5–10 business days for credit/debit cards.",
      },
      {
        q: "Can I reschedule instead of cancel?",
        a: "Rescheduling is not yet available in-app. Please cancel and rebook. Cancellation fees may apply.",
      },
      {
        q: "What if my bus is cancelled by the operator?",
        a: "You will receive a full 100% refund within 24 hours if your trip is cancelled by the bus operator. You'll be notified immediately via SMS and push notification.",
      },
    ],
  },
  {
    id: "eticket",
    icon: "📱",
    title: "E-Tickets & Boarding",
    description: "How to access and use your digital ticket",
    faqs: [
      {
        q: "Where can I find my e-ticket?",
        a: "Your e-ticket is available in My Bookings. Tap 'View Ticket' on any upcoming booking. It's also sent to your registered email.",
      },
      {
        q: "Do I need to print my ticket?",
        a: "No! Just show your QR code at the terminal. The bus conductor will scan it directly from your phone screen.",
      },
      {
        q: "What if I lose phone signal at the terminal?",
        a: "Tap 'Save to Gallery' on your e-ticket to save a screenshot locally. This works offline.",
      },
      {
        q: "Can I board with a screenshot of my ticket?",
        a: "Yes, screenshots are accepted as long as the QR code is clearly visible. However, we recommend using the live app for the best experience.",
      },
    ],
  },
  {
    id: "accounts",
    icon: "👤",
    title: "Account & Profile",
    description: "Managing your SakAi account and personal info",
    faqs: [
      {
        q: "How do I change my password?",
        a: "Go to Profile → Account Security → Change Password. You'll need to verify your identity via OTP first.",
      },
      {
        q: "Can I have multiple accounts?",
        a: "One account per mobile number is allowed. You can, however, save multiple passengers under one account.",
      },
      {
        q: "How do I delete my account?",
        a: "To delete your account, contact our support team. Note that active bookings must be resolved before deletion.",
      },
    ],
  },
  {
    id: "operators",
    icon: "🚌",
    title: "Bus Operators",
    description: "Info about bus lines, terminals, and amenities",
    faqs: [
      {
        q: "Which bus operators are on SakAi?",
        a: "Currently: Victory Liner, Genesis Transport, Partas Trans Co., and Solid North. We're onboarding more operators regularly.",
      },
      {
        q: "Where do Victory Liner buses depart from?",
        a: "Victory Liner operates from Cubao (EDSA cor. New York) and Pasay (PITX). Check the trip details for the exact terminal.",
      },
      {
        q: "Are the amenities listed guaranteed?",
        a: "Listed amenities (aircon, Wi-Fi, USB charging) are provided by the operator. SakAi displays operator-confirmed information but cannot guarantee last-minute equipment changes.",
      },
    ],
  },
  {
    id: "ai",
    icon: "✨",
    title: "AI Assistant",
    description: "How the SakAi AI finds and recommends trips for you",
    faqs: [
      {
        q: "How does the AI trip recommendation work?",
        a: "The AI reads your preferences (budget, time, comfort) and matches them against all available trips in real time. It ranks results by fit — not just price — and explains exactly why it picked each trip.",
      },
      {
        q: "Can I ask the AI in Filipino?",
        a: "Yes! The AI understands Taglish and Filipino. Try: 'Hanap ng trip papuntang Baguio, under ₱900, bukas ng umaga.'",
      },
      {
        q: "Does the AI book for me automatically?",
        a: "The AI recommends and can take you directly to checkout with one tap — but you confirm the booking. It never charges you automatically.",
      },
    ],
  },
];
