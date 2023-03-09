import Utils from "../../MarvinJSUtils";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Moravec extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    this.setAttribute("matrixSize", 3);
    this.setAttribute("threshold", 0);
  }

  process(imageIn, imageOut, attrOut, mask, previewMode) {
    let matrixSize = this.getAttribute("matrixSize");
    let threshold = this.getAttribute("threshold");

    let tempImage = new MarvinImage(imageIn.getWidth(), imageIn.getHeight());
    Marvin.grayScale(imageIn, tempImage);

    let cornernessMap = new Utils().createMatrix2D(
      tempImage.getWidth(),
      tempImage.getHeight(),
      0
    );
    let cornernessMapOut = new Utils().createMatrix2D(
      tempImage.getWidth(),
      tempImage.getHeight(),
      0
    );

    for (let y = 0; y < tempImage.getHeight(); y++) {
      for (let x = 0; x < tempImage.getWidth(); x++) {
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
    let s = Math.floor(matrixSize / 2);
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

  directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];

  c(x, y, matrixSize, image) {
    let ret = -1;
    let temp;
    let s = Math.floor(matrixSize / 2);
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
        if (ret == -1 || temp < ret) {
          ret = temp;
        }
      }
    }
    return ret;
  }
}
