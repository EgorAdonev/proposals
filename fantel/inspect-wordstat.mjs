import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ locale: "ru-RU" });
await page.goto("https://wordstat.yandex.com/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(8000);
const input = page.locator('input[type="text"], input[placeholder*="апрос"], textarea').first();
if (await input.count()) {
  await input.fill("торты оптом");
  await input.press("Enter");
  await page.waitForTimeout(5000);
}
await page.screenshot({ path: "d:/VSCodeTypescript/proposals/fantel/wordstat-debug.png", fullPage: true });
const html = await page.content();
fs.writeFileSync("d:/VSCodeTypescript/proposals/fantel/wordstat-debug.html", html, "utf8");
console.log("title:", await page.title());
console.log("text sample:", (await page.innerText("body")).slice(0, 2000));
await browser.close();
