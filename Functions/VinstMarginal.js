

// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //






                                       ///////////////////////////////////////////////

                                       // VinstMarginal.js      codename Profit Potential    funkar


                                       // denna visar endast % på vinst 



                                       // denna är 100% färdig med timer 


                                      ///////////////////////////////////////////////




window.profitcards_active = false;

// Läs in sparat värde vid uppstart
chrome.storage.local.get("profitcards", res => {
  window.profitcards_active = res.profitcards || false;
});

// Lyssna på ändringar i storage och uppdatera flaggan
chrome.storage.onChanged.addListener(changes => {
  if (changes.profitcards) {
    window.profitcards_active = changes.profitcards.newValue;
    if (!window.profitcards_active) {
      // Om toggeln stängs av – rensa alla kvarvarande etiketter OCH klasser
      clearAllProfitLabels();
    }
  }
});

// Funktion för att ta bort alla profit-etiketter och klasser direkt
function clearAllProfitLabels() {
  document.querySelectorAll("cw-csgo-market-item-card-wrapper.profit").forEach(card => {
    card.classList.remove("profit");
  });
  document.querySelectorAll(".profit-label").forEach(label => {
    label.remove();
  });
}

// Körs varannan sekund för att lägga till etiketter när profitcards_active är true
setInterval(() => {
  if (!window.profitcards_active) return;

  document
    .querySelectorAll("cw-csgo-market-item-card-wrapper:not(.profit)")
    .forEach(card => {
      // Markera kortet som ”behandlat” så vi inte skapar flera etiketter för samma kort
      card.classList.add("profit");

      const priceEl = card.querySelector("cw-pretty-balance");
      const procentMatch = card.textContent.match(/([+\-]?\d+\.?\d*)%/);
      if (!priceEl || !procentMatch) return;

      const price = parseFloat(priceEl.textContent.replace(/,/g, "").replace("€", ""));
      const currentMarkup = parseFloat(procentMatch[1]);
      const markupDiff = Math.max(0, 12 - currentMarkup);
      const profitValue = (price * (markupDiff / 100)).toFixed(2);

      const label = document.createElement("div");
      label.className = "profit-label";
      Object.assign(label.style, {
        position: "absolute",
        top: "5px",
        left: "5px",
        background: "#000a",
        color: "lime",
        padding: "4px 6px",
        borderRadius: "4px",
        fontSize: "12px",
        pointerEvents: "none",
        zIndex: "10"
      });
      label.textContent = `Vinst: ${profitValue} 🪙`;

      // Se till att kortets position är relativ så etiketten hamnar rätt
      if (getComputedStyle(card).position === "static") {
        card.style.position = "relative";
      }

      card.appendChild(label);

      // Sätt en timer på 60 sek för att ta bort just denna etikett och klass på kortet
      setTimeout(() => {
        label.remove();
        // Ta bort ”profit”-klassen så att om profitcards_active fortfarande är true
        // och kortet visas igen i nästa intervall, kan vi eventuellt skapa en ny etikett.
        card.classList.remove("profit");
      }, 60 * 1000);
    });
}, 2000);










                                       ///////////////////////////////////////////////

                                       // VinstMarginal.js      codename Profit Potential    funkar


                                       // denna visar endast % på vinst 



                                       // denna är 100% färdig med timer 


                                      ///////////////////////////////////////////////




// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //
// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //// OK! OK! //

