/*
	Scalemail Inlay Designer v3
	Developed by Anthony Edmonds for Lair of the Raven Ltd
	Continued Development by Rachel Wisekal for Kiwimaille Creations


	Copyright Lair of the Raven Ltd 2017
*/

// Variables ==========================================================================================================
// Assets
let imageAssets = new imageLoader();
let imagePath = "images/";
let c = "";


// Canvases
let backgroundLayer = new entityLayer();
let editorLayer = new entityLayer();
let interactionLayer;
let uiLayer = new entityLayer();
let photoLayer = new entityLayer();

let canvasCenterX, canvasCenterY = 0;
let updateInterval = 1000 / 60;

// Entities
let nEnt, sEnt;

// Gallery Variables
let loadedID, searchPage = 0;
let loadedTitle, loadedAuthor, loadedSRC = "";
let loadedPrivacy = true;

let searchResults, browserHistory;
let pageLimit = 30;

let saveLayer = new entityLayer();

// Interaction Variables
let panOffsetX, panOffsetY, panCenterX, panCenterY = 0;

let panState, panMouse, panKey = false;

// Overlay Variables
let overlay = new overlayInterface();
let splashText;

// Palette Variables
let palette = new colourPalette("mainPalette");
let activeColour = 2;

let gradientSheen, gradientShiny, textureBrushed;

// Pattern Variables
let editorPattern = new patternMatrix();

// Ruler Variables
let rulerUnits = "metric";
let rulerSize = "large";
let rulerData = [];
let sCount = 0;

rulerData['small'] = { width: 14, height: 22, gapH: 1, gapV: 6, weightS: 0.35, weightR: 0.13 };
rulerData['large'] = { width: 22, height: 36, gapH: 2, gapV: 12, weightS: 0.54, weightR: 0.42 };

rulerData['metric'] = { unitSize: "mm", multiSize: 1, unitWeight: "g", multiWeight: 1 };
rulerData['imperial'] = { unitSize: "\"", multiSize: 0.0393701, unitWeight: "oz", multiWeight: 0.035274 };

// Scale Variables
let scaleRadius = 35;

let scaleOffsetX, scaleOffsetY, scaleOffsetR, scaleHeightPx, scaleHeightPxHalf, scaleHeightPxQuarter,
  scaleWidthPx, scaleWidthPxHalf, scaleSpacingX, scaleSpacingXHalf, scaleSpacingY, scaleInnerHoleRadius, scaleInnerHoleOffset = 0;

let scaleRatioWide = 0.609022556;
let scaleRatioHigh = 1.641975309;

// Swatch Variables
let swatches = new templateSwatches();
let drawEmpty = true;

// Theme Variables
let themeLibrary = new themeSet();
let theme = 0;

// UI Variables
let uiToolbox = new uiSection();
let uiCamera = new uiSection();

let uiOffsetX = 15;
let uiOffsetY = 15;
let uiIconSize = 30;

let currentTool = "toolboxCursor";

init();


function init() {
  setupElements();

  imageAssets.loadImages();
  addEvent(window, "resize", scaleCanvases);
}




// Objects ============================================================================================================
// Entity
function entity() {
  this.id = "";
  this.object = false;
  this.shape = "";

  this.mouse = false;
  this.mouseClick = false;
  this.mouseHover = false;
  this.mousePointer = false;

  this.fill = false;
  this.fillColour = "";
  this.fillOrder = "nonzero";
  this.fillPalette = 0;

  this.stroke = false;
  this.strokeColour = "";
  this.strokeWeight = 0;

  this.imagesrc = "";
  this.imageClipX = false;
  this.imageClipY = false;

  this.tooltip = false;
  this.tooltipText = "";
  this.tooltipFlip = false;

  this.originX = 0;
  this.originY = 0;
  this.height = 0;
  this.width = 0;

  this.textAlign = "";
  this.textString = "";
  this.textType = 0;
}

// Interface
function uiSection() {
  this.name = "";
  this.buttons = [];

  this.alignRight = false;
  this.alignBottom = false;

  this.addButton = function(btn) {
    this.buttons.push(btn);
  }

  this.buildSection = function(target) {
    // Variables
    let x = 0;
    let y = this.buttons.length;
    let z = 0;
    let l = 0;

    let sx = 0;

    let ox = 0;
    let oy = 0;

    // Configure Origin
    if (this.alignRight === true) {
      ox = target.width - uiOffsetX - uiIconSize;
    } else {
      ox = uiOffsetX;
    }

    if (this.alignBottom === true) {
      oy = target.height - uiOffsetX - uiIconSize;
    } else {
      oy = uiOffsetY;
    }

    // Create Entities
    for (x = 0; x < y; x++) {
      if (this.buttons[x].pregap === true) {
        sx += uiIconSize;
      }

      target.addEntity(this.buttons[x].createButtonEntity(target, ox, oy + (uiIconSize * x) + sx));

      if (this.buttons[x].expandable === true && this.buttons[x].expanded === true) {
        l = this.buttons[x].subbuttons.length;

        for (z = 0; z < l; z++) {
          if (this.buttons[x].subbuttons[z].name == currentTool) {
            this.buttons[x].selected = z;
            this.buttons[x].name = this.buttons[x].subbuttons[z].name;
            this.buttons[x].helptext = this.buttons[x].subbuttons[z].helptext;
          }

          target.addEntity(this.buttons[x].subbuttons[z].createButtonEntity(target, ox + (uiIconSize * z), oy + (uiIconSize * x) + sx));
        }
      }
    }
  }
}

function uiButton() {
  this.name = "";
  this.group = "";
  this.subbuttons = [];

  this.action = "";
  this.expanded = false;
  this.expandable = false;
  this.helptext = [];
  this.icon = "";
  this.pregap = false;
  this.selected = 0;
  this.state = false;
  this.tiptext = "";

  this.addButton = function(btn) {
    this.subbuttons.push(btn);
  }

  this.createButtonEntity = function(target, ox, oy) {
    if (ox === undefined) ox = 0;
    if (oy === undefined) oy = 0;

    nEnt = new entity();
    nEnt.id = this.name;
    nEnt.object = this;
    nEnt.shape = "image";

    nEnt.mouse = true;
    nEnt.mouseClick = true;
    nEnt.mouseHover = true;

    if (this.icon !== false) {
      nEnt.imagesrc = this.icon;
    } else {
      nEnt.imagesrc = this.subbuttons[this.selected].icon;
    }

    if (currentTool == this.name) {
      nEnt.imageClipX = uiIconSize;
      nEnt.imageClipY = 0;
    } else {
      nEnt.imageClipX = 0;
      nEnt.imageClipY = 0;
    }

    nEnt.tooltip = true;
    if (this.tiptext === false) {
      nEnt.tooltipText = this.subbuttons[this.selected].tiptext;
    } else {
      nEnt.tooltipText = this.tiptext;
    }

    nEnt.originX = ox;
    nEnt.originY = oy;
    nEnt.height = uiIconSize;
    nEnt.width = uiIconSize;

    if (currentTool == this.name) {
      this.createButtonHelp(target);
    }

    return nEnt;
  }

  this.createButtonHelp = function(target) {
    let x = 0;
    let y = this.helptext.length;

    for (x = 0; x < y; x++) {
      sEnt = new entity();
      sEnt.id = "help-" + x;
      sEnt.shape = "text";

      if (x == 0) {
        sEnt.textType = 0;
      } else {
        sEnt.textType = 1;
        sEnt.textString = "- ";
      }

      sEnt.textString += this.helptext[x];

      sEnt.originX = (uiOffsetX * 2) + uiIconSize;
      sEnt.originY = uiOffsetY + 10 + (15 * x);

      target.addEntity(sEnt);
    }
  }
}

// Image Loader
function imageLoader() {
  this.list = [
    // Toolbox
    ["iconNew", "iconNew.png"],
    ["iconOpen", "iconOpen.png"],
    ["iconSave", "iconSave.png"],
    ["iconSettings", "iconSettings.png"],

    ["iconBrush", "iconBrush.png"],
    ["iconColumnCopy", "iconColumnCopy.png"],
    ["iconColumnInsert", "iconColumnInsert.png"],
    ["iconColumnPaste", "iconColumnPaste.png"],
    ["iconColumnRemove", "iconColumnRemove.png"],
    ["iconCursor", "iconCursor.png"],
    ["iconFillColour", "iconFillColour.png"],
    ["iconFillColumn", "iconFillColumn.png"],
    ["iconFillRow", "iconFillRow.png"],
    ["iconFlip", "iconFlip.png"],
    ["iconKickstarter", "iconKickstarter.png"],
    ["iconReplace", "iconReplace.png"],
    ["iconRowCopy", "iconRowCopy.png"],
    ["iconRowInsert", "iconRowInsert.png"],
    ["iconRowPaste", "iconRowPaste.png"],
    ["iconRowRemove", "iconRowRemove.png"],
    ["iconShare", "iconShare.png"],

    // Camera
    ["iconZoomIn", "iconZoomIn.png"],
    ["iconZoomOut", "iconZoomOut.png"],
    ["iconCenter", "iconCenter.png"],
    ["iconExtents", "iconExtents.png"],
    ["iconReset", "iconReset.png"],
    ["iconPan", "iconPan.png"],
    ["iconHelp", "iconHelp.png"],
    ["iconCamera", "iconCamera.png"],

    // Overlay
    ["newShape", "buttonNew.png"],
    ["newImage", "buttonImage.png"],

    ["shapeSquare", "shapeSquare.png"],
    ["shapeDiamond", "shapeDiamond.png"],

    // Textures
    ["textureBrushed", "textureBrushed2.jpg"],

  ];

  this.loadedImages = [];
  this.totalLoaded = 0;

  /* Image Loading */
  this.loadImages = function() {
    let x = 0;
    let y = this.list.length;

    for (x = 0; x < y; x++) {
      this.loadImage(this.list[x][0], this.list[x][1]);
    }
  }

  this.loadImage = function(id, src) {
    let img = new Image();

    addEvent(img, "load", function() { imageAssets.loadComplete(); });

    img.id = id;
    img.src = imagePath + src;

    this.loadedImages.push(img);
  }

  this.loadComplete = function() {
    this.totalLoaded++;

    if (this.totalLoaded == this.list.length) {
      startDesigner();
    }
  }

  /* Image Retrieval */
  this.getImage = function(id) {
    let x = 0;
    let y = this.loadedImages.length;

    for (x = 0; x < y; x++) {
      if (this.loadedImages[x].id == id) {
        return this.loadedImages[x];
      }
    }

    console.log("Unable to load " + id);
    return false;
  }
}

// Layer
function entityLayer() {
  this.canvas;
  this.context;
  this.entities = [];
  this.id;

  this.lastDraw = 0;
  this.redrawQueueTimer = false;

  this.centerX = 0;
  this.centerY = 0;
  this.height = 0;
  this.offsetX = 0;
  this.offsetY = 0;
  this.reverse = false;
  this.width = 0;

  this.tooltip = false;
  this.tooltipFlip = false;
  this.tooltipText = "";
  this.tooltipX = 0;
  this.tooltipY = 0;

  this.expanded = false;

  /* Canvas Functions */
  this.setupCanvas = function() {
    this.canvas = document.getElementById(this.id);
    this.context = this.canvas.getContext("2d");

    this.canvas.style.height = "100%";
    this.canvas.style.width = "100%";

    this.context.imageSmoothingEnabled = false;
    this.context.font = fontStyles[1];

    this.scaleCanvas();
  }

  this.setupMemory = function() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext("2d");

    this.context.imageSmoothingEnabled = false;
    this.context.font = fontStyles[1];

    this.scaleCanvas(25, 25, false);

    //document.body.appendChild(this.canvas);
  }

  this.scaleCanvas = function(height, width, minimum) {
    if (height === undefined) height = window.innerHeight;
    if (width === undefined) width = window.innerWidth;
    if (minimum === undefined) minimum = true;

    if (minimum === true) {
      if (height < 600) {
        height = 600;
      }

      if (width < 800) {
        width = 800;
      }
    }

    this.height = height;
    this.width = width;

    this.canvas.style.height = height + "px";
    this.canvas.style.width = width + "px";

    this.canvas.height = this.height;
    this.canvas.width = this.width;

    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }

  /* Entity Functions */
  this.addEntity = function(ent) {
    this.entities.push(ent);
  }

  this.clearEntities = function() {
    this.entities = [];
  }

  this.removeEntity = function(id) {
    let x = 0;
    let y = this.entities.length;

    for (x = 0; x < y; x++) {
      if (this.entities[x].id == id) {
        this.entities.splice(x, 1);
      }
    }
  }

  /* Layer Functions */
  this.redrawCanvas = function() {
    if (this.lastDraw + updateInterval < Date.now()) {
      this.lastDraw = Date.now();

      let x = 0;
      let y = this.entities.length;
      let z = 1;

      // Set Write Direction
      if (this.reverse === true) {
        x = y - 1;
        y = 0;
        z = -1;
      }

      // Erase Canvas
      this.context.clearRect(0, 0, this.width, this.height);

      // Draw Entities
      for (; x != y; x += z) {
        switch (this.entities[x].shape) {
          case "background":
            drawBackgroundDots(this, editorPattern);
            break;

          case "canvas":
            let oh = this.entities[x].imagesrc.height / 2;
            let ow = this.entities[x].imagesrc.width / 2;

            this.context.drawImage(this.entities[x].imagesrc, Math.round((this.centerX - ow) + this.offsetX), Math.round((this.centerY - oh) + this.offsetY));
            return;
            break;

          case "image":
            drawImg(this.context, this.entities[x], this.offsetX, this.offsetY);
            break;

          case "palette":
            drawPalette(this.context, this.entities[x], this.offsetX, this.offsetY);
            break;

          case "rect":
            drawRect(this.context, this.entities[x], this.offsetX, this.offsetY);
            break;

          case "scale":
            //drawScale(this.context, this.entities[x], this.offsetX, this.offsetY);
            break;

          case "text":
            drawText(this.context, this.entities[x].originX, this.entities[x].originY, this.entities[x].textAlign, this.entities[x].textType, this.entities[x].textString);
            break;
        }
      }

      // Draw Tooltip
      if (this.tooltip === true) {
        drawTooltip(this.context, this.tooltipX, this.tooltipY, this.tooltipText, this.tooltipFlip);
      }
    } else {
      let that = this;

      if (this.redrawQueueTimer !== false) {
        clearInterval(this.redrawQueueTimer);
      }

      this.redrawQueueTimer = setTimeout(function() {
        that.redrawCanvas();
        redrawQueueTimer = false;
      }, updateInterval);
    }
  }

  // Pan Functions
  this.panCanvas = function(moveX, moveY) {
    this.offsetX += moveX;
    this.offsetY += moveY;

    this.redrawCanvas();
  }

  this.panReset = function() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.panCanvas(0, 0);
  }

  // Tooltip Functions
  this.setTooltip = function(x, y, tipText, flip) {
    this.tooltip = true;

    this.tooltipFlip = flip;
    this.tooltipText = tipText;

    this.tooltipX = x;
    this.tooltipY = y;
  }

  this.clearTooltip = function() {
    this.tooltip = false;

    this.tooltipFlip = false;
    this.tooltipText = "";

    this.tooltipX = 0;
    this.tooltipY = 0;
  }
}

// Overlay
function overlayInterface() {
  this.background;
  this.loading;
  this.pane;
  this.wrapper;

  this.screens = [];

  /* Configuration */
  this.setupOverlay = function() {
    this.background = document.getElementById("overlayBackground");
    this.loading = document.getElementById("overlayLoading");
    this.pane = document.getElementById("overlayWindow");
    this.wrapper = document.getElementById("overlayWrapper");
  }

  /* Screens */
  this.addScreen = function(screen) {
    this.screens.push(screen);
  }

  this.getScreen = function(id) {
    let x = 0;
    let y = this.screens.length;

    for (x = 0; x < y; x++) {
      if (this.screens[x].id == id) {
        return this.screens[x];
      }
    }
  }

  /* Toggles */
  this.showOverlay = function() {
    this.wrapper.className = "show";
  }

  this.hideOverlay = function() {
    this.wrapper.className = "";
    this.pane.innerHTML = "";
  }

  this.showLoading = function() {
    this.loading.className = "show";
  }

  this.hideLoading = function() {
    this.loading.className = "";
  }
}

function overlayScreen() {
  this.id = "";
  this.title = "";

  this.bar = new overlayPane();
  this.pane = new overlayPane();

  this.addObjectToBar = function(object) {
    this.bar.addObject(object);
  }

  this.addObjectToPane = function(object) {
    this.pane.addObject(object);
  }
}

function overlayPane() {
  this.objects = [];

  this.addObject = function(object) {
    this.objects.push(object);
  }
}

function overlayObject() {
  this.type = "";
  this.id = "";

  this.title = "";
  this.string = [];

  this.accepted = "";
  this.checked = false;
  this.data = [];
  this.enabled = true;
  this.focused = false;
  this.increment = 0;
  this.label = "";
  this.length = 0;
  this.maxValue = 999;
  this.minValue = 0;
  this.name = "";
  this.state = 0;
  this.target = "_blank";
  this.placeholder = false;
  this.playlist = "";
  this.url = "";
  this.value = "";

  this.src = false;
  this.alt = "";

  this.click = false;
  this.hover = false;
  this.change = false;
}

// Palette
function colourPalette(id) {
  this.id = id;
  this.colours = [];

  /* Change Colours */
  this.addColour = function(colour) {
    this.colours.push(colour);
  }

  /* Check textures */
  this.isShiny = function(colour) {
    if (this.colours[colour].shiny === true) {
      return true;
    }

    return false;
  }

  this.isBrushed = function(colour) {
    if (this.colours[colour].brushed === true) {
      return true;
    }

    return false;
  }

  /* Check RGBA Range Match */
  this.matchRGBA = function(r, g, b, a) {
    let x = 0;
    let y = this.colours.length;

    let distance = 0;
    let closest = [1, 255];

    for (x = 2; x < y; x++) {
      distance = Math.abs(r - this.colours[x].r) + Math.abs(g - this.colours[x].g) + Math.abs(b - this.colours[x].b) + Math.abs(a - this.colours[x].a);

      if (distance < closest[1]) {
        closest = [x, distance];
      }
    }

    return closest[0];
  }

  /* Manage Counts */
  this.addCount = function(target) {
    this.colours[target].count++;
  }

  this.colourInformation = function() {
    let info = [];

    let x = 0;
    let y = this.colours.length;

    for (x = 2; x < y; x++) {
      info.push([this.colours[x].name, this.colours[x].count]);
    }

    return info;
  }

  this.countColours = function(target) {
    let x = 0;
    let y = 0;

    let tH = target.height;
    let tW = target.width;

    this.clearCount();

    for (y = 0; y < tH; y++) {
      for (x = 0; x < tW; x++) {
        this.addCount(target.getColour(y, x));
      }
    }
  }

  this.clearCount = function(target) {
    if (target === undefined) target = false;

    if (target === false) {
      let x = 0;
      let y = this.colours.length;

      for (x = 0; x < y; x++) {
        this.colours[x].count = 0;
      }
    } else {
      this.colours[target].count = 0;
    }
  }

  this.highestCount = function() {
    let highest = [0, -1];

    let x = 0;
    let y = this.colours.length;

    for (x = 1; x < y; x++) {
      if (this.colours[x].count > highest[1]) {
        highest = [x, this.colours[x].count];
      }
    }

    return highest[0];
  }
}

function paletteColour() {
  this.id = "";
  this.name = "";
  this.count = 0;

  this.brushed = false;
  this.plastic = false;
  this.shiny = false;

  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.a = 0;
  this.hex = "";
}

// Pattern
function patternMatrix(id) {
  this.id = id;
  this.matrix = [];

  this.height = 0;
  this.width = 0;

  this.physicalHeight = 0;
  this.physicalWidth = 0;

  // Matrix Functions
  this.clearMatrix = function() {
    this.matrix = [];
    this.height = 0;
    this.width = 0;
  }

  this.copyMatrix = function(target) {
    this.matrix = target.matrix;
    this.getSize();
  }

  this.loadMatrix = function(matrix) {
    let x = 0;
    let s = 0;
    let y = matrix.length;
    let z = matrix[0].length;

    newPattern(this, z, y, false);

    for (x = 0; x < y; x++) {
      for (s = 0; s < z; s++) {
        this.colourScale(x, s, matrix[x][s].colour);
      }
    }
  }

  this.getSize = function() {
    // Store Matrix Size
    this.height = this.matrix.length;
    this.width = this.matrix[0].length;

    // Calculate Physical Size
    if (this.height > 0 && this.width > 0) {
      // Find corners
      let firstRow = this.findFirstColour("row", 1);
      let lastRow = this.findFirstColour("row", 0);

      let firstCol = this.findFirstColour("col", 1);
      let lastCol = this.findFirstColour("col", 0);

      // Determine Physical Size of Pattern
      if (firstRow[0] !== false && lastRow[0] !== false && firstCol[0] !== false && lastCol[0] !== false) {
        // Calculate Physical Size
        this.physicalHeight = lastRow[0] - firstRow[0];
        this.physicalWidth = lastCol[1] - firstCol[1];

        if (this.matrix[firstCol[0]][0].colour == 0 || this.matrix[((this.height - 1) - lastCol[0])][0].colour == 0) {
          this.physicalWidth -= 0.5;
        }

        if (firstRow[0] === false && lastRow[0] === false) {
          this.physicalHeight = 0;
        } else {
          this.physicalHeight += 1;
        }

        if (firstCol[1] === false && lastCol[1] === false) {
          this.physicalWidth = 0;
        } else {
          this.physicalWidth += 1;
        }
      }
    }
  }

  this.findFirstColour = function(mode, direction) {
    if (direction === undefined) direction = 1;

    let colX = 0;
    let colY = 0;

    let rowX = 0;
    let rowY = 0;
    let rowZ = 0;

    switch (mode) {
      case "col":
        rowY = this.height;

        if (direction == 1) {
          colX = 0;
          colY = this.width;

          for (; colX < colY; colX++) {
            if (this.matrix[0][0].colour == 0) {
              rowX = 0;
              rowZ = 1;
            } else {
              rowX = 1;
              rowZ = 0;
            }

            for (; rowX < rowY; rowX += 2) {
              if (this.matrix[rowX][colX].colour > 1) {
                return [rowX, colX];
              }
            }

            for (; rowZ < rowY; rowZ += 2) {
              if (this.matrix[rowZ][colX].colour > 1) {
                return [rowZ, colX];
              }
            }
          }

        } else {
          colX = this.width - 1;
          colY = 0;

          for (; colX > colY; colX--) {
            if (this.matrix[0][0].colour == 0) {
              rowX = this.height - 2;
              rowZ = this.height - 1;
            } else {
              rowX = this.height - 1;
              rowZ = this.height - 2;
            }

            for (; rowX > 0; rowX -= 2) {
              if (this.matrix[rowX][colX].colour > 1) {
                return [rowX, colX];
              }
            }

            for (; rowZ > 0; rowZ -= 2) {
              if (this.matrix[rowZ][colX].colour > 1) {
                return [rowZ, colX];
              }
            }
          }
        }

        break;

      case "row":
        colY = this.width;

        if (direction == 1) {
          rowX = 0;
          rowY = this.height;

          for (; rowX < rowY; rowX++) {
            for (colX = 0; colX < colY; colX++) {
              if (this.matrix[rowX][colX].colour > 1) {
                return [rowX, colX];
              }
            }
          }

        } else {
          rowX = this.height - 1;
          rowY = 0;

          for (; rowX > rowY; rowX--) {
            for (colX = this.width - 1; colX > 0; colX--) {
              if (this.matrix[rowX][colX].colour > 1) {
                return [rowX, colX];
              }
            }
          }
        }

        break;
    }

    return [false, false];
  }

  // Scale Functions
  this.addScale = function(row, column, colour) {
    if (colour === undefined) colour = activeColour;

    try {
      this.matrix[row].splice(column, 0, new scale(colour));
    } catch (err) {
      console.log("Add Scale - That matrix position doesn't exist!");
    }
  }

  this.colourScale = function(y, x, colour, expand) {
    if (expand === undefined) expand = false;

    // Auto Expand Pattern
    if (expand === true) {
      let height = this.height;
      let width = this.width;

      if (colour > 1) {
        if (y == 0) {
          this.addRow(0);
          this.width = width;
          this.fillRow(0, 1);
          this.getSize();

          y += 1;
        } else if (y == height - 1) {
          this.addRow(height);
          this.fillRow(height, 1);
          this.getSize();
        }

        if (x == 0) {
          this.addColumn(1, 0);

          x += 1;
        } else if (x == width - 1 && this.matrix[y][0].colour != 0) {
          this.addColumn(1, width);
        }
      }
    }

    // Set Colour
    this.matrix[y][x].setColour(colour);
    this.getSize();
    createInterface();
    uiLayer.redrawCanvas();
  }

  this.getColour = function(y, x) {
    return this.matrix[y][x].colour;
  }

  this.removeScale = function() {
    try {
      this.matrix[row].splice(column, 1);
    } catch (err) {
      console.log("Remove Scale - That matrix position doesn't exist!");
    }
  }

  // Row Functions
  this.addRow = function(position) {
    if (position === undefined) position = -1;

    this.matrix.splice(position, 0, []);
  }

  this.fillRow = function(row, colour) {
    let x = 0;
    let y = this.width;
    let inset = false;

    // Create Scales
    for (x = 0; x < y; x++) {
      this.matrix[row].push(new scale(colour));
    }

    // Inset Scale
    if (this.height > 0) {
      if (row == 0) {
        if (this.matrix[row + 1][0].colour != 0) {
          inset = true;
        }
      } else {
        if (this.matrix[row - 1][0].colour != 0) {
          inset = true;
        }
      }
    } else {
      inset = true;
    }

    if (inset === true) {
      this.matrix[row][0].colour = 0;
    }
  }

  this.removeRow = function(position) {
    try {
      this.matrix.splice(position, 1);
      this.getSize();
    } catch (err) {
      console.log("Remove Row - That matrix position doesn't exist!");
    }
  }

  // Column Functions
  this.addColumn = function(colour, position) {
    if (colour === undefined) colour = activeColour;
    if (position === undefined) position = -1;

    try {
      let x = 0;
      let y = this.matrix.length;

      for (x = 0; x < y; x++) {
        this.matrix[x].splice(position, 0, new scale(colour));

        if (position == 0 && this.matrix[x][1].colour == 0) {
          this.matrix[x][0].colour = 0;
          this.matrix[x][1].colour = 1;
        }
      }

      this.getSize();
    } catch (err) {
      console.log("Add Column - That matrix position doesn't exist!");
    }
  }

  this.removeColumn = function(position) {
    try {
      let y = this.matrix.length;

      for (x = 0; x < y; x++) {
        this.matrix[x].splice(position, 1);
      }

      this.getSize();
    } catch (err) {
      console.log("Remove Column - That matrix position doesn't exist!");
    }
  }
}

function scale(colour) {
  this.colour = colour;

  this.setColour = function(colour) {
    if (colour === undefined) colour = false;

    if (colour === false) {
      this.colour = activeColour;
    } else {
      this.colour = colour;
    }
  }
}

// Swatches
function templateSwatches() {
  this.gradientSwatches = [];
  this.textureSwatches = [];
  this.scaleSwatches = [];
  this.patternSwatch;

  this.shadowBlur = 3;
  this.shadowX = 0;
  this.shadowY = 3;
  this.shadowColour = "rgba(0, 0, 0, 0.25)";

  /* Swatch Functions */
  this.generateSwatches = function() {
    let x = 0;
    let y = 0;

    // Gradients
    y = 2;

    for (x = 0; x < y; x++) {
      this.gradientSwatches.push(this.generateSwatch("gradientSwatch-" + x));
    }

    // Textures
    y = 2;

    for (x = 0; x < y; x++) {
      this.textureSwatches.push(this.generateSwatch("textureSwatch-" + x));
    }

    // Scales
    y = palette.colours.length;

    for (x = 0; x < y; x++) {
      this.scaleSwatches.push(this.generateSwatch("scaleSwatch-" + x));
    }

    // Pattern
    this.patternSwatch = this.generateSwatch("patternSwatch-" + x);
  }

  this.generateSwatch = function(id) {
    if (id === undefined) id = "";

    let newSwatch = new swatch();

    newSwatch.canvas = document.createElement("canvas");
    newSwatch.context = newSwatch.canvas.getContext("2d");

    newSwatch.id = id;

    //document.body.appendChild(newSwatch.canvas);

    return newSwatch;
  }

  this.scaleSwatch = function(swt, height, width) {
    swt.height = height;
    swt.width = width;

    swt.canvas.height = height;
    swt.canvas.width = width;

    swt.canvas.style.height = height + "px";
    swt.canvas.style.width = width + "px";
  }

  this.regenerateSwatches = function() {
    this.generateGradientSwatches();
    this.generateTextureSwatches();
    this.generateScaleSwatches();
    this.generatePatternSwatch(editorPattern);
  }

  /* Pattern Functions */
  this.generatePatternSwatch = function(pattern) {
    // Resize Canvas
    let height = ((pattern.height - 1) * scaleSpacingY) + this.scaleSwatches[0].height;
    let width = (pattern.width * scaleSpacingX) + scaleWidthPx;

    this.scaleSwatch(this.patternSwatch, height, width);

    // Draw scales
    let patternHeight = pattern.height;
    let patternWidth = pattern.width;

    let sHalf = 0;

    let x = 0;
    let y = 0;

    let limit = 0;

    if (drawEmpty === false) {
      limit = 1;
    }

    for (y = patternHeight - 1; y >= 0; y--) {
      if (pattern.matrix[y][0].colour == 0) {
        // Odd
        sHalf = 0;
      } else {
        // Even
        sHalf = scaleSpacingXHalf;
      }

      // Add Scale Entity
      for (x = 0; x < patternWidth; x++) {
        if (pattern.matrix[y][x].colour > limit) {
          this.patternSwatch.context.drawImage(this.scaleSwatches[pattern.matrix[y][x].colour].canvas, Math.round(sHalf + (scaleSpacingX * x)), Math.round(scaleSpacingY * y));
        }
      }
    }
  }

  /* Scale Functions */
  this.generateScaleSwatches = function() {
    let x = 0;
    let y = palette.colours.length;

    for (x = 0; x < y; x++) {
      this.scaleSwatch(this.scaleSwatches[x], scaleHeightPx + this.shadowY + (this.shadowBlur / 2), scaleWidthPx + this.shadowX + (this.shadowBlur / 2));
      this.generateScaleSwatch(this.scaleSwatches[x], palette.colours[x].hex, palette.colours[x].a, palette.colours[x].brushed, palette.colours[x].shiny, palette.colours[x].plastic);
    }
  }

  this.generateScaleSwatch = function(swatch, hex, alpha, brushed, mirror, plastic) {
    if (brushed === undefined) brushed = false;
    if (mirror === undefined) mirror = false;
    if (plastic === undefined) plastic = false;

    let v = 0;
    let z = 0;

    if (alpha <= 60) {
      drawScalePath(swatch.context, 0, 0);
      swatch.context.fillStyle = hex;
      swatch.context.fill("evenodd");

    } else {
      // Flat Colour
      swatch.context.shadowBlur = this.shadowBlur;
      swatch.context.shadowColor = this.shadowColour;
      swatch.context.shadowOffsetX = this.shadowX;
      swatch.context.shadowOffsetY = this.shadowY;

      drawScalePath(swatch.context, 0, 0);
      swatch.context.fillStyle = hex;
      swatch.context.fill("evenodd");
      shapeShadowReset(swatch.context);

      swatch.context.shadowBlur = 0;
      swatch.context.shadowColor = this.shadowColour;
      swatch.context.shadowOffsetX = 0;
      swatch.context.shadowOffsetY = 0;

      // Brush Texture
      if (mirror === false && plastic === false) {
        if (brushed === true) {
          v = 1;
        }

        swatch.context.globalCompositeOperation = "overlay";

        if (swatch.context.globalCompositeOperation !== "overlay") {
          console.log("Browser doesn't support the overlay blend mode.");
        } else {
          drawScalePath(swatch.context, 0, 0);
          swatch.context.fillStyle = this.textureSwatches[v].pattern;
          swatch.context.fill("evenodd");
        }
      }

      // Sheen Gradient
      if (mirror === true) {
        z = 1;
      }

      swatch.context.globalCompositeOperation = "overlay";

      if (swatch.context.globalCompositeOperation !== "overlay") {
        console.log("Browser doesn't support the overlay blend mode.");
      } else {
        drawScalePath(swatch.context, 0, 0);
        swatch.context.fillStyle = this.gradientSwatches[z].gradient;
        swatch.context.fill("evenodd");
      }
    }
  }

  /* Texture Functions */
  this.generateTextureSwatches = function() {
    let x = 0;
    let y = 2;

    let tex = [0.1, 0.225];

    for (x = 0; x < y; x++) {
      this.scaleSwatch(this.textureSwatches[x], scaleHeightPx, scaleHeightPx);
      this.generateTextureSwatch(this.textureSwatches[x], tex[x]);
    }
  }

  this.generateTextureSwatch = function(swatch, alphaMod) {
    let pattern;

    swatch.context.globalAlpha = alphaMod;
    swatch.context.drawImage(imageAssets.getImage("textureBrushed"), 0, 0);

    pattern = swatch.context.createPattern(swatch.canvas, "no-repeat");
    swatch.pattern = pattern;
  }

  /* Gradient Functions */
  this.generateGradientSwatches = function() {
    let x = 0;
    let y = 2;

    let gra = [0, 30];

    for (x = 0; x < y; x++) {
      this.scaleSwatch(this.gradientSwatches[x], scaleHeightPx, scaleWidthPx);
      this.generateGradientSwatch(this.gradientSwatches[x], gra[x]);
    }
  }

  this.generateGradientSwatch = function(swatch, rgbaMod) {
    let gradient = swatch.context.createLinearGradient(0, 0, swatch.width, 0);

    gradient.addColorStop(0, "rgba(" + (85 - rgbaMod) + ", " + (85 - rgbaMod) + ", " + (85 - rgbaMod) + ", 1)");

    gradient.addColorStop(0.425, "rgba(" + (104 - rgbaMod) + ", " + (104 - rgbaMod) + ", " + (104 - rgbaMod) + ", 1)");
    gradient.addColorStop(0.475, "rgba(" + (119 - rgbaMod) + ", " + (119 - rgbaMod) + ", " + (119 - rgbaMod) + ", 1)");

    gradient.addColorStop(0.525, "rgba(" + (119 + rgbaMod) + ", " + (119 + rgbaMod) + ", " + (119 + rgbaMod) + ", 1)");
    gradient.addColorStop(0.575, "rgba(" + (134 + rgbaMod) + ", " + (134 + rgbaMod) + ", " + (134 + rgbaMod) + ", 1)");

    gradient.addColorStop(1, "rgba(" + (175 + rgbaMod) + ", " + (175 + rgbaMod) + ", " + (175 + rgbaMod) + ", 1)");

    swatch.gradient = gradient;
  }
}

function swatch() {
  this.canvas;
  this.context;

  this.colourRGBA = "";
  this.brushed = false;
  this.gradient;
  this.height = 0;
  this.name = "";
  this.palette = 0;
  this.pattern;
  this.shiny = false;
  this.type = "";
  this.width = 0;
}

// Themes
function themeSet() {
  this.themes = [];

  this.generateThemes = function() {
    let newTheme;

    // Dark
    newTheme = new themeStyle();

    newTheme.id = "dark";

    newTheme.fontColour = "#ffffff";

    newTheme.backgroundColour = "#171717";
    newTheme.dotColour = "#9c9c9c";
    newTheme.overlayColour = "#4e4e4e";

    newTheme.toggleColour = "#e8e8e8";
    newTheme.paletteColour = "#ffffff";

    newTheme.logoColour = "White";

    this.themes.push(newTheme);

    // Light
    newTheme = new themeStyle();

    newTheme.id = "light";

    newTheme.fontColour = "#000000";

    newTheme.backgroundColour = "#e8e8e8";
    newTheme.dotColour = "#636363";
    newTheme.overlayColour = "#b1b1b1";

    newTheme.toggleColour = "#171717";
    newTheme.paletteColour = "#000000";

    newTheme.logoColour = "Black";

    this.themes.push(newTheme);
  }
}

function themeStyle() {
  this.id = "";

  this.fontColour = "";

  this.backgroundColour = "";
  this.dotColour = "";
  this.overlayColour = "";

  this.toggleColour = "";
  this.paletteColour = "";

  this.logoColour = "";
}



// Gallery Functions ==================================================================================================
// General
function showError(target, message) {
  let input = document.getElementById(target);
  let error = document.getElementById(target + "Error");

  input.className = "error";

  error.innerHTML = message;
  error.className += " show";
}

function clearErrors(list) {
  let x = 0;
  let y = list.length;

  for (x = 0; x < y; x++) {
    document.getElementById(list[x]).className = "";
    document.getElementById(list[x] + "Error").className = "inputError";
  }
}

function disableUI(butn) {
  document.getElementById(butn).disabled = true;
  overlay.showLoading();
}

function enableUI(butn) {
  document.getElementById(butn).disabled = false;
  overlay.hideLoading();
}

// Save
function savePattern() {
  // Disable Interface / Waiting
  clearErrors(["oTitle", "oAuthor", "oPassword", "oPrivate"]);
  disableUI("oSave");

  // Variables
  // Gather Data
  let saveTitle = document.getElementById("oTitle").value;
  let saveAuthor = document.getElementById("oAuthor").value;
  let savePassword = document.getElementById("oPassword").value;
  let savePrivate = document.getElementById("oPrivate").checked;
  let savePattern = JSON.stringify(editorPattern);
  let saveScales = sCount;
  let saveImage;

  let savePost = "";

  // Memory Canvas
  let saveCanvas = saveLayer.canvas;
  let saveContext = saveLayer.context;

  // Error Log
  let error = false;
  let errorList = [];

  // Generic
  let x = 0;
  let y = 0;

  let de = drawEmpty;

  // Validate Data
  if (saveTitle == "" || saveTitle == null || saveTitle == undefined || saveTitle.length > 60 || checkRestricted(saveTitle) === true || checkCharacters(saveTitle)) {
    errorList.push(["oTitle", "Please enter a title for your pattern, that is less than 60 characters long, and only contains letters, numbers, spaces, underscores, and hyphens."]);
    error = true;
  }

  if (saveAuthor == "" || saveAuthor == null || saveAuthor == undefined || saveAuthor.length > 60 || checkRestricted(saveAuthor) === true || checkCharacters(saveAuthor)) {
    errorList.push(["oAuthor", "Please enter an author name, that is less than 60 characters long, and only contains letters, numbers, spaces, underscores, and hyphens."]);
    error = true;
  }

  if (savePassword == "" || savePassword == null || savePassword == undefined || savePassword.length > 60) {
    errorList.push(["oPassword", "Please enter a password, that is less than 60 characters long."]);
    error = true;
  }

  if (savePrivate !== true && savePrivate !== false) {
    errorList.push(["oTitle", "Please check or uncheck the 'Show in Gallery' box."]);
    error = true;
  }

  if (error === true) {
    y = errorList.length;

    for (x = 0; x < y; x++) {
      showError(errorList[x][0], errorList[x][1]);
    }

    enableUI("oSave");

    return false;
  }

  // Take canvas screenshot
  // Configure memory canvas
  saveContext.setTransform(1, 0, 0, 1, 0, 0);
  saveContext.fillStyle = themeLibrary.themes[theme].backgroundColour;
  saveContext.fillRect(0, 0, 250, 250);

  // Create Image
  let ch = swatches.patternSwatch.canvas.height;
  let cw = swatches.patternSwatch.canvas.width;
  let scale = calculateScale(250, 250, ch, cw);

  drawEmpty = false;
  swatches.regenerateSwatches();

  saveContext.scale(scale, scale);
  saveContext.drawImage(swatches.patternSwatch.canvas, (250 - (cw * scale)), (250 - (ch * scale)));

  saveImage = saveCanvas.toDataURL("image/jpeg", 1);

  // Restore Original Canvas
  drawEmpty = de;
  zoomExtents(editorPattern);

  // Construct save data
  savePost = 'title=' + saveTitle;
  savePost += '&author=' + saveAuthor;
  savePost += '&password=' + savePassword;
  savePost += '&private=' + savePrivate;
  savePost += '&pattern=' + savePattern;
  savePost += '&image=' + saveImage;
  savePost += '&scales=' + sCount;

  // Send data to server
  sendRequest("savePattern", savePost, saveResponse);
}

function saveResponse(response) {
  var response = JSON.parse(response);
  let message = "";

  let x = 0;
  let y = response.messages.length;

  // Output response
  if (response.code == "s") {
    setLoadData(response.id, response.title, response.author, response.privacy);
    setURL(loadedID, loadedTitle);

    overlay.hideOverlay();
  } else {
    for (x = 0; x < y; x++) {
      message += response.messages[x].input + ": " + response.messages[x].txt + "\n";
    }

    enableUI("oSave");
    window.alert(message);
  }
}

// Gallery
function loadGallery() {
  // Disable UI
  clearErrors(["loadTitle", "loadAuthor"]);
  disableUI("loadButton");

  // Variables
  // Gather search terms
  let searchTitle = document.getElementById("loadTitle").value;
  let searchAuthor = document.getElementById("loadAuthor").value;
  let searchMin = document.getElementById("loadMin").value;
  let searchMax = document.getElementById("loadMax").value;
  let sort = document.getElementsByName("sort");

  sort = checkRadio(sort);

  let loadPost = "";

  // Error Log
  let error = false;
  let errorList = [];

  // Generic
  let x = 0;
  let y = 0;

  // Validate terms
  if (searchTitle == "" || searchTitle == null || searchTitle == undefined) {
    searchTitle = "";
  } else {
    if (checkCharacters(searchTitle)) {
      errorList.push(["loadTitle", "Search terms may only contains letters, numbers, spaces, underscores, and hyphens."]);
      error = true;
    }
  }

  if (searchAuthor == "" || searchAuthor == null || searchAuthor == undefined) {
    searchAuthor = "";
  } else {
    if (checkCharacters(searchAuthor)) {
      errorList.push(["loadAuthor", "Search terms may only contains letters, numbers, spaces, underscores, and hyphens."]);
      error = true;
    }
  }

  if (error === true) {
    y = errorList.length;

    for (x = 0; x < y; x++) {
      showError(errorList[x][0], errorList[x][1]);
    }

    enableUI("loadButton");

    return false;
  }

  // Construct Query
  loadPost = 'title=' + searchTitle;
  loadPost += '&author=' + searchAuthor;
  loadPost += '&minS=' + searchMin;
  loadPost += '&maxS=' + searchMax;
  loadPost += '&sort=' + sort;

  // Send data to server
  sendRequest("loadGallery", loadPost, galleryResponse);
  searchPage = 0;
}

function galleryResponse(response, mode) {
  if (mode === undefined) mode = false;

  if (mode === false) {
    response = JSON.parse(response);
    searchResults = response;
  }

  let output = "";
  let offset = searchPage * pageLimit;
  let temp = "";

  let x = 0;
  let y = response.results.length;
  let z = 0;

  // Output response
  output += "<h2>" + response.heading + "</h2>";

  if (response.message != "") {
    output += "<p>" + response.message + "</p>";
  }

  for (x = 0; x < pageLimit; x++) {
    output += "<div class='areaBrick backgroundTheme cursorPointer' onclick='loadPattern(\"" + response.results[x + offset].id + "\");'>";
    output += "<img src='patterns/" + response.results[x + offset].src + ".jpg' />";
    output += "<p>" + response.results[x + offset].title + "</p>";
    output += "<p>" + response.results[x + offset].author + "</p>";
    output += "<p>" + response.results[x + offset].timestamp + ", " + response.results[x + offset].scales + " scales</p>";
    output += "</div>";

    if (x + offset >= y - 1) {
      x++;
      break;
    }
  }

  for (z = 0; z < 8; z++) {
    output += "<div class='areaBrick hidden'></div>";
  }

  // Page controls
  output += "<div class='inputWrapper center'>";
  // Back Button
  if (searchPage < 1) {
    temp = "disabled ";
  } else {
    temp = "";
  }

  output += "<input class='page' type='button' value='<<' onclick='galleryPage(0);' " + temp + "/>"

  // Page Counter
  output += "<p class='noflex'>" + (searchPage + 1) + " / " + (Math.ceil(y / pageLimit)) + "</p>";

  // Forward Button
  if (x + offset == y) {
    temp = "disabled ";
  } else {
    temp = "";
  }

  output += "<input class='page' type='button' value='>>' onclick='galleryPage(1);' " + temp + "/>"

  output += "</div>";

  // Output results
  document.getElementById("htmlArea").innerHTML = output;
  enableUI("loadButton");
}

function galleryPage(mode) {
  if (mode > 0) {
    if ((searchPage * pageLimit) < searchResults.results.length) {
      searchPage++;
    }
  } else {
    if (searchPage > 0) {
      searchPage--;
    }
  }

  galleryResponse(searchResults, true);
}


// Pattern Loading
function loadPattern(id) {
  // Variables
  log = "";
  id = parseInt(id);

  // Validate ID
  if (typeof(id) != "number") {
    return false;
  }

  // Construct Query
  log = "id=" + id;

  // Send pattern ID to server
  sendRequest("loadPattern", log, loadResponse);
}

function loadResponse(response) {
  response = JSON.parse(response);

  if (response.code == "s") {
    setLoadData(response.id, response.title, response.author, response.privacy, response.src);
    setURL(loadedID, loadedTitle);

    editorPattern.loadMatrix(response.pattern.matrix);
    zoomExtents(editorPattern);

    uiLayer.clearTooltip();
    createInterface();
    uiLayer.redrawCanvas();

    overlay.hideOverlay();
  }
}

function getLoadedData() {
  document.getElementById("oTitle").value = loadedTitle;
  document.getElementById("oAuthor").value = loadedAuthor;
  document.getElementById("oPrivate").checked = loadedPrivacy;
}

function setLoadData(id, title, author, privacy, src) {
  if (id === undefined) id = 0;
  if (title === undefined) title = "";
  if (author === undefined) author = "";
  if (privacy === undefined) privacy = true;
  if (src === undefined) src = "";

  loadedID = id;
  loadedTitle = title;
  loadedAuthor = author;
  loadedPrivacy = privacy;
  loadedSRC = src;
}

// Image to Pattern Functions =========================================================================================
// Objects
function imageMatrix() {
  this.rows = [];

  this.clearData = function() {
    this.rows = [];
  }

  this.addRow = function() {
    this.rows.push(new imageRow);
  }

  this.addPixel = function(row, r, g, b, a, p) {
    this.rows[row].addPixel(r, g, b, a, p);
  }

  this.sampleRegion = function(xOrigin, yOrigin, xWidth, yHeight) {
    let x = 0;
    let y = 0;

    xWidth += xOrigin;
    yHeight += yOrigin;

    palette.clearCount();

    for (y = yOrigin; y < yHeight; y++) {
      for (x = xOrigin; x < xWidth; x++) {
        palette.addCount(this.rows[y].pixels[x].p);
      }
    }
  }
}

function imageRow() {
  this.pixels = [];

  this.addPixel = function(r, g, b, a, p) {
    this.pixels.push(new imagePixel(r, g, b, a, p));
  }
}

function imagePixel(r = 0, g = 0, b = 0, a = 0, p = 0) {

  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
  this.p = p;
}

// Variables
let itpCanvas;
let itpContext;

let itpMemCanvas;
let itpMemContext;

let itpImage = false;
let imageWidth;
let imageHeight;
let itpImageData = new imageMatrix;

let itpStage = 0;
let itpProcessRow = 0;
let itpProcessData;

let itpSampleSpacingX = 0;
let itpSampleSpacingY = 0;
let sampleWidthArea = 0;
let sampleHeightArea = 0;

let itpPattern = new patternMatrix();
let itpPatternWidth = 0;
let itpPatternHeight = 0;

// Initialisation
function itpSetCanvas() {
  itpCanvas = document.getElementById("oCanvas");
  itpContext = itpCanvas.getContext("2d");

  itpCanvasResize();
  addEvent(window, "resize", itpCanvasResize);

  itpContext.font = "20px Montserrat";
}

function itpCanvasResize(event) {
  let w = itpCanvas.parentElement.clientWidth;
  let h = itpCanvas.parentElement.clientHeight;
  itpCanvas.height = h;
  itpCanvas.width = w;

  itpCanvas.style.height = "100%";
  itpCanvas.style.width = "100%";

  itpCanvasRedraw();
}

function itpCanvasRedraw() {
  itpContext.setTransform(1, 0, 0, 1, 0, 0);
  itpContext.clearRect(0, 0, itpCanvas.width, itpCanvas.height);

  switch (itpStage) {
    case 1:
      itpPreviewImage();
      break;

    case 2:
      itpPreviewImage();
      itpProgressImage(0, 0, imageWidth, itpProcessRow);
      break;

    case 3:
      itpPreviewImage();
      itpPreviewPattern();
  }
}

function itpDisableButtons() {
  document.getElementById("o-Prev").disabled = true;
  document.getElementById("o-Next").disabled = true;
}

function itpEnableButtons() {
  document.getElementById("o-Prev").disabled = false;
  document.getElementById("o-Next").disabled = false;
}

/* Processing */
function itpImageSelect(source) {
  itpStage = 1;
  itpImage = new Image();

  // Set Image on Canvas
  itpImage.onload = function() {
    itpCanvasRedraw();
    URL.revokeObjectURL(itpImage.src);
  }

  // Get Image from File
  itpImage.src = URL.createObjectURL(source);
}

function itpImageProcess() {
  if (itpImage === false) {
    alert("Please select an image to process first.");
    return false;
  }

  itpStage = 2;

  // Disable Interface & Change Cursor
  itpDisableButtons();
  overlay.showLoading();

  // Get Image Details
  imageWidth = itpImage.width;
  imageHeight = itpImage.height;

  // Configure Memory Canvas
  itpMemCanvas = document.createElement('canvas');
  itpMemContext = itpMemCanvas.getContext('2d');

  itpMemContext.imageSmoothingEnabled = false;

  itpMemCanvas.height = imageHeight;
  itpMemCanvas.width = imageWidth;

  itpMemCanvas.style.height = "100%";
  itpMemCanvas.style.width = "100%";

  // Insert Image for Processing
  itpMemContext.drawImage(itpImage, 0, 0);
  itpProcessData = itpMemContext.getImageData(0, 0, imageWidth, imageHeight);
  console.log('processData');
  console.log(itpProcessData);

  itpImageData.clearData();
  itpProcessRow = 0;
  itpGetPixelRow();
}

function itpGetPixelRow() {
  let x = 0;
  let z = 0;
  let y = itpProcessRow;
  let l = y * imageWidth * 4;

  let r;
  let g;
  let b;
  let a;
  let p;

  // Process Row
  itpImageData.addRow();

  for (z = 0; x < imageWidth; z += 4) {
    r = itpProcessData['data'][z + l];
    g = itpProcessData['data'][z + l + 1];
    b = itpProcessData['data'][z + l + 2];
    a = itpProcessData['data'][z + l + 3];
    p = palette.matchRGBA(r, g, b, a);

    itpImageData.addPixel(y, r, g, b, a, p);

    x++;
  }

  // Update Progress
  itpProgressImage(0, itpProcessRow, imageWidth, 1);

  // Check for End
  if ((itpProcessRow + 1) < imageHeight) {
    itpProcessRow++;
  } else {
    setOverlay("newImagePattern");
    return;
  }

  itpGetPixelRow();
}

function itpPreviewImage() {
  let scale = calculateScale(itpCanvas.height, itpCanvas.width, itpImage.height, itpImage.width);

  itpContext.scale(scale, scale);
  itpContext.drawImage(itpImage, 0, 0);
}

function itpProgressImage(x, y, xw, yh) {
  itpContext.fillStyle = "rgba(255, 255, 255, 0.5)";
  itpContext.fillRect(x, y, xw, yh);
}

function itpPreviewPattern() {
  // Get Pattern Width
  itpPatternWidth = document.getElementById("o-Width").value;

  let sampleWidth = imageWidth / itpPatternWidth;
  let sampleHeight = Math.round(sampleWidth * scaleRatioHigh);

  // Calculate Pattern Offset
  let sampleRadius = sampleWidth / 2;
  let sampleOffsetX = sampleRadius / 25;

  sampleSpacingX = sampleWidth;
  sampleSpacingY = (sampleHeight - (sampleHeight - (sampleRadius / 2) - sampleOffsetX)) * 2;

  sampleWidthArea = imageWidth - sampleSpacingX + 1;
  sampleHeightArea = imageHeight - sampleSpacingY;

  // Style Canvas
  itpContext.strokeStyle = "rgba(200, 200, 200, 1)";
  itpContext.lineWidth = 2;

  // Draw Sample Areas
  let x = 0;
  let y = 0;
  let z = 0;
  let s = 0;

  for (y = 0; y < sampleHeightArea; y += sampleSpacingY) {
    if (z % 2) {
      s = 0;
    } else {
      s = sampleSpacingX / 2;
    }

    for (x = 0; x < (sampleWidthArea - s); x += sampleSpacingX) {
      itpContext.strokeRect(x + s, y, sampleSpacingX, sampleSpacingY);
    }

    z++;
  }

  itpPatternHeight = z;
}

function itpGeneratePattern() {
  itpStage = 4;
  overlay.showLoading();

  // Variables
  let colour = 0;

  let x = 0;
  let y = 0;
  let z = 0;
  let s = 0;

  let scaleX = 0;
  let scaleY = 0;
  let scaleC = 0;

  // Disable Interface
  itpDisableButtons();

  // Create pattern using defined size
  newPattern(itpPattern, itpPatternWidth, itpPatternHeight, 0, 0);

  // Get dominant colour for each sample area
  for (y = 0; y < sampleHeightArea; y += sampleSpacingY) {
    // Even/Odd Row
    if (scaleY % 2) {
      s = 0;
    } else {
      s = sampleSpacingX / 2;
    }

    // Inset Scale
    if (scaleY % 2) {
      z = 0;
    } else {
      z = 1;
    }

    // Colour Pattern
    scaleX = 0;

    for (x = 0; x < (sampleWidthArea - s); x += sampleSpacingX) {
      itpImageData.sampleRegion(Math.floor(x + s), Math.floor(y), Math.floor(sampleSpacingX), Math.floor(sampleSpacingY));
      scaleC = palette.highestCount();
      itpPattern.colourScale(scaleY, scaleX + z, scaleC);

      scaleX++;
    }

    scaleY++;
  }

  // Apply Pattern
  itpSendToEditor();
}

function itpSendToEditor() {
  setLoadData();
  setURL();

  editorPattern.copyMatrix(itpPattern);
  zoomExtents(editorPattern);

  uiLayer.clearTooltip();
  createInterface();
  uiLayer.redrawCanvas();

  overlay.hideOverlay();
}

// Interaction Functions ==============================================================================================
// Window Resize
function scaleCanvases() {
  backgroundLayer.scaleCanvas();
  backgroundLayer.redrawCanvas();

  editorLayer.scaleCanvas();
  editorLayer.redrawCanvas();

  uiLayer.scaleCanvas();
  createInterface();
  uiLayer.redrawCanvas();
}

// Zooming Functions
function zoomCanvas(inOut) {
  if (inOut > 0) {
    // Zoom Out
    if (scaleRadius > 15) {
      scaleRadius -= 5;
    }
  } else {
    // Zoom In
    if (scaleRadius < 150) {
      scaleRadius += 5;
    }
  }

  updateScaleVariables(scaleRadius);
  swatches.regenerateSwatches();

  backgroundLayer.redrawCanvas();
  editorLayer.redrawCanvas();
}

function zoomCanvasMouse(event) {
  zoomCanvas(event.deltaY);
}

function zoomExtents(sourcePattern, targetCanvas) {
  if (targetCanvas === undefined) targetCanvas = false;

  let extWidth;
  let extHeight;
  let target;

  if (targetCanvas === false) {
    target = editorLayer.canvas;
  } else {
    target = targetCanvas;
  }

  extWidth = target.width / (sourcePattern.width * scaleSpacingX);
  extHeight = target.height / (((sourcePattern.height - 1) * scaleSpacingY) + (scaleHeightPx * 1.1));

  if (extWidth < extHeight) {
    scaleRadius *= extWidth;
  } else {
    scaleRadius *= extHeight;
  }

  if (targetCanvas === false) {
    backgroundLayer.panReset();
    editorLayer.panReset();

    zoomCanvas(1);
  } else {
    target.panReset();
  }
}

function zoomReset() {
  scaleRadius = 35;
  zoomCanvas(0);
}

// Mouse Functions ====================================================================================================
// Canvas Mouse Interactions
function mouseHandler(event) {
  let mouseX = event.pageX;
  let mouseY = event.pageY;

  let x = 0;
  let y = 0;

  let uiRedraw = false;
  let uiChange = false;

  if (panMouse === false && panKey === false) {
    // Check UI Elements
    y = uiLayer.entities.length;

    for (x = y - 1; x > -1; x--) {
      if (mouseInteraction(event, uiLayer.entities[x]) === true) {
        switch (event.type) {
          case "mousedown":
            mouseClickUI(uiLayer.entities[x].id);
            break;

          case "mousemove":
            //console.log(uiLayer.entities[x].id + " Resolved hover.");

            setCursor("Pointer");
            // Tooltip
            if (uiLayer.entities[x].tooltip === true && uiLayer.entities[x].tooltipText != uiLayer.tooltipText) {
              let flipTooltip = false;

              if (event.pageX > (uiLayer.width / 2)) {
                flipTooltip = true;
              }

              uiLayer.setTooltip(uiLayer.entities[x].originX + uiLayer.entities[x].width, uiLayer.entities[x].originY + (uiLayer.entities[x].height / 2), uiLayer.entities[x].tooltipText, flipTooltip);
              uiRedraw = true;
            }

            // Expanding
            if (uiLayer.expanded !== false) {
              if (uiLayer.expanded.group != uiLayer.entities[x].object.group) {
                if (uiLayer.entities[x].object.expandable === true) {
                  uiLayer.expanded.expanded = false;
                  uiLayer.expanded = uiLayer.entities[x].object;
                  uiLayer.entities[x].object.expanded = true;
                  uiChange = true;
                } else {
                  uiLayer.expanded.expanded = false;
                  uiLayer.expanded = false;
                  uiChange = true;
                }
              }
            } else {
              if (uiLayer.entities[x].object.expandable === true) {
                uiLayer.expanded = uiLayer.entities[x].object;
                uiLayer.entities[x].object.expanded = true;
                uiChange = true;
              }
            }

            break;
        }

        if (uiChange === true) {
          createInterface();
          uiRedraw = true;
        }

        if (uiRedraw === true) {
          uiLayer.redrawCanvas();
        }

        return true;
      }
    }

    if (uiLayer.expanded !== false) {
      uiLayer.expanded.expanded = false;
      uiLayer.expanded = false;
      createInterface();
    }

    if (uiLayer.tooltip !== false) {
      uiLayer.clearTooltip();
      uiLayer.redrawCanvas();
    }

    // Check Editor Elements
    if (currentTool != "cameraPan") {
      let patternHeight = editorPattern.height;
      let patternWidth = editorPattern.width;
      let patternX = Math.round((editorLayer.centerX - (editorLayer.entities[0].imagesrc.width / 2)) + editorLayer.offsetX);
      let patternY = Math.round((editorLayer.centerY - (editorLayer.entities[0].imagesrc.height / 2)) + editorLayer.offsetY);

      let scaleX = 0;
      let scaleY = 0;
      let sHalf = 0;

      let windowEdgeL = 0 - scaleWidthPx;
      let windowEdgeR = window.innerWidth + scaleWidthPx;
      let windowEdgeT = 0 - scaleHeightPx;
      let windowEdgeB = window.innerWidth + scaleHeightPx;

      for (y = 0; y < patternHeight; y++) {
        for (x = 0; x < patternWidth; x++) {
          if (editorPattern.matrix[y][x].colour > 0) {
            // Even-Odd Spacing
            if (editorPattern.matrix[y][0].colour == 0) {
              // Odd
              sHalf = 0;
            } else {
              // Even
              sHalf = scaleSpacingXHalf;
            }

            // Test
            scaleX = Math.round(sHalf + (scaleSpacingX * x));
            scaleY = Math.round(scaleSpacingY * y);

            //editorLayer.context.globalAlpha = 0.1;
            //editorLayer.context.fillRect(patternX + scaleX, patternY + scaleY, scaleWidthPx, scaleHeightPx);

            if (scaleX > windowEdgeL && scaleX < windowEdgeR &&
              scaleY > windowEdgeT && scaleY < windowEdgeB) {
              if (distanceFromScale(mouseX, mouseY, scaleX, scaleY, patternX, patternY) === true) {
                switch (event.type) {
                  case "mousedown":
                    //console.log(y, x + " Resolved click.");

                    mouseClickEditor(y, x);
                    break;

                  case "mousemove":
                    //console.log(y, x + " Resolved hover.");

                    mouseHoverEditor();
                    break;
                }

                return true;
              }
            }
          }
        }
      }
    }
  }

  // Mouse is on Background
  switch (event.type) {
    case "mousedown":
      setCursor("Grabbing");

      panCenterX = event.pageX;
      panCenterY = event.pageY;
      panMouse = true;

      break;

    case "mousemove":
      if (panMouse === true) {
        backgroundLayer.panCanvas(event.pageX - panCenterX, event.pageY - panCenterY);
        editorLayer.panCanvas(event.pageX - panCenterX, event.pageY - panCenterY);

        panCenterX = event.pageX;
        panCenterY = event.pageY;
      } else {
        setCursor("Grab");
      }

      break;

    case "mouseleave":
    case "mouseup":
      setCursor("Grab");
      panMouse = false;

      break;
  }

  return true;
}

function keyHandler(event) {
  switch (event.which) {
    case 32:
      if (event.type == "keydown") {
        if (panMouse === false) {
          setCursor("Grab");
        }

        panKey = true;
      } else {
        panKey = false;
      }
  }
}

function mouseInteraction(event, entity, offset) {
  if (offset === undefined) offset = false;

  let mouseX = event.pageX;
  let mouseY = event.pageY;

  let offsetX = 0;
  let offsetY = 0;

  if (entity.mouse !== true) {
    return false;
  }

  if (offset === true) {
    offsetX = panOffsetX;
    offsetY = panOffsetY;
  }

  switch (event.type) {
    case "click":
      if (entity.mouseClick !== true) {
        return false;
      }

      break;

    case "mousemove":
      if (entity.mouseHover !== true) {
        return false;
      }

      break;
  }

  switch (entity.shape) {
    case "image":
      if (mouseX + offsetX >= entity.originX &&
        mouseX + offsetX <= entity.originX + entity.width &&
        mouseY + offsetY >= entity.originY &&
        mouseY + offsetY <= entity.originY + entity.height
      ) {
        return true;
      }

      break;

    case "palette":
    case "rect":
      if (mouseX + offsetX >= entity.originX - entity.strokeWeight &&
        mouseX + offsetX <= entity.originX + entity.width + entity.strokeWeight &&
        mouseY + offsetY >= entity.originY - entity.strokeWeight &&
        mouseY + offsetY <= entity.originY + entity.height + entity.strokeWeight
      ) {
        return true;
      }

      break;
  }

  return false;
}

function mouseClickEditor(y, x) {
  switch (currentTool) {
    //case "toolboxBrush":

    case "toolboxCursor":
      editorPattern.colourScale(y, x, activeColour, true);
      swatches.generatePatternSwatch(editorPattern);
      editorLayer.redrawCanvas();
      backgroundLayer.redrawCanvas();
      break;

      //case "toolboxColumnInsert":
      //case "toolboxColumnRemove":
      //case "toolboxColumnCopy":
      //case "toolboxColumnPaste":
      //case "toolboxFillRow":
      //case "toolboxFillColumn":
      //case "toolboxFillColour":
      //case "toolboxReplace":
      //case "toolboxRowInsert":
      //case "toolboxRowRemove":
      //case "toolboxRowCopy":
      //case "toolboxRowPaste":

    default:
      backgroundLayer.redrawCanvas();
      console.log("Sorry, the " + currentTool + " hasn't been implemented yet.");
      break;
  }
}

function mouseHoverEditor() {
  switch (currentTool) {
    case "toolboxBrush":
      setCursor("Brush");
      break;

    case "toolboxColumnInsert":
    case "toolboxColumnRemove":
    case "toolboxColumnCopy":
    case "toolboxColumnPaste":
      setCursor("Column");
      break;

    case "toolboxFillRow":
    case "toolboxFillColumn":
    case "toolboxFillColour":
      setCursor("Fill");
      break;

    case "toolboxReplace":
      setCursor("Replace");
      break;

    case "toolboxRowInsert":
    case "toolboxRowRemove":
    case "toolboxRowCopy":
    case "toolboxRowPaste":
      setCursor("Row");
      break;

    default:
      setCursor("Pointer");
      break;
  }
}

function mouseClickUI(id) {
  let x = 0;
  let y = palette.colours.length;

  for (x = 1; x < y; x++) {
    if (id == palette.colours[x].id) {
      setActiveColour(x);
      return true;
    }
  }

  switch (id) {
    // Camera Controls
    case "cameraCenter":
      backgroundLayer.panReset();
      editorLayer.panReset();
      break;

    case "cameraExtents":
      zoomExtents(editorPattern);
      break;

    case "cameraFlip":
      console.log("This tool has not been implemented.");
      break;

    case "cameraReset":
      backgroundLayer.panReset();
      editorLayer.panReset();

      zoomReset();
      break;

    case "cameraPhoto":
      takePhoto();
      break;

    case "cameraZoomIn":
      zoomCanvas(0);
      break;

    case "cameraZoomOut":
      zoomCanvas(1);
      break;

      // Toolbox Controls
    case "toolboxHelp":
      setOverlay("help");
      overlay.showOverlay();
      break;

    case "toolboxNew":
      setOverlay('new');
      overlay.showOverlay();
      break;

    case "toolboxOpen":
      setOverlay("open");
      overlay.showOverlay();
      break;

    case "toolboxSave":
      setOverlay("save");
      overlay.showOverlay();
      break;

    case "toolboxSettings":
      setOverlay("settings");
      overlay.showOverlay();
      break;

    case "toolboxShare":
      setOverlay("share");
      overlay.showOverlay();
      break;

    case "cameraPan":
    case "toolboxBrush":
    case "toolboxCursor":
    case "toolboxColumnInsert":
    case "toolboxColumnRemove":
    case "toolboxColumnCopy":
    case "toolboxColumnPaste":
    case "toolboxFillRow":
    case "toolboxFillColumn":
    case "toolboxFillColour":
    case "toolboxReplace":
    case "toolboxRowInsert":
    case "toolboxRowRemove":
    case "toolboxRowCopy":
    case "toolboxRowPaste":
      currentTool = id;
      createInterface();
      uiLayer.redrawCanvas();
      break;

      // Default
    default:
      console.log("Unhandled ID: " + id);
      break;
  }
}

// Cursor Functions
function setCursor(cursor) {
  interactionLayer.className = "cursor" + cursor;
}

// Overlay Functions ==================================================================================================
function setOverlay(windowID) {
  let content = "";

  let wDow = overlay.getScreen(windowID);
  let bar = wDow.bar;
  let pane = wDow.pane;

  // Output Contents
  content = "<h1>" + wDow.title + "</h1>";

  content += makeOverlayPane(bar, false);
  content += makeOverlayPane(pane, true);

  // Closing
  content += "<div class='overlayFooter fontSizeSmall'>";
  content += "<p class='fontSizeSmall floatLeft'>Scalemail Designer created by Anthony Edmonds | Continued Development: Rachel Wisekal</p>";
  //	content += "<img src='images/logoLotRSmall" + themeLibrary.themes[theme].logoColour + ".png' alt='Lair of the Raven' class='floatRight' />";
  content += "</div>";

  // Apply
  overlayWindow.innerHTML = content;
  overlay.hideLoading();

  // Pane Actions
  switch (windowID) {
    case "newShape":
      patternShape = 0;
      break;

    case "newImageSelect":
      itpStage = 0;
      itpSetCanvas();
      break;

    case "newImagePattern":
      itpStage = 3;

      itpSetCanvas();
      itpCanvasRedraw();
      break;

    case "open":
      loadGallery();
      break;

    case "save":
      getLoadedData();
      break;

    case "settings":
      if (rulerSize == "large") {
        document.getElementById("toggleSize").checked = true;
      }

      if (drawEmpty === true) {
        document.getElementById("toggleEmpty").checked = true;
      }

      if (theme == 0) {
        document.getElementById("toggleTheme").checked = true;
      }

      if (rulerUnits == "metric") {
        document.getElementById("toggleUnits").checked = true;
      }

      break;

    case "swapPalette":
      break;
  }

  if (uiLayer.tooltip === true) {
    uiLayer.tooltip = false;
    uiLayer.redrawCanvas();
  }
}

function makeOverlayPane(pane, type = true) {
  let content = "";
  let objects = 0;
  let brick = false;

  let xClick = "";
  let xChange = "";
  let xHover = "";
  let tmp = "";

  c = "";
  let x = 0;
  let y = 0;
  let z = 0;
  let n = 0;

  // Open Pane
  if (type) {
    content = "<div class='overlayPane'>";
    content += "<div id='htmlArea'>";
    y = 1;
  } else {
    content = "<div class='overlayPane bar'>";
    y = 0;
  }

  // Create Objects
  objects = pane.objects.length;

  for (x = 0; x < objects; x++) {
    // Mouse Events
    if (pane.objects[x].click !== false) {
      xClick = 'onclick="' + pane.objects[x].click + '"';
    } else {
      xClick = "";
    }

    if (pane.objects[x].hover !== false) {
      xChange = 'onhover="' + pane.objects[x].hover + '"';
    } else {
      xChange = "";
    }

    if (pane.objects[x].change !== false) {
      xHover = 'onchange="' + pane.objects[x].change + '"';
    } else {
      xHover = "";
    }

    // Write HTML
    console.log('radioClicked');

    switch (pane.objects[x].type) {
      case "anchor":
        content += "<a href='" + pane.objects[x].url + "' target='" + pane.objects[x].target + "'>"
        if (pane.objects[x].src !== false) {
          content += "<div class='anchorImage'>";
          content += "<img src='" + imagePath + pane.objects[x].src + "' alt='" + pane.objects[x].string + "' />";
          content += "<p>" + pane.objects[x].string + "</p>";
          content += "</div>";

        } else {
          content += "<p>" + pane.objects[x].string + "</p>";

        }

        content += "</a>";
        break;

      case "brick":
        content += "<a href='" + pane.objects[x].url + "' target='" + pane.objects[x].target + "'>"
        content += "<div class='areaBrick backgroundTheme cursorPointer'>";
        content += "<img src='" + imagePath + pane.objects[x].src + "' alt='" + pane.objects[x].title + "' />";
        content += "<p>" + pane.objects[x].title + "</p>";
        content += "</div>";
        content += "</a>";

        brick = true;
        break;

      case "button":
        content += "<div class='overlayButton' " + xClick + xChange + xHover + ">";
        content += "<img src='" + imagePath + pane.objects[x].src + ".png' alt='" + pane.objects[x].alt + "' />";
        content += "<p>" + pane.objects[x].title + "</p>";
        content += "</div>";
        break;

      case "canvas":
        content += "<canvas id='" + pane.objects[x].id + "' class='overlayCanvas' " + xClick + xChange + xHover + "/>";
        break;

      case "dropdown":
        z = pane.objects[x].data.length;

        content += "<div class='inputDIV'>";
        content += "<label for='" + pane.objects[x].id + "'>" + pane.objects[x].label + "</label>";

        content += "<select id='" + pane.objects[x].id + "'" + xClick + xChange + xHover + ">";
        for (n = 0; n < z; n++) {
          if (n == activeColour) {
            tmp = " selected";
          } else {
            tmp = "";
          }

          content += "<option value='" + n + "'" + tmp + ">" + pane.objects[x].data[n].name + "</option>";
        }
        content += "</select>";
        content += "</div>";
        break;

        //case "htmlArea":
        //content += "<div id='htmlArea'></div>";
        //break;

      case "image":
        content += "<img src='" + imagePath + pane.objects[x].src + "' alt='" + pane.objects[x].alt + "' " + xClick + xChange + xHover + "/>";
        break;

      case "inputButton":
        if (pane.objects[x].enabled === false) {
          tmp = " disabled";
        } else {
          tmp = "";
        }

        content += "<input id='" + pane.objects[x].id + "'" + tmp + " type='button' value='" + pane.objects[x].value + "' " + xClick + xChange + xHover + "/>";
        break;

      case "inputCheckbox":
        if (pane.objects[x].checked === true) {
          n = "checked ";
        } else {
          n = "";
        }

        content += "<div class='inputDIV'>";
        content += "<label for='" + pane.objects[x].id + "'>" + pane.objects[x].label + "</label>";
        content += "<input id='" + pane.objects[x].id + "' type='checkbox' " + n + "name='" + pane.objects[x].name + "' value='" + pane.objects[x].value + "' " + xClick + xChange + xHover + "/>";
        content += "<div id='" + pane.objects[x].id + "Error' class='inputError'></div>";
        content += "</div>";
        break;

      case "inputFile":
        content += "<div class='inputDIV'>";
        content += "<label for='" + pane.objects[x].id + "'>" + pane.objects[x].label + "</label>";
        content += "<input id='" + pane.objects[x].id + "' type='file' accept='" + pane.objects[x].accepted + "' " + xClick + xChange + xHover + "/>";
        content += "</div>";
        break;

      case "inputRadio":
        if (pane.objects[x].src !== false) {
          tmp = "<img src='" + imagePath + pane.objects[x].src + "' alt='" + pane.objects[x].alt + "' />"
          c = "hidden";
        } else {
          tmp = pane.objects[x].label;
        }

        tmp = "<label for='" + pane.objects[x].id + "'>" + tmp + "</label>";

        if (pane.objects[x].checked === true) {
          n = "checked ";
        } else {
          n = "";
        }

        content += "<div class='inputDIV'>";
        if (pane.objects[x].src === false) {
          content += tmp;
        }

        content += "<input id='" + pane.objects[x].id + "' type='radio' " + n + "class='" + c + "' name='" + pane.objects[x].name + "' value='" + pane.objects[x].value + "' " + xClick + xChange + xHover + "/>";

        if (pane.objects[x].src !== false) {
          content += tmp;
        }

        content += "</div>";
        break;

      case "inputNumber":
        content += "<div class='inputDIV'>";
        content += "<label for='" + pane.objects[x].id + "'>" + pane.objects[x].label + "</label>";
        content += "<input id='" + pane.objects[x].id + "' type='number' min='" + pane.objects[x].minValue + "' max='" + pane.objects[x].maxValue + "' step='" + pane.objects[x].increment + "' placeholder='" + pane.objects[x].placeholder + "' value='" + pane.objects[x].value + "' " + xClick + xChange + xHover + "/>";
        content += "</div>";
        break;

      case "inputPassword":
        content += "<div class='inputDIV'>";
        content += "<label for='" + pane.objects[x].id + "'>" + pane.objects[x].label + "</label>";
        content += "<input id='" + pane.objects[x].id + "' type='password' length='" + pane.objects[x].length + "' name='" + pane.objects[x].name + "' placeholder='" + pane.objects[x].placeholder + "' value='" + pane.objects[x].value + "' " + xClick + xChange + xHover + "/>";
        content += "<div id='" + pane.objects[x].id + "Error' class='inputError'></div>";
        content += "</div>";
        break;

      case "inputText":
        content += "<div class='inputDIV'>";
        content += "<label for='" + pane.objects[x].id + "'>" + pane.objects[x].label + "</label>";
        content += "<input id='" + pane.objects[x].id + "' type='text' length='" + pane.objects[x].length + "' name='" + pane.objects[x].name + "' placeholder='" + pane.objects[x].placeholder + "' value='" + pane.objects[x].value + "' " + xClick + xChange + xHover + "/>";
        content += "<div id='" + pane.objects[x].id + "Error' class='inputError'></div>";
        content += "</div>";
        break;

      case "inputWrapper":
        if (pane.objects[x].state === 1) {
          content += "<div class='inputWrapper'>";
        } else {
          content += "</div>";
        }
        break;

      case "share":
        // URL
        content += "<input type='text' value='https://scaledesigner.com?id=" + loadedID + "' onclick='this.select();' />";

        // E-Mail
        content += '<a class="shareButton" href="mailto:?subject=Check%20out%20my%20scalemail%20inlay!&amp;body=http%3A%2F%2Fscaledesigner.com%3Fid%3D' + loadedID + '" target="_self" aria-label="Share by E-Mail">';
        content += '<div class="resp-sharing-button resp-sharing-button--email resp-sharing-button--large"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">';
        content += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z"/></svg></div>Share by E-Mail</div>';
        content += '</a>';

        // Facebook
        content += '<a class="shareButton" href="https://facebook.com/sharer/sharer.php?u=http%3A%2F%2Fscaledesigner.com%3Fid%3D' + loadedID + '" target="_blank" aria-label="Share on Facebook">';
        content += '<div class="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--large"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">';
        content += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>';
        content += '</div>Share on Facebook</div>';
        content += '</a>';

        // Pinterest
        content += '<a class="shareButton" href="https://pinterest.com/pin/create/button/?url=http%3A%2F%2Fscaledesigner.com%3Fid%3D' + loadedID + '&amp;media=http%3A%2F%2Fscaledesigner.com%2Fpatterns%2F' + loadedID + '.jpg;description=Check%20out%20my%20scalemail%20inlay!" target="_blank" aria-label="Share on Pinterest">';
        content += '<div class="resp-sharing-button resp-sharing-button--pinterest resp-sharing-button--large"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">';
        content += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.14.5C5.86.5 2.7 5 2.7 8.75c0 2.27.86 4.3 2.7 5.05.3.12.57 0 .66-.33l.27-1.06c.1-.32.06-.44-.2-.73-.52-.62-.86-1.44-.86-2.6 0-3.33 2.5-6.32 6.5-6.32 3.55 0 5.5 2.17 5.5 5.07 0 3.8-1.7 7.02-4.2 7.02-1.37 0-2.4-1.14-2.07-2.54.4-1.68 1.16-3.48 1.16-4.7 0-1.07-.58-1.98-1.78-1.98-1.4 0-2.55 1.47-2.55 3.42 0 1.25.43 2.1.43 2.1l-1.7 7.2c-.5 2.13-.08 4.75-.04 5 .02.17.22.2.3.1.14-.18 1.82-2.26 2.4-4.33.16-.58.93-3.63.93-3.63.45.88 1.8 1.65 3.22 1.65 4.25 0 7.13-3.87 7.13-9.05C20.5 4.15 17.18.5 12.14.5z"/></svg>';
        content += '</div>Share on Pinterest</div>';
        content += '</a>';

        // Reddit
        content += '<a class="shareButton" href="https://reddit.com/submit/?url=http%3A%2F%2Fscaledesigner.com%3Fid%3D' + loadedID + '" target="_blank" aria-label="Share on Reddit">';
        content += '<div class="resp-sharing-button resp-sharing-button--reddit resp-sharing-button--large"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">';
        content += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-6.07-1.72.08-1.1.4-3.05 1.52-3.7.72-.4 1.73-.24 3 .5C17.2 6.3 18.46 7.5 20 7.5c1.65 0 3-1.35 3-3s-1.35-3-3-3c-1.38 0-2.54.94-2.88 2.22-1.43-.72-2.64-.8-3.6-.25-1.64.94-1.95 3.47-2 4.55-2.33.08-4.45.7-6.1 1.72C4.86 8.98 3.96 8.5 3 8.5c-1.65 0-3 1.35-3 3 0 1.32.84 2.44 2.05 2.84-.03.22-.05.44-.05.66 0 3.86 4.5 7 10 7s10-3.14 10-7c0-.22-.02-.44-.05-.66 1.2-.4 2.05-1.54 2.05-2.84zM2.3 13.37C1.5 13.07 1 12.35 1 11.5c0-1.1.9-2 2-2 .64 0 1.22.32 1.6.82-1.1.85-1.92 1.9-2.3 3.05zm3.7.13c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9.8 4.8c-1.08.63-2.42.96-3.8.96-1.4 0-2.74-.34-3.8-.95-.24-.13-.32-.44-.2-.68.15-.24.46-.32.7-.18 1.83 1.06 4.76 1.06 6.6 0 .23-.13.53-.05.67.2.14.23.06.54-.18.67zm.2-2.8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5.7-2.13c-.38-1.16-1.2-2.2-2.3-3.05.38-.5.97-.82 1.6-.82 1.1 0 2 .9 2 2 0 .84-.53 1.57-1.3 1.87z"/></svg>';
        content += '</div>Share on Reddit</div>';
        content += '</a>';

        // Twitter
        content += '<a class="shareButton" href="https://twitter.com/intent/tweet/?text=Check%20out%20my%20scalemail%20inlay!&amp;url=http%3A%2F%2Fscaledesigner.com%3Fid%3D' + loadedID + '" target="_blank" aria-label="Share on Twitter">';
        content += '<div class="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--large"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">';
        content += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>';
        content += '</div>Share on Twitter</div>';
        content += '</a>';

        break;

      case "text":
        let l = pane.objects[x].string.length;

        if (pane.objects[x].title != "") {
          content += "<h2>" + pane.objects[x].title + "</h2>";
        }

        for (let c = 0; c < l; c++) {
          content += "<p>" + pane.objects[x].string[c] + "</p>";
        }

        break;

      case "toggle":
        content += "<h2>" + pane.objects[x].title + "</h2>";
        content += "<p class='toggleText left'>" + pane.objects[x].string[0] + "</p>";

        content += "<label class='toggle'>";
        content += "<input id='" + pane.objects[x].id + "' type='checkbox' onchange='" + pane.objects[x].change + "'>";
        content += "<div class='slider'></div>";
        content += "</label>";

        content += "<p class='toggleText right'>" + pane.objects[x].string[1] + "</p>";
        break;

      default:
        console.log("Unhandled object: " + pane.objects[x].type);
        break;
    }
  }

  if (brick === true) {
    for (z = 0; z < 8; z++) {
      content += "<div class='areaBrick hidden'></div>";
    }
  }

  if (type === true) {
    content += "</div>";
  }

  content += "</div>";

  return content;
}

function buildOverlays() {
  // Variables
  let nWindow;
  let nObject;

  // Create New
  nWindow = new overlayScreen();
  nWindow.id = "new";
  nWindow.title = "Create New Pattern";

  // Bar
  // New from Shape
  nObject = new overlayObject();

  nObject.type = "button";
  nObject.title = "New from Shape...";
  nObject.src = "buttonNew";
  nObject.click = "setOverlay('newShape');";

  nWindow.addObjectToBar(nObject);

  // New from Image
  nObject = new overlayObject();

  nObject.type = "button";
  nObject.title = "New from Image...";
  nObject.src = "buttonImage";
  nObject.click = "setOverlay('newImageSelect');";

  nWindow.addObjectToBar(nObject);

  // Pane
  // Information
  nObject = new overlayObject();

  nObject.type = "text";
  nObject.title = "Scalemaille Designer";
  nObject.string[0] = "Start a new inlay design based on either a default shape, or using a simple image.";
  nObject.string[1] = "You will be able to configure your new design on the next page.";

  nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);

  // New from Shape
  nWindow = new overlayScreen();
  nWindow.id = "newShape";
  nWindow.title = "New from Shape";

  // Bar
  // Select Shape
  // Title
  nObject = new overlayObject();

  nObject.type = "text";
  nObject.title = "Select Shape";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Radio Button (Square)
  nObject = new overlayObject();

  nObject.type = "inputRadio";
  nObject.id = "shapeSquare";

  nObject.checked = true;
  nObject.label = "Square";
  nObject.name = "shape";
  nObject.value = 0;

  nObject.src = "shapeSquare.png";
  nObject.alt = "Square";

  nWindow.addObjectToBar(nObject);

  // Radio Button (Diamond)
  nObject = new overlayObject();

  nObject.type = "inputRadio";
  nObject.id = "shapeDiamond";

  nObject.label = "Diamond";
  nObject.name = "shape";
  nObject.value = 1;

  nObject.src = "shapeDiamond.png";
  nObject.alt = "Diamond";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Pattern Settings
  // Title
  nObject = new overlayObject();

  nObject.type = "text";
  nObject.title = "Pattern Settings";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Width
  nObject = new overlayObject();

  nObject.type = "inputNumber";
  nObject.id = "o-Width";

  nObject.increment = 1;
  nObject.label = "Width";
  nObject.value = 5;

  nWindow.addObjectToBar(nObject);

  // Height
  nObject = new overlayObject();

  nObject.type = "inputNumber";
  nObject.id = "o-Height";

  nObject.increment = 1;
  nObject.label = "Height";
  nObject.value = 9;

  nWindow.addObjectToBar(nObject);

  // Colours
  nObject = new overlayObject();

  nObject.type = "dropdown";
  nObject.id = "o-Colour";

  nObject.change = "setActiveColour(this.value);";
  nObject.data = palette.colours;
  nObject.label = "Colour";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Previous Button
  nObject = new overlayObject();

  nObject.type = "inputButton";
  nObject.id = "o-Prev";

  nObject.label = "Previous";
  nObject.value = "Previous";

  nObject.click = "setOverlay('new');";

  nWindow.addObjectToBar(nObject);

  // Create Button
  nObject = new overlayObject();

  nObject.type = "inputButton";

  nObject.label = "Create Pattern";
  nObject.value = "Create Pattern";

  nObject.click = "newFromShape();"

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Pane
  // Information
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "How to Use";
  nObject.string = ["Use these options to generate a new scalemail pattern from a basic shape.", "Select the desired shape from the options provided, then set the height, width, and colour as desired.", "Note that some shapes, such as the diamond, require a fixed height/width ratio that will be calculated automatically."];

  nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);

  // New from Image
  // Selection
  nWindow = new overlayScreen();
  nWindow.id = "newImageSelect";
  nWindow.title = "New from Image"

  // Bar
  // Title
  nObject = new overlayObject();

  nObject.type = "text";
  nObject.title = "Select Image";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // File Select
  nObject = new overlayObject();

  nObject.type = "inputFile";
  nObject.id = "o-File";

  nObject.accepted = "image/*";

  nObject.change = "itpImageSelect(this.files[0]);";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Information
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "How to Use";
  nObject.string[0] = "The image should be a simple motif or design.";
  nObject.string[1] = "Your image will be processed on your computer and will not be uploaded.";
  nObject.string[2] = "You will be able to configure your pattern after processing.";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Previous Button
  nObject = new overlayObject();

  nObject.type = "inputButton";
  nObject.id = "o-Prev";

  nObject.label = "Previous";
  nObject.value = "Previous";

  nObject.click = "setOverlay('new');";

  nWindow.addObjectToBar(nObject);

  // Next Button
  nObject = new overlayObject();

  nObject.type = "inputButton";
  nObject.id = "o-Next";

  nObject.label = "Process";
  nObject.value = "Process";

  nObject.click = "itpImageProcess();";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Pane
  // Canvas
  nObject = new overlayObject();

  nObject.type = "canvas";
  nObject.id = "oCanvas";

  nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);

  // Pattern
  nWindow = new overlayScreen();
  nWindow.id = "newImagePattern";
  nWindow.title = "Configure Pattern";

  // Bar
  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Pattern Width
  nObject = new overlayObject();

  nObject.type = "inputNumber";
  nObject.id = "o-Width";

  nObject.label = "Width";
  nObject.value = 10;

  nObject.change = "itpCanvasRedraw();"

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Title
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "How to Use";
  nObject.string[0] = "Change the width of the pattern to increase scale density.";
  nObject.string[1] = "Focus on the motif/design of your image. Perform minor adjustments using the editor.";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Previous Button
  nObject = new overlayObject();

  nObject.type = "inputButton";
  nObject.id = "o-Prev";

  nObject.label = "Previous";
  nObject.value = "Previous";

  nObject.click = "setOverlay('newImageSelect');";

  nWindow.addObjectToBar(nObject);

  // Next Button
  nObject = new overlayObject();

  nObject.type = "inputButton";
  nObject.id = "o-Next";

  nObject.label = "Build";
  nObject.value = "Build";

  nObject.click = "itpGeneratePattern();";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Pane
  // Canvas
  nObject = new overlayObject();

  nObject.type = "canvas";
  nObject.id = "oCanvas";

  nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);

  // Swap Colours
  nWindow = new overlayScreen();
  nWindow.id = "swapPalette";
  nWindow.title = "Swap Colours";

  // Bar

  // Pane
  // Canvas
  nObject = new overlayObject();

  nObject.type = "canvas";
  nObject.id = "oCanvas";

  nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);

  // Open
  nWindow = new overlayScreen();
  nWindow.id = "open";
  nWindow.title = "Browse Gallery";

  // Bar
  // Heading
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.string[0] = "Enter some search terms to explore the pattern gallery. If you are looking for a pattern that has been set to private, you need to enter the exact title.";
  nObject.string[1] = "Looking for Scalemail Banner Templates? Search for the title 'Template' or the author 'Lair of the Raven'.";

  nWindow.addObjectToBar(nObject);

  // Title
  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Title
  nObject = new overlayObject();

  nObject.type = "inputText";
  nObject.id = "loadTitle";

  nObject.label = "Title";
  nObject.placeholder = "Search by title";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Author
  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Author
  nObject = new overlayObject();

  nObject.type = "inputText";
  nObject.id = "loadAuthor";

  nObject.label = "Author";
  nObject.placeholder = "Search by author";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Scales
  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Minimum
  nObject = new overlayObject();

  nObject.type = "inputNumber";
  nObject.id = "loadMin";

  nObject.label = "Min. Scales";
  nObject.value = 0;

  nWindow.addObjectToBar(nObject);

  // Maximum
  nObject = new overlayObject();

  nObject.type = "inputNumber";
  nObject.id = "loadMax";

  nObject.label = "Max. Scales";
  nObject.maxValue = 9999;
  nObject.value = 9999;

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Order
  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Title A - Z
  nObject = new overlayObject();

  nObject.type = "inputRadio";
  nObject.id = "loadTitleAZ";

  nObject.label = "Title A-Z";
  nObject.name = "sort";
  nObject.value = "taz";

  nWindow.addObjectToBar(nObject);

  // Title Z - A
  nObject = new overlayObject();

  nObject.type = "inputRadio";
  nObject.id = "loadTitleZA";

  nObject.label = "Title Z-A";
  nObject.name = "sort";
  nObject.value = "tza";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Author A - Z
  nObject = new overlayObject();

  nObject.type = "inputRadio";
  nObject.id = "loadAuthorAZ";

  nObject.label = "Author A-Z";
  nObject.name = "sort";
  nObject.value = "aaz";

  nWindow.addObjectToBar(nObject);

  // Author Z - A
  nObject = new overlayObject();

  nObject.type = "inputRadio";
  nObject.id = "loadAuthorZA";

  nObject.label = "Author Z-A";
  nObject.name = "sort";
  nObject.value = "aza";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Scales 0 - 9
  nObject = new overlayObject();

  nObject.type = "inputRadio";
  nObject.id = "loadScales09";

  nObject.label = "Smallest";
  nObject.name = "sort";
  nObject.value = "saz";

  nWindow.addObjectToBar(nObject);

  // Scales 9 - 0
  nObject = new overlayObject();

  nObject.type = "inputRadio";
  nObject.id = "loadAuthorZA";

  nObject.label = "Largest";
  nObject.name = "sort";
  nObject.value = "sza";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Date New - Old
  nObject = new overlayObject();

  nObject.type = "inputRadio";
  nObject.id = "loadDateAZ";

  nObject.checked = true;
  nObject.label = "Newest";
  nObject.name = "sort";
  nObject.value = "dno";

  nWindow.addObjectToBar(nObject);

  // Date Old - New
  nObject = new overlayObject();

  nObject.type = "inputRadio";
  nObject.id = "loadDateZA";

  nObject.label = "Oldest";
  nObject.name = "sort";
  nObject.value = "don";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Search
  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Submit
  nObject = new overlayObject();

  nObject.type = "inputButton";
  nObject.id = "loadButton";

  nObject.label = "Search";
  nObject.value = "Search";

  nObject.click = "loadGallery();";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Pane
  // HTML Area
  //nObject = new overlayObject();

  //nObject.type = "htmlArea";
  //nObject.id = "galleryArea";

  //nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);

  // Save
  nWindow = new overlayScreen();
  nWindow.id = "save";
  nWindow.title = "Save Pattern";

  // Bar
  // Title
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Details";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Title Input
  nObject = new overlayObject();

  nObject.type = "inputText";
  nObject.id = "oTitle";

  nObject.label = "Title";
  nObject.placeholder = "Name your pattern";
  nObject.value = "";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Author Input
  nObject = new overlayObject();

  nObject.type = "inputText";
  nObject.id = "oAuthor";

  nObject.label = "Author";
  nObject.placeholder = "Use a pen name";
  nObject.value = "";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Password Input
  nObject = new overlayObject();

  nObject.type = "inputPassword";
  nObject.id = "oPassword";

  nObject.label = "Editing Password";
  nObject.placeholder = "To keep your Pattern safe";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Title Input
  nObject = new overlayObject();

  nObject.type = "inputCheckbox";
  nObject.id = "oPrivate";

  nObject.label = "Show in Gallery";
  nObject.checked = true;

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Wrapper (Open)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";
  nObject.state = 1;

  nWindow.addObjectToBar(nObject);

  // Title Input
  nObject = new overlayObject();

  nObject.type = "inputButton";
  nObject.id = "oSave";

  nObject.focused = true;
  nObject.label = "Save";
  nObject.value = "Save";

  nObject.click = "savePattern();"

  nWindow.addObjectToBar(nObject);

  // Wrapper (Close)
  nObject = new overlayObject();

  nObject.type = "inputWrapper";

  nWindow.addObjectToBar(nObject);

  // Pane
  // Title Information
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Title";
  nObject.string[0] = "Give your pattern a meaningful name that will allow you to find it later.";

  nWindow.addObjectToPane(nObject);

  // Author Information
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Author";
  nObject.string[0] = "Take credit for your creation! Pen names are unique, so use it for all of your patterns.";

  nWindow.addObjectToPane(nObject);

  // Password Information
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Password";
  nObject.string[0] = "Saving a new pattern? Create a memorable password to protect the design.";
  nObject.string[1] = "Updating an existing pattern? Enter your editing password.";
  nObject.string[2] = "If you forget your password, you'll need to contact us to get it reset.";

  nWindow.addObjectToPane(nObject);

  // Gallery Information
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Gallery";
  nObject.string[0] = "Let the world see your design in the gallery, or keep it all to yourself.";
  nObject.string[1] = "Anyone with the exact title of your design will be able to find it using search.";

  nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);

  // Settings
  nWindow = new overlayScreen();
  nWindow.id = "settings";
  nWindow.title = "Settings";

  // Bar
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.string[0] = "Use these toggles to configure the inlay designer.";
  nObject.string[1] = "Settings are not saved or preserved. Any changes from default will need to be set every time you start the designer.";

  nWindow.addObjectToBar(nObject);

  // Pane
  // Scale Size
  nObject = new overlayObject();
  nObject.id = "toggleSize";
  nObject.type = "toggle";

  nObject.title = "Scale Size";
  nObject.string[0] = "Small";
  nObject.string[1] = "Large";

  nObject.change = "toggleSize();";

  nWindow.addObjectToPane(nObject);

  // Show Empty Scales
  nObject = new overlayObject();
  nObject.id = "toggleEmpty";
  nObject.type = "toggle";

  nObject.title = "Empty Scales";
  nObject.string[0] = "Hide";
  nObject.string[1] = "Show";

  nObject.change = "toggleEmpty();";

  nWindow.addObjectToPane(nObject);

  // Theme
  nObject = new overlayObject();
  nObject.id = "toggleTheme";
  nObject.type = "toggle";

  nObject.title = "Theme";
  nObject.string[0] = "Light";
  nObject.string[1] = "Dark";

  nObject.change = "toggleTheme();";

  nWindow.addObjectToPane(nObject);

  // Units
  nObject = new overlayObject();
  nObject.id = "toggleUnits";
  nObject.type = "toggle";

  nObject.title = "Measurement Units";
  nObject.string[0] = "Imperial";
  nObject.string[1] = "Metric";

  nObject.change = "toggleUnits();";

  nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);

  // Bar

  // Pane

  overlay.addScreen(nWindow);

  // Share
  nWindow = new overlayScreen();
  nWindow.id = "share";
  nWindow.title = "Share Pattern";

  // Bar
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Share to Social Media";
  nObject.string[0] = "Want to show your pattern to the world? Use your pattern URL from the address bar, or use any of these useful buttons!";
  nObject.string[1] = "If you don't see your pattern URL, you need to save your pattern before you can share it.";

  nWindow.addObjectToBar(nObject);

  // Pane
  // URL
  nObject = new overlayObject();

  nObject.type = "share";

  nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);

  // Help & About
  nWindow = new overlayScreen();
  nWindow.id = "help";
  nWindow.title = "Help & About";

  // Bar
  // About
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "About";
  nObject.string[0] = "Use this tool to create scalemaille inlays and patterns, share your designs with the world, and browse the community submissions.";
  nObject.string[1] = "This tool may be used for any purpose.";

  nWindow.addObjectToBar(nObject);

  // Legal
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Legal";
  nObject.string[0] = "Colours, sizes, weights, dimensions, and shapes are all estimates or visual representations and may not accurately reflect the actual physical properties or dimensions of that which they represent.";
  nObject.string[1] = "All patterns stored on our server are held anonymously. Your IP address and other computer identifying information is not stored.";
  nObject.string[2] = "All patterns created using this tool belong to the author. Scalemaille Designer infers no copyright or other claim on user submitted patterns.";
  nObject.string[3] = "If you believe a pattern is in violation of your rights, please contact Scalemaille Designer for removal.";
  nObject.string[4] = "Continued Development by Rachel Wisekal under Creative Commons license CC-BY-NC 4.0";

  nWindow.addObjectToBar(nObject);

  // Links
  // Title
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Links";

  nWindow.addObjectToBar(nObject);

  // Creative Commons 
  nObject = new overlayObject();

  nObject.type = "anchor";

  nObject.string = "CC-BY-NC 4.0";
  nObject.url = "https://creativecommons.org/licenses/by-nc/4.0/";

  nWindow.addObjectToBar(nObject);

  // Lair of the Raven
  nObject = new overlayObject();

  nObject.type = "anchor";

  nObject.string = "Lair of the Raven";
  nObject.url = "http://lairoftheraven.uk";

  nWindow.addObjectToBar(nObject);

  // Kiwimaille Creations
  nObject = new overlayObject();

  nObject.type = "anchor";

  nObject.string = "Kiwimaille Creations";
  nObject.url = "http://kiwimaille.com";

  nWindow.addObjectToBar(nObject);

  // Contact
  // Title
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Contact";

  nWindow.addObjectToBar(nObject);

  // E-Mail
  nObject = new overlayObject();

  nObject.type = "anchor";

  nObject.string = "E-Mail";
  nObject.url = "mailto:scalemailledesigner@gmail.com";

  nWindow.addObjectToBar(nObject);

  // Facebook
  nObject = new overlayObject();

  nObject.type = "anchor";

  nObject.string = "Facebook";
  nObject.url = "https://www.facebook.com/groups/scaledesigner/";

  nWindow.addObjectToBar(nObject);

  // Reddit
  //	nObject = new overlayObject();

  //	nObject.type = "anchor";

  //	nObject.string = "Reddit";
  //	nObject.url = "https://www.reddit.com/r/lairoftheraven/";

  //	nWindow.addObjectToBar(nObject);

  // Twitter
  nObject = new overlayObject();

  nObject.type = "anchor";

  nObject.string = "@kiwimaille";
  nObject.url = "https://twitter.com/kiwimaille";

  nWindow.addObjectToBar(nObject);

  // Pane
  // Tutorial Video
  // Title
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Tutorial Playlist";
  nObject.string[0] = "Need help using the inlay designer? Check out our video tutorial series on YouTube for a detailed breakdown!";

  nWindow.addObjectToPane(nObject);

  // Introduction Video
  nObject = new overlayObject();

  nObject.type = "brick";

  nObject.title = "Introduction";
  nObject.url = "https://www.youtube.com/watch?v=wyye0o6paNE&list=PLu9KjnY1dxRbLRRMHNmAhpH1hNYDMyQ2z&index=1&t=3s";

  nObject.src = "tutorialIntroThumb.jpg";

  nWindow.addObjectToPane(nObject);

  // Interface Video
  nObject = new overlayObject();

  nObject.type = "brick";

  nObject.title = "User Interface Overview";
  nObject.url = "https://www.youtube.com/watch?v=7EZebcOiM9Q&list=PLu9KjnY1dxRbLRRMHNmAhpH1hNYDMyQ2z&index=2";

  nObject.src = "tutorialIntroThumb.jpg";

  nWindow.addObjectToPane(nObject);

  // Creating Video
  nObject = new overlayObject();

  nObject.type = "brick";

  nObject.title = "Creating a New Pattern";
  nObject.url = "https://www.youtube.com/watch?v=gTldguZj_yE&list=PLu9KjnY1dxRbLRRMHNmAhpH1hNYDMyQ2z&index=3";

  nObject.src = "tutorialCreateThumb.jpg";

  nWindow.addObjectToPane(nObject);

  // Gallery Video
  nObject = new overlayObject();

  nObject.type = "brick";

  nObject.title = "Saving, Loading, and Sharing";
  nObject.url = "https://www.youtube.com/watch?v=-raNeXvR2Fc&list=PLu9KjnY1dxRbLRRMHNmAhpH1hNYDMyQ2z&index=4";

  nObject.src = "tutorialGalleryThumb.jpg";

  nWindow.addObjectToPane(nObject);

  // Future Video
  nObject = new overlayObject();

  nObject.type = "brick";

  nObject.title = "Future Development";
  nObject.url = "https://www.youtube.com/watch?v=PA1ckRVSgnE&list=PLu9KjnY1dxRbLRRMHNmAhpH1hNYDMyQ2z&index=5";

  nObject.src = "tutorialIntroThumb.jpg";

  nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);

  // Compatability Error
  nWindow = new overlayScreen();
  nWindow.id = "compError";
  nWindow.title = "Compatability Issue";

  // Bar

  // Pane
  nObject = new overlayObject();

  nObject.type = "text";

  nObject.title = "Looks like the browser you are using doesn't support the latest web technologies.";
  nObject.string[0] = "The Scalemail Inlay Designer requires the latest web standards, especially Canvas modes and functions.";
  nObject.string[1] = "As the browser you are using doesn't support these features, I advise that you install the latest version of a web-standards compliant browser such as Firefox, Chrome, or Edge.";
  nObject.string[2] = "You can continue to use the designer, but be aware that certain things may not work properly, or display incorrectly.";

  nWindow.addObjectToPane(nObject);

  overlay.addScreen(nWindow);
}

// Palette Functions ==================================================================================================
function buildPalette(target) {
  // Void
  nEnt = new paletteColour();

  nEnt.id = "vod";
  nEnt.name = "Void";

  nEnt.r = -255;
  nEnt.g = -255;
  nEnt.b = -255;
  nEnt.a = -255;
  nEnt.hex = "rgba(0, 0, 0, 0)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Empty
  nEnt = new paletteColour();

  nEnt.id = "non";
  nEnt.name = "Empty";

  nEnt.r = 0;
  nEnt.g = 0;
  nEnt.b = 0;
  nEnt.a = -255;
  nEnt.hex = "rgba(0, 0, 0, 0.25)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Aluminium (Brushed)
  nEnt = new paletteColour();

  nEnt.id = "alm";
  nEnt.name = "Aluminium (Brushed)";

  nEnt.r = 195;
  nEnt.g = 195;
  nEnt.b = 197;
  nEnt.a = 255;
  nEnt.hex = "rgba(195, 195, 197, 1)";

  nEnt.brushed = true;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Aluminium (Mirror)
  nEnt = new paletteColour();

  nEnt.id = "als";
  nEnt.name = "Aluminium (Mirror)";

  nEnt.r = 228;
  nEnt.g = 228;
  nEnt.b = 224;
  nEnt.a = 255;
  nEnt.hex = "rgba(228, 228, 224, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Black
  nEnt = new paletteColour();

  nEnt.id = "blk";
  nEnt.name = "Black";

  nEnt.r = 32;
  nEnt.g = 36;
  nEnt.b = 39;
  nEnt.a = 255;
  nEnt.hex = "rgba(32, 36, 39, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Blue
  nEnt = new paletteColour();

  nEnt.id = "Blu";
  nEnt.name = "Blue";

  nEnt.r = 17;
  nEnt.g = 76;
  nEnt.b = 173;
  nEnt.a = 255;
  nEnt.hex = "rgba(17, 76, 173, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Bronze
  nEnt = new paletteColour();

  nEnt.id = "brz";
  nEnt.name = "Bronze";

  nEnt.r = 133;
  nEnt.g = 108;
  nEnt.b = 46;
  nEnt.a = 255;
  nEnt.hex = "rgba(133, 108, 46, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Champagne
  nEnt = new paletteColour();

  nEnt.id = "cpg";
  nEnt.name = "Champange";

  nEnt.r = 250;
  nEnt.g = 214;
  nEnt.b = 165;
  nEnt.a = 255;
  nEnt.hex = "rgba(250, 214, 165, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Copper (Shiny)
  nEnt = new paletteColour();

  nEnt.id = "cpr";
  nEnt.name = "Copper (Shiny)";

  nEnt.r = 138;
  nEnt.g = 99;
  nEnt.b = 66;
  nEnt.a = 255;
  nEnt.hex = "rgba(138, 99, 66, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Frost
  nEnt = new paletteColour();

  nEnt.id = "fst";
  nEnt.name = "Frost";

  nEnt.r = 211;
  nEnt.g = 212;
  nEnt.b = 210;
  nEnt.a = 255;
  nEnt.hex = "rgba(211, 212, 210, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Gold 
  nEnt = new paletteColour();

  nEnt.id = "gld";
  nEnt.name = "Gold";

  nEnt.r = 170;
  nEnt.g = 166;
  nEnt.b = 124;
  nEnt.a = 255;
  nEnt.hex = "rgba(170, 166, 124, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Gold (Mirror)
  nEnt = new paletteColour();

  nEnt.id = "glm";
  nEnt.name = "Gold (Mirror)";

  nEnt.r = 207;
  nEnt.g = 193;
  nEnt.b = 146;
  nEnt.a = 255;
  nEnt.hex = "rgba(207, 193, 146, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Green
  nEnt = new paletteColour();

  nEnt.id = "grn";
  nEnt.name = "Green";

  nEnt.r = 24;
  nEnt.g = 79;
  nEnt.b = 47;
  nEnt.a = 255;
  nEnt.hex = "rgba(24, 79, 47, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Orange
  nEnt = new paletteColour();

  nEnt.id = "org";
  nEnt.name = "Orange";

  nEnt.r = 210;
  nEnt.g = 100;
  nEnt.b = 32;
  nEnt.a = 255;
  nEnt.hex = "rgba(210, 100, 32, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Pink
  nEnt = new paletteColour();

  nEnt.id = "pnk";
  nEnt.name = "Pink";

  nEnt.r = 183;
  nEnt.g = 51;
  nEnt.b = 134;
  nEnt.a = 255;
  nEnt.hex = "rgba(183, 51, 134, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Purple
  nEnt = new paletteColour();

  nEnt.id = "ppl";
  nEnt.name = "Purple";

  nEnt.r = 105;
  nEnt.g = 7;
  nEnt.b = 181;
  nEnt.a = 255;
  nEnt.hex = "rgba(105, 7, 181, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Red
  nEnt = new paletteColour();

  nEnt.id = "red";
  nEnt.name = "Red";

  nEnt.r = 146;
  nEnt.g = 29;
  nEnt.b = 19;
  nEnt.a = 255;
  nEnt.hex = "rgba(146, 29, 19, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Clear (Plastic)
  nEnt = new paletteColour();

  nEnt.id = "clr";
  nEnt.name = "Clear (Plastic)";

  nEnt.r = 255;
  nEnt.g = 255;
  nEnt.b = 255;
  nEnt.a = 60;
  nEnt.hex = "rgba(255, 255, 255, 0.25)";

  nEnt.brushed = false;
  nEnt.plastic = true;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Black (Plastic)
  nEnt = new paletteColour();

  nEnt.id = "blp";
  nEnt.name = "Black (Plastic)";

  nEnt.r = 43;
  nEnt.g = 44;
  nEnt.b = 39;
  nEnt.a = 255;
  nEnt.hex = "rgba(43, 44, 39, 1)";

  nEnt.brushed = false;
  nEnt.plastic = true;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Blue (Plastic) - Small
  nEnt = new paletteColour();

  nEnt.id = "bup";
  nEnt.name = "Blue (Plastic)-Sm";

  nEnt.r = 17;
  nEnt.g = 76;
  nEnt.b = 173;
  nEnt.a = 255;
  nEnt.hex = "rgba(17, 76, 173, 1)";

  nEnt.brushed = false;
  nEnt.plastic = true;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Green (Plastic)-Sm
  nEnt = new paletteColour();

  nEnt.id = "gep";
  nEnt.name = "Green (Plastic)-Sm";


  nEnt.r = 18;
  nEnt.g = 153;
  nEnt.b = 41;
  nEnt.a = 255;
  nEnt.hex = "rgba(18, 153, 41, 1)";

  nEnt.brushed = false;
  nEnt.plastic = true;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Purple (Plastic)-Sm
  nEnt = new paletteColour();

  nEnt.id = "pep";
  nEnt.name = "Purple (Plastic)-Sm";

  nEnt.r = 108;
  nEnt.g = 18;
  nEnt.b = 153;
  nEnt.a = 255;
  nEnt.hex = "rgba(108, 18, 153, 1)";

  nEnt.brushed = false;
  nEnt.plastic = true;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Red (Plastic)-Sm
  nEnt = new paletteColour();

  nEnt.id = "rrp";
  nEnt.name = "Red (Plastic)-Sm";

  nEnt.r = 207;
  nEnt.g = 43;
  nEnt.b = 43;
  nEnt.a = 255;
  nEnt.hex = "rgba(207, 43, 43, 1)";

  nEnt.brushed = false;
  nEnt.plastic = true;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Yellow (Plastic)-Sm
  nEnt = new paletteColour();

  nEnt.id = "yep";
  nEnt.name = "Yellow (Plastic)-Sm";

  nEnt.r = 247;
  nEnt.g = 255;
  nEnt.b = 102;
  nEnt.a = 255;
  nEnt.hex = "rgba(247, 255, 102, 1)";

  nEnt.brushed = false;
  nEnt.plastic = true;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Glow in the Dark
  nEnt = new paletteColour();

  nEnt.id = "gtd";
  nEnt.name = "Glow in the Dark (Plastic)";

  nEnt.r = 216;
  nEnt.g = 242;
  nEnt.b = 179;
  nEnt.a = 255;
  nEnt.hex = "rgba(216, 242, 179, 1)";

  nEnt.brushed = false;
  nEnt.plastic = true;
  nEnt.shiny = false;

  palette.addColour(nEnt);

  // Black-Premium
  nEnt = new paletteColour();

  nEnt.id = "bkp";
  nEnt.name = "Black-Premium";

  nEnt.r = 32;
  nEnt.g = 36;
  nEnt.b = 39;
  nEnt.a = 255;
  nEnt.hex = "rgba(32, 36, 39, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Black Ice-Premium			
  nEnt = new paletteColour();

  nEnt.id = "bip";
  nEnt.name = "Black Ice-Premium";

  nEnt.r = 74;
  nEnt.g = 74;
  nEnt.b = 74;
  nEnt.a = 255;
  nEnt.hex = "rgba(74, 74, 74, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Royal Blue-Premium
  nEnt = new paletteColour();

  nEnt.id = "rbp";
  nEnt.name = "Royal Blue-Premium";

  nEnt.r = 17;
  nEnt.g = 76;
  nEnt.b = 173;
  nEnt.a = 255;
  nEnt.hex = "rgba(17, 76, 173, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Bronze-Premium
  nEnt = new paletteColour();

  nEnt.id = "bzp";
  nEnt.name = "Bronze-Premium";

  nEnt.r = 133;
  nEnt.g = 108;
  nEnt.b = 46;
  nEnt.a = 255;
  nEnt.hex = "rgba(133, 108, 46, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Champagne-Premium
  nEnt = new paletteColour();

  nEnt.id = "cgp";
  nEnt.name = "Champange-Premium";

  nEnt.r = 250;
  nEnt.g = 214;
  nEnt.b = 165;
  nEnt.a = 255;
  nEnt.hex = "rgba(250, 214, 165, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);


  // Dark Rose-Premium
  nEnt = new paletteColour();

  nEnt.id = "drp";
  nEnt.name = "Dark Rose-Premium";

  nEnt.r = 173;
  nEnt.g = 38;
  nEnt.b = 90;
  nEnt.a = 255;
  nEnt.hex = "rgba(173, 38, 90, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Light Purple-Premium
  nEnt = new paletteColour();

  nEnt.id = "lpp";
  nEnt.name = "Light Purple-Premium";

  nEnt.r = 187;
  nEnt.g = 128;
  nEnt.b = 196;
  nEnt.a = 255;
  nEnt.hex = "rgba(187, 128, 196, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Lime Green-Premium
  nEnt = new paletteColour();

  nEnt.id = "lgp";
  nEnt.name = "Lime Green-Premium";

  nEnt.r = 2;
  nEnt.g = 209;
  nEnt.b = 19;
  nEnt.a = 255;
  nEnt.hex = "rgba(2, 209, 19, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Seafoam-Premium
  nEnt = new paletteColour();

  nEnt.id = "sfp";
  nEnt.name = "Seafoam-Premium";

  nEnt.r = 101;
  nEnt.g = 201;
  nEnt.b = 141;
  nEnt.a = 255;
  nEnt.hex = "rgba(101, 201, 141, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Sky Blue-Premium
  nEnt = new paletteColour();

  nEnt.id = "sbp";
  nEnt.name = "Sky Blue-Premium";

  nEnt.r = 102;
  nEnt.g = 240;
  nEnt.b = 250;
  nEnt.a = 255;
  nEnt.hex = "rgba(102, 240, 250, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Yellow-Premium
  nEnt = new paletteColour();

  nEnt.id = "ywp";
  nEnt.name = "Yellow-Premium";

  nEnt.r = 247;
  nEnt.g = 255;
  nEnt.b = 102;
  nEnt.a = 255;
  nEnt.hex = "rgba(247, 255, 102, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Sea Green-Premium
  nEnt = new paletteColour();

  nEnt.id = "sgp";
  nEnt.name = "Sea Green-Premium";

  nEnt.r = 98;
  nEnt.g = 222;
  nEnt.b = 168;
  nEnt.a = 255;
  nEnt.hex = "rgba(98, 222, 168, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Electric Violet-Premium
  nEnt = new paletteColour();

  nEnt.id = "evp";
  nEnt.name = "Electric Violet-Premium";

  nEnt.r = 209;
  nEnt.g = 59;
  nEnt.b = 255;
  nEnt.a = 255;
  nEnt.hex = "rgba(209, 59, 255, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Gold-Premium
  nEnt = new paletteColour();

  nEnt.id = "glp";
  nEnt.name = "Gold-Premium";

  nEnt.r = 170;
  nEnt.g = 166;
  nEnt.b = 124;
  nEnt.a = 255;
  nEnt.hex = "rgba(170, 166, 124, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Green-Premium
  nEnt = new paletteColour();

  nEnt.id = "gnp";
  nEnt.name = "Green-Premium";

  nEnt.r = 24;
  nEnt.g = 79;
  nEnt.b = 47;
  nEnt.a = 255;
  nEnt.hex = "rgba(24, 79, 47, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Orange-Premium
  nEnt = new paletteColour();

  nEnt.id = "orp";
  nEnt.name = "Orange-Premium";

  nEnt.r = 210;
  nEnt.g = 100;
  nEnt.b = 32;
  nEnt.a = 255;
  nEnt.hex = "rgba(210, 100, 32, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Pink-Premium
  nEnt = new paletteColour();

  nEnt.id = "pkp";
  nEnt.name = "Pink-Premium";

  nEnt.r = 252;
  nEnt.g = 116;
  nEnt.b = 214;
  nEnt.a = 255;
  nEnt.hex = "rgba(252, 116, 214, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Purple-Premium
  nEnt = new paletteColour();

  nEnt.id = "ppp";
  nEnt.name = "Purple-Premium";

  nEnt.r = 105;
  nEnt.g = 7;
  nEnt.b = 181;
  nEnt.a = 255;
  nEnt.hex = "rgba(105, 7, 181, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Red-Premium
  nEnt = new paletteColour();

  nEnt.id = "rep";
  nEnt.name = "Red-Premium";

  nEnt.r = 146;
  nEnt.g = 29;
  nEnt.b = 19;
  nEnt.a = 255;
  nEnt.hex = "rgba(146, 29, 19, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = true;

  palette.addColour(nEnt);

  // Teal-WCC-Sm
  nEnt = new paletteColour();

  nEnt.id = "tls";
  nEnt.name = "Teal-WCC-Sm";

  nEnt.r = 0;
  nEnt.g = 128;
  nEnt.b = 128;
  nEnt.a = 255;
  nEnt.hex = "rgba(0,128,128, 1)";

  nEnt.brushed = false;
  nEnt.plastic = false;
  nEnt.shiny = false;

  palette.addColour(nEnt);


}

function setActiveColour(colour) {
  activeColour = colour;
  createInterface();
  uiLayer.redrawCanvas();
}

// Pattern Functions ==================================================================================================
function newPattern(target, width = 76, height = 38, patternShape = 0, colour = activeColour) {

  target.clearMatrix();

  // Resize Matrix for Diamond Pattern
  if (patternShape == 1) {
    if (width < height) {
      height = (width * 2) - 1;
    } else {
      if (height % 2 == 0) {
        height++;
      }

      width = (height / 2) + 0.5;
    }
  }

  // Generate Blank Matrix
  for (let x = 0; x < height; x++) {
    target.addRow();
  }

  for (let x = 0; x < width; x++) {
    target.addColumn(1);
  }

  target.getSize();

  // Generate Shape
  switch (patternShape) {
    case 1:
      patternShapeDiamond(target, colour);
      break;
    case 2:
      patternShoulderShawl(target, colour);
    default:
      patternShapeSquare(target, colour);
      break;
  }
}

function newFromShape() {
  let width = document.getElementById("o-Width").value;
  let height = document.getElementById("o-Height").value;
  let shape = document.getElementsByName("shape");

  shape = parseInt(checkRadio(shape));

  editorPattern.clearMatrix();
  newPattern(editorPattern, width, height, shape);
  setLoadData();
  setURL();
  zoomExtents(editorPattern);
  createInterface();
  uiLayer.redrawCanvas();
  overlay.hideOverlay();
}

function patternShapeSquare(target, colour = activeColour) {

  let height = target.height;
  let width = target.width;

  for (let y = 0; y < height; y++) {
    // Set Inset Scale

    if (y % 2 == 1) {
      target.matrix[y][0].colour = 0;
    } else {
      target.matrix[y][0].colour = colour;
    }

    // Set Square
    for (let x = 1; x < width; x++) {
      target.matrix[y][x].colour = colour;
    }
  }

  target.getSize();
}

function patternShapeDiamond(target, colour = activeColour) {

  let height = target.height;
  let width = target.width;
  let breakHeight = 0;
  let breakWidth = 0;

  let z = 0;
  let s = 0;

  breakHeight = Math.floor(height / 2);
  breakWidth = Math.floor(width / 2);

  for (let y = 0; y < height; y++) {
    // Set Inset Scale
    if (width % 2 == 0) {
      // Even Set Inset Scale
      if (y % 2 == 0) {
        target.matrix[y][0].colour = 0;
      }

      // Scale Offset
      if (y % 2 == 0) {
        if (y > breakHeight) {
          s--;
        }

      } else {
        if (y <= breakHeight) {
          s++;
        }
      }

    } else {
      // Odd Set Inset Scale
      if (y % 2 == 1) {
        target.matrix[y][0].colour = 0;
      }

      // Scale Offset
      if (y % 2 == 1) {
        if (y > breakHeight) {
          s--;
        }

      } else {
        if (y <= breakHeight && y > 0) {
          s++;
        }
      }
    }

    // Determine Scale Count
    if (y <= breakHeight) {
      z++;
    } else {
      z--;
    }

    // Set Diamond
    for (let x = 0; x < z; x++) {
      target.matrix[y][(breakWidth - s) + x].colour = colour;
    }
  }

  target.getSize();
}

function patternShoulderShawl(target, colour) {
  let height = 38;
  let width = 76;
  let breakHeight = Math.floor(height / 2);
  let breakWidth = Math.floor(width / 2);


}

// Scale Functions ====================================================================================================
function calculateIntersection(x0, y0, r0, x1, y1, r1) {
  let a, dx, dy, d, h, rx, ry;
  let x2, y2;

  dx = x1 - x0;
  dy = y1 - y0;
  d = Math.sqrt((dy * dy) + (dx * dx));
  a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);
  x2 = x0 + (dx * a / d);
  y2 = y0 + (dy * a / d);
  h = Math.sqrt((r0 * r0) - (a * a));
  rx = -dy * (h / d);
  ry = dx * (h / d);

  /* Intersection Points */
  let xi = x2 + rx;
  let xi_prime = x2 - rx;
  let yi = y2 + ry;
  let yi_prime = y2 - ry;

  return [xi, xi_prime, yi, yi_prime];
}

// Server Functions =====================================================================================================
function sendRequest(target, request, responseFunction) {
  let ajaxRequest = new XMLHttpRequest();

  ajaxRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      responseFunction(this.responseText);
    } else if (this.status > 399) {
      console.log("Unable to reach the server.");
    }
  }

  ajaxRequest.open("POST", "https://scaledesigner.com/parts/" + target + ".php", true);
  ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajaxRequest.send(request);
}

function updateScaleVariables(radius = 35) {

  // Scale Base
  scaleRadius = radius;

  scaleInnerHoleOffset = radius / 2;
  scaleInnerHoleRadius = radius / 4;

  // Offsets
  scaleOffsetX = scaleRadius / 25;
  scaleOffsetY = 0.8879189152169245 * radius;
  scaleOffsetR = scaleRadius - scaleOffsetY;

  scaleOffsetXDouble = scaleOffsetX * 2;
  scaleOffsetXHalf = scaleOffsetX / 2;

  // Height & Width in PX
  scaleHeightPx = scaleOffsetY * 2;
  scaleHeightPxHalf = scaleHeightPx / 2;
  scaleHeightPxQuarter = scaleHeightPx / 4;

  scaleWidthPx = scaleRadius + (scaleOffsetX * 2);
  scaleWidthPxHalf = scaleWidthPx / 2;

  // Spacing in PX
  scaleSpacingX = scaleWidthPx + scaleOffsetX;
  scaleSpacingY = scaleHeightPx - (scaleHeightPx - (scaleRadius / 2) - scaleOffsetX);

  scaleSpacingXHalf = scaleSpacingX / 2;
}

// Startup Functions ==================================================================================================
function setupElements() {
  // Theme
  themeLibrary.generateThemes();

  // Background
  backgroundLayer.id = "canvasBackground";
  backgroundLayer.setupCanvas();

  // Editor
  editorLayer.id = "canvasEditor";
  editorLayer.setupCanvas();

  // UI
  uiLayer.id = "canvasUI";
  uiLayer.setupCanvas();

  // Gallery
  saveLayer.id = "saveLayer";
  saveLayer.setupMemory();
  saveLayer.scaleCanvas(250, 250, false);

  // Photo
  photoLayer.id = "photoLayer";
  photoLayer.setupMemory();
  photoLayer.scaleCanvas(250, 250, false);

  // Interaction
  interactionLayer = document.getElementById("canvasWrapper");

  // Overlay
  overlay.setupOverlay();
  splashText = document.getElementById("splashText");
}

function startDesigner() {
  // Configure Scales
  splashText.innerHTML = "Calculating scales...";
  updateScaleVariables(75);

  // Palette
  splashText.innerHTML = "Building colours...";
  buildPalette();

  // Pattern
  newPattern(editorPattern, 72, 38, 1);

  // Templates
  splashText.innerHTML = "Generating swatches...";

  swatches.generateSwatches();
  swatches.regenerateSwatches();

  // Editor
  nEnt = new entity();
  nEnt.id = "memoryEditor";
  nEnt.shape = "canvas";
  nEnt.imagesrc = swatches.patternSwatch.canvas;
  nEnt.originX = 0;
  nEnt.originY = 0;
  editorLayer.addEntity(nEnt);

  editorLayer.redrawCanvas();

  // Background
  splashText.innerHTML = "Adding layers of complexity...";

  nEnt = new entity();
  nEnt.id = "background";
  nEnt.shape = "background";

  backgroundLayer.addEntity(nEnt);
  backgroundLayer.redrawCanvas();

  // UI
  setupInterface();
  createInterface();
  uiLayer.redrawCanvas();

  // Overlays
  buildOverlays();

  // Event Triggers
  splashText.innerHTML = "Reticulating splines...";

  addEvent(interactionLayer, "click", mouseHandler);
  addEvent(interactionLayer, "mousemove", mouseHandler);
  addEvent(interactionLayer, "mousedown", mouseHandler);
  addEvent(interactionLayer, "mouseleave", mouseHandler);
  addEvent(interactionLayer, "mouseup", mouseHandler);
  addEvent(interactionLayer, "wheel", zoomCanvasMouse);

  addEvent(document, "keydown", keyHandler);
  addEvent(document, "keyup", keyHandler);

  addEvent(overlay.background, "click", function() { overlay.hideOverlay(); });

  // Load Pattern from URL
  try {
    let query = window.location.href;
    let rex = /\?id=([0-9]*)/g;
    query = rex.exec(query);

    if (query[1] >= 0) {
      loadPattern(query[1]);
    }
  } catch (err) {

  }

  // Hide Splash Screen
  splashText.innerHTML = "Here we go!";
  overlay.hideOverlay();
  overlayBackground.className = "";

  // Check compatability
  swatches.patternSwatch.context.globalCompositeOperation = "overlay";

  if (swatches.patternSwatch.context.globalCompositeOperation !== "overlay") {
    setOverlay("compError");
    overlay.showOverlay();
  }

  swatches.patternSwatch.context.globalCompositeOperation = "source-over";
}

// User Interface Functions ===========================================================================================
function setupInterface() {
  setupToolboxButtons();
  setupCameraButtons();
}

function setupCameraButtons() {
  // Configure Section
  uiCamera.name = "Camera";
  uiCamera.alignRight = true;

  // Buttons Settings
  nEnt = new uiButton();

  nEnt.name = "toolboxSettings";

  nEnt.action = false;
  nEnt.icon = "iconSettings";
  nEnt.tiptext = "Editor Settings";

  uiCamera.addButton(nEnt);

  // Kickstarter
  //	nEnt = new uiButton();

  //	nEnt.name = "toolboxKickstarter";

  //	nEnt.action = false;
  //	nEnt.icon = "iconKickstarter";
  //	nEnt.tiptext = "Kickstarter Supporters";

  //	uiCamera.addButton(nEnt);

  // Help
  nEnt = new uiButton();

  nEnt.name = "toolboxHelp";

  nEnt.action = false;
  nEnt.icon = "iconHelp";
  nEnt.tiptext = "Help & About";

  uiCamera.addButton(nEnt);

  // Zoom In
  nEnt = new uiButton();

  nEnt.name = "cameraZoomIn";

  nEnt.action = false;
  nEnt.icon = "iconZoomIn";
  nEnt.pregap = true;
  nEnt.tiptext = "Zoom In";

  uiCamera.addButton(nEnt);

  // Zoom Out
  nEnt = new uiButton();

  nEnt.name = "cameraZoomOut";

  nEnt.action = false;
  nEnt.icon = "iconZoomOut";
  nEnt.tiptext = "Zoom Out";

  uiCamera.addButton(nEnt);

  // Center
  nEnt = new uiButton();

  nEnt.name = "cameraCenter";

  nEnt.action = false;
  nEnt.icon = "iconCenter";
  nEnt.tiptext = "Center View";

  uiCamera.addButton(nEnt);

  // Extents
  nEnt = new uiButton();

  nEnt.name = "cameraExtents";

  nEnt.action = false;
  nEnt.icon = "iconExtents";
  nEnt.tiptext = "Zoom to Extents";

  uiCamera.addButton(nEnt);

  // Flip
  nEnt = new uiButton();

  nEnt.name = "cameraPhoto";

  nEnt.action = false;
  nEnt.icon = "iconCamera";
  nEnt.tiptext = "Save Image";

  uiCamera.addButton(nEnt);

  // Flip
  nEnt = new uiButton();

  nEnt.name = "cameraFlip";

  nEnt.action = false;
  nEnt.icon = "iconFlip";
  nEnt.tiptext = "Flip Pattern";

  uiCamera.addButton(nEnt);

  // Reset
  nEnt = new uiButton();

  nEnt.name = "cameraReset";

  nEnt.action = false;
  nEnt.icon = "iconReset";
  nEnt.tiptext = "Reset View";

  uiCamera.addButton(nEnt);
}

function setupToolboxButtons() {
  // Configure Section
  uiToolbox.name = "Toolbox";

  // Buttons
  // New
  nEnt = new uiButton();

  nEnt.name = "toolboxNew";

  nEnt.action = false;
  nEnt.icon = "iconNew";
  nEnt.tiptext = "New Pattern";

  uiToolbox.addButton(nEnt);

  // Open
  nEnt = new uiButton();

  nEnt.name = "toolboxOpen";

  nEnt.action = false;
  nEnt.icon = "iconOpen";
  nEnt.tiptext = "Open Pattern";

  uiToolbox.addButton(nEnt);

  // Save
  nEnt = new uiButton();

  nEnt.name = "toolboxSave";

  nEnt.action = false;
  nEnt.icon = "iconSave";
  nEnt.tiptext = "Save Pattern";

  uiToolbox.addButton(nEnt);

  // Share
  nEnt = new uiButton();

  nEnt.name = "toolboxShare";

  nEnt.action = false;
  nEnt.icon = "iconShare";
  nEnt.tiptext = "Share Pattern";

  uiToolbox.addButton(nEnt);

  // Cursor
  nEnt = new uiButton();

  nEnt.name = "toolboxCursor";

  nEnt.action = false;
  nEnt.helptext = ["Cursor Tool", "Click a scale to change its colour."];
  nEnt.icon = "iconCursor";
  nEnt.pregap = true;
  nEnt.tiptext = "Cursor Tool";

  uiToolbox.addButton(nEnt);

  // Pan
  nEnt = new uiButton();

  nEnt.name = "cameraPan";

  nEnt.action = false;
  nEnt.helptext = ["Pan Tool", "Click anywhere to pan."];
  nEnt.icon = "iconPan";
  nEnt.tiptext = "Pan Mode";

  uiToolbox.addButton(nEnt);

  // Brush
  //	nEnt = new uiButton();

  //	nEnt.name = "toolboxBrush";

  //	nEnt.action = false;
  //	nEnt.helptext = ["Brush Tool", "Click and hold to colour many scales."];
  //	nEnt.icon = "iconBrush";
  //	nEnt.tiptext = "Brush Tool";

  //	uiToolbox.addButton(nEnt);

  // Fill
  //	nEnt = new uiButton();

  //	nEnt.name = "toolboxFill";
  //	nEnt.group = "fill";

  // Fill Row
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxFillRow";
  //		sEnt.group = "fill";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Fill Row", "Click to colour an entire row."];
  //		sEnt.icon = "iconFillRow";
  //		sEnt.tiptext = "Fill Row";

  //		nEnt.addButton(sEnt);

  // Fill Column
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxFillColumn";
  //		sEnt.group = "fill";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Fill Column", "Click to colour an entire column."];
  //		sEnt.icon = "iconFillColumn";
  //		sEnt.tiptext = "Fill Column";

  //		nEnt.addButton(sEnt);

  // Fill Colour
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxFillColour";
  //		sEnt.group = "fill";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Fill Area", "Click to change all adjacent scales of the same colour."];
  //		sEnt.icon = "iconFillColour";
  //		sEnt.tiptext = "Fill Colour";

  //		nEnt.addButton(sEnt);

  //	nEnt.action = false;
  //	nEnt.expandable = true;
  //	nEnt.icon = false;
  //	nEnt.tiptext = false;

  //	uiToolbox.addButton(nEnt);

  // Row
  //	nEnt = new uiButton();

  //	nEnt.name = "toolboxRow";
  //	nEnt.group = "row";

  // Insert Row
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxRowInsert";
  //		sEnt.group = "row";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Insert Row", "Click to add a new row of scales."];
  //		sEnt.icon = "iconRowInsert";
  //		sEnt.tiptext = "Insert Row";

  //		nEnt.addButton(sEnt);

  // Remove Row
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxRowRemove";
  //		sEnt.group = "row";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Remove Row", "Click to remove a row of scales."];
  //		sEnt.icon = "iconRowRemove";
  //		sEnt.tiptext = "Delete Row";

  //		nEnt.addButton(sEnt);

  // Copy Row
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxRowCopy";
  //		sEnt.group = "row";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Copy Row", "Click to copy the colours of a row of scales."];
  //		sEnt.icon = "iconRowCopy";
  //		sEnt.tiptext = "Copy Row";

  //		nEnt.addButton(sEnt);

  // Paste Row
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxRowPaste";
  //		sEnt.group = "row";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Paste Row", "Click to paste the copied colours of a row of scales."];
  //		sEnt.icon = "iconRowPaste";
  //		sEnt.tiptext = "Paste Row";

  //		nEnt.addButton(sEnt);

  //	nEnt.action = false;
  //	nEnt.expandable = true;
  //	nEnt.icon = false;
  //	nEnt.tiptext = false;

  //	uiToolbox.addButton(nEnt);

  // Column
  //	nEnt = new uiButton();

  //	nEnt.name = "toolboxColumn";
  //	nEnt.group = "column";

  // Insert Column
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxColumnInsert";
  //		sEnt.group = "column";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Insert Column", "Click to insert a new column of scales."];
  //		sEnt.icon = "iconColumnInsert";
  //		sEnt.tiptext = "Insert Column";

  //		nEnt.addButton(sEnt);

  // Remove Column
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxColumnRemove";
  //		sEnt.group = "column";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Remove Column", "Click to remove a column of scales."];
  //		sEnt.icon = "iconColumnRemove";
  //		sEnt.tiptext = "Delete Column";

  //		nEnt.addButton(sEnt);

  // Copy Column
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxColumnCopy";
  //		sEnt.group = "column";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Copy Column", "Click to copy the colours of a column of scales."];
  //		sEnt.icon = "iconColumnCopy";
  //		sEnt.tiptext = "Copy Column";

  //		nEnt.addButton(sEnt);

  // Paste Column
  //		sEnt = new uiButton();

  //		sEnt.name = "toolboxColumnPaste";
  //		sEnt.group = "column";

  //		sEnt.action = false;
  //		sEnt.helptext = ["Paste Column", "Click to paste the copied colours of a row of scales."];
  //		sEnt.icon = "iconColumnPaste";
  //		sEnt.tiptext = "Paste Column";

  //		nEnt.addButton(sEnt);

  //	nEnt.action = false;
  //	nEnt.expandable = true;
  //	nEnt.icon = false;
  //	nEnt.tiptext = false;

  //	uiToolbox.addButton(nEnt);

  // Replace
  //	nEnt = new uiButton();

  //	nEnt.name = "toolboxReplace";

  //	nEnt.action = false;
  //	nEnt.helptext = ["Replace Colour", "Click to change all scales of a single colour."];
  //	nEnt.icon = "iconReplace";
  //	nEnt.tiptext = "Replace Colour";

  //	uiToolbox.addButton(nEnt);
}

function createInterface() {
  uiLayer.clearEntities();

  uiToolbox.buildSection(uiLayer);
  createPalette(uiLayer);
  uiCamera.buildSection(uiLayer);
  createData(uiLayer, editorPattern);
}

function createPalette(target) {
  let x = 0;
  let y = palette.colours.length;

  let r = 0;
  c = 0;

  let strokeWeight = 4;
  let strokeColour = themeLibrary.themes[theme].paletteColour;

  let perRow = 7;
  let paletteIcon = uiIconSize / 1.5;

  let boxOriginX = uiOffsetX - (strokeWeight / 2);
  let boxOriginY = target.height - uiOffsetY - (paletteIcon * Math.ceil(y / perRow)) - (strokeWeight / 2);

  for (x = 1; x < y; x++) {
    if (x == activeColour) {
      strokeColour = themeLibrary.themes[theme].paletteColour;
    } else {
      strokeColour = palette.colours[x].hex;
    }

    nEnt = new entity();
    nEnt.id = palette.colours[x].id;
    nEnt.shape = "palette";

    nEnt.mouse = true;
    nEnt.mouseClick = true;
    nEnt.mouseHover = true;

    nEnt.fill = true;
    nEnt.fillColour = palette.colours[x].hex;
    nEnt.fillPalette = palette.colours[x];

    nEnt.stroke = true;
    nEnt.strokeColour = strokeColour;
    nEnt.strokeWeight = strokeWeight;

    nEnt.tooltip = true;
    nEnt.tooltipText = palette.colours[x].name;

    nEnt.originX = boxOriginX + (paletteIcon * c) + strokeWeight;
    nEnt.originY = boxOriginY + (paletteIcon * r) + strokeWeight;
    nEnt.height = paletteIcon - strokeWeight;
    nEnt.width = paletteIcon - strokeWeight;

    target.addEntity(nEnt);

    c++;

    if (c == perRow) {
      r++;
      c = 0;
    }
  }
}

function createData(target, pattern) {
  // Variables
  let pHeight = pattern.physicalHeight;
  let pWidth = pattern.physicalWidth;
  let pData;

  let mHeight = 0;
  let mWidth = 0;
  let mFraction = "";

  let wScales = 0;
  let wRings = 0;
  let wTotal = 0;

  let output = [];

  let oHeight = 0;
  let oWidth = 0;

  let posX = 0;
  let posY = 0;

  let x = 0;
  let y = 0;
  let h = 0;

  // Generate Data
  // Scale Count & Colour Tally
  sCount = 0;
  output.push([0, "Colours Used"]);

  palette.countColours(pattern);
  pData = palette.colourInformation();

  y = pData.length;

  for (x = 0; x < y; x++) {
    if (pData[x][1] > 0) {
      output.push([1, pData[x][1] + "x " + pData[x][0]]);
      sCount += pData[x][1];
    }
  }

  // Physical Height and Width
  output.push([0, "Pattern Size"]);

  // Width
  mWidth = (pWidth * rulerData[rulerSize].width) + ((pWidth - 1) * rulerData[rulerSize].gapH);
  mWidth *= rulerData[rulerUnits]['multiSize'];

  if (rulerUnits == "imperial") {
    mFraction = " " + inchesFraction(mWidth);
    mWidth = Math.floor(mWidth);
  }

  output.push([1, "~" + mWidth + rulerData[rulerUnits].unitSize + mFraction + " wide"]);

  // Height
  mHeight = ((pHeight - 1) * rulerData[rulerSize].gapV) + rulerData[rulerSize].height;
  mHeight *= rulerData[rulerUnits]['multiSize'];

  if (rulerUnits == "imperial") {
    mFraction = " " + inchesFraction(mHeight);
    mHeight = Math.floor(mHeight);
  }

  output.push([1, "~" + mHeight + rulerData[rulerUnits].unitSize + mFraction + " high"]);

  // Physical Weight
  output.push([0, "Pattern Weight"]);

  wScales = (sCount * rulerData[rulerSize].weightS) * rulerData[rulerUnits]['multiWeight'];
  wRings = ((sCount * rulerData[rulerSize].weightR) * 2) * rulerData[rulerUnits]['multiWeight'];
  wTotal = wScales + wRings;

  wScales = wScales.toFixed(2);
  wRings = wRings.toFixed(2);
  wTotal = wTotal.toFixed(2);

  output.push([1, sCount + " Scales (~" + wScales + rulerData[rulerUnits].unitWeight + ")"]);
  output.push([1, (sCount * 2) + " Rings (~" + wRings + rulerData[rulerUnits].unitWeight + ")"]);
  output.push([1, "~" + wTotal + rulerData[rulerUnits].unitWeight + " Total"]);

  // Create Entities
  y = output.length;

  // Precompute Size
  for (x = 0; x < y; x++) {
    if (output[x][0] == 0) {
      oHeight += 25;
    } else {
      oHeight += 15;
    }
  }

  // Generate
  for (x = 0; x < y; x++) {
    if (output[x][0] == 0) {
      h = 25;
    } else {
      h = 15;
    }

    posX = target.width - 20;
    posY = target.height - 20 - oHeight + h;
    oHeight -= h;

    nEnt = new entity();
    nEnt.id = "data-" + x;
    nEnt.shape = "text";

    nEnt.fill = true;
    nEnt.fillColour = themeLibrary.themes[theme].fontColour;

    nEnt.originX = posX;
    nEnt.originY = posY;

    nEnt.textAlign = "right";
    nEnt.textString = output[x][1];
    nEnt.textType = output[x][0];

    target.addEntity(nEnt);
  }
}