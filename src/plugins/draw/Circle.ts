import MarvinImage from "../../image/MarvinImage";

export default class Circle {


    process(image: MarvinImage, x, y, radius, color, weight = 1) {
        image.ctx.beginPath();
        image.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        image.ctx.lineWidth = weight;
        image.ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        image.ctx.stroke();
        image.imageData = image.ctx.getImageData(0, 0, image.getWidth(), image.getHeight());
        return image;
    }
}