import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Emboss extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load = function () {};

  process = function (imageIn, imageOut, attributesOut, mask, previewMode) {
    let l_arrMask = mask.getMask();

    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          imageOut.setIntColor(x, y, 255, imageIn.getIntColor(x, y));
          continue;
        }

        let rDiff = 0;
        let gDiff = 0;
        let bDiff = 0;

        if (y > 0 && x > 0) {
          // Red component difference between the current and the upperleft pixels
          rDiff =
            imageIn.getIntComponent0(x, y) -
            imageIn.getIntComponent0(x - 1, y - 1);

          // Green component difference between the current and the upperleft pixels
          gDiff =
            imageIn.getIntComponent1(x, y) -
            imageIn.getIntComponent1(x - 1, y - 1);

          // Blue component difference between the current and the upperleft pixels
          bDiff =
            imageIn.getIntComponent2(x, y) -
            imageIn.getIntComponent2(x - 1, y - 1);
        } else {
          rDiff = 0;
          gDiff = 0;
          bDiff = 0;
        }

        let diff = rDiff;
        if (Math.abs(gDiff) > Math.abs(diff)) diff = gDiff;
        if (Math.abs(bDiff) > Math.abs(diff)) diff = bDiff;

        let grayLevel = Math.max(Math.min(128 + diff, 255), 0);

        imageOut.setIntColor(x, y, 255, grayLevel, grayLevel, grayLevel);
      }
    }
  };
}
