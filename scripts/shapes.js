// Shape Functions ====================================================================================================
function drawImg(context, entity, offsetX, offsetY) {
  context.beginPath();

  if (entity.imageClipX !== false) {
    context.drawImage(imageAssets.getImage(entity.imagesrc), entity.imageClipX, entity.imageClipY, entity.width, entity.height, entity.originX + offsetX, entity.originY + offsetY, entity.width, entity.height);
  } else {
    context.drawImage(imageAssets.getImage(entity.imagesrc), entity.originX + offsetX, entity.originY + offsetY);
  }

  context.closePath();
}

function drawPalette(context, entity, offsetX, offsetY) {
  // Colour
  drawRect(context, entity, offsetX, offsetY);
  context.fillStyle = entity.fillColour;
  context.fill();

  // Brush
  if (entity.fillPalette.brushed === true) {
    drawRect(context, entity, offsetX, offsetY);
    context.globalCompositeOperation = "overlay";
    context.fillStyle = swatches.textureSwatches[1].pattern;
    context.fill();
    context.globalCompositeOperation = "source-over";
  }
}

function drawRect(context, entity, offsetX, offsetY) {
  context.beginPath();
  context.rect(entity.originX + offsetX, entity.originY + offsetY, entity.width, entity.height);
  context.closePath();

  if (entity.stroke === true) {
    shapeStroke(context, entity.strokeColour, entity.strokeWeight);
  }

  if (entity.fill === true) {
    shapeFill(context, entity.fillColour, this.entity.fillOrder);
  }
}

function drawScale(context, entity, offsetX, offsetY) {
  context.drawImage(swatches.scaleSwatches[entity.fillPalette].canvas, entity.originX + offsetX, entity.originY + offsetY);
}

function drawScalePath(context, originX, originY) {
  originX += scaleOffsetXDouble;
  originY += scaleOffsetY;

  // Build Outer Scale
  context.beginPath();
  context.arc(originX, originY, scaleRadius, 5.19, 1.08);
  context.arc(originX + scaleRadius - (scaleOffsetXDouble), originY, scaleRadius, 2.05, 4.23);
  context.closePath();

  // Cutout Hole
  context.arc(originX + scaleInnerHoleOffset - scaleOffsetX, originY - (scaleInnerHoleOffset) - scaleOffsetX, (scaleInnerHoleRadius) - (scaleOffsetXHalf), 0, 2 * Math.PI);
  context.closePath();
}

function drawText(context, x, y, align, type, string) {
  let textWidth = 0;
  let posX = x;

  context.font = fontStyles[type];
  context.fillStyle = themeLibrary.themes[theme].fontColour;

  if (align == "right") {
    textWidth = context.measureText(string).width;
    posX -= textWidth;
  }

  context.beginPath();
  context.fillText(string, posX, y);
  context.closePath();
}

function drawTooltip(target, originX, originY, tipText, tipFlip) {
  let textWidth = target.measureText(tipText).width;
  let textHeight = 10;
  let textPadding = 10;

  let boxX = originX;
  let boxY = originY - ((textHeight + textPadding) / 2);
  let triA = 0;
  let triB = textHeight;

  let shadow = 3;
  let shadowOff = 3;

  if (tipFlip === true) {
    boxX = originX - uiIconSize - textPadding - textWidth - (textHeight * 2);
    triA = textWidth + textPadding + (textHeight * 2);
    triB = textWidth + textPadding + textHeight;

    shadowOff = -3;
  }

  // Build Background
  shapeShadow(shadow, shadowOff, shadow);

  target.beginPath();
  target.rect(boxX + textHeight, boxY, textWidth + textPadding, textHeight + textPadding);

  target.moveTo(boxX + triA, boxY + ((textHeight + textPadding) / 2));
  target.lineTo(boxX + triB, boxY);
  target.lineTo(boxX + triB, boxY + (textHeight + textPadding));

  shapeFill(target, "rgba(60, 114, 92, 0.75)");
  target.closePath();

  // Build Text
  target.beginPath();
  target.fillStyle = "#ffffff";
  target.fillText(tipText, boxX + textHeight + (textPadding / 4), boxY + textPadding + 3);
  target.closePath();
}

function shapeShadow(target, shadowBlur, offsetX, offsetY, colour) {
  if (shadowBlur === undefined) shadowBlur = 5;
  if (offsetX === undefined) offsetX = 0;
  if (offsetY === undefined) offsetY = 0;
  if (colour === undefined) colour = "rgba(0, 0, 0, 0.3)";

  target.shadowBlur = shadowBlur;
  target.shadowColor = colour;
  target.shadowOffsetX = offsetX;
  target.shadowOffsetY = offsetY;
}

function shapeShadowReset(target) {
  target.shadowBlur = 0;
  target.shadowColor = "rgba(0,0,0,0.3)";
  target.shadowOffsetX = 0;
  target.shadowOffsetY = 0;
}

function shapeStroke(target, colour, weight) {
  if (weight === undefined) weight = 2;

  target.strokeStyle = colour;
  target.lineWidth = weight;
  target.stroke();
}

function shapeFill(target, colour, order) {
  if (order === undefined) order = "nonzero";

  target.fillStyle = colour;
  target.fill(order);

  shapeShadowReset(target);
}