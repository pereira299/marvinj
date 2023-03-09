import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class ThresholdingNeighborhood extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    ThresholdingNeighborhood.setAttribute("neighborhoodSide", 10);
    ThresholdingNeighborhood.setAttribute("samplingPixelDistance", 1);
    ThresholdingNeighborhood.setAttribute("thresholdPercentageOfAverage", 1.0);
  }

  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    const neighborhoodSide = ThresholdingNeighborhood.getAttribute("neighborhoodSide");
    const samplingPixelDistance = ThresholdingNeighborhood.getAttribute("samplingPixelDistance");
    const thresholdPercentageOfAverage = ThresholdingNeighborhood.getAttribute(
      "thresholdPercentageOfAverage"
    );

    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        this.theshold(
          imageIn,
          imageOut,
          x,
          y,
          thresholdPercentageOfAverage,
          neighborhoodSide,
          samplingPixelDistance
        );
      }
    }
  }

  theshold(
    image,
    imageOut,
    x,
    y,
    thresholdPercentageOfAverage,
    side,
    neighborhoodDistance
  ) {
    let min = -1;
    let max = -1;
    let pixels = 0;
    let average = 0;

    const inc = neighborhoodDistance;

    for (let j = y - side / 2; j < y + (inc + side / 2); j += inc) {
      for (let i = x - side / 2; i < x + side / 2; i += inc) {
        if (i >= 0 && j >= 0 && i < image.getWidth() && j < image.getHeight()) {
          const color = image.getIntComponent0(i, j);

          if (min == -1 || color < min) {
            min = color;
          }
          if (max == -1 || color > max) {
            max = color;
          }

          average += color;
          pixels++;
        }
      }
    }

    average /= pixels;

    const color = image.getIntComponent0(x, y);

    if (color < average * thresholdPercentageOfAverage || max - min <= 30) {
      imageOut.setIntColor(x, y, 255, 0, 0, 0);
    } else {
      imageOut.setIntColor(x, y, 255, 255, 255, 255);
    }
  }
}
