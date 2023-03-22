import MarvinColorModelConverter from "../../color/MarvinColorModelConverter";
import MarvinImage from "../../image/MarvinImage";

export default class Star {
  process(image: MarvinImage, x, y, count, radius, color, weight = 1) {
    // draw a star at x,y with count points of corners and radius
    const angle = Math.PI / count;
    let coordX, coordY;

    const [r,b,g] = MarvinColorModelConverter.hexToRgb(color);
    image.ctx.beginPath();
    image.ctx.moveTo(x + Math.cos(0) * radius, y + Math.sin(0) *  radius);
    for (let i = 0; i < count * 2; i++) {
        const r = i % 2 == 0 ? radius : radius / 2;
        coordX = x + Math.cos(i * angle) * r;
        coordY = y + Math.sin(i * angle) * r;
        image.ctx.lineTo(coordX, coordY);
    }
    image.ctx.closePath();
    image.ctx.lineWidth = weight;
    image.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    image.ctx.stroke();
    image.imageData = image.ctx.getImageData(
      0,
      0,
      image.getWidth(),
      image.getHeight()
    );
    return image;
  }
}
