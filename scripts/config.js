const allowedCharacters = new RegExp("^[a-z0-9 _-]+$");
const fontStyles = ["bold 12px Montserrat", "12px Montserrat", "bold 18px Montserrat", "18px Montserrat"];

const encoded = '92b2d4c1c4msh1de35bf2aa66991p1aa7eajsna9bd146f7191'

// Validations =======================================================================================================
async function checkRestricted(string) {
  string = string.toLowerCase();

  const encodedParams = new URLSearchParams();
  encodedParams.append("content", string);

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': encoded,
      'X-RapidAPI-Host': 'neutrinoapi-bad-word-filter.p.rapidapi.com'
    },
    body: encodedParams
  };

  let restrictedResult = '';
  await fetch('https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter', options)
    .then(response => response.json())
    .then(response => restrictedResult = response)
    .catch(err => console.error(err));

  if (restrictedResult['is-bad']) {
    console.log("Couldn't you use a nicer word than that?");
    return true;
  }

  return false;
}

function checkCharacters(string) {
  string = string.toLowerCase();

  if (allowedCharacters.test(string) === false) {
    console.log("Invalid character used.");
    return true;
  }

  return false;
}

function checkRadio(radios) {
  let x = 0;
  let y = radios.length;

  for (x = 0; x < y; x++) {
    if (radios[x].checked) {
      return radios[x].value;
    }
  }
}

// Conversion Functions ===============================================================================================
function inchesFraction(v) {
  return Math.floor(16 * (v % 1)) + "/16ths";
}

// Toggle Settings ====================================================================================================
function toggleEmpty() {
  if (drawEmpty === true) {
    drawEmpty = false;
  } else {
    drawEmpty = true;
  }

  swatches.regenerateSwatches();
  editorLayer.redrawCanvas();
}

function toggleSize() {
  if (rulerSize == "large") {
    rulerSize = "small";
  } else {
    rulerSize = "large";
  }

  createInterface();
  uiLayer.redrawCanvas();
}

function toggleTheme() {
  if (theme == 0) {
    theme = 1;
  } else {
    theme = 0;
  }

  changeCSS("*", "color", themeLibrary.themes[theme].fontColour);
  changeCSS(".borderBottom, h1", "border-color", themeLibrary.themes[theme].fontColour);
  changeCSS(".borderTop, .overlayFooter", "border-color", themeLibrary.themes[theme].fontColour);
  changeCSS(".backgroundTheme", "background-color", themeLibrary.themes[theme].backgroundColour);
  changeCSS("input[type=\"file\"]", "color", themeLibrary.themes[theme].fontColour);
  changeCSS(".slider", "background-color", themeLibrary.themes[theme].toggleColour);
  changeCSS("#overlayWindow", "background-color", themeLibrary.themes[theme].overlayColour);

  backgroundLayer.redrawCanvas();
  createInterface();
  uiLayer.redrawCanvas();
}

function toggleUnits() {
  if (rulerUnits == "metric") {
    rulerUnits = "imperial";
  } else {
    rulerUnits = "metric";
  }

  createInterface();
  uiLayer.redrawCanvas();
}

// General Functions ====================================================================================================
function addEvent(object, type, method) {
  object.addEventListener(type, method, false);
}

function calculateScale(destinationHeight, destinationWidth, sourceHeight, sourceWidth) {
  let scale = 0;
  let sh = 0;
  let sw = 0;

  sh = destinationHeight / sourceHeight;
  sw = destinationWidth / sourceWidth;

  if (sh < sw) {
    scale = sh;
  } else {
    scale = sw;
  }

  return scale;
}

function changeCSS(selector, style, value) {
  let css = document.styleSheets[0].cssRules;

  let x = 0;
  let y = 0;

  for (x = 0; x < css.length; x++) {
    if (css[x].selectorText == selector) {
      css[x].style.setProperty(style, value);
      return true;
    }
  }

  console.log("Rule " + selector + " not found.");
  return false;
}

function distanceFromScale(fromX, fromY, toX, toY, offsetX, offsetY) {
  let scaleCenterX = toX + offsetX + scaleWidthPxHalf;
  let scaleCenterY = toY + offsetY + scaleHeightPxHalf;

  let dx = fromX - scaleCenterX;
  let dy = fromY - scaleCenterY;

  let ry = scaleRadius - (scaleOffsetR * 2);

  let dist = Math.abs(Math.sqrt(((dx * dx) * 2.25) + (dy * dy)));

  if (dist < ry) {
    return true;
  }
}

function formatRGBA(r, g, b, a = 1) {
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function setURL(id = "", title = "") {
  if (id != "") {
    id = "?id=" + id;
  } else {
    id = "https://scalemail.lairoftheraven.uk";
  }

  //disabled for local
  // window.history.pushState(browserHistory, title, id);
}

// Background Functions ===============================================================================================
function drawBackgroundDots(canvas, pattern, colour) {
  if (colour === undefined) colour = themeLibrary.themes[theme].dotColour;

  // Variables
  let context = canvas.context;

  let h = editorLayer.entities[0].imagesrc.height / 2;
  let w = editorLayer.entities[0].imagesrc.width / 2;
  let m = 0;
  let x = 0;
  let y = 0;

  let drawX = 0;
  let drawY = 0;

  let backgroundOriginX = 0;
  let backgroundOriginY = 0;

  let backgroundOffsetX = 0;
  let backgroundOffsetY = 0;

  let stepX = scaleSpacingX;
  let stepY = scaleSpacingY * 2;

  let dot = Math.floor(scaleRadius / 30);

  if (dot < 1) {
    dot = 1;
  }

  // Calculate Bottom Left Scale
  if (pattern.matrix[pattern.matrix.length - 1][0].colour == 0) {
    m = scaleSpacingXHalf;
  }

  backgroundOriginX = canvas.centerX - w - dot + scaleSpacingX + m;
  backgroundOriginY = canvas.centerY + h - (dot * 1.5);

  // Calculate Pan Offset
  backgroundOriginX += canvas.offsetX
  backgroundOriginY += canvas.offsetY;

  // Step Back to Edge
  for (x = 0; backgroundOriginX > 0; x++) {
    backgroundOriginX -= stepX;
  }

  for (y = 0; backgroundOriginY > 0; y++) {
    backgroundOriginY -= stepY;
  }

  // Draw Dots
  context.beginPath();
  for (y = 0;
    (y - 1) * stepY < canvas.height; y++) {
    for (x = 0;
      (x - 1) * stepX < canvas.width; x++) {
      drawX = Math.round(backgroundOriginX + (stepX * x));
      drawY = Math.round(backgroundOriginY + (stepY * y));
      context.rect(drawX, drawY, dot, dot);

      drawX += Math.round(scaleSpacingXHalf);
      drawY -= Math.round(scaleSpacingY);
      context.rect(drawX, drawY, dot, dot);
    }
  }

  context.closePath();

  context.fillStyle = colour;
  context.fill("nonzero");
}

// Camera Functions ===================================================================================================
function takePhoto() {
  // Variables
  let canvas = photoLayer.canvas;
  let context = photoLayer.context;

  let photo;
  let a;

  let tt = "Created using Lair of the Raven's Scalemail Inlay Designer";
  let it = "";

  let ch = 0;
  let cw = 0;

  // Configure Memory Canvas
  // Set Scale Radius
  drawEmpty = false;
  zoomReset();

  // Scale to Pattern Size
  ch = swatches.patternSwatch.canvas.height;
  cw = swatches.patternSwatch.canvas.width;
  photoLayer.scaleCanvas(ch + 100, cw + 50, false);

  // Fill Layer
  context.fillStyle = themeLibrary.themes[theme].backgroundColour;
  context.fillRect(0, 0, photoLayer.width, photoLayer.height);

  // Create Image
  // Draw Pattern
  context.drawImage(swatches.patternSwatch.canvas, 25, 25);

  if (loadedTitle.length > 0) {
    tt = loadedTitle + " by " + loadedAuthor;
    it = "?id=" + loadedID;
  }

  context.fillStyle = "rgba(255, 255, 255, 0.5)";

  context.beginPath();
  context.font = fontStyles[2];
  context.fillText(tt, 25, ch + 100 - 45);

  context.font = fontStyles[3];
  context.fillText("https://scalemail.lairoftheraven.uk" + it, 25, ch + 100 - 25);
  context.closePath();

  // To Image
  photo = canvas.toDataURL("image/png");

  // Download
  a = document.getElementById('photoAnchor');

  if (loadedTitle.length < 1) {
    a.download = "mypattern.png";
  } else {
    a.download = loadedTitle + ".png";
  }

  a.href = photo;
  a.click();

  // Restore Original Canvas
  drawEmpty = true;
  zoomExtents(editorPattern);
}