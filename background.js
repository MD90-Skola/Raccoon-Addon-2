// background.js – ren version

chrome.runtime.onInstalled.addListener(() => {
  console.log('🦝  Raccoon Tool PRO installerat');
  chrome.contextMenus.create({
    id: 'lookupSkin',
    title: '🔍 Sök upp Skin på PriceEmpire',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'lookupSkin' || !tab?.id) return;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractSkinAndOpen
  });
});

// -------------- injiceras i sidans DOM --------------
function extractSkinAndOpen () {
  const el = document.elementFromPoint(window.lastMouseX || 0,
                                       window.lastMouseY || 0);
  if (!el) return alert('❌ Hittade inget kort');

  const raw = (el.textContent || '').replace(/[★☆♦▪•™]/g,'').trim();

  // weapon | skin (wear?)   – wear är VALFRI
  const m = raw.match(/(.+?)\s*\|\s*(.+?)(?:\s*\((.+?)\))?$/);
  if (!m) return alert('❌ Kunde inte tolka skin-namnet');

  const [ , weapon, skin, wearRaw ] = m;
  const slug = s => encodeURIComponent(s.toLowerCase().trim().replace(/\s+/g,'-'));
  const wear = wearRaw ? slug(wearRaw) : 'vanilla';
  const url  = `https://app.pricempire.com/item/cs2/skin/${slug(weapon)}/${slug(skin)}/${wear}`;
  window.open(url,'_blank','noopener');
}
