export default class MarvinColorModelConverter {
  static rgbToBinary(img, threshold) {
    let resultImage = new MarvinImage(
      img.getWidth(),
      img.getHeight(),
      MarvinImage.COLOR_MODEL_BINARY
    );

    for (let y = 0; y < img.getHeight(); y++) {
      for (let x = 0; x < img.getWidth(); x++) {
        let gray = Math.ceil(
          img.getIntComponent0(x, y) * 0.3 +
            img.getIntComponent1(x, y) * 0.59 +
            img.getIntComponent2(x, y) * 0.11
        );

        if (gray <= threshold) {
          resultImage.setBinaryColor(x, y, true);
        } else {
          resultImage.setBinaryColor(x, y, false);
        }
      }
    }
    return resultImage;
  }

  static binaryToRgb(img) {
    let resultImage = new MarvinImage(
      img.getWidth(),
      img.getHeight(),
      MarvinImage.COLOR_MODEL_RGB
    );

    for (let y = 0; y < img.getHeight(); y++) {
      for (let x = 0; x < img.getWidth(); x++) {
        if (img.getBinaryColor(x, y)) {
          resultImage.setIntColor(x, y, 255, 0, 0, 0);
        } else {
          resultImage.setIntColor(x, y, 255, 255, 255, 255);
        }
      }
    }
    return resultImage;
  }

  static rgbToHsv(rgbArray) {
    let hsvArray = new Array(rgbArray.length * 3);

    let red, green, blue;
    for (let i = 0; i < rgbArray.length; i++) {
      red = (rgbArray[i] & 0xff0000) >>> 16;
      green = (rgbArray[i] & 0x00ff00) >>> 8;
      blue = rgbArray[i] & 0x0000ff;

      red /= 255.0;
      green /= 255.0;
      blue /= 255.0;

      let max = Math.max(Math.max(red, green), blue);
      let min = Math.min(Math.min(red, green), blue);
      let c = max - min;

      // H
      let h, s, v;
      if (c != 0) {
        if (max == red) {
          if (green >= blue) {
            h = 60 * ((green - blue) / c);
          } else {
            h = 60 * ((green - blue) / c) + 360;
          }
        } else if (max == green) {
          h = 60 * ((blue - red) / c) + 120;
        } else {
          h = 60 * ((red - green) / c) + 240;
        }
      } else {
        h = 0;
      }

      // V
      v = max;

      // S
      s = c != 0 ? c / v : 0;

      hsvArray[i * 3] = h;
      hsvArray[i * 3 + 1] = s;
      hsvArray[i * 3 + 2] = v;
    }
    return hsvArray;
  }

  static hsvToRgb(hsvArray) {
    let rgbArray = new Array(hsvArray.length / 3);

    for (let i = 0, j = 0; i < hsvArray.length; i += 3, j++) {
      let h = hsvArray[i];
      let s = hsvArray[i + 1];
      let v = hsvArray[i + 2];

      // HSV to RGB
      let hi = Math.ceil((h / 60) % 6);
      let f = h / 60 - hi;
      let p = v * (1 - s);
      let q = v * (1 - f * s);
      let t = v * (1 - (1 - f) * s);

      let iHi = Math.ceil(hi);

      let r = 0,
        g = 0,
        b = 0;

      switch (iHi) {
        case 0:
          r = Math.ceil(v * 255);
          g = Math.ceil(t * 255);
          b = Math.ceil(p * 255);
          break;
        case 1:
          r = Math.ceil(q * 255);
          g = Math.ceil(v * 255);
          b = Math.ceil(p * 255);
          break;
        case 2:
          r = Math.ceil(p * 255);
          g = Math.ceil(v * 255);
          b = Math.ceil(t * 255);
          break;
        case 3:
          r = Math.ceil(p * 255);
          g = Math.ceil(q * 255);
          b = Math.ceil(v * 255);
          break;
        case 4:
          r = Math.ceil(t * 255);
          g = Math.ceil(p * 255);
          b = Math.ceil(v * 255);
          break;
        case 5:
          r = Math.ceil(v * 255);
          g = Math.ceil(p * 255);
          b = Math.ceil(q * 255);
          break;
      }

      rgbArray[j] = 0xff000000 + (r << 16) + (g << 8) + b;
    }

    return rgbArray;
  }
}
