import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import MarvinJSUtils from "../../MarvinJSUtils";
import MarvinImage from "../../image/MarvinImage";
import Marvin from "../../MarvinFramework";

export default class Closing extends MarvinAbstractImagePlugin {

  matrix: number[][];

  constructor() {
    super();
    this.load();
  }

  load () {
    this.matrix = MarvinJSUtils.createMatrix2D(3, 3, true);
    Closing.setAttribute("matrix", 3);
  }

  process (imgIn, imgOut, attributesOut, mask, previewMode) {
    const matrix = Closing.getAttribute("matrix");

    if (
      imgIn.getColorModel() == MarvinImage.COLOR_MODEL_BINARY &&
      matrix != null
    ) {
      Marvin.morphologicalDilation(imgIn, imgOut, matrix);
      MarvinImage.copyColorArray(imgOut, imgIn);
      Marvin.morphologicalErosion(imgIn, imgOut, matrix);
    }
  }
}
