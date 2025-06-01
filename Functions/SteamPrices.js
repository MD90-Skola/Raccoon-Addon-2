let scoutPopup;

window.scoutmode_active = false;
chrome.storage.local.get("scoutmode", (res) => {
  window.scoutmode_active = res.scoutmode || false;
});
chrome.storage.onChanged.addListener((changes) => {
  if (changes.scoutmode) {
    window.scoutmode_active = changes.scoutmode.newValue;
  }
});

document.addEventListener('mousemove', (e) => {
  if (!window.scoutmode_active) return;

  if (e.ctrlKey && e.shiftKey) {
    const card = e.target.closest('cw-csgo-market-item-card-wrapper');
    if (card) {
      const text = card.textContent.trim();
      const nameMatch = text.match(/^(.*?)\s+\d/);
      const procentMatch = text.match(/([+\-]?\d+\.?\d*)%/);

      const priceEl = card.querySelector('cw-pretty-balance');
      const price = priceEl ? parseFloat(priceEl.textContent.replace(',', '').replace('€', '')) : null;

      const name = nameMatch ? nameMatch[1] : 'N/A';
      const currentMarkup = procentMatch ? parseFloat(procentMatch[1]) : 0;
      const markupDiff = Math.max(0, 12 - currentMarkup);
      const profit = price ? (price * markupDiff / 100).toFixed(2) : 'N/A';

      if (!scoutPopup) {
        scoutPopup = document.createElement('div');
        Object.assign(scoutPopup.style, {
          position: 'fixed', background: '#222', color: '#fff',
          borderRadius: '8px', padding: '10px', pointerEvents: 'none',
          zIndex: 9999, boxShadow: '0 0 20px rgba(0,255,0,0.2)', width: '260px',
          fontSize: '14px', lineHeight: '1.5'
        });
        document.body.appendChild(scoutPopup);
      }

      scoutPopup.innerHTML = `
        <div><strong style="color: #aaa; font-size: 15px;">${name}</strong></div>
        <div>Nuvarande markup: <strong style="color: #ccc;">${currentMarkup}%</strong></div>
        <div>Kvar till max: <strong style="color: #ccc;">${markupDiff.toFixed(1)}%</strong></div>
        <div>Nuvarande pris: <strong style="color: #ccc;">${price} 🪙</strong></div>
        <div style="margin-top: 6px; font-size: 16px; font-weight: bold; color: lightgreen;">
          Potentiell vinst: ${profit} 🪙
        </div>
      `;

      scoutPopup.style.left = `${e.clientX + 15}px`;
      scoutPopup.style.top = `${e.clientY + 15}px`;
    }
  } else if (scoutPopup) {
    scoutPopup.remove();
    scoutPopup = null;
  }
});
