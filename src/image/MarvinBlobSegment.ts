import MarvinBlob from "./MarvinBlob";

export default class MarvinBlobSegment {
  private x: number;
  y: number;
  private blob: MarvinBlob;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  setBlob(blob: MarvinBlob): void {
    this.blob = blob;
  }

  getBlob(): MarvinBlob {
    return this.blob;
  }
}
