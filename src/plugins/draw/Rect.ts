import MarvinColorModelConverter from "../../color/MarvinColorModelConverter";
import MarvinImage from "../../image/MarvinImage";
import Marvin from "../../MarvinFramework";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Rect extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    Rect.setAttribute("x", 0);
    Rect.setAttribute("y", 0);
    Rect.setAttribute("width", 0);
    Rect.setAttribute("height", 0);
    Rect.setAttribute("color", 0);
  }

  process(imageIn: MarvinImage) {
    const x = Rect.getAttribute("x");
    const y = Rect.getAttribute("y");
    const width = Rect.getAttribute("width");
    const height = Rect.getAttribute("height");
    const color = Rect.getAttribute("color");
    const weight = Rect.getAttribute("weight");

    const imageOut = imageIn.clone();
    if (!color) {
      console.error("Color is required");
      return imageOut;
    }
    if (!x || !y || !width || !height) {
      console.error("Coordinates are required");
      return imageOut;
    }
    if (x < 0 || y < 0 || width < 0 || height < 0) {
      console.error("Coordinates must be positive");
      return imageOut;
    }
    if (
      x > imageIn.getWidth() ||
      y > imageIn.getHeight() ||
      width > imageIn.getWidth() ||
      height > imageIn.getHeight()
    ) {
      console.error("Coordinates must be inside the image");
      return imageOut;
    }

    const halfWeight = Math.floor(weight / 2);
    const marvin = new Marvin(imageIn)
      .drawLine(Math.max(x-halfWeight, 0), y, Math.min(x + width + halfWeight, imageIn.getWidth()), y, {color, weight})
      .drawLine(x, y, x, y + height, {color, weight})
      .drawLine(x + width, y, x + width, y + height, {color, weight})
      .drawLine(Math.max(x-halfWeight, 0), y + height, Math.min(x + width + halfWeight, imageIn.getWidth()), y + height, {color, weight});
    return marvin.output();
  }
}
