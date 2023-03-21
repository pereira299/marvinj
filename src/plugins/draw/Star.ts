import MarvinImage from "../../image/MarvinImage";

export default class Star {

    process(image: MarvinImage, x, y, count, radius, color, weight = 1) {
        // draw a star at x,y with count points of corners and radius
        image.ctx.beginPath();
        image.ctx.moveTo(x, y - radius);
        for (let i = 0; i < count; i++) {
            image.ctx.rotate(Math.PI / count);
            image.ctx.lineTo(x, y - radius);
            image.ctx.rotate(Math.PI / count);
            image.ctx.lineTo(x, y);
        }
        image.ctx.lineWidth = weight;
        image.ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        image.ctx.stroke();
        image.imageData = image.ctx.getImageData(0, 0, image.getWidth(), image.getHeight());
        return image;
    }

}