import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class ColorChannel extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load = function () {
    this.setAttribute("red", 0);
    this.setAttribute("green", 0);
    this.setAttribute("blue", 0);
  };

  process = function (imageIn, imageOut, attributesOut, mask, previewMode) {
    let vr = this.getAttribute("red");
    let vg = this.getAttribute("green");
    let vb = this.getAttribute("blue");

    let mr = 1 + Math.abs((vr / 100.0) * 2.5);
    let mg = 1 + Math.abs((vg / 100.0) * 2.5);
    let mb = 1 + Math.abs((vb / 100.0) * 2.5);

    mr = vr > 0 ? mr : 1.0 / mr;
    mg = vg > 0 ? mg : 1.0 / mg;
    mb = vb > 0 ? mb : 1.0 / mb;

    let red, green, blue;
    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        red = imageIn.getIntComponent0(x, y);
        green = imageIn.getIntComponent1(x, y);
        blue = imageIn.getIntComponent2(x, y);

        red = Math.min(red * mr, 255);
        green = Math.min(green * mg, 255);
        blue = Math.min(blue * mb, 255);

        imageOut.setIntColor(x, y, 255, red, green, blue);
      }
    }
  };
}
