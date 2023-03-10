import { MarvinContour } from "./MarvinCoutour";

export default class MarvinBlob {
  int: number;
  width: number;
  height: number;
  static area: number;
  pixels: boolean[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    MarvinBlob.area = 0;
    this.pixels = Array.from({ length: width }, () =>
      Array.from({ length: height }, () => false)
    );
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  setValue(x: number, y: number, value: boolean): void {
    if (!this.pixels[x][y] && value) {
      MarvinBlob.area++;
    } else if (this.pixels[x][y] && !value) {
      MarvinBlob.area--;
    }

    this.pixels[x][y] = value;
  }

  public static getArea(): number {
    return MarvinBlob.area;
  }

  public getValue(x: number, y: number): boolean {
	console.log(x, y);
    return this.pixels[x][y];
  }

  public toContour(): MarvinContour {
    const contour: MarvinContour = new MarvinContour();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.getValue(x, y)) {
          if (
            x - 1 < 0 ||
            x + 1 == this.width ||
            y - 1 < 0 ||
            y + 1 == this.height ||
            !this.getValue(x - 1, y - 1) ||
            !this.getValue(x - 1, y) ||
            !this.getValue(x - 1, y + 1) ||
            !this.getValue(x, y - 1) ||
            !this.getValue(x, y + 1) ||
            !this.getValue(x + 1, y - 1) ||
            !this.getValue(x + 1, y) ||
            !this.getValue(x + 1, y + 1)
          ) {
            contour.addPoint(x, y);
          }
        }
      }
    }
    return contour;
  }
}
