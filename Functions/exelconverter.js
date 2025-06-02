// ExcelConverter.js - Kopierar skin-namn + info vid SHIFT+C

window.printinfo_active = false;
chrome.storage.local.get("printinfo", (res) => {
  window.printinfo_active = res.printinfo || false;
});
chrome.storage.onChanged.addListener((changes) => {
  if (changes.printinfo) {
    window.printinfo_active = changes.printinfo.newValue;
  }
});

function showCopyPopup(message = "✅ Copy successful") {
  const popup = document.createElement("div");
  popup.textContent = message;
  Object.assign(popup.style, {
    position: "fixed",
    left: `${window.mouseX || 0}px`,
    top: `${window.mouseY || 0}px`,
    background: "#111",
    color: "#0f0",
    padding: "6px 12px",
    borderRadius: "8px",
    fontWeight: "bold",
    boxShadow: "0 0 10px rgba(0,255,0,0.4)",
    zIndex: 10000,
    pointerEvents: "none"
  });
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1500);
}

document.addEventListener("mousemove", (e) => {
  window.mouseX = e.clientX + 10;
  window.mouseY = e.clientY + 10;
});

window.addEventListener("keydown", (e) => {
  if (!(e.shiftKey && e.code === "KeyC")) return;
  if (!window.printinfo_active) return;

  const card = document.querySelector("cw-csgo-market-item-card-wrapper:hover");
  if (!card) return;

  const spans = Array.from(card.querySelectorAll("span"));
  const namePart = spans.find(el =>
    el.textContent.includes("StatTrak") ||
    el.textContent.includes("★") ||
    el.textContent.length > 14
  );
  const wearPart = spans.find(el =>
    /(FN|MW|FT|WW|BS)/.test(el.textContent)
  );
  const procentPart = spans.find(el =>
    el.textContent.includes("%")
  );
  const priceEl = card.querySelector("cw-pretty-balance");

  const name = namePart?.textContent.trim() || "Skin saknas";
  const wear = wearPart?.textContent.trim() || "";
  const procent = procentPart ? procentPart.textContent.replace('%', '').trim() : "null";
  const price = priceEl ? priceEl.textContent.replace(/[^\d,\.]/g, '').trim() : "0";

  const row = `${name}\t${wear}\t${procent}\t${price}`;

  navigator.clipboard.writeText(row).then(() => {
    showCopyPopup();
  });
});
