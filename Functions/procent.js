window.procent_active = false;


chrome.storage.local.get("procent", res => {
  window.procent_active = res.procent || false;
  console.log("INIT - procent_active:", window.procent_active);
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.procent) {
    window.procent_active = changes.procent.newValue;
    console.log("STORAGE CHANGED - procent_active:", window.procent_active);

    if (!window.procent_active) {
      console.log("Procent disabled. Rensar popup.");
      document.querySelectorAll('.procent-label').forEach(el => el.remove());
      document.querySelectorAll('cw-csgo-market-item-card-wrapper.procent').forEach(card => {
        card.classList.remove('procent');
        card.style.boxShadow = ''; // Rensa glow om aktivt
      });
    }
  }
});

setInterval(() => {
  if (!window.procent_active) {
    console.log("Procent not active, skipping");
    return;
  }

  const cards = document.querySelectorAll('cw-csgo-market-item-card-wrapper:not(.procent)');
  console.log("Hittade kort:", cards.length);

  cards.forEach(card => {
    let span = Array.from(card.querySelectorAll('span.lh-16.fw-600.fs-10.ng-star-inserted'))
      .find(el => el.textContent.includes('%'));

    let rawMarkup = "0%";
    let currentMarkup = 0;

    if (!span) {
      console.log("Ingen % hittad i kort – behandlas som 0%");
    } else {
      rawMarkup = span.textContent.trim();
      currentMarkup = parseFloat(rawMarkup);
    }

    console.log("Hittade markup:", rawMarkup);

    const label = document.createElement('div');
    label.className = 'procent-label';

    // Standardfärg
    let textColor = '#00ff00';
    let glowCard = false;

    if (currentMarkup > 12) {
      console.log("Markup över 12% – popup visas inte");
      return;
    }
    
    if (currentMarkup >= 4 && currentMarkup < 6) {
      textColor = '#ffff00'; // gul
    } else if (currentMarkup >= 6 && currentMarkup <= 12) {
      textColor = '#ff4444'; // röd
    } else {
      glowCard = true; // < 4% (eller saknade)
    }

    Object.assign(label.style, {
      position: 'absolute',
      top: 'calc(50% + 19px)',
      left: 'calc(50% + 60px)',
      transform: 'translate(-50%, -50%) scale(0.7)',
      background: '#000c',
      color: textColor,
      padding: '6px 10px',
      fontSize: '25px',
      fontWeight: 'bold',
      borderRadius: '8px',
      pointerEvents: 'none',
      zIndex: 9999,
      textShadow: '0 0 6px black',
      whiteSpace: 'nowrap'
    });

    label.textContent = rawMarkup;

    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }

    card.classList.add('procent');
    card.appendChild(label);

    if (glowCard) {
      card.style.boxShadow = '0 0 20px 4px limegreen';
    }
  });
}, 3000);
