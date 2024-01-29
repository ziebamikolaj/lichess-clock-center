const defaultSettings = {
   arcThickness: 70,
   arcDiscrepancy: 50,
   leftArcColor: "#ffffff",
   rightArcColor: "#000000",
   arcAlpha: 0.4,
   arcAngle: 30,
};

chrome.runtime.onInstalled.addListener(() => {
   console.log("Lichess ClockCenter Extension Installed");
   chrome.storage.local.get("clockCenterSettings", function (data) {
      if (!data.clockCenterSettings) {
         chrome.storage.local.set({ clockCenterSettings: defaultSettings });
      }
   });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.message === "setSettings") {
      chrome.storage.local.set({ clockCenterSettings: request.settings });
   }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.message === "getSettings") {
      chrome.storage.local.get("clockCenterSettings", function (data) {
         if (data.clockCenterSettings) {
            sendResponse({ settings: data.clockCenterSettings });
         } else {
            chrome.storage.local.set({ clockCenterSettings: defaultSettings });
            sendResponse({ settings: data.clockCenterSettings });
         }
      });
      return true;
   }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.message === "resetSettings") {
      chrome.storage.local.remove("clockCenterSettings");
      chrome.storage.local.set({ clockCenterSettings: defaultSettings });
      sendResponse({ settings: defaultSettings });
   }
});
