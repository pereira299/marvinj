import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import Marvin from "../../MarvinFramework";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinJSUtils from "../../MarvinJSUtils";
import MarvinMath from "../../math/MarvinMath";

type Dot = {
  x: number;
  y: number;
};

type NeighborhoodDots = {
  ponto: Dot;
  avgDistancia: number;
  dotsComMenorDistancia: {
    top: { ponto: Dot; distancia: number };
    bottom: { ponto: Dot; distancia: number };
    left: { ponto: Dot; distancia: number };
    right: { ponto: Dot; distancia: number };
  };
};

export default class RemoveBackground {
  process2(imageIn: MarvinImage, threshold: number, previewMode: boolean) {
    let imageOut = imageIn.clone();
    // deep copy of imageIn
    const img_original = new MarvinImage(
      imageIn.getWidth(),
      imageIn.getHeight()
    );
    img_original.loadFromImage(imageIn);
    const marvin = new Marvin(imageOut);
    console.time("moravec");
    const matrix: Dot[] = this.findDots(imageIn, threshold);
    console.timeEnd("moravec");
    const int = 1;
    const sanitizedMatrix = [...matrix];
    let avgGlobal = 0;

    console.time("sanitized");
    const dotsNearest: NeighborhoodDots[] = this.findNearPixels(
      sanitizedMatrix
    ).sort((a, b) => {
      return a.avgDistancia - b.avgDistancia;
    });
    console.timeEnd("sanitized");

    // this.drawBorder(dotsNearest, imageIn);
    avgGlobal =
      dotsNearest.reduce((acc, curr) => acc + curr.avgDistancia, 0) /
      dotsNearest.length;

    console.time("heatmap");
    const { imageOut: imageOutHeartMap, heartMap } = this.heatMap(
      dotsNearest,
      imageIn,
      avgGlobal,
      10
    );
    imageOut = imageOutHeartMap;
    console.timeEnd("heatmap");
    if (previewMode) {
      console.time("draw");
      imageOut = this.drawHeatMap(
        heartMap,
        imageOut,
        sanitizedMatrix.length,
        avgGlobal
      );
      console.timeEnd("draw");
      new Marvin(imageOut).save("output/preview.png");
    }

    console.time("remove");
    imageOut = this.removeBg(img_original, heartMap);
    console.timeEnd("remove");
    return imageOut;
  }

  process(imageIn: MarvinImage, threshold: number, previewMode: boolean) {
    const imageOut = imageIn.clone();
    const corners = this.getCorners(imageIn, threshold);
    return this.removeDots(corners, imageOut);
  }
  heatMap(
    cornernessMap: NeighborhoodDots[],
    imageIn: MarvinImage,
    avgGlobal: number,
    range = 15
  ) {
    const imageOut = imageIn.clone();
    const heartMap = MarvinJSUtils.createMatrix2D(
      imageIn.getWidth(),
      imageIn.getHeight(),
      0
    );
    const maxDist = Math.floor(avgGlobal) * 4;
    cornernessMap.forEach((coord, i) => {
      let startX = coord.ponto.x - range;
      let endX = coord.ponto.x + range;
      let startY = coord.ponto.y - range;
      let endY = coord.ponto.y + range;
      if (startX < 0) startX = 0;
      if (endX > imageIn.getWidth()) endX = imageIn.getWidth();
      if (startY < 0) startY = 0;
      if (endY > imageIn.getHeight()) endY = imageIn.getHeight();
      for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
          // check if dot has a neighbor in direction of pixel
          if (coord.ponto.x > x && !coord.dotsComMenorDistancia.left) continue;
          if (coord.ponto.x < x && !coord.dotsComMenorDistancia.right) continue;
          if (coord.ponto.y > y && !coord.dotsComMenorDistancia.top) continue;
          if (coord.ponto.y < y && !coord.dotsComMenorDistancia.bottom)
            continue;

          const pxDist = MarvinMath.euclideanDistance2D(
            coord.ponto.x,
            coord.ponto.y,
            x,
            y
          );
          heartMap[x][y] += pxDist > maxDist ? 0 : maxDist - Math.ceil(pxDist);
        }
      }
    });
    return {
      imageOut,
      heartMap,
    };
  }

  async drawBorder(dots: NeighborhoodDots[], imageIn: MarvinImage) {
    const imageOut = imageIn.clone();
    let marvin = new Marvin(imageOut);
    const matrix = Array.from({ length: imageIn.getWidth() }, () =>
      Array(imageIn.getHeight())
    );

    dots.forEach((dot) => {
      matrix[dot.ponto.x][dot.ponto.y] = dot;
    });

    const startX = matrix.findIndex((row) =>
      row.some((col) => col !== undefined)
    );
    const endX =
      matrix.length -
      matrix
        .reverse()
        .findIndex((row) => row.some((col) => col !== undefined)) -
      1;

    for (let x = startX; x < endX; x++) {
      const startY = matrix[x].find((col) => col !== undefined);
      const endY = matrix[x].reverse().find((col) => col !== undefined);
      if (!startY) continue;

      marvin = marvin.drawLine(
        startY.dotsComMenorDistancia.top?.ponto.x || startY.ponto.x,
        startY.dotsComMenorDistancia.top?.ponto.y || startY.ponto.y,
        startY.dotsComMenorDistancia.bottom?.ponto.x || startY.ponto.x,
        startY.dotsComMenorDistancia.bottom?.ponto.y || startY.ponto.y,
        "#ff0000"
      );

      // if (endY.dotsComMenorDistancia.top) {
      //   marvin = marvin.drawLine(
      //     endY.ponto.x,
      //     endY.ponto.y,
      //     endY.dotsComMenorDistancia.top.ponto.x,
      //     endY.dotsComMenorDistancia.top.ponto.y,
      //     "#ff0000"
      //   );
      // } else {
      //   marvin = marvin.drawLine(
      //     endY.ponto.x,
      //     endY.ponto.y,
      //     endY.dotsComMenorDistancia.bottom.ponto.x,
      //     endY.dotsComMenorDistancia.bottom.ponto.y,
      //     "#ff0000"
      //   );
      // }
    }

    marvin.save("output/border.png");
  }

  drawHeatMap(
    heatMap: number[][],
    imageIn: MarvinImage,
    dotsSize = 1,
    avgGlobal = 0
  ) {
    const imageOut = imageIn.clone();
    const max = heatMap.reduce((acc, curr) => {
      return Math.max(acc, ...curr);
    }, 0);
    const min = heatMap.reduce((acc, curr) => {
      return Math.min(acc, ...curr);
    }, 0);
    const avg = (max + min) / 2;

    heatMap.forEach((row: number[], i: number) => {
      row.forEach((col: number, j: number) => {
        if (col < avg) {
          // gradient between blue and yellow
          imageOut.setIntColor(i, j, col, col, avg - col);
        } else {
          // gradient between yellow and red
          imageOut.setIntColor(i, j, col, max - col, 0);
        }
      });
    });

    return imageOut;
  }

  findDots(imageIn: MarvinImage, threshold: number) {
    const marvin = new Marvin(imageIn);
    const matrix: Dot[] = [];
    const emboss = marvin
      .grayScale()
      .gaussianBlur(5)
      .sobel(1)
      .thresholding(1)
      .invertColors()
      .output();

    for (let x = 0; x < emboss.getWidth(); x++) {
      for (let y = 0; y < emboss.getHeight(); y++) {
        const pixel = [
          emboss.getIntComponent0(x, y),
          emboss.getIntComponent1(x, y),
          emboss.getIntComponent2(x, y),
        ];
        const distWhite = MarvinMath.euclideanDistance3D(
          pixel[0],
          pixel[1],
          pixel[2],
          255,
          255,
          255
        );
        if (distWhite > threshold) {
          const last = matrix.at(-1);
          const dist = last
            ? MarvinMath.euclideanDistance2D(last.x, last.y, x, y)
            : 10;
          if (last && (dist < 5 || dist > 50)) continue;
          matrix.push({ x, y });
        }
      }
    }
    console.log(matrix.length);
    return matrix;
  }

  removeBg(imageIn: MarvinImage, heatMap: number[][]) {
    const imageOut = imageIn.clone();
    const max = heatMap.reduce((acc, curr) => {
      return Math.max(acc, ...curr);
    }, 0);
    const min = heatMap.reduce((acc, curr) => {
      return Math.min(acc, ...curr);
    }, 0);
    const avg = (max + min) / 2;
    const unid = (max - min) / 255;
    heatMap.forEach((row: number[], i: number) => {
      row.forEach((col: number, j: number) => {
        if (col < avg / 2) {
          imageOut.setAlphaComponent(i, j, 0);
        } else if (col < avg) {
          imageOut.setAlphaComponent(
            i,
            j,
            255 - Math.floor((col - avg / 2) / unid)
          );
        }
      });
    });

    return imageOut;
  }
  findNearPixels(dots) {
    const dotsNearest = [];

    for (let i = 0; i < dots.length; i++) {
      const dotsNearestCurr = {
        top: { ponto: null, distancia: Infinity },
        bottom: { ponto: null, distancia: Infinity },
        left: { ponto: null, distancia: Infinity },
        right: { ponto: null, distancia: Infinity },
      };

      for (let j = 0; j < dots.length; j++) {
        if (i === j) continue;

        const distancia = this.calcularDistanciaEuclidiana(dots[i], dots[j]);

        if (
          (dots[j].x < dots[i].x &&
            distancia < dotsNearestCurr.top?.distancia) ||
          dotsNearestCurr.top === undefined
        ) {
          dotsNearestCurr.top = {
            ponto: dots[j],
            distancia: distancia,
          };
        }

        if (
          (dots[j].x > dots[i].x &&
            distancia < dotsNearestCurr.bottom?.distancia) ||
          dotsNearestCurr.bottom === undefined
        ) {
          dotsNearestCurr.bottom = {
            ponto: dots[j],
            distancia: distancia,
          };
        }

        if (
          (dots[j].y < dots[i].y &&
            distancia < dotsNearestCurr.left?.distancia) ||
          dotsNearestCurr.left === undefined
        ) {
          dotsNearestCurr.left = {
            ponto: dots[j],
            distancia: distancia,
          };
        }

        if (
          (dots[j].y > dots[i].y &&
            distancia < dotsNearestCurr.right?.distancia) ||
          dotsNearestCurr.right === undefined
        ) {
          dotsNearestCurr.right = {
            ponto: dots[j],
            distancia: distancia,
          };
        }
      }

      const validDots = Object.values(dotsNearestCurr).filter(
        (dot) => dot.distancia !== Infinity
      );
      const avg =
        validDots.reduce((acc, curr) => acc + curr.distancia, 0) /
        validDots.length;

      if (dotsNearestCurr.top.distancia === Infinity)
        delete dotsNearestCurr.top;
      if (dotsNearestCurr.bottom.distancia === Infinity)
        delete dotsNearestCurr.bottom;
      if (dotsNearestCurr.left.distancia === Infinity)
        delete dotsNearestCurr.left;
      if (dotsNearestCurr.right.distancia === Infinity)
        delete dotsNearestCurr.right;

      dotsNearest.push({
        ponto: dots[i],
        avgDistancia: avg,
        dotsComMenorDistancia: dotsNearestCurr,
      });
    }

    return dotsNearest;
  }

  calcularDistanciaEuclidiana(dot1, dot2) {
    const diffX = dot1.x - dot2.x;
    const diffY = dot1.y - dot2.y;

    return Math.sqrt(diffX ** 2 + diffY ** 2);
  }

  getCorners(img_in: MarvinImage, matrixSize: number) {
    const width = img_in.getWidth();
    const height = img_in.getHeight();

    const cornersImage = [];

    let matrixRGB = [];
    for (let c = 0; c < 4; c++) {
      const startX = c % 2 === 0 ? 0 : width - 1 - matrixSize;
      const startY = c < 2 ? 0 : height - 1 - matrixSize;
      const endX = c % 2 === 0 ? matrixSize : width;
      const endY = c < 2 ? matrixSize : height;
      for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
          matrixRGB.push({
            r: img_in.getIntComponent0(x, y),
            g: img_in.getIntComponent1(x, y),
            b: img_in.getIntComponent2(x, y),
          });
        }
      }
      const avgRGB: { r: number; g: number; b: number } = matrixRGB.reduce(
        (acc, curr) => {
          acc.r += curr.r;
          acc.g += curr.g;
          acc.b += curr.b;
          return acc;
        },
        { r: 0, g: 0, b: 0 }
      );
      avgRGB.r /= matrixRGB.length;
      avgRGB.g /= matrixRGB.length;
      avgRGB.b /= matrixRGB.length;

      const variance = matrixRGB.reduce(
        (acc, curr) => {
          acc.r += (curr.r - avgRGB.r) ** 2;
          acc.g += (curr.g - avgRGB.g) ** 2;
          acc.b += (curr.b - avgRGB.b) ** 2;
          return acc;
        },
        { r: 0, g: 0, b: 0 }
      );
      variance.r /= matrixRGB.length;
      variance.g /= matrixRGB.length;
      variance.b /= matrixRGB.length;

      cornersImage.push(avgRGB);

      matrixRGB = [];
    }

    return cornersImage;
  }
  removeDots(corners, image) {
    const width = image.getWidth();
    const height = image.getHeight();
    const newImage = new MarvinImage(width, height);
    newImage.loadFromImage(image);
    const halfVariation = 20;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const r = image.getIntComponent0(x, y);
        const g = image.getIntComponent1(x, y);
        const b = image.getIntComponent2(x, y);
        for (let i = 0; i < corners.length; i++) {
          const diffR = Math.abs(r - corners[i].r);
          const diffG = Math.abs(g - corners[i].g);
          const diffB = Math.abs(b - corners[i].b);
          if (
            diffR < halfVariation &&
            diffG < halfVariation &&
            diffB < halfVariation
          ) {
            newImage.setIntColor(x, y, 0, 0, 0, 0);
            break;
          }
        }
      }
    }
    return newImage;
  }
}
