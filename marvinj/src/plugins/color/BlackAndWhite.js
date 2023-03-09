import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class BlackAndWhite extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.MAX_RLEVEL = 0.03;
    this.load();
  }
  load = function () {
    this.grayScale = new GrayScale();
    this.setAttribute("level", 10);
  };

  process = function (imageIn, imageOut, attributesOut, mask, previewMode) {
    this.grayScale.process(imageIn, imageOut);
    let level = this.getAttribute("level");
    let rlevel = (level / 100.0) * this.MAX_RLEVEL;

    let c = 0;
    let gray;
    for (let y = 0; y < imageOut.getHeight(); y++) {
      for (let x = 0; x < imageOut.getWidth(); x++) {
        gray = imageIn.getIntComponent0(x, y);

        if (gray <= 127) {
          gray = Math.max(gray * (1 - (127 - gray) * rlevel), 0);
        } else {
          gray = Math.min(gray * (1 + (gray - 127) * rlevel), 255);
        }

        if (c++ < 1) {
          console.log("gray:" + gray);
          console.log("level:" + level);
          console.log("rlevel:" + rlevel);
        }

        imageOut.setIntColor(
          x,
          y,
          255,
          Math.floor(gray),
          Math.floor(gray),
          Math.floor(gray)
        );
      }
    }
  };
}
