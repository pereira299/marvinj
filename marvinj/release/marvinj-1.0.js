export class MarvinColorModelConverter {
  constructor() {}

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

export class MarvinImage {
  COLOR_MODEL_RGB = 0;
  COLOR_MODEL_BINARY = 1;

  constructor(width, height, colorModel) {
    // properties
    this.image = null;
    this.canvas = null;
    this.ctx = null;
    this.data = null;

    if (colorModel == null) {
      this.colorModel = this.COLOR_MODEL_RGB;
    } else {
      this.colorModel = colorModel;
    }

    if (width != null) {
      this.create(width, height);
    }

    if (colorModel == this.COLOR_MODEL_BINARY) {
      this.arrBinaryColor = new Array(width * height);
    }
  }

  create(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.imageData = this.ctx.getImageData(0, 0, width, height);
    this.width = width;
    this.height = height;
  }

  setDimension(width, height) {
    this.create(width, height);
  }

  load(url, callback) {
    this.onload = callback;
    this.image = new Image();
    let ref = this;
    this.image.onload = () => {
      ref.callbackImageLoaded(ref);
    };
    this.image.crossOrigin = "anonymous";
    this.image.src = url;
  }

  // WARN: the callback "this" object is the reference to js Image object.
  callbackImageLoaded(marvinImage) {
    marvinImage.width = marvinImage.image.width;
    marvinImage.height = marvinImage.image.height;
    marvinImage.canvas = document.createElement("canvas");
    marvinImage.canvas.width = marvinImage.image.width;
    marvinImage.canvas.height = marvinImage.image.height;

    marvinImage.ctx = marvinImage.canvas.getContext("2d");
    marvinImage.ctx.drawImage(marvinImage.image, 0, 0);

    this.imageData = marvinImage.ctx.getImageData(
      0,
      0,
      marvinImage.getWidth(),
      marvinImage.getHeight()
    );

    if (marvinImage.onload != null) {
      marvinImage.onload();
    }
  }

  clone() {
    let image = new MarvinImage(
      this.getWidth(),
      this.getHeight(),
      this.colorModel
    );
    MarvinImage.copyColorArray(this, image);
    return image;
  }

  update(color) {
    this.canvas.getContext("2d").putImageData(this.imageData, 0, 0);
  }

  clear(color) {
    for (let y = 0; y < this.getHeight(); y++) {
      for (let x = 0; x < this.getWidth(); x++) {
        this.setIntColor(x, y, color);
      }
    }
  }

  getColorModel() {
    return this.colorModel;
  }

  getAlphaComponent(x, y) {
    let start = (y * this.getWidth() + x) * 4;
    return this.imageData.data[start + 3];
  }

  setAlphaComponent(x, y, alpha) {
    let start = (y * this.getWidth() + x) * 4;
    this.imageData.data[start + 3] = alpha;
  }

  getIntComponent0(x, y) {
    let start = (y * this.getWidth() + x) * 4;
    return this.imageData.data[start];
  }

  getIntComponent1(x, y) {
    let start = (y * this.getWidth() + x) * 4;
    return this.imageData.data[start + 1];
  }

  getIntComponent2(x, y) {
    let start = (y * this.getWidth() + x) * 4;
    return this.imageData.data[start + 2];
  }

  setIntColor(x, y, a1, a2, a3, a4) {
    if (a2 == null) {
      this.setIntColor1(x, y, a1);
    } else if (a3 == null && a4 == null) {
      this.setIntColor2(x, y, a1, a2);
    } else if (a4 == null) {
      this.setIntColor3(x, y, a1, a2, a3);
    } else {
      this.setIntColor4(x, y, a1, a2, a3, a4);
    }
  }

  getIntColor(x, y) {
    let start = (y * this.getWidth() + x) * 4;

    return (
      0x100000000 +
      (this.imageData.data[start + 3] << 24) +
      (this.imageData.data[start] << 16) +
      (this.imageData.data[start + 1] << 8) +
      this.imageData.data[start + 2]
    );
  }

  setIntColor1(x, y, color) {
    let a = (color & 0xff000000) >>> 24;
    let r = (color & 0x00ff0000) >> 16;
    let g = (color & 0x0000ff00) >> 8;
    let b = color & 0x000000ff;
    this.setIntColor4(x, y, a, r, g, b);
  }

  setBinaryColor(x, y, value) {
    let pos = y * this.getWidth() + x;
    this.arrBinaryColor[pos] = value;
  }

  getBinaryColor(x, y) {
    let pos = y * this.getWidth() + x;
    return this.arrBinaryColor[pos];
  }

  copyColorArray(imgSource, imgDestine) {
    if (imgSource.getColorModel() == imgDestine.getColorModel()) {
      switch (imgSource.getColorModel()) {
        case MarvinImage.COLOR_MODEL_RGB:
          for (let i = 0; i < imgSource.imageData.data.length; i++) {
            imgDestine.imageData.data[i] = imgSource.imageData.data[i];
          }
          break;
        case MarvinImage.COLOR_MODEL_BINARY:
          for (let i = 0; i < imgSource.arrBinaryColor.length; i++) {
            imgDestine.arrBinaryColor[i] = imgSource.arrBinaryColor[i];
          }
          break;
      }
    }
  }

  drawRect(x, y, width, height, color) {
    for (let i = x; i < x + width; i++) {
      this.setIntColor(i, y, color);
      this.setIntColor(i, y + (height - 1), color);
    }

    for (let i = y; i < y + height; i++) {
      this.setIntColor(x, i, color);
      this.setIntColor(x + (width - 1), i, color);
    }
  }

  fillRect(x, y, width, height, color) {
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        if (i < this.getWidth() && j < this.getHeight()) {
          this.setIntColor(i, j, color);
        }
      }
    }
  }

  setColorToAlpha(color, alpha) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if ((this.getIntColor(x, y) & 0x00ffffff) == (color & 0x00ffffff)) {
          this.setAlphaComponent(x, y, alpha);
        }
      }
    }
  }

  setAlphaToColor(color) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.getAlphaComponent(x, y) == 0) {
          this.setIntColor(x, y, 0xffffffff);
        }
      }
    }
  }

  setIntColor2(x, y, alpha, color) {
    let r = (color & 0x00ff0000) >> 16;
    let g = (color & 0x0000ff00) >> 8;
    let b = color & 0x000000ff;
    this.setIntColor4(x, y, alpha, r, g, b);
  }

  setIntColor3(x, y, r, g, b) {
    this.setIntColor4(x, y, 255, r, g, b);
  }

  setIntColor4(x, y, alpha, r, g, b) {
    let start = (y * this.getWidth() + x) * 4;
    this.imageData.data[start] = r;
    this.imageData.data[start + 1] = g;
    this.imageData.data[start + 2] = b;
    this.imageData.data[start + 3] = alpha;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  isValidPosition(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return true;
    }
    return false;
  }

  draw(canvas, x, y, alphaCombination) {
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    canvas.getContext("2d").putImageData(this.imageData, x, y); /*
		if(alphaCombination == null || !alphaCombination){
			canvas.getContext("2d").putImageData(this.imageData, x,y);
		} else{
			this.imageData = this.ctx.getImageData(0, 0, width, height);
			let c = document.createElement('canvas');
			c.width = this.width;
			c.height = this.height;
			c.getContext('2d').putImageData(this.imageData,x,y); 
			let img = new Image();
			img.src = c.toDataURL();
			canvas.getContext("2d").drawImage(img, x, y);
		}*/
  }

  toBlob() {
    this.update();
    return this.dataURItoBlob(this.canvas.toDataURL("image/png"));
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }
}

export class MarvinImageMask {
  NULL_MASK = this.createNullMask();

  constructor(w, h) {
    this.width = w;
    this.height = h;

    if (w != 0 && h != 0) {
      this.arrMask = MarvinJSUtils.createMatrix2D(width, height);
    } else {
      this.arrMask = null;
    }
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  addPixel(x, y) {
    this.arrMask[x][y] = true;
  }

  removePixel(x, y) {
    this.arrMask[x][y] = false;
  }

  clear() {
    if (this.arrMask != null) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          this.arrMask[x][y] = false;
        }
      }
    }
  }

  getMask() {
    return this.arrMask;
  }

  addRectRegion(startX, startY, regionWidth, regionHeight) {
    for (let x = startX; x < startX + regionWidth; x++) {
      for (let y = startY; y < startY + regionHeight; y++) {
        this.arrMask[x][y] = true;
      }
    }
  }

  createNullMask() {
    return new MarvinImageMask(0, 0);
  }
}

export class MarvinSegment {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;

    if (x1 != -1 && y1 != -1 && x2 != -1 && y2 != -1) {
      this.width = x2 - x1 + 1;
      this.height = y2 - y1 + 1;
      this.area = this.width * this.height;
    }
  }

  segmentMinDistance(segments, minDistance) {
    let s1, s2;
    const math = new MarvinMath();
    for (let i = 0; i < segments.size() - 1; i++) {
      for (let j = i + 1; j < segments.size(); j++) {
        s1 = segments[i];
        s2 = segments[j];

        if (
          math.euclidianDistance(
            (s1.x1 + s1.x2) / 2,
            (s1.y1 + s1.y2) / 2,
            (s2.x1 + s2.x2) / 2,
            (s2.y1 + s2.y2) / 2
          ) < minDistance
        ) {
          segments.splice(j, 1);
          j--;
        }
      }
    }
  }
}

export class MarvinColor {
  constructor(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    return this;
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}

export class MarvinJSUtils {
  constructor() {}

  static createMatrix2D(rows, cols, value) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(cols);
      arr[i].fill(value);
    }
    return arr;
  }

  static createMatrix3D(rows, cols, depth, value) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(cols);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = new Array(depth);
        arr[i][j].fill(value);
      }
    }
    return arr;
  }

  static createMatrix4D(rows, cols, depth, another, value) {
    let arr = new Array(rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(cols);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = new Array(depth);
        for (let w = 0; w < arr[i][j].length; w++) {
          arr[i][j][w] = new Array(another);
          arr[i][j][w].fill(value);
        }
      }
    }
    return arr;
  }
}

export class MarvinMath {
  constructor() {}

  static getTrueMatrix(rows, cols) {
    let ret = MarvinJSUtils.createMatrix2D(rows, cols);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ret[i][j] = true;
      }
    }
    return ret;
  }

  static scaleMatrix(matrix, scale) {
    let ret = MarvinJSUtils.createMatrix2D(matrix.length, matrix.length);

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        ret[i][j] = matrix[i][j] * scale;
      }
    }
    return ret;
  }

  static euclideanDistance(p1, p2, p3, p4, p5, p6) {
    if (p6 != null) {
      return this.euclideanDistance3D(p1, p2, p3, p4, p5, p6);
    } else {
      return this.euclideanDistance3D(p1, p2, p3, p4);
    }
  }

  static euclideanDistance2D(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static euclideanDistance3D(x1, y1, z1, x2, y2, z2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    let dz = z1 - z2;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

export class DetermineFixedCameraBackground extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    this.initialized = false;
  }

  initialize(imageIn) {
    this.weights = this.weights = MarvinJSUtils.createMatrix4D(
      imageIn.getWidth(),
      imageIn.getHeight(),
      3,
      26,
      0
    );
    initialized = true;
  }

  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    if (!this.initialized) {
      this.initialize(imageIn);
    }

    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        let red = imageIn.getIntComponent0(x, y);
        let green = imageIn.getIntComponent1(x, y);
        let blue = imageIn.getIntComponent2(x, y);

        weights[x][y][0][red / 10]++;
        weights[x][y][1][green / 10]++;
        weights[x][y][2][blue / 10]++;

        imageOut.setIntColor(
          x,
          y,
          255,
          this.getProbableColor(weights[x][y][0]),
          this.getProbableColor(weights[x][y][1]),
          this.getProbableColor(weights[x][y][2])
        );
      }
    }
  }

  getProbableColor(arr) {
    let max = -1;
    let maxIndex = 0;

    for (let i = 0; i < arr.length; i++) {
      if (max == -1 || arr[i] > max) {
        max = arr[i];
        maxIndex = i;
      }
    }

    return maxIndex * 10;
  }
}

export class DetermineSceneBackground extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    this.setAttribute("threshold", 30);
  }

  process(images, imageOut) {
    let threshold = this.getAttribute("threshold");
    let image0 = images[0];
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
    let colors = new Array();
    for (let i in images) {
      let img = images[i];
      let c = new Array(4);
      c[0] = img.getIntComponent0(x, y);
      c[1] = img.getIntComponent1(x, y);
      c[2] = img.getIntComponent2(x, y);
      c[3] = 0;

      if (colors.length == 0) {
        colors.push(c);
      } else {
        let found = false;
        for (let j in colors) {
          let c2 = colors[j];
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
    let c2 = null;
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

export class GaussianBlur extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    this.RED = 0;
    this.GREEN = 1;
    this.BLUE = 2;

    this.kernelMatrix = null;
    this.resultMatrix = null;
    this.appiledkernelMatrix = null;
    this.radius = null;

    this.setAttribute("radius", 3);
  }

  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    this.radius = this.getAttribute("radius");

    let l_imageWidth = imageIn.getWidth();
    let l_imageHeight = imageIn.getHeight();

    let l_pixelColor;
    this.kernelMatrix = this.getGaussianKernel();
    this.resultMatrix = MarvinJSUtils.createMatrix3D(
      l_imageWidth,
      l_imageHeight,
      3,
      0
    );
    this.appiledkernelMatrix = MarvinJSUtils.createMatrix2D(
      l_imageWidth,
      l_imageHeight,
      0
    );

    let l_arrMask = mask.getMask();

    for (let x = 0; x < l_imageWidth; x++) {
      for (let y = 0; y < l_imageHeight; y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }
        l_pixelColor = imageIn.getIntColor(x, y);
        this.applyKernel(x, y, l_pixelColor, imageOut);
      }
    }

    for (let x = 0; x < l_imageWidth; x++) {
      for (let y = 0; y < l_imageHeight; y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }
        this.resultMatrix[x][y][this.RED] =
          (this.resultMatrix[x][y][0] / this.appiledkernelMatrix[x][y]) % 256;
        this.resultMatrix[x][y][this.GREEN] =
          (this.resultMatrix[x][y][1] / this.appiledkernelMatrix[x][y]) % 256;
        this.resultMatrix[x][y][this.BLUE] =
          (this.resultMatrix[x][y][2] / this.appiledkernelMatrix[x][y]) % 256;
        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          Math.floor(this.resultMatrix[x][y][0]),
          Math.floor(this.resultMatrix[x][y][1]),
          Math.floor(this.resultMatrix[x][y][2])
        );
      }
    }
  }

  /*
   * Calc Gaussian Matrix.
   */
  getGaussianKernel() {
    let l_matrix = MarvinJSUtils.createMatrix2D(
      this.radius * 2 + 1,
      this.radius * 2 + 1
    );
    let l_q = this.radius / 3.0;
    let l_distance;
    let l_x;
    let l_y;

    for (let x = 1; x <= this.radius * 2 + 1; x++) {
      for (let y = 1; y <= this.radius * 2 + 1; y++) {
        l_x = Math.abs(x - (this.radius + 1));
        l_y = Math.abs(y - (this.radius + 1));
        l_distance = Math.sqrt(l_x * l_x + l_y * l_y);
        l_matrix[y - 1][x - 1] =
          (1.0 / (2.0 * Math.PI * l_q * l_q)) *
          Math.exp(-(l_distance * l_distance) / (2.0 * l_q * l_q));
      }
    }
    return l_matrix;
  }

  /*
   * Apply the blur matrix on a image region.
   */
  applyKernel(centerPixel_X, centerPixel_Y, pixelColor, image) {
    for (let y = centerPixel_Y; y < centerPixel_Y + this.radius * 2; y++) {
      for (let x = centerPixel_X; x < centerPixel_X + this.radius * 2; x++) {
        if (
          x - this.radius >= 0 &&
          x - this.radius < image.getWidth() &&
          y - this.radius >= 0 &&
          y - this.radius < image.getHeight()
        ) {
          this.resultMatrix[x - this.radius][y - this.radius][this.RED] +=
            ((pixelColor & 0x00ff0000) >>> 16) *
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y];
          this.resultMatrix[x - this.radius][y - this.radius][this.GREEN] +=
            ((pixelColor & 0x0000ff00) >>> 8) *
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y];
          this.resultMatrix[x - this.radius][y - this.radius][this.BLUE] +=
            (pixelColor & 0x000000ff) *
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y];
          this.appiledkernelMatrix[x - this.radius][y - this.radius] +=
            this.kernelMatrix[x - centerPixel_X][y - centerPixel_Y];
        }
      }
    }
  }
}

export class AlphaBoundary extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("radius", 5);
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let neighborhood = this.getAttribute("radius");
    for (let y = 0; y < imageOut.getHeight(); y++) {
      for (let x = 0; x < imageOut.getWidth(); x++) {
        this.alphaRadius(imageOut, x, y, neighborhood);
      }
    }
  }
  alphaRadius(image, x, y, radius) {
    let oldAlpha = image.getAlphaComponent(x, y);
    let newAlpha;
    let totalAlpha = 0;
    let totalPixels = 0;
    let hn = Math.floor(radius / 2);

    for (let j = y - hn; j < y + hn; j++) {
      for (let i = x - hn; i < x + hn; i++) {
        if (i >= 0 && i < image.getWidth() && j >= 0 && j < image.getHeight()) {
          totalAlpha += image.getAlphaComponent(i, j);
          totalPixels++;
        }
      }
    }

    newAlpha = Math.floor(totalAlpha / totalPixels);

    if (newAlpha < oldAlpha) image.setAlphaComponent(x, y, newAlpha);
  }
}

export class AverageColor extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }
  load() {}
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;

    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        totalR += imageIn.getIntComponent0(x, y);
        totalG += imageIn.getIntComponent1(x, y);
        totalB += imageIn.getIntComponent2(x, y);
      }
    }

    let totalPixels = imageIn.getWidth() * imageIn.getHeight();
    totalR = Math.round(totalR / totalPixels);
    totalG = Math.round(totalG / totalPixels);
    totalB = Math.round(totalB / totalPixels);

    if (attributesOut != null) {
      attributesOut.set("averageColor", [totalR, totalG, totalB]);
    }
  }
}

export class BlackAndWhite extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.MAX_RLEVEL = 0.03;
    this.load();
  }
  load() {
    this.grayScale = new GrayScale();
    this.setAttribute("level", 10);
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    this.grayScale.process(imageIn, imageOut);
    let level = this.getAttribute("level");
    let rlevel = (level / 100.0) * this.MAX_RLEVEL;

    let c = 0;
    let gray;
    for (let y = 0; y < imageOut.getHeight(); y++) {
      for (let x = 0; x < imageOut.getWidth(); x++) {
        gray = imageIn.getIntComponent0(x, y);

        if (gray <= 127) {
          gray = Math.max(gray * (1 - (127 - gray) * rlevel), 0);
        } else {
          gray = Math.min(gray * (1 + (gray - 127) * rlevel), 255);
        }

        if (c++ < 1) {
          console.log("gray:" + gray);
          console.log("level:" + level);
          console.log("rlevel:" + rlevel);
        }

        imageOut.setIntColor(
          x,
          y,
          255,
          Math.floor(gray),
          Math.floor(gray),
          Math.floor(gray)
        );
      }
    }
  }
}

export class BrightnessAndContrast extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load() {
    // Attributes
    this.setAttribute("brightness", 0);
    this.setAttribute("contrast", 0);
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let r, g, b;
    let l_brightness = this.getAttribute("brightness");
    let l_contrast = this.getAttribute("contrast");
    l_contrast = Math.pow((127 + l_contrast) / 127, 2);

    // Brightness
    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        r = imageIn.getIntComponent0(x, y);
        g = imageIn.getIntComponent1(x, y);
        b = imageIn.getIntComponent2(x, y);

        r += (1 - r / 255) * l_brightness;
        g += (1 - g / 255) * l_brightness;
        b += (1 - b / 255) * l_brightness;
        if (r < 0) r = 0;
        if (r > 255) r = 255;
        if (g < 0) g = 0;
        if (g > 255) g = 255;
        if (b < 0) b = 0;
        if (b > 255) b = 255;

        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          Math.floor(r),
          Math.floor(g),
          Math.floor(b)
        );
      }
    }

    // Contrast
    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        r = imageOut.getIntComponent0(x, y);
        g = imageOut.getIntComponent1(x, y);
        b = imageOut.getIntComponent2(x, y);

        r /= 255.0;
        r -= 0.5;
        r *= l_contrast;
        r += 0.5;
        r *= 255.0;

        g /= 255.0;
        g -= 0.5;
        g *= l_contrast;
        g += 0.5;
        g *= 255.0;

        b /= 255.0;
        b -= 0.5;
        b *= l_contrast;
        b += 0.5;
        b *= 255.0;

        if (r < 0) r = 0;
        if (r > 255) r = 255;
        if (g < 0) g = 0;
        if (g > 255) g = 255;
        if (b < 0) b = 0;
        if (b > 255) b = 255;

        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          Math.floor(r),
          Math.floor(g),
          Math.floor(b)
        );
      }
    }
  }
}
export class ColorChannel extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("red", 0);
    this.setAttribute("green", 0);
    this.setAttribute("blue", 0);
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let vr = this.getAttribute("red");
    let vg = this.getAttribute("green");
    let vb = this.getAttribute("blue");

    let mr = 1 + Math.abs((vr / 100.0) * 2.5);
    let mg = 1 + Math.abs((vg / 100.0) * 2.5);
    let mb = 1 + Math.abs((vb / 100.0) * 2.5);

    mr = vr > 0 ? mr : 1.0 / mr;
    mg = vg > 0 ? mg : 1.0 / mg;
    mb = vb > 0 ? mb : 1.0 / mb;

    let red, green, blue;
    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        red = imageIn.getIntComponent0(x, y);
        green = imageIn.getIntComponent1(x, y);
        blue = imageIn.getIntComponent2(x, y);

        red = Math.min(red * mr, 255);
        green = Math.min(green * mg, 255);
        blue = Math.min(blue * mb, 255);

        imageOut.setIntColor(x, y, 255, red, green, blue);
      }
    }
  }
}

export class Emboss extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }
  load() {}
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let l_arrMask = mask.getMask();

    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          imageOut.setIntColor(x, y, 255, imageIn.getIntColor(x, y));
          continue;
        }

        let rDiff = 0;
        let gDiff = 0;
        let bDiff = 0;

        if (y > 0 && x > 0) {
          // Red component difference between the current and the upperleft pixels
          rDiff =
            imageIn.getIntComponent0(x, y) -
            imageIn.getIntComponent0(x - 1, y - 1);

          // Green component difference between the current and the upperleft pixels
          gDiff =
            imageIn.getIntComponent1(x, y) -
            imageIn.getIntComponent1(x - 1, y - 1);

          // Blue component difference between the current and the upperleft pixels
          bDiff =
            imageIn.getIntComponent2(x, y) -
            imageIn.getIntComponent2(x - 1, y - 1);
        } else {
          rDiff = 0;
          gDiff = 0;
          bDiff = 0;
        }

        let diff = rDiff;
        if (Math.abs(gDiff) > Math.abs(diff)) diff = gDiff;
        if (Math.abs(bDiff) > Math.abs(diff)) diff = bDiff;

        let grayLevel = Math.max(Math.min(128 + diff, 255), 0);

        imageOut.setIntColor(x, y, 255, grayLevel, grayLevel, grayLevel);
      }
    }
  }
}
export class GrayScale {
  constructor() {
    super();
    this.load();
  }
  load() {}
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    // Mask
    let l_arrMask;
    if (mask != null) {
      l_arrMask = mask.getMask();
    }

    let r, g, b, finalColor;
    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }
        //Red - 30% / Green - 59% / Blue - 11%
        r = imageIn.getIntComponent0(x, y);
        g = imageIn.getIntComponent1(x, y);
        b = imageIn.getIntComponent2(x, y);
        finalColor = Math.ceil(r * 0.3 + g * 0.59 + b * 0.11);
        imageOut.setIntColor(
          x,
          y,
          imageIn.getAlphaComponent(x, y),
          finalColor,
          finalColor,
          finalColor
        );
      }
    }
  }
}
export class Invert {
  constructor() {
    super();
    this.load();
  }
  load() {}
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let l_arrMask = mask.getMask();

    let r, g, b;
    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }
        r = 255 - imageIn.getIntComponent0(x, y);
        g = 255 - imageIn.getIntComponent1(x, y);
        b = 255 - imageIn.getIntComponent2(x, y);

        imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), r, g, b);
      }
    }
  }
}
export class Sepia {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("txtValue", "20");
    this.setAttribute("intensity", 20);
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let r, g, b, depth, corfinal;

    //Define a intensidade do filtro...
    depth = this.getAttribute("intensity");

    let width = imageIn.getWidth();
    let height = imageIn.getHeight();

    let l_arrMask = mask.getMask();

    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }
        //Captura o RGB do ponto...
        r = imageIn.getIntComponent0(x, y);
        g = imageIn.getIntComponent1(x, y);
        b = imageIn.getIntComponent2(x, y);

        //Define a cor como a m�dia aritm�tica do pixel...
        corfinal = (r + g + b) / 3;
        r = g = b = corfinal;

        r = this.truncate(r + depth * 2);
        g = this.truncate(g + depth);

        //Define a nova cor do ponto...
        imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), r, g, b);
      }
    }
  }

  /**
   * Sets the RGB between 0 and 255
   * @param a
   * @param a
   * @return
   */ truncate(a) {
    if (a < 0) return 0;
    else if (a > 255) return 255;
    else return a;
  }
}
export class Thresholding {
  constructor() {
    super();
    this.load();

    this.threshold = null;
    this.thresholdRange = null;
    this.neighborhood = null;
    this.range = null;
  }
  load() {
    // Attributes
    this.setAttribute("threshold", 125);
    this.setAttribute("thresholdRange", -1);
    this.setAttribute("neighborhood", -1);
    this.setAttribute("range", -1);

    this.pluginGray = new GrayScale();
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    this.threshold = this.getAttribute("threshold");
    this.thresholdRange = this.getAttribute("thresholdRange");
    this.neighborhood = this.getAttribute("neighborhood");
    this.range = this.getAttribute("range");

    if (this.thresholdRange == -1) {
      this.thresholdRange = 255 - threshold;
    }

    this.pluginGray.process(
      imageIn,
      imageOut,
      attributesOut,
      mask,
      previewMode
    );

    let bmask = mask.getMask();

    if (this.neighborhood == -1 && this.range == -1) {
      this.hardThreshold(imageIn, imageOut, bmask);
    } else {
      this.contrastThreshold(imageIn, imageOut);
    }
  }
  hardThreshold(imageIn, imageOut, mask) {
    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        if (mask != null && !mask[x][y]) {
          continue;
        }

        let gray = imageIn.getIntComponent0(x, y);
        if (
          gray < this.threshold ||
          gray > this.threshold + this.thresholdRange
        ) {
          imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), 0, 0, 0);
        } else {
          imageOut.setIntColor(
            x,
            y,
            imageIn.getAlphaComponent(x, y),
            255,
            255,
            255
          );
        }
      }
    }
  }
  contrastThreshold(imageIn, imageOut) {
    this.range = 1;
    for (let x = 0; x < imageIn.getWidth(); x++) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        if (checkNeighbors(x, y, neighborhood, neighborhood, imageIn)) {
          imageOut.setIntColor(x, y, 0, 0, 0);
        } else {
          imageOut.setIntColor(x, y, 255, 255, 255);
        }
      }
    }
  }
  checkNeighbors(x, y, neighborhoodX, neighborhoodY, img) {
    let color;
    let z = 0;

    color = img.getIntComponent0(x, y);

    for (let i = 0 - neighborhoodX; i <= neighborhoodX; i++) {
      for (let j = 0 - neighborhoodY; j <= neighborhoodY; j++) {
        if (i == 0 && j == 0) {
          continue;
        }

        if (
          color < getSafeColor(x + i, y + j, img) - range &&
          getSafeColor(x + i, y + j, img) != -1
        ) {
          z++;
        }
      }
    }

    if (z > neighborhoodX * neighborhoodY * 0.5) {
      return true;
    }

    return false;
  }
  getSafeColor(x, y, img) {
    if (x >= 0 && x < img.getWidth() && y >= 0 && y < img.getHeight()) {
      return img.getIntComponent0(x, y);
    }
    return -1;
  }
}
export class ThresholdingNeighborhood {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("neighborhoodSide", 10);
    this.setAttribute("samplingPixelDistance", 1);
    this.setAttribute("thresholdPercentageOfAverage", 1.0);
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let neighborhoodSide = this.getAttribute("neighborhoodSide");
    let samplingPixelDistance = this.getAttribute("samplingPixelDistance");
    let thresholdPercentageOfAverage = this.getAttribute(
      "thresholdPercentageOfAverage"
    );

    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        this.theshold(
          imageIn,
          imageOut,
          x,
          y,
          thresholdPercentageOfAverage,
          neighborhoodSide,
          samplingPixelDistance
        );
      }
    }
  }
  theshold(
    image,
    imageOut,
    x,
    y,
    thresholdPercentageOfAverage,
    side,
    neighborhoodDistance
  ) {
    let min = -1;
    let max = -1;
    let pixels = 0;
    let average = 0;

    let inc = neighborhoodDistance;

    for (let j = y - side / 2; j < y + (inc + side / 2); j += inc) {
      for (let i = x - side / 2; i < x + side / 2; i += inc) {
        if (i >= 0 && j >= 0 && i < image.getWidth() && j < image.getHeight()) {
          let color = image.getIntComponent0(i, j);

          if (min == -1 || color < min) {
            min = color;
          }
          if (max == -1 || color > max) {
            max = color;
          }

          average += color;
          pixels++;
        }
      }
    }

    average /= pixels;

    let color = image.getIntComponent0(x, y);

    if (color < average * thresholdPercentageOfAverage || max - min <= 30) {
      imageOut.setIntColor(x, y, 255, 0, 0, 0);
    } else {
      imageOut.setIntColor(x, y, 255, 255, 255, 255);
    }
  }
}
export class CombineByAlpha {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("x", 0);
    this.setAttribute("y", 0);
    this.setAttribute("imageOther", null);
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let imageOther = this.getAttribute("imageOther");
    let x = this.getAttribute("x");
    let y = this.getAttribute("y");

    if (imageOther != null) {
      for (let j = 0; j < imageIn.getHeight(); j++) {
        for (let i = 0; i < imageIn.getWidth(); i++) {
          let ox = i - x;
          let oy = j - y;

          if (
            ox >= 0 &&
            ox < imageOther.getWidth() &&
            oy >= 0 &&
            oy < imageOther.getHeight()
          ) {
            let alpha = imageOther.getAlphaComponent(ox, oy);
            if (alpha != 0) {
              let factor = alpha / 255;

              let rA = imageIn.getIntComponent0(i, j);
              let gA = imageIn.getIntComponent1(i, j);
              let bA = imageIn.getIntComponent2(i, j);

              let rB = imageOther.getIntComponent0(ox, oy);
              let gB = imageOther.getIntComponent1(ox, oy);
              let bB = imageOther.getIntComponent2(ox, oy);

              let red = Math.floor(rA * (1 - factor) + rB * factor);
              let green = Math.floor(gA * (1 - factor) + gB * factor);
              let blue = Math.floor(bA * (1 - factor) + bB * factor);

              imageOut.setIntColor(
                i,
                j,
                Math.max(imageIn.getAlphaComponent(x, y), alpha),
                red,
                green,
                blue
              );
            } else {
              imageOut.setIntColor(i, j, imageIn.getIntColor(i, j));
            }
          } else {
            imageOut.setIntColor(i, j, imageIn.getIntColor(i, j));
          }
        }
      }
    }
  }
}
export class MergePhotos {
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
export class Convolution {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("matrix", null);
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let matrix = this.getAttribute("matrix");

    if (matrix != null && matrix.length > 0) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        for (let x = 0; x < imageIn.getWidth(); x++) {
          if (
            y >= matrix.length / 2 &&
            y < imageIn.getHeight() - matrix.length / 2 &&
            x >= matrix[0].length / 2 &&
            x < imageIn.getWidth() - matrix[0].length / 2
          ) {
            this.applyMatrix(x, y, matrix, imageIn, imageOut);
          } else {
            imageOut.setIntColor(x, y, 0xff000000);
          }
        }
      }
    }
  }
  applyMatrix(x, y, matrix, imageIn, imageOut) {
    let nx, ny;
    let resultRed = 0;
    let resultGreen = 0;
    let resultBlue = 0;

    let xC = Math.ceil(matrix[0].length / 2);
    let yC = Math.ceil(matrix.length / 2);

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        if (matrix[i][j] != 0) {
          nx = x + (j - xC);
          ny = y + (i - yC);

          if (
            nx >= 0 &&
            nx < imageOut.getWidth() &&
            ny >= 0 &&
            ny < imageOut.getHeight()
          ) {
            resultRed += matrix[i][j] * imageIn.getIntComponent0(nx, ny);
            resultGreen += matrix[i][j] * imageIn.getIntComponent1(nx, ny);
            resultBlue += matrix[i][j] * imageIn.getIntComponent2(nx, ny);
          }
        }
      }
    }

    resultRed = Math.abs(resultRed);
    resultGreen = Math.abs(resultGreen);
    resultBlue = Math.abs(resultBlue);

    // allow the combination of multiple applications
    resultRed += imageOut.getIntComponent0(x, y);
    resultGreen += imageOut.getIntComponent1(x, y);
    resultBlue += imageOut.getIntComponent2(x, y);

    resultRed = Math.min(resultRed, 255);
    resultGreen = Math.min(resultGreen, 255);
    resultBlue = Math.min(resultBlue, 255);

    resultRed = Math.max(resultRed, 0);
    resultGreen = Math.max(resultGreen, 0);
    resultBlue = Math.max(resultBlue, 0);

    imageOut.setIntColor(
      x,
      y,
      imageIn.getAlphaComponent(x, y),
      Math.floor(resultRed),
      Math.floor(resultGreen),
      Math.floor(resultBlue)
    );
  }
}
export class Moravec {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("matrixSize", 3);
    this.setAttribute("threshold", 0);
  }
  process(imageIn, imageOut, attrOut, mask, previewMode) {
    let matrixSize = this.getAttribute("matrixSize");
    let threshold = this.getAttribute("threshold");

    let tempImage = new MarvinImage(imageIn.getWidth(), imageIn.getHeight());
    Marvin.grayScale(imageIn, tempImage);

    let cornernessMap = MarvinJSUtils.createMatrix2D(
      tempImage.getWidth(),
      tempImage.getHeight(),
      0
    );
    let cornernessMapOut = MarvinJSUtils.createMatrix2D(
      tempImage.getWidth(),
      tempImage.getHeight(),
      0
    );

    for (let y = 0; y < tempImage.getHeight(); y++) {
      for (let x = 0; x < tempImage.getWidth(); x++) {
        cornernessMap[x][y] = this.c(x, y, matrixSize, tempImage);

        if (cornernessMap[x][y] < threshold) {
          cornernessMap[x][y] = 0;
        }
      }
    }

    for (let x = 0; x < cornernessMap.length; x++) {
      for (let y = 0; y < cornernessMap[x].length; y++) {
        cornernessMapOut[x][y] = this.nonmax(x, y, matrixSize, cornernessMap);

        if (cornernessMapOut[x][y] > 0) {
          cornernessMapOut[x][y] = 1;
        }
      }
    }

    if (attrOut != null) {
      attrOut.set("cornernessMap", cornernessMapOut);
    }
  }
  nonmax(x, y, matrixSize, matrix) {
    let s = Math.floor(matrixSize / 2);
    if (
      x - (s + 1) >= 0 &&
      x + (s + 1) < matrix.length &&
      y - (s + 1) >= 0 &&
      y + (s + 1) < matrix[0].length
    ) {
      for (let i = -s; i <= s; i++) {
        for (let j = -s; j <= s; j++) {
          if (i != 0 || j != 0) {
            if (matrix[x][y] < matrix[x + i][y + j]) {
              return 0;
            }
          }
        }
      }
    }
    return matrix[x][y];
  }

  directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  c(x, y, matrixSize, image) {
    let ret = -1;
    let temp;
    let s = Math.floor(matrixSize / 2);
    if (
      x - (s + 1) >= 0 &&
      x + (s + 1) < image.getWidth() &&
      y - (s + 1) >= 0 &&
      y + (s + 1) < image.getHeight()
    ) {
      for (let d = 0; d < Moravec.directions.length; d++) {
        temp = 0;
        for (let i = -s; i <= s; i++) {
          for (let j = -s; j <= s; j++) {
            temp += Math.pow(
              image.getIntComponent0(x + i, y + j) -
                image.getIntComponent0(
                  x + i + Moravec.directions[d][0],
                  y + j + Moravec.directions[d][1]
                ),
              2
            );
          }
        }
        if (ret == -1 || temp < ret) {
          ret = temp;
        }
      }
    }
    return ret;
  }

  /**
   * @author Gabriel Ambr�sio Archanjo
   */
}
export class Prewitt {
  constructor() {
    super();

    // Definitions
    this.matrixPrewittX = [
      [1, 0, -1],
      [1, 0, -1],
      [1, 0, -1],
    ];

    this.matrixPrewittY = [
      [1, 1, 1],
      [0, 0, 0],
      [-1, -1, -1],
    ];

    this.load();
  }
  load() {
    this.convolution = new Convolution();
    this.setAttribute("intensity", 1.0);
  }
  process(imageIn, imageOut, attrOut, mask, previewMode) {
    let intensity = this.getAttribute("intensity");

    if (intensity == 1) {
      this.convolution.setAttribute("matrix", this.matrixPrewittX);
      this.convolution.process(imageIn, imageOut, null, mask, this.previewMode);
      this.convolution.setAttribute("matrix", this.matrixPrewittY);
      this.convolution.process(imageIn, imageOut, null, mask, this.previewMode);
    } else {
      this.convolution.setAttribute(
        "matrix",
        MarvinMath.scaleMatrix(this.matrixPrewittX, intensity)
      );
      this.convolution.process(imageIn, imageOut, null, mask, previewMode);
      this.convolution.setAttribute(
        "matrix",
        MarvinMath.scaleMatrix(this.matrixPrewittY, intensity)
      );
      this.convolution.process(imageIn, imageOut, null, mask, previewMode);
    }
  }
}
export class BoundaryFill {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("x", 0);
    this.setAttribute("y", 0);
    this.setAttribute("color", 0xffff0000);
    this.setAttribute("tile", null);
    this.setAttribute("threshold", 0);
  }
  process(imgIn, imgOut, attributesOut, mask, previewMode) {
    let l_list = new Array();
    let l_point, l_pointW, l_pointE;

    //MarvinImage.copyColorArray(imgIn, imgOut);

    let x = this.getAttribute("x");
    let y = this.getAttribute("y");
    let tileImage = this.getAttribute("tile");
    this.threshold = this.getAttribute("threshold");

    if (!imgOut.isValidPosition(x, y)) {
      return;
    }

    let targetColor = imgIn.getIntColor(x, y);
    let targetRed = imgIn.getIntComponent0(x, y);
    let targetGreen = imgIn.getIntComponent1(x, y);
    let targetBlue = imgIn.getIntComponent2(x, y);
    let color = this.getAttribute("color");
    let newColor = color;

    let fillMask = MarvinJSUtils.createMatrix2D(
      imgOut.getWidth(),
      imgOut.getHeight,
      false
    );
    fillMask[x][y] = true;

    l_list.push(new MarvinPoint(x, y));

    //for(let l_i=0; l_i<l_list.size(); l_i++){
    while (l_list.length > 0) {
      l_point = l_list.splice(0, 1)[0]; // list poll
      l_pointW = new MarvinPoint(l_point.x, l_point.y);
      l_pointE = new MarvinPoint(l_point.x, l_point.y);

      // west
      while (true) {
        if (
          l_pointW.x - 1 >= 0 &&
          this.match(
            imgIn,
            l_pointW.x - 1,
            l_pointW.y,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold
          ) &&
          !fillMask[l_pointW.x - 1][l_pointW.y]
        ) {
          l_pointW.x--;
        } else {
          break;
        }
      }

      // east
      while (true) {
        if (
          l_pointE.x + 1 < imgIn.getWidth() &&
          this.match(
            imgIn,
            l_pointE.x + 1,
            l_pointE.y,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold
          ) &&
          !fillMask[l_pointE.x + 1][l_pointE.y]
        ) {
          l_pointE.x++;
        } else {
          break;
        }
      }

      // set color of pixels between pointW and pointE
      for (let l_px = l_pointW.x; l_px <= l_pointE.x; l_px++) {
        //imgOut.setIntColor(l_px, l_point.y, -1);
        //drawPixel(imgOut, l_px, l_point.y, newColor, tileImage);
        fillMask[l_px][l_point.y] = true;

        if (
          l_point.y - 1 >= 0 &&
          this.match(
            imgIn,
            l_px,
            l_point.y - 1,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold
          ) &&
          !fillMask[l_px][l_point.y - 1]
        ) {
          l_list.push(new MarvinPoint(l_px, l_point.y - 1));
        }
        if (
          l_point.y + 1 < imgOut.getHeight() &&
          this.match(
            imgIn,
            l_px,
            l_point.y + 1,
            targetRed,
            targetGreen,
            targetBlue,
            this.threshold
          ) &&
          !fillMask[l_px][l_point.y + 1]
        ) {
          l_list.push(new MarvinPoint(l_px, l_point.y + 1));
        }
      }
    }

    if (tileImage != null) {
      /* Plugin not ported yet. */
      /*
    		let p = MarvinPluginLoader.loadImagePlugin("org.marvinproject.image.texture.tileTexture.jar");
    		p.setAttribute("lines", (int)(Math.ceil((double)imgOut.getHeight()/tileImage.getHeight())));
    		p.setAttribute("columns", (int)(Math.ceil((double)imgOut.getWidth()/tileImage.getWidth())));
    		p.setAttribute("tile", tileImage);
    		MarvinImageMask newMask = new MarvinImageMask(fillMask);    		
    		p.process(imgOut, imgOut, null, newMask, false);
			*/
    } else {
      for (let j = 0; j < imgOut.getHeight(); j++) {
        for (let i = 0; i < imgOut.getWidth(); i++) {
          if (fillMask[i][j]) {
            imgOut.setIntColor(i, j, newColor);
          }
        }
      }
    }
  }
  match(image, x, y, targetRed, targetGreen, targetBlue, threshold) {
    let diff =
      Math.abs(image.getIntComponent0(x, y) - targetRed) +
      Math.abs(image.getIntComponent1(x, y) - targetGreen) +
      Math.abs(image.getIntComponent2(x, y) - targetBlue);
    return diff <= threshold;
  }
}
export class ErrorDiffusion {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.threshold = 128;
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let color;
    let dif;

    Marvin.grayScale(imageIn, imageOut, attributesOut, mask, previewMode);

    // Mask
    let l_arrMask;
    if (mask != null) {
      l_arrMask = mask.getMask();
    }

    for (let y = 0; y < imageOut.getHeight(); y++) {
      for (let x = 0; x < imageOut.getWidth(); x++) {
        if (l_arrMask != null && !l_arrMask[x][y]) {
          continue;
        }

        let color = imageOut.getIntComponent0(x, y);
        if (color > this.threshold) {
          imageOut.setIntColor(
            x,
            y,
            imageIn.getAlphaComponent(x, y),
            255,
            255,
            255
          );
          dif = -(255 - color);
        } else {
          imageOut.setIntColor(x, y, imageIn.getAlphaComponent(x, y), 0, 0, 0);
          dif = color;
        }

        // Pixel Right
        if (x + 1 < imageOut.getWidth()) {
          color = imageOut.getIntComponent0(x + 1, y);
          color += Math.floor(0.4375 * dif);
          color = this.getValidGray(color);
          imageOut.setIntColor(
            x + 1,
            y,
            imageIn.getAlphaComponent(x + 1, y),
            color,
            color,
            color
          );

          // Pixel Right Down
          if (y + 1 < imageOut.getHeight()) {
            color = imageOut.getIntComponent0(x + 1, y + 1);
            color += Math.floor(0.0625 * dif);
            color = this.getValidGray(color);
            imageOut.setIntColor(
              x + 1,
              y + 1,
              imageIn.getAlphaComponent(x + 1, y + 1),
              color,
              color,
              color
            );
          }
        }

        // Pixel Down
        if (y + 1 < imageOut.getHeight()) {
          color = imageOut.getIntComponent0(x, y + 1);
          color += Math.floor(0.3125 * dif);
          color = this.getValidGray(color);
          imageOut.setIntColor(
            x,
            y + 1,
            imageIn.getAlphaComponent(x, y + 1),
            color,
            color,
            color
          );

          // Pixel Down Left
          if (x - 1 >= 0) {
            color = imageOut.getIntComponent0(x - 1, y + 1);
            color += Math.floor(0.1875 * dif);
            color = this.getValidGray(color);
            imageOut.setIntColor(
              x - 1,
              y + 1,
              imageIn.getAlphaComponent(x - 1, y + 1),
              color,
              color,
              color
            );
          }
        }
      }
    }
  }
  getValidGray(a_value) {
    if (a_value < 0) return 0;
    if (a_value > 255) return 255;
    return a_value;
  }
}

export class MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  static super(ref) {
    ref.attributes = {};
    ref["setAttribute"] = this.setAttribute;
    ref["getAttribute"] = this.getAttribute;
  }

  static setAttribute(label, value) {
    this.attributes[label] = value;
  }

  static getAttribute(label, value) {
    return this.attributes[label];
  }
}
export class Closing {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.matrix = MarvinJSUtils.createMatrix2D(3, 3, true);
    this.setAttribute("matrix", 3);
  }
  process(imgIn, imgOut, attributesOut, mask, previewMode) {
    let matrix = this.getAttribute("matrix");

    if (
      imgIn.getColorModel() == MarvinImage.COLOR_MODEL_BINARY &&
      matrix != null
    ) {
      Marvin.morphologicalDilation(imgIn, imgOut, matrix);
      MarvinImage.copyColorArray(imgOut, imgIn);
      Marvin.morphologicalErosion(imgIn, imgOut, matrix);
    }
  }
}
export class Dilation {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.matrix = MarvinJSUtils.createMatrix2D(3, 3, true);
    this.setAttribute("matrix", 3);
  }
  process(imgIn, imgOut, attributesOut, mask, previewMode) {
    let matrix = this.getAttribute("matrix");

    if (
      imgIn.getColorModel() == MarvinImage.COLOR_MODEL_BINARY &&
      matrix != null
    ) {
      MarvinImage.copyColorArray(imgIn, imgOut);

      for (let y = 0; y < imgIn.getHeight(); y++) {
        for (let x = 0; x < imgIn.getWidth(); x++) {
          this.applyMatrix(x, y, matrix, imgIn, imgOut);
        }
      }
    }
  }
  applyMatrix(x, y, matrix, imgIn, imgOut) {
    let nx, ny;
    let xC = matrix[0].length / 2;
    let yC = matrix.length / 2;

    if (imgIn.getBinaryColor(x, y)) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
          if ((i != yC || j != xC) && matrix[i][j]) {
            nx = x + (j - xC);
            ny = y + (i - yC);

            if (
              nx > 0 &&
              nx < imgOut.getWidth() &&
              ny > 0 &&
              ny < imgOut.getHeight()
            ) {
              imgOut.setBinaryColor(nx, ny, true);
            }
          }
        }
      }
    }
  }
}
export class Erosion {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.matrix = MarvinJSUtils.createMatrix2D(3, 3, true);
    this.setAttribute("matrix", 3);
  }
  process(imgIn, imgOut, attributesOut, mask, previewMode) {
    let matrix = this.getAttribute("matrix");

    if (
      imgIn.getColorModel() == MarvinImage.COLOR_MODEL_BINARY &&
      matrix != null
    ) {
      MarvinImage.copyColorArray(imgIn, imgOut);

      for (let y = 0; y < imgIn.getHeight(); y++) {
        for (let x = 0; x < imgIn.getWidth(); x++) {
          this.applyMatrix(x, y, matrix, imgIn, imgOut);
        }
      }
    }
  }
  applyMatrix(x, y, matrix, imgIn, imgOut) {
    let nx, ny;

    let xC = Math.floor(matrix[0].length / 2);
    let yC = Math.floor(matrix.length / 2);

    if (!imgIn.getBinaryColor(x, y)) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
          if ((i != yC || j != xC) && matrix[i][j]) {
            nx = x + (j - xC);
            ny = y + (i - yC);

            if (
              nx >= 0 &&
              nx < imgOut.getWidth() &&
              ny >= 0 &&
              ny < imgOut.getHeight()
            ) {
              imgOut.setBinaryColor(nx, ny, false);
            }
          }
        }
      }
    }
  }
}
export class FindTextRegions {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("maxWhiteSpace", 10);
    this.setAttribute("maxFontLineWidth", 10);
    this.setAttribute("minTextWidth", 30);
    this.setAttribute("grayScaleThreshold", 127);
  }
  process(imageIn, imageOut, attrOut, mask, previewMode) {
    // The image will be affected so it's generated a new instance
    imageIn = imageIn.clone();

    let maxWhiteSpace = this.getAttribute("maxWhiteSpace");
    let maxFontLineWidth = this.getAttribute("maxFontLineWidth");
    let minTextWidth = this.getAttribute("minTextWidth");
    let grayScaleThreshold = this.getAttribute("grayScaleThreshold");

    Marvin.thresholding(imageIn, imageIn, grayScaleThreshold);

    let segments = [];
    for (let i = 0; i < imageIn.getHeight(); i++) {
      segments.push([]);
    }

    // map of already processed pixels

    let processed = MarvinJSUtils.createMatrix2D(
      imageIn.getWidth(),
      imageIn.getHeight,
      false
    );

    let color;
    let patternStartX = -1;
    let patternLength = 0;
    let whitePixels = 0;
    let blackPixels = 0;
    for (let y = 0; y < imageIn.getHeight(); y++) {
      for (let x = 0; x < imageIn.getWidth(); x++) {
        if (!processed[x][y]) {
          color = imageIn.getIntColor(x, y);

          if (color == 0xffffffff && patternStartX != -1) {
            whitePixels++;
            blackPixels = 0;
          }

          if (color == 0xff000000) {
            blackPixels++;

            if (patternStartX == -1) {
              patternStartX = x;
            }

            whitePixels = 0;
          }

          // check white and black pattern maximum lenghts
          if (
            whitePixels > maxWhiteSpace ||
            blackPixels > maxFontLineWidth ||
            x == imageIn.getWidth() - 1
          ) {
            if (patternLength >= minTextWidth) {
              let list = segments[y];
              list.push([patternStartX, y, patternStartX + patternLength, y]);
            }

            whitePixels = 0;
            blackPixels = 0;
            patternLength = 0;
            patternStartX = -1;
          }

          if (patternStartX != -1) {
            patternLength++;
          }

          processed[x][y] = true;
        }
      }
    }

    // Group line patterns intersecting in x coordinate and too near in y coordinate.
    for (let y = 0; y < imageIn.getHeight() - 2; y++) {
      let listY = segments[y];

      for (let w = y + 1; w <= y + 2; w++) {
        let listW = segments[w];

        for (let i = 0; i < listY.length; i++) {
          let sA = listY[i];
          for (let j = 0; j < listW.length; j++) {
            let sB = listW[j];

            // horizontal intersection
            if (
              (sA[0] <= sB[0] && sA[2] >= sB[2]) ||
              (sA[0] >= sB[0] && sA[0] <= sB[2]) ||
              (sA[2] >= sB[0] && sA[2] <= sB[2])
            ) {
              sA[0] = Math.min(sA[0], sB[0]);
              sA[2] = Math.max(sA[2], sB[2]);
              sA[3] = sB[3];

              listY.splice(i, 1);
              i--;

              listW.splice(j, 1);
              listW.push(sA);

              break;
            }
          }
        }
      }
    }

    // Convert the result to a List<> of MarvinSegment objects.
    let marvinSegments = [];
    for (let y = 0; y < imageIn.getHeight(); y++) {
      let list = segments[y];
      for (let i in list) {
        let seg = list[i];
        marvinSegments.push(new MarvinSegment(seg[0], seg[1], seg[2], seg[3]));
      }
    }

    attrOut.set("matches", marvinSegments);
  }
}
export class IteratedFunctionSystem {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.rules = [];
    this.EXAMPLE_RULES =
      "0,0,0,0.16,0,0,0.01\n" +
      "0.85,0.04,-0.04,0.85,0,1.6,0.85\n" +
      "0.2,-0.26,0.23,0.22,0,1.6,0.07\n" +
      "-0.15,0.28,0.26,0.24,0,0.44,0.07\n";

    this.setAttribute("rules", this.EXAMPLE_RULES);
    this.setAttribute("iterations", 1000000);
  }

  /*
	private MarvinAttributesPanel	attributesPanel;
	private MarvinAttributes 		attributes;
	
	private List<Rule> rules;
	
	// Testing String
	private final static String EXAMPLE_RULES = 	"0,0,0,0.16,0,0,0.01\n"+
											"0.85,0.04,-0.04,0.85,0,1.6,0.85\n"+
											"0.2,-0.26,0.23,0.22,0,1.6,0.07\n"+
											"-0.15,0.28,0.26,0.24,0,0.44,0.07\n";
	@Override
	public void load() {
		attributes = getAttributes();
		attributes.set("rules", EXAMPLE_RULES);
		attributes.set("iterations", 1000000);
		
		rules = new ArrayList<Rule>();
	}
	*/
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    this.loadRules();
    let iterations = this.getAttribute("iterations");

    let x0 = 0;
    let y0 = 0;
    let x, y;
    let startX;
    let startY;
    let factor;

    let minX = 999999999,
      minY = 999999999,
      maxX = -999999999,
      maxY = -99999999;

    let tempRule;
    let point = [x0, y0];

    imageOut.clear(0xffffffff);

    for (let i = 0; i < iterations; i++) {
      tempRule = this.getRule();
      this.applyRule(point, tempRule);

      x = point[0];
      y = point[1];

      if (x < minX) {
        minX = x;
      }
      if (x > maxX) {
        maxX = x;
      }
      if (y < minY) {
        minY = y;
      }
      if (y > maxY) {
        maxY = y;
      }
    }

    let width = imageOut.getWidth();
    let height = imageOut.getHeight();

    let deltaX = Math.abs(maxX - minX);
    let deltaY = Math.abs(maxY - minY);
    if (deltaX > deltaY) {
      factor = width / deltaX;
      if (deltaY * factor > height) {
        factor = factor * (height / (deltaY * factor));
      }
    } else {
      factor = height / deltaY;
      if (deltaX * factor > width) {
        factor = factor * (width / (deltaX * factor));
      }
    }

    factor *= 0.9;

    startX = Math.floor(width / 2 - (minX + deltaX / 2) * factor);
    startY = Math.floor(height - (height / 2 - (minY + deltaY / 2) * factor));

    point[0] = x0;
    point[1] = y0;

    for (let i = 0; i < iterations; i++) {
      tempRule = this.getRule();
      this.applyRule(point, tempRule);

      x = Math.floor(point[0] * factor + startX);
      y = startY - Math.floor(point[1] * factor);

      if (x >= 0 && x < width && y >= 0 && y < height) {
        imageOut.setIntColor(Math.floor(x), Math.floor(y), 255, 0);
      }
    }
  }
  loadRules() {
    this.rules = [];
    let r = this.getAttribute("rules").split("\n");

    for (let i = 0; i < r.length; i++) {
      this.addRule(r[i]);
    }
  }
  addRule(rule) {
    rule = rule.replace(/ /g, ""); //replace all spaces
    let attr = rule.split(",");

    if (attr.length == 7) {
      let r = new Object();
      r.a = parseFloat(attr[0]);
      r.b = parseFloat(attr[1]);
      r.c = parseFloat(attr[2]);
      r.d = parseFloat(attr[3]);
      r.e = parseFloat(attr[4]);
      r.f = parseFloat(attr[5]);
      r.probability = parseFloat(attr[6]);

      /*
			(
				parseFloat(attr[0]),
				parseFloat(attr[1]),
				parseFloat(attr[2]),
				parseFloat(attr[3]),
				parseFloat(attr[4]),
				parseFloat(attr[5]),
				parseFloat(attr[6])
			);
			*/

      this.rules.push(r);
    }
  }
  getRule() {
    let random = Math.random();
    let sum = 0;
    let i;
    for (i = 0; i < this.rules.length; i++) {
      sum += this.rules[i].probability;
      if (random < sum) {
        return this.rules[i];
      }
    }

    if (i != 0) {
      return this.rules[i - 1];
    }
    return this.rules[0];
  }
  applyRule(point, rule) {
    let nx = rule.a * point[0] + rule.b * point[1] + rule.e;
    let ny = rule.c * point[0] + rule.d * point[1] + rule.f;
    point[0] = nx;
    point[1] = ny;
  }
}
export class Crop {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("x", 0);
    this.setAttribute("y", 0);
    this.setAttribute("width", 0);
    this.setAttribute("height", 0);
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    let x = this.getAttribute("x");
    let y = this.getAttribute("y");
    let width = this.getAttribute("width");
    let height = this.getAttribute("height");

    imageOut.setDimension(width, height);

    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        imageOut.setIntColor(i - x, j - y, imageIn.getIntColor(i, j));
      }
    }
  }
}
export class FloodfillSegmentation {
  constructor() {
    super();
    this.load();
  }
  load() {
    this.setAttribute("returnType", "MarvinSegment");
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    if (attributesOut != null) {
      let returnType = this.getAttribute("returnType");
      let fillBuffer = imageIn.clone();
      let segments = this.floodfillSegmentation(imageIn, fillBuffer);

      switch (returnType) {
        case "MarvinSegment":
          attributesOut.set("segments", segments);
          break;
        case "MarvinBlobSegment":
          attributesOut.set("blobSegments", blobSegments(fillBuffer, segments));
          break;
      }
    }
  }
  floodfillSegmentation(image, fillBuffer) {
    fillBuffer.clear(0xff000000);

    let currentColor = 1;
    for (let y = 0; y < image.getHeight(); y++) {
      for (let x = 0; x < image.getWidth(); x++) {
        let color = fillBuffer.getIntColor(x, y);

        if ((color & 0x00ffffff) == 0 && image.getAlphaComponent(x, y) > 0) {
          let c = 0xff000000 | currentColor++;
          Marvin.boundaryFill(image, fillBuffer, x, y, c);
        }
      }
    }

    let segments = new Array(currentColor - 1);
    let seg;
    for (let y = 0; y < fillBuffer.getHeight(); y++) {
      for (let x = 0; x < fillBuffer.getWidth(); x++) {
        let color = fillBuffer.getIntColor(x, y) & 0x00ffffff;

        if (color != 0x00ffffff && color > 0) {
          seg = segments[color - 1];

          if (seg == null) {
            seg = new MarvinSegment();
            segments[color - 1] = seg;
          }

          // x and width
          if (seg.x1 == -1 || x < seg.x1) {
            seg.x1 = x;
          }
          if (seg.x2 == -1 || x > seg.x2) {
            seg.x2 = x;
          }
          seg.width = seg.x2 - seg.x1 + 1;

          // y and height;
          if (seg.y1 == -1 || y < seg.y1) {
            seg.y1 = y;
          }
          if (seg.y2 == -1 || y > seg.y2) {
            seg.y2 = y;
          }
          seg.height = seg.y2 - seg.y1 + 1;

          seg.area++;
        }
      }
    }

    return segments;
  }
  blobSegments(image, segments) {
    let blobSegments = new Array(segments.length);

    let colorSegment;
    let seg;
    for (let i = 0; i < segments.length; i++) {
      seg = segments[i];
      colorSegment = 0xff000000 + (i + 1);

      blobSegments[i] = new MarvinBlobSegment(seg.x1, seg.y1);
      let tempBlob = new MarvinBlob(seg.width, seg.height);
      blobSegments[i].setBlob(tempBlob);

      for (let y = seg.y1; y <= seg.y2; y++) {
        for (let x = seg.x1; x <= seg.x2; x++) {
          if (image.getIntColor(x, y) == colorSegment) {
            tempBlob.setValue(x - seg.x1, y - seg.y1, true);
          }
        }
      }
    }
    return blobSegments;
  }
}
export class Scale {
  constructor() {
    super();
    this.load();
  }
  load() {
    // Attributes
    this.setAttribute("newWidth", 0);
    this.setAttribute("newHeight", 0);
  }
  process(imageIn, imageOut, attributesOut, mask, previewMode) {
    if (!previewMode) {
      let width = imageIn.getWidth();
      let height = imageIn.getHeight();
      let newWidth = this.getAttribute("newWidth");
      let newHeight = this.getAttribute("newHeight");

      if (
        imageOut.getWidth() != newWidth ||
        imageOut.getHeight() != newHeight
      ) {
        imageOut.setDimension(newWidth, newHeight);
      }

      let x_ratio = Math.floor((width << 16) / newWidth);
      let y_ratio = Math.floor((height << 16) / newHeight);
      let x2, y2;
      for (let i = 0; i < newHeight; i++) {
        for (let j = 0; j < newWidth; j++) {
          x2 = Math.floor((j * x_ratio) >> 16);
          y2 = Math.floor((i * y_ratio) >> 16);
          imageOut.setIntColor(
            j,
            i,
            imageIn.getAlphaComponent(x2, y2),
            imageIn.getIntColor(x2, y2)
          );
        }
      }
    }
  }
}
export class MarvinAttributes {
  constructor() {
    this.hashAttributes = new Object();
  }
  set(name, value) {
    this.hashAttributes[name] = value;
  }
  get(name, defaultValue) {
    let ret = this.hashAttributes[name];

    if (ret != null) {
      return ret;
    }
    return defaultValue;
  }
  clone() {
    let attrs = new MarvinAttributes();

    for (let key in this.hashAttributes) {
      attrs.set(key, this.hashAttributes[key]);
    }
    return attrs;
  }
}
export class MarvinPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  setX(x) {
    this.x = x;
  }
  getX() {
    return this.x;
  }
  setY(x) {
    this.y = y;
  }
  getY() {
    return this.y;
  }
}

export class Marvin {
  constructor(callback) {}

  // Alpha Boundary
  alphaBoundary(imageIn, imageOut, radius) {
    this.alphaBoundary = new AlphaBoundary();
    this.alphaBoundary.setAttribute("radius", radius);
    this.alphaBoundary.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Average Color
  averageColor(imageIn) {
    this.averageColor = new AverageColor();
    let attrOut = new MarvinAttributes();
    this.averageColor.process(
      imageIn,
      null,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("averageColor");
  }

  // Black And White
  blackAndWhite(imageIn, imageOut, level) {
    this.blackAndWhite = new BlackAndWhite();
    this.blackAndWhite.setAttribute("level", level);
    this.blackAndWhite.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // BoundaryFill
  boundaryFill(imageIn, imageOut, x, y, color, threshold) {
    this.boundaryFill = new BoundaryFill();
    this.boundaryFill.setAttribute("x", x);
    this.boundaryFill.setAttribute("y", y);
    this.boundaryFill.setAttribute("color", color);
    if (threshold != null) {
      this.boundaryFill.setAttribute("threshold", threshold);
    }

    this.boundaryFill.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Brightness and Contrast
  brightnessAndContrast(imageIn, imageOut, brightness, contrast) {
    this.brightnessAndContrast = new BrightnessAndContrast();
    this.brightnessAndContrast.setAttribute("brightness", brightness);
    this.brightnessAndContrast.setAttribute("contrast", contrast);
    this.brightnessAndContrast.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Color Channel
  colorChannel(imageIn, imageOut, red, green, blue) {
    this.colorChannel = new ColorChannel();
    this.colorChannel.setAttribute("red", red);
    this.colorChannel.setAttribute("green", green);
    this.colorChannel.setAttribute("blue", blue);
    this.colorChannel.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Color Channel
  crop(imageIn, imageOut, x, y, width, height) {
    this.crop = new Crop();
    this.crop.setAttribute("x", x);
    this.crop.setAttribute("y", y);
    this.crop.setAttribute("width", width);
    this.crop.setAttribute("height", height);
    this.crop.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Combine by Alpha
  combineByAlpha(imageIn, imageOther, imageOut, x, y) {
    this.combineByAlpha = new CombineByAlpha();
    this.combineByAlpha.setAttribute("imageOther", imageOther);
    this.combineByAlpha.setAttribute("x", x);
    this.combineByAlpha.setAttribute("y", y);
    this.combineByAlpha.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Emboss
  emboss(imageIn, imageOut) {
    this.emboss = new Emboss();
    this.emboss.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Emboss
  halftoneErrorDiffusion(imageIn, imageOut) {
    this.halftoneErrorDiffusion = new ErrorDiffusion();
    this.halftoneErrorDiffusion.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // FindTextRegions
  findTextRegions(
    imageIn,
    maxWhiteSpace,
    maxFontLineWidth,
    minTextWidth,
    grayScaleThreshold
  ) {
    this.findTextRegions = new FindTextRegions();
    let attrOut = new MarvinAttributes();
    this.findTextRegions.setAttribute(
      "maxWhiteSpace",
      this.getValue(maxWhiteSpace, 10)
    );
    this.findTextRegions.setAttribute(
      "maxFontLineWidth",
      this.getValue(maxFontLineWidth, 10)
    );
    this.findTextRegions.setAttribute(
      "minTextWidth",
      this.getValue(minTextWidth, 30)
    );
    this.findTextRegions.setAttribute(
      "grayScaleThreshold",
      this.getValue(grayScaleThreshold, 127)
    );
    this.findTextRegions.process(
      imageIn,
      null,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("matches");
  }

  // Floodfill Segmentation
  floodfillSegmentation(imageIn) {
    this.floodfillSegmentation = new FloodfillSegmentation();
    let attrOut = new MarvinAttributes();
    this.floodfillSegmentation.setAttribute("returnType", "MarvinSegment");
    this.floodfillSegmentation.process(
      imageIn,
      null,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("segments");
  }

  // Gaussian Blur
  gaussianBlur(imageIn, imageOut, radius) {
    this.gaussianBlur = new GaussianBlur();
    this.gaussianBlur.setAttribute("radius", getValue(radius, 3.0));
    this.gaussianBlur.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Invert
  invertColors(imageIn, imageOut) {
    this.invertColors = new Invert();
    this.invertColors.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  iteratedFunctionSystem(imageIn, imageOut, rules, iterations) {
    this.iteratedFunctionSystem = new IteratedFunctionSystem();
    this.iteratedFunctionSystem.setAttribute("rules", rules);
    this.iteratedFunctionSystem.setAttribute("iterations", iterations);
    this.iteratedFunctionSystem.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // GrayScale
  grayScale(imageIn, imageOut) {
    this.grayScale = new GrayScale();
    this.grayScale.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  //Merge Photos
  mergePhotos(images, imageOut, threshold) {
    this.mergePhotos = new MergePhotos();
    this.mergePhotos.setAttribute("threshold", threshold);
    this.mergePhotos.process(images, imageOut);
  }

  // Moravec
  moravec(imageIn, imageOut, matrixSize, threshold) {
    this.moravec = new Moravec();
    let attrOut = new MarvinAttributes();
    this.moravec.setAttribute("matrixSize", matrixSize);
    this.moravec.setAttribute("threshold", threshold);
    this.moravec.process(
      imageIn,
      imageOut,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("cornernessMap");
  }

  // Morphological Dilation
  morphologicalDilation(imageIn, imageOut, matrix) {
    this.morphologicalDilation = new Dilation();
    this.morphologicalDilation.setAttribute("matrix", matrix);
    this.morphologicalDilation.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Morphological Erosion
  morphologicalErosion(imageIn, imageOut, matrix) {
    this.morphologicalErosion = new Erosion();
    this.morphologicalErosion.setAttribute("matrix", matrix);
    this.morphologicalErosion.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Morphological Closing
  morphologicalClosing(imageIn, imageOut, matrix) {
    this.morphologicalClosing = new Closing();
    this.morphologicalClosing.setAttribute("matrix", matrix);
    this.morphologicalClosing.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Prewitt
  prewitt(imageIn, imageOut, intensity) {
    this.prewitt = new Prewitt();
    this.prewitt.setAttribute("intensity", getValue(intensity, 1.0));
    this.prewitt.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Scale
  scale(imageIn, imageOut, newWidth, newHeight) {
    this.scale = new Scale();
    if (newHeight == null) {
      let factor = imageIn.getHeight() / imageIn.getWidth();
      newHeight = Math.floor(factor * newWidth);
    }

    this.scale.setAttribute("newWidth", newWidth);
    this.scale.setAttribute("newHeight", newHeight);
    this.scale.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Sepia
  sepia(imageIn, imageOut, intensity) {
    this.sepia = new Sepia();
    this.sepia.setAttribute("intensity", intensity);
    this.sepia.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Thresholding
  thresholding(imageIn, imageOut, threshold, thresholdRange) {
    this.thresholding = new Thresholding();
    this.thresholding.setAttribute("threshold", threshold);
    this.thresholding.setAttribute("thresholdRange", thresholdRange);
    this.thresholding.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // ThresholdingNeighborhood
  thresholdingNeighborhood(
    imageIn,
    imageOut,
    thresholdPercentageOfAverage,
    neighborhoodSide,
    samplingPixelDistance
  ) {
    this.thresholdingNeighborhood = new ThresholdingNeighborhood();
    this.thresholdingNeighborhood.setAttribute(
      "thresholdPercentageOfAverage",
      thresholdPercentageOfAverage
    );
    this.thresholdingNeighborhood.setAttribute(
      "neighborhoodSide",
      neighborhoodSide
    );
    this.thresholdingNeighborhood.setAttribute(
      "samplingPixelDistance",
      samplingPixelDistance
    );
    this.thresholdingNeighborhood.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }
}
