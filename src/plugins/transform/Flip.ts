import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Flip extends MarvinAbstractImagePlugin {
  private static HORIZONTAL = "horizontal";
  private static VERTICAL = "vertical";
  private static BOTH = "both";

  private attributes: MarvinAttributes;
  private arrMask: boolean[][];

  constructor() {
    super();
    this.load();
  }

  public load() {
    this.attributes = Flip.getAttributes();
    this.attributes.set("flip", "horizontal");
  }

  public process(
    a_imageIn: MarvinImage,
    a_attributesOut: MarvinAttributes,
    a_mask: MarvinImageMask
  ) {
    const l_operation: string = this.attributes.get("flip");
    this.arrMask = a_mask.getMask();
    let a_imageOut: MarvinImage = a_imageIn.clone();

    switch (l_operation) {
      case Flip.HORIZONTAL:
        return this.flipHorizontal(a_imageOut);
      case Flip.VERTICAL:
        return this.flipVertical(a_imageOut);
      case Flip.BOTH:
        a_imageOut = this.flipHorizontal(a_imageOut);
        return this.flipVertical(a_imageOut);
    }
  }

  private flipHorizontal(a_imageIn: MarvinImage): MarvinImage {
    let r: number;
    let g: number;
    let b: number;
    const a_imageOut = a_imageIn.clone();
    for (let y = 0; y < a_imageIn.getHeight(); y++) {
      for (let x = 0; x < a_imageIn.getWidth() / 2 + 1; x++) {
        if (this.arrMask != null && !this.arrMask[x][y]) {
          continue;
        }
        //Get Y points and change the positions
        r = a_imageIn.getIntComponent0(x, y);
        g = a_imageIn.getIntComponent1(x, y);
        b = a_imageIn.getIntComponent2(x, y);

        a_imageOut.setIntColor(
          x,
          y,
          a_imageIn.getIntComponent0(a_imageIn.getWidth() - 1 - x, y),
          a_imageIn.getIntComponent1(a_imageIn.getWidth() - 1 - x, y),
          a_imageIn.getIntComponent2(a_imageIn.getWidth() - 1 - x, y)
        );

        a_imageOut.setIntColor(a_imageIn.getWidth() - 1 - x, y, r, g, b);
      }
    }
    return a_imageOut;
  }

  private flipVertical(a_imageIn: MarvinImage): MarvinImage {
    let r: number;
    let g: number;
    let b: number;
    const a_imageOut = a_imageIn.clone();
    for (let x = 0; x < a_imageIn.getWidth(); x++) {
      for (let y = 0; y < a_imageIn.getHeight() / 2 + 1; y++) {
        if (this.arrMask != null && this.arrMask[x][y]) {
          continue;
        }

        //Get X points and change the positions
        r = a_imageIn.getIntComponent0(x, y);
        g = a_imageIn.getIntComponent1(x, y);
        b = a_imageIn.getIntComponent2(x, y);

        a_imageOut.setIntColor(
          x,
          y,
          a_imageIn.getIntComponent0(x, a_imageIn.getHeight() - 1 - y),
          a_imageIn.getIntComponent1(x, a_imageIn.getHeight() - 1 - y),
          a_imageIn.getIntComponent2(x, a_imageIn.getHeight() - 1 - y)
        );

        a_imageOut.setIntColor(x, a_imageIn.getHeight() - 1 - y, r, g, b);
      }
    }
    return a_imageOut;
  }
}
