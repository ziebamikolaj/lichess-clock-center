function createOrUpdateCanvas(chessboard, side) {
   let canvasId = side === "left" ? "left-canvas" : "right-canvas";
   let canvas = document.getElementById(canvasId);
   if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = canvasId;
      chessboard.appendChild(canvas);
   }
   canvas.width = chessboard.clientWidth;
   canvas.height = chessboard.clientHeight;
   canvas.style.position = "absolute";
   canvas.style.zIndex = "100";
   canvas.style.pointerEvents = "none";
   canvas.style.top = "0px";
   if (side === "left") {
      canvas.style.right = cachedSettings.arcDiscrepancy / 2 + "%";
   } else {
      canvas.style.left = cachedSettings.arcDiscrepancy / 2 + "%";
   }

   return canvas;
}

function drawArc(canvas, percentage, side) {
   let context = canvas.getContext("2d");
   let width = canvas.width;
   let height = canvas.height;

   let offset = 100;
   percentage = Math.min(Math.max(percentage, 0), 100);
   let arcAngle = 2 * cachedSettings.arcAngle;

   let startX = width / 2;
   let startY = height - offset;
   let endX = width / 2;
   let endY = 0 + offset;

   let controlOffset = arcAngle * 1.5;
   let controlX =
      side === "left" ? startX - controlOffset : startX + controlOffset;
   let controlY = height / 2;
   let controlX2 =
      side === "left" ? startX - controlOffset : startX + controlOffset;
   let controlY2 = controlY;
   context.clearRect(0, 0, width, height);
   context.beginPath();
   context.moveTo(startX, startY);

   let numSegments = 100;
   let tStep = 1 / numSegments;

   for (let i = 0; i <= numSegments * (percentage / 100); i++) {
      let t = tStep * i;
      let x =
         (1 - t) ** 3 * startX +
         3 * (1 - t) ** 2 * t * controlX +
         3 * (1 - t) * t ** 2 * controlX2 +
         t ** 3 * endX;
      let y =
         (1 - t) ** 3 * startY +
         3 * (1 - t) ** 2 * t * controlY +
         3 * (1 - t) * t ** 2 * controlY2 +
         t ** 3 * endY;
      context.lineTo(x, y);
   }

   context.lineWidth = cachedSettings.arcThickness;
   context.strokeStyle =
      side === "left"
         ? parseColor(cachedSettings.leftArcColor, cachedSettings.arcAlpha)
         : parseColor(cachedSettings.rightArcColor, cachedSettings.arcAlpha);
   context.stroke();
}

function parseColor(inputColor, alpha) {
   let canvas = document.createElement("canvas");
   let ctx = canvas.getContext("2d");
   canvas.width = canvas.height = 1;
   ctx.fillStyle = inputColor; // Set the input color
   ctx.fillRect(0, 0, 1, 1);
   let [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function updateTimeDisplay() {
   let chessboard = document.querySelector(".main-board");
   if (!chessboard) return;
   let opponentTime = getUserTime(document.querySelectorAll(".rclock")[0]);
   let userTime = getUserTime(document.querySelectorAll(".rclock")[1]);
   let leftCanvas = createOrUpdateCanvas(chessboard, "left");
   let rightCanvas = createOrUpdateCanvas(chessboard, "right");
   drawArc(leftCanvas, (userTime * 100) / gameTime, "left");
   drawArc(rightCanvas, (opponentTime * 100) / gameTime, "right");
}

function getGameTime() {
   let timeElement = document.querySelector(".setup");
   if (!timeElement) {
      console.log("Element not found");
      return;
   }
   let time = timeElement.textContent.split("+")[0];
   time = time.replace("½", "0.5");
   time = time.replace("¼", "0.25");
   time = time.replace("¾", "0.75");
   return time;
}

function getUserTime(domElement) {
   let time = domElement.textContent;
   time = time.replace(":", ".");
   time = time.replace(/(\.)(.+)/gm, function (_, g1, g2) {
      return g1 + (g2 / 60).toString().split(".")[1];
   });
   time = parseFloat(time);
   return time;
}

function setupCanvases() {
   chrome.storage.local.get("clockCenterSettings", function (data) {
      if (data.clockCenterSettings) {
         cachedSettings = data.clockCenterSettings;
      }
   });
   window.addEventListener("resize", updateTimeDisplay);
   setInterval(updateTimeDisplay, 100);
}
const gameTime = getGameTime();
let cachedSettings = {};

setupCanvases();
// updateTimeDisplay();
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.type === "updateSettings") {
      cachedSettings = request.newSettings;
      updateTimeDisplay();
   }
});
