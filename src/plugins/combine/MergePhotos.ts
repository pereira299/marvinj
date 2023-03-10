import DetermineSceneBackground from "../background/DetermineSceneBackground";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import MarvinImage from "../../image/MarvinImage";

export default class MergePhotos extends MarvinAbstractImagePlugin {
  background: DetermineSceneBackground;

  constructor() {
    super();
    this.load();
  }

  load() {
    this.background = new DetermineSceneBackground();
    this.background.load();
    MergePhotos.setAttribute("threshold", 30);
  }

  process(images: MarvinImage[], imageOut: MarvinImage) {
    if (images.length > 0) {
      const threshold = MergePhotos.getAttribute("threshold");
      DetermineSceneBackground.setAttribute("threshold", threshold);
      const backgroundImage = images[0].clone();
      this.background.process(images, backgroundImage);
      MarvinImage.copyColorArray(backgroundImage, imageOut);
      return this.mergePhotos(images, imageOut, backgroundImage, threshold);
    }
    return null;
  }

  mergePhotos(
    images: MarvinImage[],
    imageOut: MarvinImage,
    background: MarvinImage,
    threshold: number
  ) {
    for (const i in images) {
      const img = images[i];
      imageOut = this.mergePhotosSingle(img, imageOut, background, threshold);
    }
    return imageOut;
  }

  mergePhotosSingle(
    imageA: MarvinImage,
    imageB: MarvinImage,
    imageBackground: MarvinImage,
    threshold: number
  ) {
    let rA, gA, bA, rB, gB, bB;
    for (let y = 0; y < imageA.getHeight(); y++) {
      for (let x = 0; x < imageA.getWidth(); x++) {
        rA = imageA.getIntComponent0(x, y);
        gA = imageA.getIntComponent1(x, y);
        bA = imageA.getIntComponent2(x, y);
        rB = imageBackground.getIntComponent0(x, y);
        gB = imageBackground.getIntComponent1(x, y);
        bB = imageBackground.getIntComponent2(x, y);

        if (
          Math.abs(rA - rB) > threshold ||
          Math.abs(gA - gB) > threshold ||
          Math.abs(bA - bB) > threshold
        ) {
          imageB.setIntColor(x, y, 255, rA, gA, bA);
        }
      }
    }
    return imageB;
  }
}
