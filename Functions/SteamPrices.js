// SteamPrices.js – MV3-kompatibel
// ===============================================

let scoutPopup = null;
let scoutmode_active = false;
const CACHE_TTL = 12 * 60 * 60 * 1000;            // 12 h i ms
const STORAGE_KEY  = "scoutCache";                // { slug : { ts, stats } }

// ------------------------------------------------
// Initiera flaggan & lyssnare
chrome.storage.local.get("scoutmode", r => {
  scoutmode_active = r.scoutmode || false;
});
chrome.storage.onChanged.addListener(ch => {
  if (ch.scoutmode) scoutmode_active = ch.scoutmode.newValue;
});

// ------------------------------------------------
// Hjälpfunktioner
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[★|]/g, "")      // ta bort stjärna & lodstreck
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");     // mellanslag → bindestreck
}

async function getStats(slug) {
  // 1) Försök hämta från cache
  const store = await chrome.storage.local.get(STORAGE_KEY);
  const cache = store[STORAGE_KEY] || {};
  const hit   = cache[slug];
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.stats;

  // 2) Hämta via proxy
  const url   = `https://csgoskins.gg/items/${slug}`;
  const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  try {
    const html = await fetch(proxy).then(r => {
      if (!r.ok) throw new Error(`Proxy status ${r.status}`);
      return r.text();
    });

    // 3) Plocka ut Price Statistics
    const doc   = new DOMParser().parseFromString(html, "text/html");
    const box   = doc.querySelector("div.shadow-md.bg-gray-800.rounded-sm.mt-4");
    if (!box) throw new Error("Ingen statistikbox hittad");

    const rows  = box.querySelectorAll("div.flex");
    const stats = {};
    rows.forEach(r => {
      const key   = r.children[0]?.textContent.trim();
      const value = r.children[1]?.textContent.trim();
      if (key && value) stats[key] = value;
    });

    // 4) Cacha & returnera
    await chrome.storage.local.set({
      [STORAGE_KEY]: { ...cache, [slug]: { ts: Date.now(), stats } }
    });
    return stats;
  } catch (err) {
    console.warn("SteamPrices: fetch/parse-fel", err);
    return null;                                  // fortsätt utan stats
  }
}

function createPopup() {
  const div = document.createElement("div");
  Object.assign(div.style, {
    position: "fixed",
    background: "#222",
    color: "#fff",
    borderRadius: "8px",
    padding: "10px",
    pointerEvents: "none",
    zIndex: 9_999,
    boxShadow: "0 0 20px rgba(0,255,0,.2)",
    width: "260px",
    fontSize: "14px",
    lineHeight: "1.5",
  });
  document.body.appendChild(div);
  return div;
}

// ------------------------------------------------
// Huvud-lyssnare
document.addEventListener("mousemove", async e => {
  if (!scoutmode_active) {
    scoutPopup?.remove();
    scoutPopup = null;
    return;
  }

  if (!(e.ctrlKey && e.shiftKey)) {
    scoutPopup?.remove();
    scoutPopup = null;
    return;
  }

  const card = e.target.closest("cw-csgo-market-item-card-wrapper");
  if (!card) {
    scoutPopup?.remove();
    scoutPopup = null;
    return;
  }

  // --- Extrahera vapennamn & skin ---
  const text = card.textContent.trim();
  const nameMatch = text.match(/^(.*?)\s+\d/);
  if (!nameMatch) return;
  const fullName = nameMatch[1].replace("★", "").trim();  // ex: Bayonet | Tiger Tooth
  const slug     = slugify(fullName);                     //   bayonet-tiger-tooth

  // --- Hämta stats (kan vara null) ---
  const stats = await getStats(slug);

  // --- Visa popup ---
  if (!scoutPopup) scoutPopup = createPopup();

  const statsHTML = stats
    ? Object.entries(stats)
        .map(([k, v]) => `<div>${k}: <strong style="color:#ccc;">${v}</strong></div>`)
        .join("")
    : "<div style='color:#f55;'>Ingen statistik hittad</div>";

  scoutPopup.innerHTML = `
    <div style="font-size:15px;color:#aaa;font-weight:bold;margin-bottom:4px;">
      ${fullName}
    </div>
    ${statsHTML}
  `;
  scoutPopup.style.left = `${e.clientX + 15}px`;
  scoutPopup.style.top  = `${e.clientY + 15}px`;
});