// == Constants and Data Arrays ==
const knifeTypes = [
  "", "Bayonet", "Bowie Knife", "Butterfly Knife", "Classic Knife", "Falchion Knife",
  "Flip Knife", "Ghost Knife", "Gut Knife", "Huntsman Knife", "Karambit", "Kukri Knife",
  "M9 Bayonet", "Navaja Knife", "Nomad Knife", "Paracord Knife", "Skeleton Knife",
  "Stiletto Knife", "Survival Knife", "Talon Knife", "Ursus Knife", "Shadow Daggers"
];

const knifeSkins = [
  "", 
  "Autotronic", 
  "Black Laminate", 
  "Black Pearl", 
  "Blue Steel", 
  "Case Hardened",
  "Crimson Web", 
  "Damascus Steel", 
  "Doppler",
  "Doppler Phase 1",
  "Doppler Phase 2",
  "Doppler Phase 3",
  "Doppler Phase 4",
  "Emerald", 
  "Fade", 
  "Freehand", 
  "Gamma",
  "Gamma Doppler Phase 1",
  "Gamma Doppler Phase 2",
  "Gamma Doppler Phase 3",
  "Gamma Doppler Phase 4",
  "Lore", 
  "Marble Fade", 
  "Night", 
  "Ruby",
  "Rust Coat", 
  "Sapphire", 
  "Slaughter", 
  "Tiger Tooth", 
  "Ultraviolet"
];

const SETTINGS_KEY = "knifeFinderSettings";
const COIN_TO_EUR = 0.62;
const EUR_TO_SEK = 10.9087;

// == DOM Element References ==
const knifeTypeSelect = document.getElementById("knifeType");
const knifeSkinSelect = document.getElementById("knifeSkin");

const toggleFilter = document.getElementById("toggleFilter");
const toggleGlow = document.getElementById("ToggleKnifeGlow");
const toggleAlert = document.getElementById("ToggleKnifeAlert");
const toggleBlink = document.getElementById("ToggleKnifeBlink");

const glowMin = document.getElementById("KnifeGlowPlaceholder1");
const glowMax = document.getElementById("KnifeGlowPlaceholder2");
const alertMin = document.getElementById("KnifeAlertPlaceholder1");
const alertMax = document.getElementById("KnifeAlertPlaceholder2");
const blinkMin = document.getElementById("KnifeBlinkPlaceholder1");
const blinkMax = document.getElementById("KnifeBlinkPlaceholder2");

// Toggles and Boxes (secondary features)
const procentViewerToggle = document.getElementById("toggle-procent-viewer");
const scoutModeToggle = document.getElementById("toggle-scout-mode");
const profitPotentialToggle = document.getElementById("toggle-profit-potential");
const walletConverterToggle = document.getElementById("toggle-wallet-converter");
const instaToggle = document.getElementById("toggle-insta");
const printInfoToggle = document.getElementById("toggle-print-info");

// Bargain Calculator Elements
const bargainPrice = document.getElementById("bargainPrice");
const bargainOrig = document.getElementById("bargainOrig");
const bargainNew = document.getElementById("bargainNew");
const bargainNewVal = document.getElementById("bargainNewVal");
const bargainOrigVal = document.getElementById("bargainOrigVal");
const bargainNewPrice = document.getElementById("bargainNewPrice");
const bargainDiff = document.getElementById("bargainDiff");

// Coin Converter Elements
const coinInput = document.getElementById("coinInput");
const euroOutput = document.getElementById("euroOutput");
const sekOutput = document.getElementById("sekOutput");

// Buttons
const btnInventory = document.getElementById("btnInventory");
const btnTrade = document.getElementById("btnTrade");
const btnApiKey = document.getElementById("btnApiKey");

// Additional Population at Bottom
const typeSelect = document.getElementById("knifeTypeSelect");

// == Utility Functions ==
function populateKnifeDropdowns() {
  if (!knifeTypeSelect || !knifeSkinSelect) {
    console.warn("Dropdowns för knivar saknas i DOM");
    return;
  }

  knifeTypeSelect.innerHTML = "";
  knifeSkinSelect.innerHTML = "";

  knifeTypes.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    // Om värdet är tomt, visa "All Items"
    opt.textContent = type === "" ? "All Items" : type;
    knifeTypeSelect.appendChild(opt);
  });

  knifeSkins.forEach(skin => {
    const opt = document.createElement("option");
    opt.value = skin;
    // Om värdet är tomt, visa "All Skins"
    opt.textContent = skin === "" ? "All Skins" : skin;
    knifeSkinSelect.appendChild(opt);
  });
}

function normalize(txt) {
  return txt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')   // släng allt utom a–z, 0–9
    .trim();
}






function resetAllEffects() {
  document.querySelectorAll(
    "cw-csgo-market-item-card-wrapper, cw-csgo-market-item-card"
  ).forEach(c => {
    c.classList.remove("knife-blink");
    c.style.boxShadow = "";
  });
}




function filterItemsBySkin() {
  const wantWeapon = normalize(knifeTypeSelect.value);   // "" = All Items
  const wantSkin   = normalize(knifeSkinSelect.value);   // "" = All Skins

  document.querySelectorAll('.market-item').forEach(item => {
    const nameEl = item.querySelector('label.name-mh');
    if (!nameEl) return;

    const { weapon, skin } = splitName(nameEl.innerText || '');

    const weaponOK = !wantWeapon || weapon.includes(wantWeapon);
    const skinOK   = !wantSkin   || skin.includes(wantSkin);

    item.style.display = (weaponOK && skinOK) ? '' : 'none';
  });
}

function splitName(raw) {
  // ★ Bayonet | Gamma Doppler Phase 1  →  { weapon:"bayonet", skin:"gammadopplerphase1" }
  const parts = raw.replace('★', '').split('|');      // [" Bayonet ", " Gamma Doppler Phase 1"]
  const weapon = normalize(parts[0] || '');           // "bayonet"
  const skin   = normalize((parts[1] || parts[0]));   // "gammadopplerphase1"
  return { weapon, skin };
}












function calcBargain() {
  const list = parseFloat(bargainPrice.value) || 0;
  const orig = parseFloat(bargainOrig.value) || 0;
  const neu = parseFloat(bargainNew.value) || 0;
  const base = list / (1 + orig / 100);
  const newPrice = base * (1 + neu / 100);
  const diff = newPrice - list;

  bargainNewVal.textContent = neu.toFixed(1);
  bargainOrigVal.textContent = orig.toFixed(1);
  bargainNewPrice.textContent = newPrice.toFixed(2);
  bargainDiff.textContent = diff.toFixed(2);
}

// == Initialization on DOM Ready ==
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", populateKnifeDropdowns);
} else {
  populateKnifeDropdowns();
}

document.addEventListener("DOMContentLoaded", () => {



chrome.storage.local.get(SETTINGS_KEY, res => {
  const settings = res[SETTINGS_KEY] || {};

  knifeTypeSelect.value = settings.knifeType || "";
  knifeSkinSelect.value = settings.knifeSkin || "";
  toggleFilter.checked = settings.toggleFilter ?? true;
  toggleGlow.checked = settings.ToggleKnifeGlow || false;
  toggleAlert.checked = settings.ToggleKnifeAlert || false;
  toggleBlink.checked = settings.ToggleKnifeBlink || false;
  glowMin.value = settings.KnifeGlowPlaceholder1 ?? -99;
  glowMax.value = settings.KnifeGlowPlaceholder2 ?? 12;
  alertMin.value = settings.KnifeAlertPlaceholder1 ?? -99;
  alertMax.value = settings.KnifeAlertPlaceholder2 ?? 12;
  blinkMin.value = settings.KnifeBlinkPlaceholder1 ?? -99;
  blinkMax.value = settings.KnifeBlinkPlaceholder2 ?? 12;

  // ✅ Kör filtrering efter att dropdownen fått sitt värde
  filterItemsBySkin();
});






knifeSkinSelect.addEventListener("change", filterItemsBySkin);


  // Load saved settings
  chrome.storage.local.get(SETTINGS_KEY, res => {
    const settings = res[SETTINGS_KEY] || {};

    knifeTypeSelect.value = settings.knifeType || "";
    knifeSkinSelect.value = settings.knifeSkin || "";
    toggleFilter.checked = settings.toggleFilter ?? true;
    toggleGlow.checked = settings.ToggleKnifeGlow || false;
    toggleAlert.checked = settings.ToggleKnifeAlert || false;
    toggleBlink.checked = settings.ToggleKnifeBlink || false;
    glowMin.value = settings.KnifeGlowPlaceholder1 ?? -99;
    glowMax.value = settings.KnifeGlowPlaceholder2 ?? 12;
    alertMin.value = settings.KnifeAlertPlaceholder1 ?? -99;
    alertMax.value = settings.KnifeAlertPlaceholder2 ?? 12;
    blinkMin.value = settings.KnifeBlinkPlaceholder1 ?? -99;
    blinkMax.value = settings.KnifeBlinkPlaceholder2 ?? 12;
  });





  // Secondary feature toggles
  [
    ["toggleFilter", "filterBox", "block"],
    ["toggleCalc", "calcBox", "block"],
    ["toggleTools", "toolsBox", "grid"],
    ["toggleInventory", "inventoryBox", "grid"]
  ].forEach(([t, b, mode]) => {
    const toggle = document.getElementById(t);
    const box = document.getElementById(b);
    if (toggle && box) {
      toggle.addEventListener("change", e => {
        box.style.display = e.target.checked ? mode : "none";
      });
    }
  });

  // Percent Viewer Toggle
  procentViewerToggle.addEventListener("change", () => {
    if (procentViewerToggle.checked) {
      console.log("➗  förstoringsglas är PÅ");
    } else {
      console.log("➗  förstoringsglas är AV");
    }
  });

  // Scout Mode Toggle
  scoutModeToggle.addEventListener("change", () => {
    if (scoutModeToggle.checked) {
      console.log("🔭 Priskoll är PÅ");
    } else {
      console.log("🔭 Priskoll är AV");
    }
  });

  // Profit Potential Toggle
  profitPotentialToggle.addEventListener("change", () => {
    if (profitPotentialToggle.checked) {
      console.log("📈 Profit Potential är PÅ");
    } else {
      console.log("📈 Profit Potential är AV");
    }
  });

  // Wallet Converter Toggle
  walletConverterToggle.addEventListener("change", () => {
    if (walletConverterToggle.checked) {
      console.log("💰 Wallet converter är PÅ");
    } else {
      console.log("💰 Wallet converter är AV");
    }
  });

  // Insta Toggle
  instaToggle.addEventListener("change", () => {
    if (instaToggle.checked) {
      console.log("⚡ Insta är PÅ");
    } else {
      console.log("⚡ Insta är AV");
    }
  });

  // Print Info Toggle
  printInfoToggle.addEventListener("change", () => {
    if (printInfoToggle.checked) {
      console.log("📷 Print Info är PÅ");
    } else {
      console.log("📷 Print Info är AV");
    }
  });

  // Bargain Calculator Inputs
  ["bargainPrice", "bargainOrig", "bargainNew"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => {
        if (id === "bargainOrig") {
          const v = parseFloat(bargainOrig.value) || 0;
          bargainNew.value = v;
        }
        calcBargain();
      });
    }
  });

  // Coin Converter Input
  if (coinInput) {
    coinInput.addEventListener("input", () => {
      const coins = parseFloat(coinInput.value) || 0;
      const eur = coins * COIN_TO_EUR;
      const sek = eur * EUR_TO_SEK;
      euroOutput.textContent = eur.toFixed(2);
      sekOutput.textContent = sek.toFixed(2);
    });
  }
});

// == Save and Reset Functions ==
function saveSettings() {
  const updatedSettings = {
    knifeType: knifeTypeSelect.value,
    knifeSkin: knifeSkinSelect.value,
    toggleFilter: toggleFilter.checked,
    ToggleKnifeGlow: toggleGlow.checked,
    ToggleKnifeAlert: toggleAlert.checked,
    ToggleKnifeBlink: toggleBlink.checked,
    KnifeGlowPlaceholder1: parseFloat(glowMin.value),
    KnifeGlowPlaceholder2: parseFloat(glowMax.value),
    KnifeAlertPlaceholder1: parseFloat(alertMin.value),
    KnifeAlertPlaceholder2: parseFloat(alertMax.value),
    KnifeBlinkPlaceholder1: parseFloat(blinkMin.value),
    KnifeBlinkPlaceholder2: parseFloat(blinkMax.value)
  };

  chrome.storage.local.set({ [SETTINGS_KEY]: updatedSettings });
}

// == Event Listeners for Settings Changes ==
[
  knifeTypeSelect, knifeSkinSelect,
  toggleFilter, toggleGlow, toggleAlert, toggleBlink,
  glowMin, glowMax, alertMin, alertMax, blinkMin, blinkMax
].forEach(el => {
  el.addEventListener("change", saveSettings);
});

// Reset effects when toggles are turned off
toggleGlow.addEventListener("change", () => {
  if (!toggleGlow.checked) {
    resetAllEffects();
  }
});

toggleBlink.addEventListener("change", () => {
  if (!toggleBlink.checked) {
    resetAllEffects();
  }
});

toggleAlert.addEventListener("change", () => {
  if (!toggleAlert.checked) {
    chrome.storage.local.set({ knifeFinderResetAlert: true });
  }
});

// == Button Click Handlers ==
btnInventory?.addEventListener("click", () => {
  window.open("https://steamcommunity.com/my/inventory#730", "_blank");
});

btnTrade?.addEventListener("click", () => {
  window.open("https://steamcommunity.com/my/tradeoffers/", "_blank");
});

btnApiKey?.addEventListener("click", () => {
  window.open("https://store.steampowered.com/pointssummary/ajaxgetasyncconfig", "_blank");
});

// == Bottom Population Script for knifeTypeSelect ==
if (typeSelect) {
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All Items";
  typeSelect.appendChild(allOption);

  knifeTypes.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    typeSelect.appendChild(opt);
  });
}

// Note: ALL ITEMS SCRIPT till knivmod får vänta me denna



document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["scoutmode", "profitcards", "procentviewer"], (result) => {
    document.getElementById("toggle-scout-mode").checked = result.scoutmode || false;
    document.getElementById("toggle-profit-potential").checked = result.profitcards || false;
    document.getElementById("toggle-procent-viewer").checked = result.procentviewer || false;
  });
});

// Spara till chrome.storage.local när toggles ändras

procentViewerToggle.addEventListener("change", () => {
  chrome.storage.local.set({ procentviewer: procentViewerToggle.checked });
});

scoutModeToggle.addEventListener("change", () => {
  chrome.storage.local.set({ scoutmode: scoutModeToggle.checked });
});

profitPotentialToggle.addEventListener("change", () => {
  chrome.storage.local.set({ profitcards: profitPotentialToggle.checked });
});
