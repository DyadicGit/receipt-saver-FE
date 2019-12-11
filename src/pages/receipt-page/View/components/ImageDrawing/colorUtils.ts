const invertColors = (imageData: ImageData) => {
  const pix = imageData.data;

  for (let i = 0; i < pix.length; i += 4) {
    pix[i] = 255 - pix[i]; // red
    pix[i + 1] = 255 - pix[i + 1]; // green
    pix[i + 2] = 255 - pix[i + 2]; // blue
  }
};
export type Color = { R: number; G: number; B: number; alpha?: number };
const black = { R: 0, G: 0, B: 0 };

const replaceColor = (imageData: ImageData, oldColor: Color, newColor: Color = black) => {
  const { R: oldRed, G: oldGreen, B: oldBlue } = oldColor;
  const { R: newRed, G: newGreen, B: newBlue } = newColor;

  for (let i = 0; i < imageData.data.length; i += 4) {
    const pix = imageData.data;

    if (isApprox(pix[i], oldRed, 155) && isApprox(pix[i + 1], oldGreen, 155) && isApprox(pix[i + 2], oldBlue, 155)) {
      pix[i] = newRed;
      pix[i + 1] = newGreen;
      pix[i + 2] = newBlue;
      pix[i + 3] = 255;
    }
  }
};
const isApprox = (a, b, range) => {
  const d = a - b;
  return d < range && d > -range;
};

const fillTransparent = (imageData: ImageData, colorToFill: Color = black) => {
  const pix = imageData.data;

  for (let i = 0; i < pix.length; i += 4) {
    if (pix[i + 3] === 0) {
      pix[i] = colorToFill.R;
      pix[i + 1] = colorToFill.G;
      pix[i + 2] = colorToFill.B;
      pix[i + 3] = 255;
    }
  }
};

const removeColor = (imageData: ImageData, colorToRemove: Color) => {
  const pix = imageData.data;

  for (let i = 0; i < pix.length; i += 4) {
    if (isApprox(pix[i], colorToRemove.R, 155) && isApprox(pix[i + 1], colorToRemove.G, 155) && isApprox(pix[i + 2], colorToRemove.B, 155)) {
      pix[i + 3] = 0;
    }
  }
};

export default { removeColor, invertColors, replaceColor, fillTransparent, color: {black} };
