window.profitcards_active = false;

chrome.storage.local.get("profitcards", res => {
  window.profitcards_active = res.profitcards || false;
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.profitcards) {
    window.profitcards_active = changes.profitcards.newValue;
  }
});

setInterval(() => {
  if (!window.profitcards_active) return;

  document.querySelectorAll('cw-csgo-market-item-card-wrapper:not(.profit)').forEach(card => {
    card.classList.add('profit');

    const priceEl = card.querySelector('cw-pretty-balance');
    const procentEl = card.textContent.match(/([+\-]?\d+\.?\d*)%/);
    if (!priceEl || !procentEl) return;

    const price = parseFloat(priceEl.textContent.replace(',', '').replace('€', ''));
    const currentMarkup = parseFloat(procentEl[1]);
    const markupDiff = Math.max(0, 12 - currentMarkup);
    const profit = (price * (markupDiff / 100)).toFixed(2);

    const label = document.createElement('div');
    label.className = 'profit-label';
    Object.assign(label.style, {
      position: 'absolute', top: '5px', left: '5px', background: '#000a',
      color: 'lime', padding: '4px 6px', borderRadius: '4px',
      fontSize: '12px', pointerEvents: 'none', zIndex: '10'
    });
    label.innerHTML = `Vinst: ${profit} 🪙`;

    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }

    card.appendChild(label);
  });
}, 2000);
