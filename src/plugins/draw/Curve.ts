import MarvinColorModelConverter from "../../color/MarvinColorModelConverter";
import MarvinImage from "../../image/MarvinImage";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Curve extends MarvinAbstractImagePlugin {
  process(imageIn: MarvinImage) {
    const x1 = Curve.getAttribute("x1");
    const y1 = Curve.getAttribute("y1");
    const x2 = Curve.getAttribute("x2");
    const y2 = Curve.getAttribute("y2");
    const type = Curve.getAttribute("type");
    const dot1 = Curve.getAttribute("dot1");
    const dot2 = Curve.getAttribute("dot2");
    const radius = Curve.getAttribute("radius");
    const color = Curve.getAttribute("color");
    const weight = Curve.getAttribute("weight");
    const degStart = Curve.getAttribute("degStart");
    const degEnd = Curve.getAttribute("degEnd");

    const imageOut = imageIn.clone();

    const [r, g, b] = MarvinColorModelConverter.hexToRgb(color);
    switch (type) {
      case "regular":
        return this.drawRegularCurve(
          x1,
          y1,
          radius,
          degStart,
          degEnd,
          { r, g, b },
          weight,
          imageOut
        );
      case "quadratic":
        return this.drawQuadradicCurve(
          x1,
          y1,
          x2,
          y2,
          dot1,
          { r, g, b },
          weight,
          imageOut
        );
      case "cubic":
        return this.drawCubicCurve(
          x1,
          y1,
          x2,
          y2,
          dot1,
          dot2,
          { r, g, b },
          weight,
          imageOut
        );
      default:
        console.error("Type is required");
        return imageOut;
    }
  }

  drawRegularCurve(
    x1: number,
    y1: number,
    radius: number,
    degStart: number,
    degEnd: number,
    color: { r: number; g: number; b: number },
    weight: number,
    imageOut: MarvinImage
  ) {
    // Generate a regular curve that goes from x1, y1 to x2, y2 with a radius of radius
    imageOut.ctx.beginPath();
    imageOut.ctx.arc(x1, y1, radius, degStart, degEnd);
    imageOut.ctx.lineWidth = weight;
    imageOut.ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    imageOut.ctx.stroke();
    imageOut.imageData = imageOut.ctx.getImageData(
      0,
      0,
      imageOut.getWidth(),
      imageOut.getHeight()
    );
    return imageOut;
  }

  drawQuadradicCurve(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dot: { x: number; y: number },
    color: { r: number; g: number; b: number },
    weight: number,
    imageOut: MarvinImage
  ) {
    // Generate a quadradic curve that goes from x1, y1 to x2, y2 with a control point at dot
    imageOut.ctx.beginPath();
    imageOut.ctx.moveTo(x1, y1);
    imageOut.ctx.quadraticCurveTo(dot.x, dot.y, x2, y2);
    imageOut.ctx.lineWidth = weight;
    imageOut.ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    imageOut.ctx.stroke();
    imageOut.imageData = imageOut.ctx.getImageData(
      0,
      0,
      imageOut.getWidth(),
      imageOut.getHeight()
    );
    return imageOut;
  }

  drawCubicCurve(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dot1: { x: number; y: number },
    dot2: { x: number; y: number },
    color: { r: number; g: number; b: number },
    weight: number,
    imageOut: MarvinImage
  ) {
    // Generate a cubic curve that goes from x1, y1 to x2, y2 with control points at dot1 and dot2
    imageOut.ctx.beginPath();
    imageOut.ctx.moveTo(x1, y1);
    imageOut.ctx.bezierCurveTo(dot1.x, dot1.y, dot2.x, dot2.y, x2, y2);
    imageOut.ctx.lineWidth = weight;
    imageOut.ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    imageOut.ctx.stroke();
    imageOut.imageData = imageOut.ctx.getImageData(
      0,
      0,
      imageOut.getWidth(),
      imageOut.getHeight()
    );
    return imageOut;
  }

  drawCurve(
    curve: { x: number; y: number }[],
    color: { r: number; g: number; b: number },
    weight: number,
    imageOut: MarvinImage
  ) {
    const { weightIn, weightOut } = this.weightCalc(weight);
    const width = imageOut.getWidth();
    const height = imageOut.getHeight();
    // Draw the curve on the image
    for (let i = 0; i < curve.length; i++) {
      const x = Math.floor(curve[i].x);
      const y = Math.floor(curve[i].y);
      for (let i = weightIn; i < weightOut; i++) {
        const nx = x + i;
        if (nx < 0 || nx >= width) continue;
        for (let j = weightIn; j < weightOut; j++) {
          const ny = y + j;

          if (ny >= 0 && ny < height) {
            //set timer to check performance and save in sum array
            imageOut.setIntColor4(nx, ny, 255, color.r, color.g, color.b);
          }
        }
      }
    }

    //calculate average time
    return imageOut;
  }

  weightCalc(weight: number) {
    const weightIn = weight % 2 ? weight / 2 - 1 : weight / 2;
    const weightOut = weight % 2 ? weight / 2 : weight / 2;
    return {
      weightIn: Math.floor(weightIn) * -1,
      weightOut: Math.floor(weightOut),
    };
  }
}
