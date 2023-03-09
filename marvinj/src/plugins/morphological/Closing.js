import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Closing extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load = function () {
    this.matrix = MarvinJSUtils.createMatrix2D(3, 3, true);
    this.setAttribute("matrix", 3);
  };

  process = function (imgIn, imgOut, attributesOut, mask, previewMode) {
    var matrix = this.getAttribute("matrix");

    if (
      imgIn.getColorModel() == MarvinImage.COLOR_MODEL_BINARY &&
      matrix != null
    ) {
      Marvin.morphologicalDilation(imgIn, imgOut, matrix);
      MarvinImage.copyColorArray(imgOut, imgIn);
      Marvin.morphologicalErosion(imgIn, imgOut, matrix);
    }
  };
}
