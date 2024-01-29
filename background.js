const defaultSettings = {
   arcThickness: 25,
   arcDiscrepancy: 30,
   leftArcColor: "#00ff00",
   rightArcColor: "#ff0000",
   leftArcAlpha: 0.3,
   rightArcAlpha: 0.3,
   arcAngle: 70,
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
