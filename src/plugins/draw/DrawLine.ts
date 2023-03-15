import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class DrawLine extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    DrawLine.setAttribute("x1", 0);
    DrawLine.setAttribute("y1", 0);
    DrawLine.setAttribute("x2", 0);
    DrawLine.setAttribute("y2", 0);
    DrawLine.setAttribute("color", 0);
  }

  process(imageIn) {
    const x1 = DrawLine.getAttribute("x1");
    const y1 = DrawLine.getAttribute("y1");
    const x2 = DrawLine.getAttribute("x2");
    const y2 = DrawLine.getAttribute("y2");
    const color = DrawLine.getAttribute("color");
    const weight = DrawLine.getAttribute("weight");

    const imageOut = imageIn.clone();
    if(!color) {
        console.error('Color is required');
        return imageOut;
    }
    if(!x1 || !y1 || !x2 || !y2) {
        console.error('Coordinates are required');
        return imageOut;
    }
    if(x1 < 0 || y1 < 0 || x2 < 0 || y2 < 0) {
        console.error('Coordinates must be positive');
        return imageOut;
    }
    if(x1 > imageIn.getWidth() || y1 > imageIn.getHeight() || x2 > imageIn.getWidth() || y2 > imageIn.getHeight()) {
        console.error('Coordinates must be inside the image');
        return imageOut;
    }
    const colorRGB = this.hexToRgb(color);
    this.drawLine(x1, y1, x2, y2, colorRGB, weight, imageOut);

    return imageOut;
  }

  hexToRgb(hex) {
    let charStep = 1;
    if (hex.length > 4) {
      charStep = 2;
    }
    const rgba = [];
    for (let i = 0; i < hex.length; i += charStep) {
      rgba.push(parseInt(hex.substr(i, charStep), 16));
    }
    return {
      r: rgba[0],
      g: rgba[1],
      b: rgba[2],
      a: rgba[3] || 255,
    };
  }

  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color,
    weight = 1,
    imageOut
  ) {
    const diffY = y2 - y1;
    const diffX = x2 - x1;

    switch (true) {
      case diffX == 0:
        this.drawHorizontalLine(x1, y1, y2, color, weight, imageOut);
        break;
      case diffY == 0:
        this.drawVerticalLine(y1, x1, x2, color, weight, imageOut);
        break;
      default:
        this.drawDiagonalLine(x1, y1, x2, y2, color, weight, imageOut);
    }
  }

  weightCalc(weight) {
    let weightIn = 0;
    let weightOut = 1;
    if (weight <= 1) {
      weightIn = 0;
      weightOut = 1;
    } else if (weight % 2) {
      weightIn = (weight * -1) / 2;
      weightOut = weight / 2 - 1;
    } else {
      weightIn = (weight * -1) / 2;
      weightOut = weight / 2;
    }
    return { weightIn, weightOut };
  }

  drawVerticalLine(y: number, x1: number, x2: number, color, weight, imageOut) {
    const { weightIn, weightOut } = this.weightCalc(weight);
    for (let x = x1; x != x2; x++) {
      for (let i = weightIn; i < weightOut; i++) {
        imageOut.setIntColor(x, y + i, color.r, color.g, color.b, color.a);
      }
    }
    return imageOut;
  }

  drawHorizontalLine(
    x: number,
    y1: number,
    y2: number,
    color,
    weight,
    imageOut
  ) {
    const { weightIn, weightOut } = this.weightCalc(weight);
    for (let y = y1; y != y2; y++) {
        for (let i = weightIn; i < weightOut; i++) {
            imageOut.setIntColor(x + i, y, color.r, color.g, color.b, color.a);
        }
    }
    return imageOut;
  }

  drawDiagonalLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color,
    weight,
    imageOut
  ) {
    const diffY = y2 - y1;
    const diffX = x2 - x1;
    const m = diffY / diffX; // slope of the line
    const b = y1 - m * x1; // y-intercept
    const { weightIn, weightOut } = this.weightCalc(weight);
    for (let x = x1; x != x2; x++) {
      const y = m * x + b; // y = mx + b
        for (let i = weightIn; i < weightOut; i++) {
            imageOut.setIntColor(x + i, y + i, color.r, color.g, color.b, color.a);
        }
    }
    return imageOut;
  }
}
