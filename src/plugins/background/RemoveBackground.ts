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
  process(
    imageIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    let imageOut = imageIn.clone();
    // deep copy of imageIn
    const img_original = new MarvinImage(imageIn.getWidth(), imageIn.getHeight());
    img_original.loadFromImage(imageIn);
    const marvin = new Marvin(imageOut);
    console.time("moravec");
    const matrix: Dot[] = marvin.moravec(3, 5000);
    console.timeEnd("moravec");
    const int = 1;
    const sanitizedMatrix = [...matrix];
    let avgGlobal = 0;

    const dotsNearest:NeighborhoodDots[] = this.findNearPixels(sanitizedMatrix).sort((a, b) => {
      return a.avgDistancia - b.avgDistancia;
    });

    avgGlobal =
      dotsNearest.reduce((acc, curr) => acc + curr.avgDistancia, 0) /
      dotsNearest.length;
    
    console.time("heatmap");
    const { imageOut: imageOutHeartMap, heartMap } = this.heatMap(
      dotsNearest,
      imageIn,
      avgGlobal, 10
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
    imageOut = this.removeBg(
        img_original,
        heartMap,
    );
    console.timeEnd("remove");
    return imageOut;
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
}
