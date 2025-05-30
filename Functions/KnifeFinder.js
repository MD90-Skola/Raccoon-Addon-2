// KnifeFinder.js – Triggerbaserat, inga loops, inga spams

function normalize(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9]/g, '');
}

const SETTINGS_KEY = "knifeFinderSettings";
let alertedCards = new WeakSet();

function applyFilterToCards(cfg) {
  // Kontrollera grundinställningar
  if (!cfg || !cfg.toggleFilter) return;
  // Kontrollera att minst en effekt är på
  if (!cfg.ToggleKnifeGlow && !cfg.ToggleKnifeBlink && !cfg.ToggleKnifeAlert) return;

  // Hämta alla kort
  const cards = Array.from(document.querySelectorAll("cw-csgo-market-item-card-wrapper, cw-csgo-market-item-card"));
  if (!cards.length) return;

  const filterKnife = normalize(cfg.knifeType || '');
  const filterSkin = normalize(cfg.knifeSkin || '');

  cards.forEach(card => {
    const text = card.textContent || '';
    // Extrahera namn+skin innan prislappen (före siffror)
    const nameSkinMatch = text.match(/^(.*?)\s+\d/);
    if (!nameSkinMatch) return;
    const nameSkin = nameSkinMatch[1].replace(/[★☆♦▪•–—]/g, '').trim();
    // Dela på dubbla blanksteg eller enkel blanksteget och/eller '|'
    let [rawKnife = '', rawSkin = ''] = ['',''];
    if (nameSkin.includes('|')) {
      [rawKnife, rawSkin] = nameSkin.split('|').map(s => s.trim());
    } else {
      const parts = nameSkin.split('  '); // dubbel blank
      rawKnife = parts[0].trim();
      rawSkin = parts[1] ? parts[1].trim() : '';
    }
    const knifeName = normalize(rawKnife);
    const skinName = normalize(rawSkin);

    // Filtrera
    if (filterKnife && !knifeName.includes(filterKnife)) return;
    if (filterSkin && !skinName.includes(filterSkin)) return;

    // Hitta markup %
    const pctMatch = text.match(/([+\-]?\d+\.?\d*)%/);
    const pct = pctMatch ? parseFloat(pctMatch[1]) : NaN;
    if (isNaN(pct)) return;

    // Återställ tidigare effekter på detta kort
    card.style.boxShadow = '';
    card.classList.remove('knife-blink');

    // Applicera effekter enligt inställningar
    if (cfg.ToggleKnifeGlow && pct >= cfg.KnifeGlowPlaceholder1 && pct <= cfg.KnifeGlowPlaceholder2) {
      card.style.boxShadow = '0 0 20px 4px limegreen';
    }
    if (cfg.ToggleKnifeBlink && pct >= cfg.KnifeBlinkPlaceholder1 && pct <= cfg.KnifeBlinkPlaceholder2) {
      card.classList.add('knife-blink');
    }
    if (cfg.ToggleKnifeAlert && pct >= cfg.KnifeAlertPlaceholder1 && pct <= cfg.KnifeAlertPlaceholder2) {
      if (!alertedCards.has(card)) {
        console.log("🔔 Alert triggered for card:", rawKnife, rawSkin, pct);
        try {
          const audio = new Audio(chrome.runtime.getURL('Assets/trade.mp3'));
          audio.play().catch(err => console.warn("🔇 Ljudfel vid uppspelning:", err));
        } catch(e) {
          console.warn("🔇 Audio objekt kunde inte skapas:", e);
        }
        alertedCards.add(card);
      }
    }
  });
}

// CSS för blink-effekt
const style = document.createElement('style');
style.textContent = `
  @keyframes knife-blink-opacity { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
  .knife-blink { animation: knife-blink-opacity 1s infinite; }
`;
document.head.appendChild(style);

// Lyssna bara på trigger-ändringar (Glow/Blink/Alert eller kniv/skin/ranges)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes[SETTINGS_KEY]) return;
  const { oldValue: oldCfg = {}, newValue: newCfg = {} } = changes[SETTINGS_KEY];
  
  const filterChanged = oldCfg.knifeType !== newCfg.knifeType || oldCfg.knifeSkin !== newCfg.knifeSkin;
  const glowToggleChanged = oldCfg.ToggleKnifeGlow !== newCfg.ToggleKnifeGlow;
  const blinkToggleChanged = oldCfg.ToggleKnifeBlink !== newCfg.ToggleKnifeBlink;
  const alertToggleChanged = oldCfg.ToggleKnifeAlert !== newCfg.ToggleKnifeAlert;
  const glowRangeChanged = oldCfg.KnifeGlowPlaceholder1 !== newCfg.KnifeGlowPlaceholder1 || oldCfg.KnifeGlowPlaceholder2 !== newCfg.KnifeGlowPlaceholder2;
  const blinkRangeChanged = oldCfg.KnifeBlinkPlaceholder1 !== newCfg.KnifeBlinkPlaceholder1 || oldCfg.KnifeBlinkPlaceholder2 !== newCfg.KnifeBlinkPlaceholder2;
  const alertRangeChanged = oldCfg.KnifeAlertPlaceholder1 !== newCfg.KnifeAlertPlaceholder1 || oldCfg.KnifeAlertPlaceholder2 !== newCfg.KnifeAlertPlaceholder2;

  // Om ingen relevant ändring, gör inget
  if (!filterChanged && !glowToggleChanged && !blinkToggleChanged && !alertToggleChanged && !glowRangeChanged && !blinkRangeChanged && !alertRangeChanged) return;

  // Rensa tidigare effekter (lampor/blink)
  document.querySelectorAll('cw-csgo-market-item-card-wrapper, cw-csgo-market-item-card').forEach(c => {
    c.style.boxShadow = '';
    c.classList.remove('knife-blink');
  });

  // Hantera alert reset: bara om alert toggle eller range eller filter ändras
  if (alertToggleChanged && !newCfg.ToggleKnifeAlert) {
    // Alert stängdes av – rensa ljudflagga
    alertedCards = new WeakSet();
  }
  if ((alertToggleChanged && newCfg.ToggleKnifeAlert) || alertRangeChanged || filterChanged) {
    // Alert slås på nytt eller range ändras eller filter ändras – rensa tidigare spelade kort
    alertedCards = new WeakSet();
  }

  // Applicera filter och effekter
  applyFilterToCards(newCfg);
});