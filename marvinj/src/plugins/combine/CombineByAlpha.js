import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class CombineByAlpha extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    this.setAttribute("x", 0);
    this.setAttribute("y", 0);
    this.setAttribute("imageOther", null);
  }

  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let imageOther = this.getAttribute("imageOther");
    let x = this.getAttribute("x");
    let y = this.getAttribute("y");

    if (imageOther != null) {
      for (let j = 0; j < imageIn.getHeight(); j++) {
        for (let i = 0; i < imageIn.getWidth(); i++) {
          let ox = i - x;
          let oy = j - y;

          if (
            ox >= 0 &&
            ox < imageOther.getWidth() &&
            oy >= 0 &&
            oy < imageOther.getHeight()
          ) {
            let alpha = imageOther.getAlphaComponent(ox, oy);
            if (alpha != 0) {
              let factor = alpha / 255;

              let rA = imageIn.getIntComponent0(i, j);
              let gA = imageIn.getIntComponent1(i, j);
              let bA = imageIn.getIntComponent2(i, j);

              let rB = imageOther.getIntComponent0(ox, oy);
              let gB = imageOther.getIntComponent1(ox, oy);
              let bB = imageOther.getIntComponent2(ox, oy);

              let red = Math.floor(rA * (1 - factor) + rB * factor);
              let green = Math.floor(gA * (1 - factor) + gB * factor);
              let blue = Math.floor(bA * (1 - factor) + bB * factor);

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
