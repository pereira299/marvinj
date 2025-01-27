import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import MarvinJSUtils from "../../MarvinJSUtils";
import MarvinPoint from "../../util/MarvinPoint";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinImage from "../../image/MarvinImage";
import MarvinAttributes from "../../util/MarvinAttributes";

export default class BoundaryFill extends MarvinAbstractImagePlugin {
  threshold = 0;

  constructor() {
    super();
    this.load();
  }

  load() {
    BoundaryFill.setAttribute("x", 0);
    BoundaryFill.setAttribute("y", 0);
    BoundaryFill.setAttribute("color", 0xffff0000);
    BoundaryFill.setAttribute("tile", null);
    BoundaryFill.setAttribute("threshold", 0);
  }

  process(
    imgIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    const imgOut = imgIn.clone();
    const l_list = [];
    let l_point, l_pointW, l_pointE;

    //MarvinImage.copyColorArray(imgIn, imgOut);

    const x = BoundaryFill.getAttribute("x");
    const y = BoundaryFill.getAttribute("y");
    const tileImage = BoundaryFill.getAttribute("tile");
    this.threshold = BoundaryFill.getAttribute("threshold");

    if (!imgOut.isValidPosition(x, y)) {
      return;
    }

    const targetColor = imgIn.getIntColor(x, y);
    const targetRed = imgIn.getIntComponent0(x, y);
    const targetGreen = imgIn.getIntComponent1(x, y);
    const targetBlue = imgIn.getIntComponent2(x, y);
    const color = BoundaryFill.getAttribute("color");
    const newColor = color;

    const fillMask = MarvinJSUtils.createMatrix2D(
      imgOut.getWidth(),
      imgOut.getHeight(),
      false
    );
    fillMask[x][y] = true;

    l_list.push(new MarvinPoint(x, y));

    //for(let l_i=0; l_i<l_list.size(); l_i++){
    while (l_list.length > 0) {
      l_point = l_list.splice(0, 1)[0]; // list poll
      l_pointW = new MarvinPoint(l_point.x, l_point.y);
      l_pointE = new MarvinPoint(l_point.x, l_point.y);

      // west
      while (l_pointW.x >= 0) {
        if (
          l_pointW.x - 1 >= 0 &&
          this.match(
            imgIn,
            l_pointW.x - 1,
            l_pointW.y,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold
          ) &&
          !fillMask[l_pointW.x - 1][l_pointW.y]
        ) {
          l_pointW.x--;
        } else {
          break;
        }
      }

      // east
      while (l_pointE.x < imgIn.getWidth()) {
        if (
          l_pointE.x + 1 < imgIn.getWidth() &&
          this.match(
            imgIn,
            l_pointE.x + 1,
            l_pointE.y,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold
          ) &&
          !fillMask[l_pointE.x + 1][l_pointE.y]
        ) {
          l_pointE.x++;
        } else {
          break;
        }
      }

      // set color of pixels between pointW and pointE
      for (let l_px = l_pointW.x; l_px <= l_pointE.x; l_px++) {
        //imgOut.setIntColor(l_px, l_point.y, -1);
        //drawPixel(imgOut, l_px, l_point.y, newColor, tileImage);
        fillMask[l_px][l_point.y] = true;

        if (
          l_point.y - 1 >= 0 &&
          this.match(
            imgIn,
            l_px,
            l_point.y - 1,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold
          ) &&
          !fillMask[l_px][l_point.y - 1]
        ) {
          l_list.push(new MarvinPoint(l_px, l_point.y - 1));
        }
        if (
          l_point.y + 1 < imgOut.getHeight() &&
          this.match(
            imgIn,
            l_px,
            l_point.y + 1,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold
          ) &&
          !fillMask[l_px][l_point.y + 1]
        ) {
          l_list.push(new MarvinPoint(l_px, l_point.y + 1));
        }
      }
    }

    if (tileImage != null) {
      /* Plugin not ported yet. */
      // const p = MarvinPluginLoader.loadImagePlugin("org.marvinproject.image.texture.tileTexture.jar");
      // p.setAttribute("lines", (Math.ceil(imgOut.getHeight()/tileImage.getHeight())));
      // p.setAttribute("columns", (Math.ceil(imgOut.getWidth()/tileImage.getWidth())));
      // p.setAttribute("tile", tileImage);
      // const newMask: MarvinImageMask = new MarvinImageMask(null, null, fillMask);
      // p.process(imgOut, imgOut, null, newMask, false);
    } else {
      for (let j = 0; j < imgOut.getHeight(); j++) {
        for (let i = 0; i < imgOut.getWidth(); i++) {
          if (fillMask[i][j]) {
            imgOut.setIntColor(i, j, newColor);
          }
        }
      }
    }

    return imgOut;
  }

  match(image, x, y, targetRed, targetGreen, targetBlue, threshold) {
    const diff =
      Math.abs(image.getIntComponent0(x, y) - targetRed) +
      Math.abs(image.getIntComponent1(x, y) - targetGreen) +
      Math.abs(image.getIntComponent2(x, y) - targetBlue);
    return diff <= threshold;
  }
}
