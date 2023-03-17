import MarvinImage from "../../image/MarvinImage";
import MarvinMath from "../../math/MarvinMath";

type Color =
  | {
      r: number;
      g: number;
      b: number;
    }
  | number[]
  | number
  | string;

type ColorsMap = {
  cold: Color;
  hot: Color;
  via?: Color;
};
export default class HeatMap {
  process(imageIn: MarvinImage, colorsIn: ColorsMap, colorsOut: ColorsMap) {
    const heatMap = this.heatMap(imageIn, colorsIn);
    const imageOut = this.drawHeatMap(heatMap, imageIn, colorsOut);
    return imageOut;
  }

  heatMap(imageIn: MarvinImage, colorsIn: ColorsMap) {
    const heatMap: number[][] = [];
    const width = imageIn.getWidth();
    const height = imageIn.getHeight();
    for (let i = 0; i < width; i++) {
      heatMap[i] = [];
      for (let j = 0; j < height; j++) {
        heatMap[i][j] = MarvinMath.euclideanDistance3D(
          imageIn.getIntComponent0(i, j),
          imageIn.getIntComponent1(i, j),
          imageIn.getIntComponent2(i, j),
          colorsIn.cold[0],
          colorsIn.cold[1],
          colorsIn.cold[2]
        );
      }
    }
    return heatMap;
  }

  drawHeatMap(heatMap: number[][], imageIn: MarvinImage, colorsOut: ColorsMap) {
    const imageOut = imageIn.clone();
    const max = heatMap.reduce((acc, curr) => {
      return Math.max(acc, ...curr);
    }, 0);
    const min = heatMap.reduce((acc, curr) => {
      return Math.min(acc, ...curr);
    }, 0);
    const avg = (max + min) / 2;
    const halfLess = [
      colorsOut.via[0] - colorsOut.cold[0],
      colorsOut.via[1] - colorsOut.cold[1],
      colorsOut.via[2] - colorsOut.cold[2],
    ];
    const halfMore = [
      colorsOut.hot[0] - colorsOut.via[0],
      colorsOut.hot[1] - colorsOut.via[1],
      colorsOut.hot[2] - colorsOut.via[2],
    ];

    heatMap.forEach((row: number[], i: number) => {
      row.forEach((col: number, j: number) => {
        if (col < avg) {
          imageOut.setIntColor(
            i,
            j,
            colorsOut.cold[0] + (halfLess[0] * col) / avg,
            colorsOut.cold[1] + (halfLess[1] * col) / avg,
            colorsOut.cold[2] + (halfLess[2] * col) / avg
          );
        } else {
          imageOut.setIntColor(
            i,
            j,
            colorsOut.via[0] + (halfMore[0] * (col - avg)) / avg,
            colorsOut.via[1] + (halfMore[1] * (col - avg)) / avg,
            colorsOut.via[2] + (halfMore[2] * (col - avg)) / avg
          );
        }
      });
    });

    return imageOut;
  }
}
