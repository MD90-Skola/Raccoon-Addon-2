// Körs i bakgrunden – t.ex. vid klick eller kommunikation
chrome.runtime.onInstalled.addListener(() => {
  console.log("🦝 Raccoon Tool PRO är installerat!");
});

// Exempel på att lyssna på meddelanden från popup eller content
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "logInfo") {
    console.log("📩 Mottaget från popup:", message.data);
    sendResponse({ status: "OK" });
  }
});
