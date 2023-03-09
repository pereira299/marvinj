import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class MergePhotos extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    this.background = new DetermineSceneBackground();
    this.background.load();
    this.setAttribute("threshold", 30);
  }

  process(images, imageOut) {
    if (images.length > 0) {
      let threshold = this.getAttribute("threshold");
      this.background.setAttribute("threshold", threshold);
      let backgroundImage = images[0].clone();
      this.background.process(images, backgroundImage);
      MarvinImage.copyColorArray(backgroundImage, imageOut);
      this.mergePhotos(images, imageOut, backgroundImage, threshold);
    }
  }

  mergePhotos(images, imageOut, background, threshold) {
    for (let i in images) {
      let img = images[i];
      this.mergePhotosSingle(img, imageOut, background, threshold);
    }
  }

  mergePhotosSingle(imageA, imageB, imageBackground, threshold) {
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
  }
}
