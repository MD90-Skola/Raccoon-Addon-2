const knifeTypes = [
  "Bayonet",
  "Karambit",
  "Butterfly Knife",
  "M9 Bayonet",
  "Flip Knife",
  "Huntsman Knife",
  "Shadow Daggers",
  "Falchion Knife",
  "Gut Knife",
  "Navaja Knife",
  "Stiletto Knife",
  "Talon Knife",
  "Ursus Knife",
  "Survival Knife",
  "Paracord Knife",
  "Nomad Knife",
  "Skeleton Knife"
];

const knifeSkins = [
  "Doppler",
  "Fade",
  "Lore",
  "Crimson Web",
  "Tiger Tooth",
  "Slaughter",
  "Marble Fade",
  "Damascus Steel",
  "Case Hardened",
  "Ultraviolet",
  "Night",
  "Rust Coat",
  "Blue Steel"
];

// Fyll dropdowns
const knifeTypeSelect = document.getElementById("knifeType");
const knifeSkinSelect = document.getElementById("knifeSkin");

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

// Sök-funktion
function searchKnife() {
  const type = knifeTypeSelect.value;
  const skin = knifeSkinSelect.value;
  const combo = `${type} | ${skin}`;
  document.getElementById("result").textContent = `Du söker: ${combo}`;

  // Här kan du koppla detta till sökning på din hemsida
  // t.ex. sökPåWebbsida(combo);
}


function updateSliderBackground(slider) {
  const min = parseFloat(slider.min) || 0;
  const max = parseFloat(slider.max) || 100;
  const val = parseFloat(slider.value);

  const percent = ((val - min) / (max - min)) * 100;

  // Justering: tummen är 14px bred → ~7px halvvägs
  const pixelAdjust = 7; // justering i px
  const sliderWidth = slider.offsetWidth;
  const adjustPercent = (pixelAdjust / sliderWidth) * 100;

  const start = Math.max(5, percent - adjustPercent);
  const end = Math.min(50, percent + adjustPercent);

  slider.style.background = `linear-gradient(to right, #1e3930 0%, #1e3930 ${start}%, #1e1e1e ${end}%, #1e1e1e 100%)`;
}

document.querySelectorAll('input[type="range"].custom-slider').forEach(slider => {
  updateSliderBackground(slider);
  slider.addEventListener('input', () => updateSliderBackground(slider));
});



(() => {
  'use strict';

  // TOGGLE HELPERS
  const toggles = [
    ['toggleFilter',   'filterBox',      'block'],
    ['toggleCalc',     'calcBox',        'block'],
    ['toggleInventory','inventoryBox',   'grid'],
    ['toggleGlowOpts', 'glowOptionsBox', 'block'],
    ['toggleMisc',     'miscContent',    'block']
  ];

  toggles.forEach(([chkId, boxId, mode]) => {
    const chk  = document.getElementById(chkId);
    const box  = document.getElementById(boxId);
    if (!chk || !box) return;
    const update = () => { box.style.display = chk.checked ? mode : 'none'; };
    chk.addEventListener('change', update);
    update();
  });

  // BARGAIN CALCULATOR
  const bargainFields = ['bargainPrice', 'bargainOrig', 'bargainNew']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const calcBargain = () => {
    const list =  parseFloat(bargainPrice.value) || 0;
    const orig =  parseFloat(bargainOrig.value)  || 0;
    const neu  =  parseFloat(bargainNew.value)   || 0;
    const base     = list / (1 + orig / 100);
    const newPrice = base * (1 + neu / 100);
    const diff     = newPrice - list;

    bargainNewVal.textContent   = neu .toFixed(1);
    bargainOrigVal.textContent  = orig.toFixed(1);
    bargainNewPrice.textContent = newPrice.toFixed(2);
    bargainDiff.textContent     = diff.toFixed(2);
  };

  bargainFields.forEach(el => {
    el.addEventListener('input', () => {
      if (el.id === 'bargainOrig') {
        bargainNew.value = parseFloat(bargainOrig.value) || 0;
      }
      calcBargain();
    });
  });

  // COIN CONVERTER
  const COIN_TO_EUR = 0.62;
  const EUR_TO_SEK  = 10.9087;
  const coinInputEl = document.getElementById('coinInput');
  coinInputEl.addEventListener('input', () => {
    const coins = parseFloat(coinInputEl.value) || 0;
    const eur   = coins * COIN_TO_EUR;
    euroOutput.textContent = eur.toFixed(2);
    sekOutput.textContent  = (eur * EUR_TO_SEK).toFixed(2);
  });
})();




document.getElementById("btnInventory")?.addEventListener("click", () => {
  window.open("https://steamcommunity.com/my/inventory#730", "_blank");
});

document.getElementById("btnTrade")?.addEventListener("click", () => {
  window.open("https://steamcommunity.com/my/tradeoffers/", "_blank");
});

document.getElementById("btnApiKey")?.addEventListener("click", () => {
  window.open("https://store.steampowered.com/pointssummary/ajaxgetasyncconfig", "_blank");
});




document.getElementById("toggleMisc")?.addEventListener("change", e => {
  document.getElementById("miscContent")?.classList.toggle("hidden", !e.target.checked);
});
