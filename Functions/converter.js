let balanceBox = null;

function formatCurrency(value, suffix) {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${suffix}`;
}


function updateBalanceInfo() {
  if (!window.converter_active) return;

  const walletEl = document.querySelector('cw-user-balance .balance-container');
  if (!walletEl) return;

  const rawText = walletEl?.textContent?.trim() ?? "";
  const match = rawText.match(/([\d.,]+)/);
  if (!match) return;

  const cleanedText = match[1].replace(/\s/g, '').replace(',', '.');
  const coins = parseFloat(cleanedText);
  if (isNaN(coins)) return;

  const euro = coins * 0.6143;
  const sek = euro * 10.9;

  const euroText = formatCurrency(euro, "Euro");
  const sekText = formatCurrency(sek, "SEK");

  if (!balanceBox) {
    balanceBox = document.createElement('div');
    balanceBox.id = 'wallet-converter-popup';
    Object.assign(balanceBox.style, {
      position: 'fixed',
      background: '#111',
      color: 'white',
      fontSize: '13px',
      padding: '6px 12px',
      borderRadius: '8px',
      boxShadow: '0 0 8px rgba(255,255,255,0.2)',
      zIndex: 10000,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      lineHeight: '1.4',
      textAlign: 'left',
      fontWeight: 'bold',
    });
    document.body.appendChild(balanceBox);
  }

  balanceBox.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <img src="${chrome.runtime.getURL('assets/euro.png')}" width="18" height="18" />
      <span>${euroText}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
      <img src="${chrome.runtime.getURL('assets/sverige.png')}" width="18" height="18" />
      <span>${sekText}</span>
    </div>
  `;

  const rect = walletEl.getBoundingClientRect();
  balanceBox.style.left = `${rect.left}px`;
  balanceBox.style.top = `${rect.bottom + 8}px`;
}

chrome.storage.local.get("converter", res => {
  window.converter_active = res.converter || false;
  if (window.converter_active) updateBalanceInfo();
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.converter) {
    window.converter_active = changes.converter.newValue;
    if (window.converter_active) {
      updateBalanceInfo();
    } else if (balanceBox) {
      balanceBox.remove();
      balanceBox = null;
    }
  }
});

setInterval(() => {
  if (window.converter_active) updateBalanceInfo();
}, 2000);
