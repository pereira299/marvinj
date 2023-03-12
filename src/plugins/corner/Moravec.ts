import MarvinImage from "../../image/MarvinImage";
import Utils from "../../MarvinJSUtils";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import Marvin from "../../MarvinFramework"
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinImageMask from "../../image/MarvinImageMask";

export default class Moravec extends MarvinAbstractImagePlugin {

  static directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];

  constructor() {
    super();
    this.load();
  }

  load() {
    Moravec.setAttribute("matrixSize", 3);
    Moravec.setAttribute("threshold", 0);
  }

  process(
    imageIn: MarvinImage,
    attrOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    const matrixSize = Moravec.getAttribute("matrixSize");
    const threshold = Moravec.getAttribute("threshold");

    let tempImage = new MarvinImage(imageIn.getWidth(), imageIn.getHeight());
    const marvin = new Marvin(tempImage);
    tempImage = marvin.grayScale().output();

    const cornernessMap = Utils.createMatrix2D(
      tempImage.getWidth(),
      tempImage.getHeight(),
      0
    );
    const cornernessMapOut = Utils.createMatrix2D(
      tempImage.getWidth(),
      tempImage.getHeight(),
      0
    );

    for (let y = 0; y < tempImage.getHeight(); y++) {
      for (let x = 0; x < tempImage.getWidth(); x++) {
        if(y == Math.abs(tempImage.getHeight()/2) && x == Math.abs(tempImage.getWidth()/4)){
          console.log("x: " + x + " y: " + y);
        }
        cornernessMap[x][y] = this.c(x, y, matrixSize, tempImage);

        if (cornernessMap[x][y] < threshold) {
          cornernessMap[x][y] = 0;
        }
      }
    }

    for (let x = 0; x < cornernessMap.length; x++) {
      for (let y = 0; y < cornernessMap[x].length; y++) {
        cornernessMapOut[x][y] = this.nonmax(x, y, matrixSize, cornernessMap);

        if (cornernessMapOut[x][y] > 0) {
          cornernessMapOut[x][y] = 1;
        }
      }
    }

    if (attrOut != null) {
      attrOut.set("cornernessMap", cornernessMapOut);
    }
  }

  nonmax(x, y, matrixSize, matrix) {
    const s = Math.floor(matrixSize / 2);
    if (
      x - (s + 1) >= 0 &&
      x + (s + 1) < matrix.length &&
      y - (s + 1) >= 0 &&
      y + (s + 1) < matrix[0].length
    ) {
      for (let i = -s; i <= s; i++) {
        for (let j = -s; j <= s; j++) {
          if (i != 0 || j != 0) {
            if (matrix[x][y] < matrix[x + i][y + j]) {
              return 0;
            }
          }
        }
      }
    }
    return matrix[x][y];
  }

  

  c(x, y, matrixSize, image) {
    let ret = -1;
    let temp;
    const s = Math.floor(matrixSize / 2);
    if (
      x - (s + 1) >= 0 &&
      x + (s + 1) < image.getWidth() &&
      y - (s + 1) >= 0 &&
      y + (s + 1) < image.getHeight()
    ) {
      for (let d = 0; d < Moravec.directions.length; d++) {
        temp = 0;
        for (let i = -s; i <= s; i++) {
          for (let j = -s; j <= s; j++) {
            temp += Math.pow(
              image.getIntComponent0(x + i, y + j) -
                image.getIntComponent0(
                  x + i + Moravec.directions[d][0],
                  y + j + Moravec.directions[d][1]
                ),
              2
            );
          }
        }
        if()
        if (ret == -1 || temp < ret) {
          ret = temp;
        }
      }
    }
    return ret;
  }
}
