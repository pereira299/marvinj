import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Invert extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load = function () {};

  process = function (imageIn, imageOut, attributesOut, mask, previewMode) {
    let l_arrMask = mask.getMask();

    let r, g, b;
    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }
        r = 255 - imageIn.getIntComponent0(x, y);
        g = 255 - imageIn.getIntComponent1(x, y);
        b = 255 - imageIn.getIntComponent2(x, y);

        imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), r, g, b);
      }
    }
  };
}
