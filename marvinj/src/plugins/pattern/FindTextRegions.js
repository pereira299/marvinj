import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class FindTextRegions extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load = function () {
    this.setAttribute("maxWhiteSpace", 10);
    this.setAttribute("maxFontLineWidth", 10);
    this.setAttribute("minTextWidth", 30);
    this.setAttribute("grayScaleThreshold", 127);
  };

  process = function (imageIn, imageOut, attrOut, mask, previewMode) {
    // The image will be affected so it's generated a new instance
    imageIn = imageIn.clone();

    let maxWhiteSpace = this.getAttribute("maxWhiteSpace");
    let maxFontLineWidth = this.getAttribute("maxFontLineWidth");
    let minTextWidth = this.getAttribute("minTextWidth");
    let grayScaleThreshold = this.getAttribute("grayScaleThreshold");

    Marvin.thresholding(imageIn, imageIn, grayScaleThreshold);

    let segments = [];
    for (let i = 0; i < imageIn.getHeight(); i++) {
      segments.push([]);
    }

    // map of already processed pixels

    let processed = MarvinJSUtils.createMatrix2D(
      imageIn.getWidth(),
      imageIn.getHeight,
      false
    );

    let color;
    let patternStartX = -1;
    let patternLength = 0;
    let whitePixels = 0;
    let blackPixels = 0;
    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        if (!processed[x][y]) {
          color = imageIn.getIntColor(x, y);

          if (color == 0xffffffff && patternStartX != -1) {
            whitePixels++;
            blackPixels = 0;
          }

          if (color == 0xff000000) {
            blackPixels++;

            if (patternStartX == -1) {
              patternStartX = x;
            }

            whitePixels = 0;
          }

          // check white and black pattern maximum lenghts
          if (
            whitePixels > maxWhiteSpace ||
            blackPixels > maxFontLineWidth ||
            x == imageIn.getWidth() - 1
          ) {
            if (patternLength >= minTextWidth) {
              let list = segments[y];
              list.push([patternStartX, y, patternStartX + patternLength, y]);
            }

            whitePixels = 0;
            blackPixels = 0;
            patternLength = 0;
            patternStartX = -1;
          }

          if (patternStartX != -1) {
            patternLength++;
          }

          processed[x][y] = true;
        }
      }
    }

    // Group line patterns intersecting in x coordinate and too near in y coordinate.
    for (let y = 0; y < imageIn.getHeight() - 2; y++) {
      let listY = segments[y];

      for (let w = y + 1; w <= y + 2; w++) {
        let listW = segments[w];

        for (let i = 0; i < listY.length; i++) {
          let sA = listY[i];
          for (let j = 0; j < listW.length; j++) {
            let sB = listW[j];

            // horizontal intersection
            if (
              (sA[0] <= sB[0] && sA[2] >= sB[2]) ||
              (sA[0] >= sB[0] && sA[0] <= sB[2]) ||
              (sA[2] >= sB[0] && sA[2] <= sB[2])
            ) {
              sA[0] = Math.min(sA[0], sB[0]);
              sA[2] = Math.max(sA[2], sB[2]);
              sA[3] = sB[3];

              listY.splice(i, 1);
              i--;

              listW.splice(j, 1);
              listW.push(sA);

              break;
            }
          }
        }
      }
    }

    // Convert the result to a List<> of MarvinSegment objects.
    let marvinSegments = [];
    for (let y = 0; y < imageIn.getHeight(); y++) {
      let list = segments[y];
      for (let i in list) {
        let seg = list[i];
        marvinSegments.push(new MarvinSegment(seg[0], seg[1], seg[2], seg[3]));
      }
    }

    attrOut.set("matches", marvinSegments);
  };
}
