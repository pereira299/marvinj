import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Sepia extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load () {
    Sepia.setAttribute("txtValue", "20");
    Sepia.setAttribute("intensity", 20);
  }

  process (imageIn, imageOut, attributesOut, mask, previewMode) {
    let r, g, b, depth, corfinal;

    //Define a intensidade do filtro...
    depth = Sepia.getAttribute("intensity");

    const width = imageIn.getWidth();
    const height = imageIn.getHeight();

    const l_arrMask = mask.getMask();

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
   * @return
   */
  truncate (a) {
    if (a < 0) return 0;
    else if (a > 255) return 255;
    else return a;
  }
}
