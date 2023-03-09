import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class CombineByAlpha extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    CombineByAlpha.setAttribute("x", 0);
    CombineByAlpha.setAttribute("y", 0);
    CombineByAlpha.setAttribute("imageOther", null);
  }

  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    const imageOther = CombineByAlpha.getAttribute("imageOther");
    const x = CombineByAlpha.getAttribute("x");
    const y = CombineByAlpha.getAttribute("y");

    if (imageOther != null) {
      for (let j = 0; j < imageIn.getHeight(); j++) {
        for (let i = 0; i < imageIn.getWidth(); i++) {
          const ox = i - x;
          const oy = j - y;

          if (
            ox >= 0 &&
            ox < imageOther.getWidth() &&
            oy >= 0 &&
            oy < imageOther.getHeight()
          ) {
            const alpha = imageOther.getAlphaComponent(ox, oy);
            if (alpha != 0) {
              const factor = alpha / 255;

              const rA = imageIn.getIntComponent0(i, j);
              const gA = imageIn.getIntComponent1(i, j);
              const bA = imageIn.getIntComponent2(i, j);

              const rB = imageOther.getIntComponent0(ox, oy);
              const gB = imageOther.getIntComponent1(ox, oy);
              const bB = imageOther.getIntComponent2(ox, oy);

              const red = Math.floor(rA * (1 - factor) + rB * factor);
              const green = Math.floor(gA * (1 - factor) + gB * factor);
              const blue = Math.floor(bA * (1 - factor) + bB * factor);

              imageOut.setIntColor(
                i,
                j,
                Math.max(imageIn.getAlphaComponent(x, y), alpha),
                red,
                green,
                blue
              );
            } else {
              imageOut.setIntColor(i, j, imageIn.getIntColor(i, j));
            }
          } else {
            imageOut.setIntColor(i, j, imageIn.getIntColor(i, j));
          }
        }
      }
    }
  }
}
