import MarvinImage from "../../image/MarvinImage";

export default class Polygon {

    process(image: MarvinImage, sides, width, height, radius, color, weight = 1) {
        image.ctx.beginPath();
        image.ctx.moveTo(width, height);
        for (let i = 1; i <= sides; i++) {
            const x = width + Math.cos((i * 2 * Math.PI) / sides) * radius;
            const y = height + Math.sin((i * 2 * Math.PI) / sides) * radius;
            image.ctx.lineTo(x, y);
        }
        image.ctx.lineWidth = weight;
        image.ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        image.ctx.stroke();
        image.imageData = image.ctx.getImageData(0, 0, image.getWidth(), image.getHeight());
        return image;
    }
}