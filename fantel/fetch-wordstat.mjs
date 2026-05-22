import { chromium } from "playwright";
import fs from "fs";

const queries = [
  "производитель тортов оптом",
  "бисквитные торты оптом",
  "торты в нарезке оптом",
  "пирожные оптом производитель",
  "торты для HoReCa",
  "торт длительного хранения",
  "торт замороженный оптом",
  "торты на заказ для кафе",
  "эстерхази торт оптом",
  "прага торт производитель",
  "торт чёрный принц оптом",
  "киевский торт оптом",
  "производитель пирожных Челябинск",
  "торты Челябинск оптом",
  "дистрибуция кондитерских изделий",
  "фабрика тортов Россия",
  "торты оптом",
  "купить торты оптом",
  "кондитерская фабрика",
  "производитель кондитерских изделий",
  "поставщик тортов",
  "торты от производителя",
  "торт медовик производитель",
  "торт наполеон оптом",
  "десерты оптом",
  "мини торты оптом",
  "торты для ресторана",
  "кондитерская продукция оптом",
  "торты в магазин",
  "торт прага оптом",
];

// Yandex Wordstat region ids (Direct geo)
const REGIONS = {
  rf: 225, // Russia
  chel: 11225, // Chelyabinsk Oblast
};

async function fetchPhrase(page, phrase, regionId) {
  const url = `https://wordstat.yandex.ru/?region=${regionId}&view=table&period=month&words=${encodeURIComponent(phrase)}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);

  const text = await page.evaluate(() => document.body.innerText);
  const nums = [...text.matchAll(/(\d[\d\s\u00a0]*)/g)].map((m) =>
    parseInt(m[1].replace(/[\s\u00a0]/g, ""), 10),
  );
  const candidates = nums.filter((n) => n > 0 && n < 500000);
  // Heuristic: largest reasonable monthly count in page
  const val = candidates.length ? Math.max(...candidates.slice(0, 20)) : 0;
  return val;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: "ru-RU",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});
const page = await context.newPage();

const results = [];
for (const q of queries) {
  process.stdout.write(`RF: ${q}... `);
  let rf = 0;
  let chel = 0;
  try {
    rf = await fetchPhrase(page, q, REGIONS.rf);
    chel = await fetchPhrase(page, q, REGIONS.chel);
  } catch (e) {
    console.log("err", e.message);
  }
  console.log(rf, chel);
  results.push({ q, rf, chel });
  await page.waitForTimeout(800);
}

await browser.close();
fs.writeFileSync(
  "d:/VSCodeTypescript/proposals/fantel/wordstat-data.json",
  JSON.stringify({ date: "2026-05-22", results }, null, 2),
  "utf8",
);
console.log("saved", results.length);
