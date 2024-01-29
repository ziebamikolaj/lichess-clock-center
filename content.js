function createOrUpdateCanvas(chessboard, side) {
   let canvasId = side === "left" ? "left-canvas" : "right-canvas";
   let canvas = document.getElementById(canvasId);
   if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = canvasId;
      chessboard.appendChild(canvas);
   }
   canvas.width = chessboard.clientWidth / 2;
   canvas.height = chessboard.clientHeight;
   canvas.style.position = "absolute";
   canvas.style.zIndex = "100";
   canvas.style.pointerEvents = "none";
   canvas.style.top = "0px";
   if (side === "left") {
      canvas.style.left = "25%";
   } else {
      canvas.style.left = "25%";
   }
   return canvas;
}

function drawArc(canvas, percentage, side) {
   let context = canvas.getContext("2d");
   if (percentage > 100) percentage = 100;
   let x = canvas.width / 2;
   let y = canvas.height / 2;

   let radius = (Math.min(canvas.width, canvas.height) / 2) * 0.8;

   let thickness = 30;
   let startAngle = Math.PI / 2;
   let endAngle =
      side === "left"
         ? startAngle + Math.PI * (percentage / 100)
         : startAngle - Math.PI * (percentage / 100);

   context.clearRect(0, 0, canvas.width, canvas.height);
   if (percentage > 0) {
      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, side === "right");
      context.lineWidth = thickness;
      context.strokeStyle =
         side === "left" ? "rgba(0, 128, 0, 0.3)" : "rgba(255, 0, 0, 0.3)";
      context.stroke();
   }
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
   updateTimeDisplay();
   window.addEventListener("resize", updateTimeDisplay);
   setInterval(updateTimeDisplay, 1000);
}
const gameTime = getGameTime();
setupCanvases();
