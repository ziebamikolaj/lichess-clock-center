function saveSettings() {
   let settings = {
      arcThickness: document.getElementById("arcThickness").value,
      arcDiscrepancy: document.getElementById("arcDiscrepancy").value,
      leftArcColor: document.getElementById("leftArcColor").value,
      rightArcColor: document.getElementById("rightArcColor").value,
      arcAlpha: document.getElementById("arcAlpha").value,
      arcAngle: document.getElementById("arcAngle").value,
   };

   chrome.runtime.sendMessage({ message: "setSettings", settings: settings });
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
         type: "updateSettings",
         newSettings: settings,
      });
   });
}
function resetSettings() {
   chrome.runtime.sendMessage(
      { message: "resetSettings" },
      function (response) {
         if (response && response.settings) {
            const settings = response.settings;
            document.getElementById("arcThickness").value =
               settings.arcThickness;
            document.getElementById("arcDiscrepancy").value =
               settings.arcDiscrepancy;
            document.getElementById("leftArcColor").value =
               settings.leftArcColor;
            document.getElementById("rightArcColor").value =
               settings.rightArcColor;
            document.getElementById("arcAlpha").value = settings.arcAlpha;
            document.getElementById("arcAngle").value = settings.arcAngle;
            saveSettings();
         }
      }
   );
}

function initializeSettings() {
   chrome.runtime.sendMessage({ message: "getSettings" }, function (response) {
      if (response && response.settings) {
         const settings = response.settings;
         document.getElementById("arcThickness").value = settings.arcThickness;
         document.getElementById("arcDiscrepancy").value =
            settings.arcDiscrepancy;
         document.getElementById("leftArcColor").value = settings.leftArcColor;
         document.getElementById("rightArcColor").value =
            settings.rightArcColor;
         document.getElementById("arcAlpha").value = settings.arcAlpha;
         document.getElementById("arcAngle").value = settings.arcAngle;
      }
   });

   document
      .getElementById("arcThickness")
      .addEventListener("input", saveSettings);
   document
      .getElementById("arcDiscrepancy")
      .addEventListener("input", saveSettings);
   document
      .getElementById("leftArcColor")
      .addEventListener("input", saveSettings);
   document
      .getElementById("rightArcColor")
      .addEventListener("input", saveSettings);
   document.getElementById("arcAlpha").addEventListener("input", saveSettings);
   document.getElementById("arcAngle").addEventListener("input", saveSettings);
}

document.addEventListener("DOMContentLoaded", initializeSettings);
document
   .getElementById("resetSettings")
   .addEventListener("click", resetSettings);
