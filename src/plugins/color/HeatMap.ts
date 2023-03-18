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
  process(
    imageIn: MarvinImage,
    colorsIn: ColorsMap,
    colorsOut: ColorsMap,
    propagation: number
  ) {
    let heatMap = this.heatMap(imageIn, colorsIn);
    const avg =
      heatMap.reduce((acc, curr) => {
        return acc + curr.reduce((acc2, curr2) => acc2 + curr2, 0);
      }, 0) /
      (heatMap.length * heatMap[0].length);
    if (propagation) {
      heatMap = this.propagateHeatMap(heatMap, propagation, avg);
    }
    const imageOut = this.drawHeatMap(heatMap, imageIn, colorsOut, avg);
    return imageOut;
  }

  heatMap(imageIn: MarvinImage, colorsIn: ColorsMap) {
    const heatMap: number[][] = Array.from(Array(imageIn.getWidth()), () =>
      new Array(imageIn.getHeight()).fill(0)
    );
    const width = imageIn.getWidth();
    const height = imageIn.getHeight();
    for (let i = 0; i < width; i++) {
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

  propagateHeatMap(heatMap: number[][], propagation: number, average: number) {
    const width = heatMap.length;
    const height = heatMap[0].length;
    const newHeatMap = Array.from(Array(width), () =>
      new Array(height).fill(0)
    );
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let sum = 0;
        let count = 0;
        for (let k = -propagation; k <= propagation; k++) {
          for (let l = -propagation; l <= propagation; l++) {
            if (i + k >= 0 && i + k < width && j + l >= 0 && j + l < height) {
              sum += heatMap[i + k][j + l];
              count++;
            }
          }
        }
        newHeatMap[i][j] = sum / count;
      }
    }
    return newHeatMap;
  }

  drawHeatMap(
    heatMap: number[][],
    imageIn: MarvinImage,
    colorsOut: ColorsMap,
    avg: number
  ) {
    const imageOut = imageIn.clone();

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
