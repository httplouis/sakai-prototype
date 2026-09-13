/**
 * SakAi UI Screenshot Script
 * Captures all screens at 390x844 (iPhone 14 size)
 *
 * Run: node scripts/screenshot-all.js
 * Output: screenshots/ folder
 *
 * Requires: npm install puppeteer
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const BASE_URL = "http://localhost:3000";
const OUT_DIR  = path.join(__dirname, "..", "screenshots");
const WIDTH    = 390;
const HEIGHT   = 844;

// All routes to capture
const ROUTES = [
  { path: "/splash",                      name: "01-splash" },
  { path: "/onboarding",                  name: "02-onboarding" },
  { path: "/login",                        name: "03-login" },
  { path: "/register",                     name: "04-register" },
  { path: "/forgot-password",             name: "05-forgot-password" },
  { path: "/home",                         name: "06-home" },
  { path: "/search?from=Manila%20(Cubao)&to=Baguio%20City&date=2026-09-13&passengers=1", name: "07-search-results" },
  { path: "/trip/trip-001",               name: "08-trip-detail",   timeout: 20000 },
  { path: "/addons",                       name: "09-addons",         timeout: 20000 },
  { path: "/seats",                        name: "10-seats" },
  { path: "/booking-summary",             name: "11-booking-summary" },
  { path: "/passenger-info",              name: "12-passenger-info" },
  { path: "/payment",                      name: "13-payment-method" },
  { path: "/payment-details",             name: "14-payment-details" },
  { path: "/booking-confirmation?ref=SKI-DEMO1234", name: "15-booking-confirmation" },
  { path: "/e-ticket/SKI-20260912-4821",  name: "16-e-ticket" },
  { path: "/my-bookings",                  name: "17-my-bookings-upcoming" },
  { path: "/booking-detail/bkg-001",      name: "18-booking-detail" },
  { path: "/refund-status/bkg-003",       name: "19-refund-status" },
  { path: "/rate-trip/bkg-002",           name: "20-rate-trip" },
  { path: "/ai-assistant",                name: "21-ai-assistant" },
  { path: "/support",                      name: "22-support" },
  { path: "/support/booking",             name: "23-support-category" },
  { path: "/profile",                      name: "24-profile" },
  { path: "/profile/saved-passengers",    name: "25-saved-passengers" },
  { path: "/profile/payment-methods",     name: "26-payment-methods" },
  { path: "/profile/payment-methods/add", name: "27-add-card" },
  { path: "/profile/notifications",       name: "28-notifications" },
  { path: "/profile/language",            name: "29-language" },
  { path: "/payment-failed",              name: "30-payment-failed" },
];

(async () => {
  // Create output dir
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

  // Set user agent to mobile
  await page.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
  );

  let success = 0;
  let failed  = 0;

  for (const route of ROUTES) {
    const url      = `${BASE_URL}${route.path}`;
    const filename = `${route.name}.png`;
    const filepath = path.join(OUT_DIR, filename);

    try {
      process.stdout.write(`  Capturing ${route.name}... `);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
      // Wait a bit for animations
      await new Promise((r) => setTimeout(r, 800));
      await page.screenshot({ path: filepath, fullPage: false });
      console.log("✓");
      success++;
    } catch (err) {
      console.log(`✗ (${err.message.split("\n")[0]})`);
      failed++;
    }
  }

  await browser.close();

  console.log(`\nDone! ${success} screenshots saved to /screenshots/`);
  if (failed > 0) console.log(`${failed} routes failed (server may not be running or route needs auth state).`);
})();
