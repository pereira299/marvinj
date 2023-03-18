import MarvinImage from "../../image/MarvinImage";

export default class Posterization {
  process(imageIn: MarvinImage, levels: number) {
    const imageOut = imageIn.clone();
    const width = imageIn.getWidth();
    const height = imageIn.getHeight();
    const step = 255 / levels;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const r = Math.round(imageIn.getIntComponent0(i, j) / step) * step;
        const g = Math.round(imageIn.getIntComponent1(i, j) / step) * step;
        const b = Math.round(imageIn.getIntComponent2(i, j) / step) * step;
        imageOut.setIntColor(i, j, r, g, b);
      }
    }
    return imageOut;
  }
}
