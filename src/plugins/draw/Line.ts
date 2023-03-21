import MarvinColorModelConverter from "../../color/MarvinColorModelConverter";
import MarvinImage from "../../image/MarvinImage";
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
    if (!color) {
      console.error("Color is required");
      return imageOut;
    }
    if (!x1 || !y1 || !x2 || !y2) {
      console.error("Coordinates are required");
      return imageOut;
    }
    if (x1 < 0 || y1 < 0 || x2 < 0 || y2 < 0) {
      console.error("Coordinates must be positive");
      return imageOut;
    }
    if (
      x1 > imageIn.getWidth() ||
      y1 > imageIn.getHeight() ||
      x2 > imageIn.getWidth() ||
      y2 > imageIn.getHeight()
    ) {
      console.error("Coordinates must be inside the image");
      return imageOut;
    }
    const [r, g, b] = MarvinColorModelConverter.hexToRgb(color);
    const colorRGB = { r, g, b, a: 255 };
    imageOut.ctx.beginPath();
    imageOut.ctx.moveTo(x1, y1);
    imageOut.ctx.lineTo(x2, y2);
    imageOut.ctx.lineWidth = weight;  
    imageOut.ctx.strokeStyle = `rgb(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b})`;
    imageOut.ctx.stroke();
    imageOut.imageData = imageOut.ctx.getImageData(0, 0, imageOut.getWidth(), imageOut.getHeight());
    return imageOut;
  }
}
