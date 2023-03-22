import MarvinImage from "../../image/MarvinImage";

export default class Ellipse {
  process(image: MarvinImage, x, y, width, height, color, weight = 1) {
    image.ctx.save();
    image.ctx.beginPath();
    image.ctx.translate(x, y);
    image.ctx.scale(width / 2, height / 2);
    image.ctx.arc(0, 0, 1, 0, 2 * Math.PI);
    image.ctx.lineWidth = weight;
    image.ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    image.ctx.stroke();
    image.ctx.restore();
    image.imageData = image.ctx.getImageData(
      0,
      0,
      image.getWidth(),
      image.getHeight()
    );
    return image;
  }
}
