// ======================= INITIALA AUDIO-FUNKTIONER =======================
let audioContext;
let audioBuffer;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    fetch(chrome.runtime.getURL('Assets/trade.mp3'))
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(buffer => { audioBuffer = buffer; })
        .catch(err => console.warn("🔇 Kunde inte ladda ljudbuffert:", err));
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
}

document.addEventListener('click', initAudio, { once: true });

function playAlertSound() {
  if (audioContext && audioBuffer) {
    try {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch(e) {
      console.warn("🔇 Ljudfel vid uppspelning via AudioContext:", e);
    }
  } else {
    console.warn("🔇 Ljudbuffert ej laddad eller AudioContext ej initierad.");
  }
}

// ======================= HJÄLPFUNKTION FÖR NORMALISERING =======================
function normalize(text) {
  return (text || "").toLowerCase().replace(/[^a-z0-9]/g, '');
}

const SETTINGS_KEY = "knifeFinderSettings";
let alertedCards = new WeakSet();

// ======================= PARSNINGS- OCH FILTRERINGSFUNKTION =======================
function applyFilterToSingleCard(card, cfg) {
  if (!cfg || !cfg.toggleFilter) return;
  if (!cfg.ToggleKnifeGlow && !cfg.ToggleKnifeBlink && !cfg.ToggleKnifeAlert) return;

  const text = card.textContent || '';
  const nameSkinMatch = text.match(/^(.*?)\s+\d/);
  if (!nameSkinMatch) return;

  // Parsning av namn+skin
  let nameSkin = nameSkinMatch[1].replace(/[★☆♦▪•–—]/g, '').trim();
  let rawKnife = '', rawSkin = '';
  if (nameSkin.includes('|')) {
    [rawKnife, rawSkin] = nameSkin.split('|').map(s => s.trim());
  } else if (nameSkin.includes('  ')) {
    const idx = nameSkin.indexOf('  ');
    rawKnife = nameSkin.slice(0, idx).trim();
    rawSkin = nameSkin.slice(idx + 2).trim();
  } else {
    rawKnife = nameSkin;
    rawSkin = '';
  }
  const knifeName = normalize(rawKnife);
  const skinName = normalize(rawSkin);

  const filterKnife = normalize(cfg.knifeType || '');
  const filterSkin = normalize(cfg.knifeSkin || '');
  if (filterKnife && !knifeName.includes(filterKnife)) return;
  if (filterSkin && !skinName.includes(filterSkin)) return;

  // Hitta procentsats - nu behandla 0 som giltigt värde och null/inget värde som 0
  const pctMatch = text.match(/([+\-]?\d+\.?\d*)%/);
  let pct = 0; // Standard värde är 0 (både för null och inget värde)

  if (pctMatch) {
    const parsed = parseFloat(pctMatch[1]);
    if (!isNaN(parsed)) {
      pct = parsed; // Använd det faktiska värdet, inklusive 0
    }
    // Om parsed är NaN, behåll pct som 0
  }
  // Om ingen procentsats hittades alls, använd standardvärdet 0

  // Nollställ tidigare effekter
  card.style.boxShadow = '';
  card.classList.remove('knife-blink');

  // Applicera Glow
  if (
      cfg.ToggleKnifeGlow &&
      pct >= cfg.KnifeGlowPlaceholder1 &&
      pct <= cfg.KnifeGlowPlaceholder2
  ) {
    card.style.boxShadow = '0 0 20px 4px limegreen';
  }
  // Applicera Blink
  if (
      cfg.ToggleKnifeBlink &&
      pct >= cfg.KnifeBlinkPlaceholder1 &&
      pct <= cfg.KnifeBlinkPlaceholder2
  ) {
    card.classList.add('knife-blink');
  }
  // Applicera Alert
  if (
      cfg.ToggleKnifeAlert &&
      pct >= cfg.KnifeAlertPlaceholder1 &&
      pct <= cfg.KnifeAlertPlaceholder2
  ) {
    if (!alertedCards.has(card)) {
      playAlertSound();
      alertedCards.add(card);
    }
  }
}

// Loop för alla befintliga kort (t.ex. vid första filtrering)
function applyFilterToCards(cfg) {
  if (!cfg || !cfg.toggleFilter) return;
  if (!cfg.ToggleKnifeGlow && !cfg.ToggleKnifeBlink && !cfg.ToggleKnifeAlert) return;

  const cards = Array.from(document.querySelectorAll("cw-csgo-market-item-card-wrapper, cw-csgo-market-item-card"));
  if (!cards.length) return;

  cards.forEach(card => {
    applyFilterToSingleCard(card, cfg);
  });
}

// ======================= OBSERVER FÖR NYA KORT =======================
let observer;

function observeNewCards(cfg) {
  const targetNode = document.body; // eller mer specifik container om möjligt
  const config = { childList: true, subtree: true };

  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (
            node.matches &&
            (node.matches('cw-csgo-market-item-card-wrapper') ||
                node.matches('cw-csgo-market-item-card'))
        ) {
          applyFilterToSingleCard(node, cfg);
        }
      });
    }
  });

  observer.observe(targetNode, config);
}

// ======================= CSS FÖR BLINK-EFFEKT =======================
const style = document.createElement('style');
style.textContent = `
  @keyframes knife-blink-opacity {
    0%,100% { opacity:1; }
    50% { opacity:0.2; }
  }
  .knife-blink {
    animation: knife-blink-opacity 1s infinite;
  }
`;
document.head.appendChild(style);

// ======================= LYSSNARE PÅ INSTÄLLNINGSÄNDRING =======================
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes[SETTINGS_KEY]) return;
  const oldCfg = changes[SETTINGS_KEY].oldValue || {};
  const newCfg = changes[SETTINGS_KEY].newValue || {};

  const filterChanged =
      oldCfg.knifeType !== newCfg.knifeType ||
      oldCfg.knifeSkin !== newCfg.knifeSkin;
  const glowToggleChanged = oldCfg.ToggleKnifeGlow !== newCfg.ToggleKnifeGlow;
  const blinkToggleChanged = oldCfg.ToggleKnifeBlink !== newCfg.ToggleKnifeBlink;
  const alertToggleChanged = oldCfg.ToggleKnifeAlert !== newCfg.ToggleKnifeAlert;
  const glowRangeChanged =
      oldCfg.KnifeGlowPlaceholder1 !== newCfg.KnifeGlowPlaceholder1 ||
      oldCfg.KnifeGlowPlaceholder2 !== newCfg.KnifeGlowPlaceholder2;
  const blinkRangeChanged =
      oldCfg.KnifeBlinkPlaceholder1 !== newCfg.KnifeBlinkPlaceholder1 ||
      oldCfg.KnifeBlinkPlaceholder2 !== newCfg.KnifeBlinkPlaceholder2;
  const alertRangeChanged =
      oldCfg.KnifeAlertPlaceholder1 !== newCfg.KnifeAlertPlaceholder1 ||
      oldCfg.KnifeAlertPlaceholder2 !== newCfg.KnifeAlertPlaceholder2;

  // Om ingen relevant inställning ändrats → gör inget
  if (
      !(
          filterChanged ||
          glowToggleChanged ||
          blinkToggleChanged ||
          alertToggleChanged ||
          glowRangeChanged ||
          blinkRangeChanged ||
          alertRangeChanged
      )
  ) {
    return;
  }

  // Rensa alla kort från tidigare effekter
  document
      .querySelectorAll('cw-csgo-market-item-card-wrapper, cw-csgo-market-item-card')
      .forEach(c => {
        c.style.boxShadow = '';
        c.classList.remove('knife-blink');
      });

  // Återställ alertedCards när alert-inställning eller filter ändras
  if (alertToggleChanged || alertRangeChanged || filterChanged) {
    alertedCards = new WeakSet();
  }

  // Applicera filter på befintliga kort
  applyFilterToCards(newCfg);

  // Börja lyssna på nya kort
  observeNewCards(newCfg);
});