import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class DetermineSceneBackground extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    DetermineSceneBackground.setAttribute("threshold", 30);
  }

  process(images, imageOut) {
    const threshold = DetermineSceneBackground.getAttribute("threshold");
    const image0 = images[0];
    for (let y = 0; y < image0.getHeight(); y++) {
      for (let x = 0; x < image0.getWidth(); x++) {
        imageOut.setIntColor(
          x,
          y,
          this.getBackgroundPixel(x, y, images, threshold)
        );
      }
    }
  }

  getBackgroundPixel(x, y, images, threshold) {
    const colors: number[][] = [];
    for (const i in images) {
      const img = images[i];
      const c = new Array(4);
      c[0] = img.getIntComponent0(x, y);
      c[1] = img.getIntComponent1(x, y);
      c[2] = img.getIntComponent2(x, y);
      c[3] = 0;

      if (colors.length == 0) {
        colors.push(c);
      } else {
        let found = false;
        for (const j in colors) {
          const c2 = colors[j];
          if (
            Math.abs(c2[0] - c[0]) < threshold * 0.3 &&
            Math.abs(c2[1] - c[1]) < threshold * 0.3 &&
            Math.abs(c2[2] - c[2]) < threshold * 0.3
          ) {
            c2[0] = Math.floor((c2[0] + c[0]) / 2);
            c2[1] = Math.floor((c2[1] + c[1]) / 2);
            c2[2] = Math.floor((c2[2] + c[2]) / 2);
            c2[3]++;
            found = true;
            break;
          }
        }

        if (!found) {
          colors.push(c);
        }
      }
    }

    let max = -1;
    let maxIndex = 0;
    let c2: number[];
    for (let i = 0; i < colors.length; i++) {
      c2 = colors[i];
      if (max == -1 || c2[3] > max) {
        max = c2[3];
        maxIndex = i;
      }
    }
    c2 = colors[maxIndex];
    return 0xff000000 + (c2[0] << 16) + (c2[1] << 8) + c2[2];
  }
}
