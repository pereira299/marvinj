import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import MarvinJSUtils from "../../MarvinJSUtils";
import MarvinImage from "../../image/MarvinImage";
import Marvin from "../../MarvinFramework";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinImageMask from "../../image/MarvinImageMask";

export default class Closing extends MarvinAbstractImagePlugin {
  matrix: number[][];

  constructor() {
    super();
    this.load();
  }

  load() {
    this.matrix = MarvinJSUtils.createMatrix2D(3, 3, true);
    Closing.setAttribute("matrix", 3);
  }

  process(
    imgIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    const matrix = Closing.getAttribute("matrix");
    let imgOut = imgIn.clone();
    if (
      imgIn.getColorModel() == MarvinImage.COLOR_MODEL_BINARY &&
      matrix != null
    ) {
      const marvin = new Marvin(imgOut);
      imgOut = marvin.morphologicalDilation(matrix).output();
      MarvinImage.copyColorArray(imgOut, imgIn);
      imgOut = marvin.morphologicalDilation(matrix).output();
    }

    return imgOut;
  }
}
