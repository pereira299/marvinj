import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class BrightnessAndContrast extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load () {
    // Attributes
    BrightnessAndContrast.setAttribute("brightness", 0);
    BrightnessAndContrast.setAttribute("contrast", 0);
  }

  process (imageIn, imageOut, attributesOut, mask, previewMode) {
    let r, g, b;
    const l_brightness = BrightnessAndContrast.getAttribute("brightness");
    let l_contrast = BrightnessAndContrast.getAttribute("contrast");
    l_contrast = Math.pow((127 + l_contrast) / 127, 2);

    // Brightness
    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        r = imageIn.getIntComponent0(x, y);
        g = imageIn.getIntComponent1(x, y);
        b = imageIn.getIntComponent2(x, y);

        r += (1 - r / 255) * l_brightness;
        g += (1 - g / 255) * l_brightness;
        b += (1 - b / 255) * l_brightness;
        if (r < 0) r = 0;
        if (r > 255) r = 255;
        if (g < 0) g = 0;
        if (g > 255) g = 255;
        if (b < 0) b = 0;
        if (b > 255) b = 255;

        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          Math.floor(r),
          Math.floor(g),
          Math.floor(b)
        );
      }
    }

    // Contrast
    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        r = imageOut.getIntComponent0(x, y);
        g = imageOut.getIntComponent1(x, y);
        b = imageOut.getIntComponent2(x, y);

        r /= 255.0;
        r -= 0.5;
        r *= l_contrast;
        r += 0.5;
        r *= 255.0;

        g /= 255.0;
        g -= 0.5;
        g *= l_contrast;
        g += 0.5;
        g *= 255.0;

        b /= 255.0;
        b -= 0.5;
        b *= l_contrast;
        b += 0.5;
        b *= 255.0;

        if (r < 0) r = 0;
        if (r > 255) r = 255;
        if (g < 0) g = 0;
        if (g > 255) g = 255;
        if (b < 0) b = 0;
        if (b > 255) b = 255;

        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          Math.floor(r),
          Math.floor(g),
          Math.floor(b)
        );
      }
    }
  }
}
