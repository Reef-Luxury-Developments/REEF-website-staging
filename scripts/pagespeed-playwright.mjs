/**
 * Load a PageSpeed Insights report URL and print visible text.
 * Run: node scripts/pagespeed-playwright.mjs [url]
 */
import { chromium } from "playwright";

const url =
  process.argv[2] ||
  "https://pagespeed.web.dev/analysis/https-reef-website-staging-vercel-app/3gygpli0fk?form_factor=desktop";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });

await page.getByRole("button", { name: /ok, got it/i }).click().catch(() => {});

await page.waitForTimeout(12_000);

const title = await page.title();
const bodyText = await page.locator("body").innerText();

console.log("=== document.title ===\n", title);
console.log("\n=== body innerText ===\n");
console.log(bodyText);

await browser.close();
