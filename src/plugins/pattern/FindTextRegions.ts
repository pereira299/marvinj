import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import MarvinJSUtils from "../../MarvinJSUtils";
import Marvin from "../../MarvinFramework";
import MarvinSegment from "../../image/MarvinSegment";
import MarvinImage from "../../image/MarvinImage";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinImageMask from "../../image/MarvinImageMask";

export default class FindTextRegions extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    FindTextRegions.setAttribute("maxWhiteSpace", 10);
    FindTextRegions.setAttribute("maxFontLineWidth", 10);
    FindTextRegions.setAttribute("minTextWidth", 30);
    FindTextRegions.setAttribute("grayScaleThreshold", 127);
  }

  process(
    imageIn: MarvinImage,
    attrOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    // The image will be affected so it's generated a new instance
    imageIn = imageIn.clone();

    const maxWhiteSpace = FindTextRegions.getAttribute("maxWhiteSpace");
    const maxFontLineWidth = FindTextRegions.getAttribute("maxFontLineWidth");
    const minTextWidth = FindTextRegions.getAttribute("minTextWidth");
    const grayScaleThreshold =
      FindTextRegions.getAttribute("grayScaleThreshold");

    const marvin = new Marvin(imageIn);
    imageIn = marvin.thresholding(grayScaleThreshold, true).output();

    const segments = [];
    for (let i = 0; i < imageIn.getHeight(); i++) {
      segments.push([]);
    }

    // map of already processed pixels

    const processed = MarvinJSUtils.createMatrix2D(
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
              const list = segments[y];
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
      const listY = segments[y];

      for (let w = y + 1; w <= y + 2; w++) {
        const listW = segments[w];

        for (let i = 0; i < listY.length; i++) {
          const sA = listY[i];
          for (let j = 0; j < listW.length; j++) {
            const sB = listW[j];

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
    const marvinSegments = [];
    for (let y = 0; y < imageIn.getHeight(); y++) {
      const list = segments[y];
      for (const i in list) {
        const seg = list[i];
        marvinSegments.push(new MarvinSegment(seg[0], seg[1], seg[2], seg[3]));
      }
    }

    attrOut.set("matches", marvinSegments);
  }
}
