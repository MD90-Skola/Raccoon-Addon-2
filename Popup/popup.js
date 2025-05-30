// popup.js

// == Knife Dropdown Data ==
const knifeTypes = [
  "Bayonet", "Bowie Knife", "Butterfly Knife", "Classic Knife", "Falchion Knife",
  "Flip Knife", "Ghost Knife", "Gut Knife", "Huntsman Knife", "Karambit", "Kukri Knife",
  "M9 Bayonet", "Navaja Knife", "Nomad Knife", "Paracord Knife", "Skeleton Knife",
  "Stiletto Knife", "Survival Knife", "Talon Knife", "Ursus Knife", "Shadow Daggers"
];

const knifeSkins = [
  "Autotronic", "Black Laminate", "Black Pearl", "Blue Steel", "Case Hardened",
  "Crimson Web", "Damascus Steel", "Doppler", "Emerald", "Fade", "Freehand", "Gamma",
  "Lore", "Marble Fade", "Night", "Phase 1", "Phase 2", "Phase 3", "Phase 4", "Ruby",
  "Rust Coat", "Sapphire", "Slaughter", "Tiger Tooth", "Ultraviolet"
];

function populateKnifeDropdowns() {
  const knifeTypeSelect = document.getElementById("knifeType");
  const knifeSkinSelect = document.getElementById("knifeSkin");

  if (!knifeTypeSelect || !knifeSkinSelect) {
    console.warn("Dropdowns för knivar saknas i DOM");
    return;
  }

  knifeTypeSelect.innerHTML = '';
  knifeSkinSelect.innerHTML = '';

  knifeTypes.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    knifeTypeSelect.appendChild(opt);
  });

  knifeSkins.forEach(skin => {
    const opt = document.createElement("option");
    opt.value = skin;
    opt.textContent = skin;
    knifeSkinSelect.appendChild(opt);
  });
}

// DOM Elements
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

const SETTINGS_KEY = "knifeFinderSettings";

// Vänta tills DOM är redo innan dropdowns fylls
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', populateKnifeDropdowns);
} else {
  populateKnifeDropdowns();
}

// Ladda sparade inställningar
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

// Event Listeners
[
  knifeTypeSelect, knifeSkinSelect,
  toggleFilter, toggleGlow, toggleAlert, toggleBlink,
  glowMin, glowMax, alertMin, alertMax, blinkMin, blinkMax
].forEach(el => {
  el.addEventListener("change", saveSettings);
});

function resetAllEffects() {
  document.querySelectorAll("cw-csgo-market-item-card-wrapper, cw-csgo-market-item-card").forEach(c => {
    c.classList.remove("knife-blink");
    c.style.boxShadow = "";
  });
}

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



// Normalisera strängar så att vi matchar även ogämn text/mellanrum
function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, '').trim();
}

// Gör likadant i KnifeFinder.js för att säkra att den hittar rätt
