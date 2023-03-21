import * as canvas from "canvas";
import * as fs from "fs";

export default class MarvinImage {
  static COLOR_MODEL_RGB = 0;
  static COLOR_MODEL_BINARY = 1;
  image: any;
  canvas: canvas.Canvas | null;
  ctx: canvas.CanvasRenderingContext2D | null;
  data: any;
  document: Document;
  imageData: canvas.ImageData;
  colorModel: number;
  arrBinaryColor: any;
  width: number;
  height: number;
  onload: any;

  constructor(width = 100, height = 100, colorModel: number | null = null) {
    // properties
    if (!colorModel) {
      colorModel = MarvinImage.COLOR_MODEL_RGB;
    }

    this.colorModel = colorModel;
    if (width != null) {
      this.create(width, height);
    }

    if (colorModel == MarvinImage.COLOR_MODEL_BINARY) {
      this.arrBinaryColor = new Array(width * height);
    }
  }

  create(width: number, height: number) {
    this.canvas = canvas.createCanvas(width, height);
    this.ctx = this.canvas.getContext("2d");
    if (this.ctx == null) throw new Error("Could not get canvas context");
    this.imageData = this.ctx.getImageData(0, 0, width, height);
    this.width = width;
    this.height = height;
  }

  setDimension(width: number, height: number) {
    this.create(width, height);
  }

  loadFromImage(imgIn: MarvinImage) {
    this.ctx?.drawImage(imgIn.canvas, 0, 0);
    this.imageData =
      this.ctx?.getImageData(0, 0, this.width, this.height) ||
      new canvas.ImageData(0, 0);
    return this;
  }

  load(url: string): Promise<MarvinImage> {
    return new Promise((resolve, reject) => {
      this.image = new canvas.Image();
      this.image.onload = () => {
        const res = this.callbackImageLoaded(this);
        if (!res) reject(res);
        resolve(res);
      };
      this.image.crossOrigin = "anonymous";
      this.image.src = url;
    });
  }

  loadFromBase64(base64: string): Promise<MarvinImage> {
    return new Promise((resolve, reject) => {
      this.image = new canvas.Image();
      this.image.onload = () => {
        const res = this.callbackImageLoaded(this);
        if (!res) reject(res);
        resolve(res);
      };
      this.image.src = base64;
    });
  }
  // WARN: the callback "this" object is the reference to js Image object.
  callbackImageLoaded(marvinImage: MarvinImage) {
    try {
      marvinImage.width = marvinImage.image.width;
      marvinImage.height = marvinImage.image.height;
      marvinImage.canvas = canvas.createCanvas(
        marvinImage.image.width,
        marvinImage.image.height
      );

      marvinImage.ctx = marvinImage.canvas.getContext("2d");
      marvinImage.ctx.drawImage(marvinImage.image, 0, 0);

      this.imageData = marvinImage.ctx.getImageData(
        0,
        0,
        marvinImage.width,
        marvinImage.height
      );

      if (marvinImage.onload != null) {
        marvinImage.onload(this);
      }
      return this;
    } catch (e) {
      return e;
    }
  }

  clone(all = true) {
    const image = new MarvinImage(
      this.width,
      this.height,
      this.colorModel
    );
    if (all) {
      image.canvas = this.canvas;
      image.ctx = this.ctx;
      image.imageData = this.imageData;
      image.image = this.image;
    }
    return MarvinImage.copyColorArray(this, image);
  }

  update() {
    this.canvas.getContext("2d")?.putImageData(this.imageData, 0, 0);
    return this;
  }

  clear(color) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.setIntColor(x, y, color);
      }
    }
    return this;
  }

  getColorModel() {
    return this.colorModel;
  }

  getAlphaComponent(x, y) {
    const start = (y * this.width + x) * 4;
    return this.imageData.data[start + 3];
  }

  setAlphaComponent(x, y, alpha) {
    const start = (y * this.width + x) * 4;
    this.imageData.data[start + 3] = alpha;
  }

  getIntComponent0(x, y) {
    const start = (y * this.width + x) * 4;
    return this.imageData.data[start];
  }

  getIntComponent1(x, y) {
    const start = (y * this.width + x) * 4;
    return this.imageData.data[start + 1];
  }

  getIntComponent2(x, y) {
    const start = (y * this.width + x) * 4;
    return this.imageData.data[start + 2];
  }

  setIntColor(
    x: number,
    y: number,
    a1: number,
    a2: number | null = null,
    a3: number | null = null,
    a4: number | null = null
  ) {
    if (a2 == null) {
      this.setIntColor1(x, y, a1);
    } else if (a3 == null && a4 == null) {
      this.setIntColor2(x, y, a1, a2);
    } else if (a4 == null && a3 != null) {
      this.setIntColor3(x, y, a1, a2, a3);
    } else if (a4 != null && a3 != null && a2 != null) {
      this.setIntColor4(x, y, a1, a2, a3, a4);
    }

    return this;
  }

  getIntColor(x, y) {
    const start = (y * this.width + x) * 4;

    return (
      0x100000000 +
      (this.imageData.data[start + 3] << 24) +
      (this.imageData.data[start] << 16) +
      (this.imageData.data[start + 1] << 8) +
      this.imageData.data[start + 2]
    );
  }

  setIntColor1(x: number, y: number, color: number) {
    const a = (color & 0xff000000) >>> 24;
    const r = (color & 0x00ff0000) >> 16;
    const g = (color & 0x0000ff00) >> 8;
    const b = color & 0x000000ff;
    this.setIntColor4(x, y, a, r, g, b);
  }

  setBinaryColor(x, y, value) {
    const pos = y * this.width + x;
    this.arrBinaryColor[pos] = value;
  }

  getBinaryColor(x, y) {
    const pos = y * this.width + x;
    return this.arrBinaryColor[pos];
  }

  static copyColorArray(imgSource: MarvinImage, imgDestine: MarvinImage) {
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
    return imgDestine;
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

    return this;
  }

  fillRect(x, y, width, height, color) {
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        if (i < this.width && j < this.height) {
          this.setIntColor(i, j, color);
        }
      }
    }
    return this;
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

  setAlphaToColor(color: number) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.getAlphaComponent(x, y) == 0) {
          this.setIntColor(x, y, 0xffffffff);
        }
      }
    }
  }

  setIntColor2(x: number, y: number, alpha: number, color: number) {
    const r = (color & 0x00ff0000) >> 16;
    const g = (color & 0x0000ff00) >> 8;
    const b = color & 0x000000ff;
    this.setIntColor4(x, y, alpha, r, g, b);
  }

  setIntColor3(x: number, y: number, r: number, g: number, b: number) {
    this.setIntColor4(x, y, 255, r, g, b);
  }

  download(filepath: string) {
    const dataURL = this.canvas.toDataURL("image/png");
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(filepath, base64Data, "base64");
  }

  setIntColor4(
    x: number,
    y: number,
    alpha: number,
    r: number,
    g: number,
    b: number
  ): void {
    const start = (y * this.width + x) * 4;
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
    canvas.getContext("2d").putImageData(this.imageData, x, y);
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
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  getBuffer() {
    const cv = canvas.createCanvas(this.imageData.width, this.imageData.height);
    const ctx = cv.getContext("2d");
    ctx.putImageData(this.imageData, 0, 0);
    //image data to base64
    const dataURL = cv.toDataURL("image/png");
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
    return Buffer.from(base64Data, "base64");
  }
}
