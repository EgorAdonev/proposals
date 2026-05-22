import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const base = "http://localhost:8080";
const outDir = fileURLToPath(new URL("./media/future-website/", import.meta.url));

const shots = [
  ["/", "desktop-01-hero.png", 0],
  ["/", "desktop-02-catalog.png", 720],
  ["/", "desktop-03-quality.png", 1120],
  ["/", "desktop-04-request.png", 1660],
  ["/catalog", "page-products.png", 0],
  ["/catalog", "page-products-list.png", 520],
  ["/dealers", "page-dealers.png", 0],
  ["/dealers", "page-dealers-terms.png", 620],
  ["/dealers", "page-dealers-form.png", 1220],
  ["/about", "page-about.png", 0],
  ["/contacts", "page-contacts.png", 0],
  ["/career", "page-career.png", 0],
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });

for (const [route, fileName, scrollY] of shots) {
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(350);
  await page.screenshot({ path: join(outDir, fileName), fullPage: false });
  console.log(`${fileName} ${route} scroll=${scrollY}`);
}

await browser.close();
