import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BookingProvider } from "@/lib/BookingContext";

export const metadata: Metadata = {
  title: "SakAi — Smarter Intercity Travel",
  description: "The first PH intercity travel app where AI acts — not just assists.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1A1533",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <BookingProvider>
          <div className="phone-shell">
            {children}
          </div>
        </BookingProvider>
      </body>
    </html>
  );
}
