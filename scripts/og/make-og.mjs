// Generates one share image (opengraph-image.jpg) per public page, from the PAGES list below.
//   node scripts/og/make-og.mjs            -> writes a contact sheet to ../brand/exports/og-all-preview.png (installs nothing)
//   node scripts/og/make-og.mjs --install  -> writes src/app/<path>/opengraph-image.jpg (+ .alt.txt) for every page
// To add a page: add one line to PAGES. Needs Edge (headless) and sharp (already a Next dependency).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "../..");
const url = (p) => pathToFileURL(path.join(ROOT, p)).href;
const EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].find((p) => fs.existsSync(p));
const INSTALL = process.argv.includes("--install");

// theme: blue | light | calm.  mark: where the big A sits.  motif: the graphic on the left.
const PAGES = [
  { path: "/start", title: "תרגול חינמי", sub: "בלי תשלום", theme: "blue", motif: "cards", mark: "br" },
  { path: "/sample-test", title: "מבחן אמירנט לדוגמה", sub: "עם תשובות והסבר", theme: "light", motif: "exam", mark: "tl" },
  { path: "/amirnet-words", title: "אוצר מילים לאמירנט", sub: "עם תרגום ומשפט לדוגמה", theme: "blue", motif: "flash", mark: "tr" },
  { path: "/practice/daily", title: "שאלת היום", sub: "שאלה אחת ביום, עם הסבר מלא", theme: "light", motif: "streak", mark: "br" },
  { path: "/amirnet", title: "מה צריך לדעת על המבחן", sub: "מבנה, ציון והרשמה", theme: "blue", motif: "info", mark: "bl" },
  { path: "/guide", title: "מדריך קצר להורדה", sub: "5 טיפים לפני המבחן", theme: "light", motif: "doc", mark: "tr" },
  { path: "/learn/connectors", title: "מילות קישור באמירנט", sub: "שיעור קצר ותרגול", theme: "blue", motif: "lesson", mark: "bl" },
  { path: "/learn/affixes", title: "תחיליות וסופיות באמירנט", sub: "שיעור קצר ותרגול", theme: "light", motif: "lesson", mark: "br" },
  { path: "/score", title: "מחשבון ציון", sub: "מהציון שלך לרמת השיבוץ", theme: "blue", motif: "gauge", mark: "tl" },
  { path: "/exam-dates", title: "מועדי הבחינה", sub: "לפי מרכז בחינה", theme: "light", motif: "cal", mark: "br" },
  { path: "/private-tutor", title: "מורה פרטי לאמירנט", sub: "מורה אמיתי, לא אפליקציה", theme: "photo" },
  { path: "/ads", title: "7 ימים לאמירנט", sub: "זום בקבוצה קטנה, עם מורה", theme: "blue", motif: "week", mark: "bl" },
  { path: "/blog", title: "הבלוג", sub: "מאמרים על הכנה לאמירנט", theme: "light", motif: "blog", mark: "tr" },
  { path: "/calm", title: "אנג'לה", sub: "מיינדסט למבחן", theme: "angela", motif: "angela", mark: "none" },
];

const NAVY = "#19107F", PINK = "#ff00cf", MINT = "#5be3a8", SOFT = "#e2eaff";
const bar = (w, c = "rgba(25,16,127,.16)", h = 20) => `<span style="display:block;height:${h}px;width:${w}px;border-radius:${h / 2}px;background:${c}"></span>`;
const card = (inner, css = "") => `<div style="background:#fff;border-radius:26px;box-shadow:0 24px 60px rgba(6,3,40,.35);${css}">${inner}</div>`;
const col = (inner, gap = 18) => `<div style="display:flex;flex-direction:column;gap:${gap}px">${inner}</div>`;
const row = (inner, gap = 14, css = "") => `<div style="display:flex;align-items:center;gap:${gap}px;${css}">${inner}</div>`;
const dot = (c, size = 40, inner = "") => `<span style="width:${size}px;height:${size}px;border-radius:50%;background:${c};display:flex;align-items:center;justify-content:center;color:#fff;font:700 ${size * 0.5}px Rubik">${inner}</span>`;

const MOTIFS = {
  cards: () => `<div style="position:relative;width:520px;height:440px">
    ${[0, 1, 2].map((i) => card(col(bar(150, PINK) + bar(380 - i * 40) + bar(260)) , `position:absolute;left:${i * 30}px;top:${(2 - i) * 46}px;width:440px;height:260px;padding:34px;transform:rotate(${(i - 1) * 3}deg)`)).join("")}</div>`,
  exam: () => card(col(row(bar(130, PINK) + bar(220)) + [1, 2, 3, 4].map((n) => row(dot(NAVY, 44, n) + bar(260 - n * 20))).join(""), 26), "width:500px;height:440px;padding:40px"),
  flash: () => `<div style="position:relative;width:520px;height:420px">
    ${card("", "position:absolute;left:60px;top:0;width:440px;height:290px;transform:rotate(5deg);opacity:.55")}
    ${card(col(bar(200, NAVY, 28) + bar(300) + row(`<span style="background:${MINT};border-radius:999px;padding:8px 22px;color:${NAVY};font:700 26px Rubik">✓</span>` + bar(150))), "position:absolute;left:0;top:90px;width:440px;height:300px;padding:40px;transform:rotate(-3deg)")}</div>`,
  streak: () => card(col(row([1, 1, 1, 1, 1].map(() => dot(MINT, 54, "✓")).join("") + `<span style="width:54px;height:54px;border-radius:50%;border:4px solid ${PINK}"></span>` + `<span style="width:54px;height:54px;border-radius:50%;border:4px solid rgba(25,16,127,.18)"></span>`, 12) + bar(300) + bar(220), 28), "width:560px;height:300px;padding:48px;"),
  info: () => card(col([1, 2, 3].map((n) => row(dot(n === 1 ? PINK : NAVY, 56, n) + col(bar(260 - n * 10, "rgba(25,16,127,.5)") + bar(340 - n * 30), 12), 22)).join(""), 36), "width:520px;height:420px;padding:46px"),
  doc: () => `<div style="position:relative">${card(col(bar(200, PINK) + bar(330) + bar(300) + bar(340) + bar(220), 22), "width:400px;height:480px;padding:46px")}
    <span style="position:absolute;left:-30px;bottom:-30px">${dot(PINK, 110, "↓")}</span></div>`,
  lesson: () => card(col(row(bar(110, PINK) + bar(240)) + bar(380) + row(["", "", ""].map((_, i) => `<span style="border:3px solid ${NAVY};border-radius:999px;padding:12px 34px;background:${i === 1 ? NAVY : "transparent"}">${bar(60, i === 1 ? "#fff" : "rgba(25,16,127,.3)", 14)}</span>`).join(""), 14) + bar(300), 30), "width:520px;height:360px;padding:44px"),
  gauge: () => card(`<svg width="440" height="270" viewBox="0 0 440 270"><path d="M40 230A180 180 0 0 1 400 230" fill="none" stroke="rgba(25,16,127,.14)" stroke-width="34" stroke-linecap="round"/><path d="M40 230A180 180 0 0 1 300 72" fill="none" stroke="${PINK}" stroke-width="34" stroke-linecap="round"/><circle cx="220" cy="230" r="20" fill="${NAVY}"/><path d="M220 230L300 90" stroke="${NAVY}" stroke-width="10" stroke-linecap="round"/></svg>`, "padding:40px 40px 20px"),
  cal: () => card(col(row(bar(160, NAVY, 26)) + `<div style="display:grid;grid-template-columns:repeat(7,52px);gap:12px">${Array.from({ length: 28 }, (_, i) => `<span style="height:52px;border-radius:14px;background:${[9, 16].includes(i) ? PINK : [10, 17, 23].includes(i) ? MINT : "rgba(25,16,127,.1)"}"></span>`).join("")}</div>`, 28), "padding:44px"),
  week: () => card(col(row(Array.from({ length: 7 }, (_, i) => dot([1, 3, 5].includes(i) ? PINK : NAVY, 58, i + 1)).join(""), 12) + bar(320) + bar(230), 34), "width:620px;height:300px;padding:48px"),
  blog: () => card(`<div style="width:460px;height:200px;border-radius:26px 26px 0 0;background:linear-gradient(135deg,${NAVY},#4a3df0)"></div><div style="padding:34px 40px">${col(bar(150, PINK) + bar(340) + bar(260), 18)}</div>`, "width:460px;overflow:hidden"),
  angela: () => { const paths = [...fs.readFileSync(path.join(ROOT, "src/components/AngelaDrawing.tsx"), "utf8").matchAll(/ d="([^"]+)"/g)].map((m) => `<path d="${m[1]}"/>`).join("");
    return `<div style="position:relative;width:440px;height:440px"><div style="position:absolute;inset:0;border-radius:50%;background:rgba(25,16,127,.10)"></div><div style="position:absolute;inset:6%;border-radius:50%;border:2px solid rgba(25,16,127,.15)"></div><svg viewBox="0 0 100 100" style="position:absolute;inset:14%;width:72%;height:72%" fill="#19107F">${paths}</svg></div>`; },
  calm: () => `<svg width="520" height="520" viewBox="0 0 520 520">${[250, 190, 130].map((r, i) => `<circle cx="260" cy="260" r="${r}" fill="rgba(25,16,127,${0.05 + i * 0.05})"/>`).join("")}<circle cx="260" cy="260" r="64" fill="${NAVY}"/></svg>`,
};

const BLOB = "M40,-52C52,-44,60,-30,64,-14C68,2,68,20,59,33C50,46,32,54,14,61C-4,68,-22,74,-38,67C-54,60,-68,40,-70,21C-72,2,-62,-16,-50,-31C-38,-46,-24,-58,-6,-61C12,-64,28,-60,40,-52Z";
const blobs = `<svg viewBox="-100 -100 200 200" style="position:absolute;right:-60px;top:-110px;width:520px;opacity:.07"><path d="${BLOB}" fill="#19107F"/></svg><svg viewBox="-100 -100 200 200" style="position:absolute;left:-90px;bottom:-190px;width:520px;opacity:.06;transform:rotate(90deg)"><path d="${BLOB}" fill="#19107F"/></svg><svg viewBox="0 0 100 40" style="position:absolute;left:60px;top:60px;width:130px;opacity:.2" fill="none" stroke="#19107F" stroke-width="1.2"><circle cx="14" cy="22" r="12"/><circle cx="32" cy="14" r="10"/><circle cx="46" cy="24" r="8"/></svg>`;
const MARK = { tl: "left:-170px;top:-250px", tr: "right:-200px;top:-260px", bl: "left:-200px;bottom:-290px", br: "right:-300px;bottom:-250px" };

function html(p) {
  const light = p.theme === "light" || p.theme === "angela";
  const bg = {
    blue: `radial-gradient(800px 500px at 25% 50%,rgba(120,110,255,.38),rgba(120,110,255,0) 70%),radial-gradient(500px 400px at 100% 100%,rgba(238,71,140,.25),rgba(238,71,140,0) 70%),linear-gradient(135deg,#2b20b8 0%,#19107F 48%,#0E0852 100%)`,
    light: `radial-gradient(700px 500px at 25% 55%,#ffffff,rgba(255,255,255,0) 70%),linear-gradient(135deg,${SOFT} 0%,#E4E4E4 100%)`,
    // /calm uses the plain site light theme (mist + navy), with soft blobs
    angela: `radial-gradient(700px 500px at 28% 50%,rgba(255,255,255,.5),rgba(255,255,255,0) 70%),#E4E4E4`,
    photo: `url("${url("scripts/og/noa.jpg")}") left top/1200px auto no-repeat`,
  }[p.theme];
  const size = p.theme === "angela" ? 170 : p.title.length <= 10 ? 112 : p.title.length <= 16 ? 92 : 80;
  const wm = url(`public/brand/wordmark-${light ? "dark" : "light"}.png`);
  const mk = url(`public/brand/mark-${light ? "dark" : "light"}.png`);
  const overlay = p.theme === "photo" ? `<div style="position:absolute;inset:0;background:linear-gradient(to left,rgba(25,16,127,.96) 0%,rgba(25,16,127,.93) 42%,rgba(25,16,127,0) 72%)"></div>` : "";
  const watermark = p.theme === "angela" ? blobs : p.mark && p.mark !== "none" ? `<img style="position:absolute;${MARK[p.mark]};height:760px;opacity:${light ? 0.06 : 0.07}" src="${mk}">` : "";
  const motif = p.motif ? `<div style="position:absolute;left:80px;right:640px;top:0;bottom:0;display:flex;align-items:center;justify-content:center">${MOTIFS[p.motif]()}</div>` : "";
  return `<!doctype html><html lang="he"><head><meta charset="utf-8"><style>
@font-face{font-family:Rubik;src:url("${url("src/app/fonts/Rubik-Bold.woff2")}");font-weight:700}
@font-face{font-family:Gadi;src:url("${url("src/app/fonts/GadiAlmog-Regular.woff2")}");font-weight:400}
@font-face{font-family:G;src:url("${url("src/app/fonts/GoogleSans.woff2")}");font-weight:400 700}
*{margin:0;box-sizing:border-box}html,body{overflow:hidden;background:#19107F}
#c{position:absolute;left:0;top:0;width:1200px;height:630px;overflow:hidden;direction:rtl;font-family:G;background:${bg};color:${light ? NAVY : "#fff"}}
</style></head><body><div id="c">${watermark}${overlay}${motif}
<img style="position:absolute;top:56px;right:80px;height:46px" src="${wm}">
<div style="position:absolute;right:80px;top:150px;width:${p.theme === "photo" ? 470 : 480}px;bottom:80px;display:flex;flex-direction:column;justify-content:center">
 <div style="font-family:${p.theme === "angela" ? "Gadi" : "Rubik"};font-weight:${p.theme === "angela" ? 400 : 700};font-size:${size}px;line-height:1.08">${p.title}</div>
 <div style="margin-top:26px;font-size:34px;line-height:1.3;font-weight:500;opacity:.9">${p.sub}</div>
</div></div></body></html>`;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "og-"));
const out = [];
for (const p of PAGES) {
  const file = path.join(tmp, p.path.replace(/\W+/g, "_") + ".html");
  const png = file.replace(".html", ".png");
  fs.writeFileSync(file, html(p));
  execFileSync(EDGE, ["--headless", "--disable-gpu", "--allow-file-access-from-files", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=1500,700", `--screenshot=${png}`, pathToFileURL(file).href], { stdio: "ignore" });
  const jpg = await sharp(png).extract({ left: 0, top: 0, width: 1200, height: 630 }).jpeg({ quality: 86 }).toBuffer();
  out.push({ p, jpg });
  if (INSTALL) {
    const dir = path.join(ROOT, "src/app", p.path);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "opengraph-image.jpg"), jpg);
    fs.writeFileSync(path.join(dir, "opengraph-image.alt.txt"), `Anglit: ${p.title}`);
  }
}
if (!INSTALL) {
  const w = 400, h = 210, cols = 3, gap = 14, rows = Math.ceil(out.length / cols);
  const tiles = await Promise.all(out.map(async ({ jpg }, i) => ({ input: await sharp(jpg).resize(w, h).toBuffer(), left: gap + (i % cols) * (w + gap), top: gap + Math.floor(i / cols) * (h + gap) })));
  const dest = path.resolve(ROOT, "../brand/exports/og-all-preview.png");
  await sharp({ create: { width: gap + cols * (w + gap), height: gap + rows * (h + gap), channels: 3, background: "#777" } }).composite(tiles).png().toFile(dest);
  console.log("preview:", dest);
} else console.log("installed", out.length, "images");
