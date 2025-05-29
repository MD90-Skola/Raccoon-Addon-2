document.addEventListener("DOMContentLoaded", () => {
  /* ----------  TOGGLE HELPERS  ---------- */
  const toggles = [
    ['toggleFilter',   'filterBox',      'block'],
    ['toggleCalc',     'calcBox',        'block'],
    ['toggleInventory','inventoryBox',   'grid'],
    ['toggleGlowOpts', 'glowOptionsBox', 'block'],
    ['toggleMisc',     'miscContent',    'block']   // Tutorial / Info
  ];

  toggles.forEach(([chkId, boxId, mode]) => {
    const chk  = document.getElementById(chkId);
    const box  = document.getElementById(boxId);
    if (!chk || !box) return;
    const update = () => { box.style.display = chk.checked ? mode : 'none'; };
    chk.addEventListener('change', update);
    update();
  });

  /* ----------  BARGAIN CALCULATOR  ---------- */
  const bargainFields = ['bargainPrice', 'bargainOrig', 'bargainNew']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const calcBargain = () => {
    const list =  parseFloat(document.getElementById('bargainPrice')?.value) || 0;
    const orig =  parseFloat(document.getElementById('bargainOrig')?.value)  || 0;
    const neu  =  parseFloat(document.getElementById('bargainNew')?.value)   || 0;

    const base     = list / (1 + orig / 100);
    const newPrice = base * (1 + neu / 100);
    const diff     = newPrice - list;

    document.getElementById('bargainNewVal').textContent   = neu.toFixed(1);
    document.getElementById('bargainOrigVal').textContent  = orig.toFixed(1);
    document.getElementById('bargainNewPrice').textContent = newPrice.toFixed(2);
    document.getElementById('bargainDiff').textContent     = diff.toFixed(2);
  };

  bargainFields.forEach(el => {
    el.addEventListener('input', () => {
      if (el.id === 'bargainOrig') {
        document.getElementById('bargainNew').value = parseFloat(el.value) || 0;
      }
      calcBargain();
    });
  });

  /* ----------  COIN CONVERTER  ---------- */
  const COIN_TO_EUR = 0.62;
  const EUR_TO_SEK  = 10.9087;

  const coinInputEl = document.getElementById('coinInput');
  coinInputEl?.addEventListener('input', () => {
    const coins = parseFloat(coinInputEl.value) || 0;
    const eur   = coins * COIN_TO_EUR;

    document.getElementById('euroOutput').textContent = eur.toFixed(2);
    document.getElementById('sekOutput').textContent  = (eur * EUR_TO_SEK).toFixed(2);
  });

  /* ----------  KNIFE DROPDOWNS  ---------- */
  const knifeTypes = [
    "Bayonet", "Karambit", "Butterfly Knife", "M9 Bayonet", "Flip Knife",
    "Huntsman Knife", "Shadow Daggers", "Falchion Knife", "Gut Knife",
    "Navaja Knife", "Stiletto Knife", "Talon Knife", "Ursus Knife",
    "Survival Knife", "Paracord Knife", "Nomad Knife", "Skeleton Knife"
  ];

  const knifeSkins = [
    "Doppler", "Fade", "Lore", "Crimson Web", "Tiger Tooth", "Slaughter",
    "Marble Fade", "Damascus Steel", "Case Hardened", "Ultraviolet",
    "Night", "Rust Coat", "Blue Steel"
  ];

  const knifeTypeSelect = document.getElementById("knifeType");
  const knifeSkinSelect = document.getElementById("knifeSkin");

  knifeTypes.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    knifeTypeSelect?.appendChild(opt);
  });

  knifeSkins.forEach(skin => {
    const opt = document.createElement("option");
    opt.value = skin;
    opt.textContent = skin;
    knifeSkinSelect?.appendChild(opt);
  });
});




document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnInventory")?.addEventListener("click", () => {
    window.open("https://steamcommunity.com/my/inventory#730", "_blank");
  });

  document.getElementById("btnTrade")?.addEventListener("click", () => {
    window.open("https://steamcommunity.com/my/tradeoffers/", "_blank");
  });

  document.getElementById("btnApiKey")?.addEventListener("click", () => {
    window.open("https://store.steampowered.com/pointssummary/ajaxgetasyncconfig", "_blank");
  });
});

