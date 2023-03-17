import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Convolution extends MarvinAbstractImagePlugin {
  constructor() {
    super();
    this.load();
  }

  load () {
    Convolution.setAttribute("matrix", null);
  }

  process(imagem: MarvinImage, kernel: number[][]) {
    const img_out = new MarvinImage(imagem.getWidth(), imagem.getHeight());
    img_out.loadFromImage(imagem);
    const alturaImagem = imagem.getHeight();
    const larguraImagem = imagem.getWidth();
    const alturaKernel = kernel.length;
    const larguraKernel = kernel[0].length;
    const bordaAltura = Math.floor(alturaKernel / 2);
    const bordaLargura = Math.floor(larguraKernel / 2);
  
    for (let i = 0; i < alturaImagem; i++) {
  
      for (let j = 0; j < larguraImagem; j++) {
        let sumRed = 0;
        let sumGreen = 0;
        let sumBlue = 0;
        
        const inicioAltura = i - bordaAltura;
        const inicioLargura = j - bordaLargura;
        const fimAltura = inicioAltura + alturaKernel;
        const fimLargura = inicioLargura + larguraKernel;
        const xInicial = inicioAltura < 0 ? -inicioAltura : 0;
        const xFinal = fimAltura > alturaImagem ? alturaKernel - (fimAltura - alturaImagem) : alturaKernel;
        const yInicial = inicioLargura < 0 ? -inicioLargura : 0;
        const yFinal = fimLargura > larguraImagem ? larguraKernel - (fimLargura - larguraImagem) : larguraKernel;
        
        for (let k = xInicial; k < xFinal; k++) {
          for (let l = yInicial; l < yFinal; l++) {
            sumRed += imagem.getIntComponent0(inicioLargura + l, inicioAltura + k) * kernel[k][l];
            sumGreen += imagem.getIntComponent1(inicioLargura + l, inicioAltura + k) * kernel[k][l];
            sumBlue += imagem.getIntComponent2(inicioLargura + l, inicioAltura + k) * kernel[k][l];
          }
        }
  
        img_out.setIntColor(j, i, sumRed, sumGreen, sumBlue);
      }
    }
  
    return img_out;
  }
  
  process2 (
    imageIn: MarvinImage,
    attributesOut: MarvinAttributes,
    mask: MarvinImageMask,
    previewMode: boolean
  ) {
    const matrix = Convolution.getAttribute("matrix");
    console.log("matrix: ", matrix);
    let imageOut = new MarvinImage(imageIn.getWidth(), imageIn.getHeight());
    imageOut.loadFromImage(imageIn);
    if (matrix != null && matrix.length > 0) {
      for (let y = 0; y < imageIn.getHeight(); y++) {
        for (let x = 0; x < imageIn.getWidth(); x++) {
          if (
            y >= matrix.length / 2 &&
            y < imageIn.getHeight() - matrix.length / 2 &&
            x >= matrix[0].length / 2 &&
            x < imageIn.getWidth() - matrix[0].length / 2
          ) {
            imageOut = this.applyMatrix(x, y, matrix, imageIn);
          } else {
            imageOut = imageOut.setIntColor(x, y, 0xff000000);
          }
        }
      }
    }
    return imageOut;
  }

  applyMatrix (x:number, y:number, matrix:number[][], imageIn:MarvinImage) {
    let nx, ny;

    const imageOut = new MarvinImage(imageIn.getWidth(), imageIn.getHeight());
    imageOut.loadFromImage(imageIn);
    const xC = Math.ceil(matrix[0].length / 2);
    const yC = Math.ceil(matrix.length / 2);

    const flatMatrix = matrix.flat();
    const width = imageIn.getWidth();
    const height = imageIn.getHeight();

    const result = flatMatrix.reduce((acc, curr, index, arr) => {
      const i = arr.length / matrix.length;
      const j = index % i;
      const k = Math.floor(index / i);
      const nx = x + (j - xC);
      const ny = y + (k - yC);
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        acc.resultRed += curr * imageIn.getIntComponent0(nx, ny);
        acc.resultGreen += curr * imageIn.getIntComponent1(nx, ny);
        acc.resultBlue += curr * imageIn.getIntComponent2(nx, ny);
      }
      return acc;
    }, {resultRed: 0, resultGreen: 0, resultBlue: 0});
    // for (let i = 0; i < matrix.length; i++) {
    //   for (let j = 0; j < matrix[0].length; j++) {
    //     if (matrix[i][j] != 0) {
    //       nx = x + (j - xC);
    //       ny = y + (i - yC);

    //       if (
    //         nx >= 0 &&
    //         nx < imageOut.getWidth() &&
    //         ny >= 0 &&
    //         ny < imageOut.getHeight()
    //       ) {
    //         resultRed += matrix[i][j] * imageIn.getIntComponent0(nx, ny);
    //         resultGreen += matrix[i][j] * imageIn.getIntComponent1(nx, ny);
    //         resultBlue += matrix[i][j] * imageIn.getIntComponent2(nx, ny);
    //       }
    //     }
    //   }
    // }

    let resultRed = Math.abs(result.resultRed);
    let resultGreen = Math.abs(result.resultGreen);
    let resultBlue = Math.abs(result.resultBlue);
    // allow the combination of multiple applications
    resultRed = (resultRed + imageOut.getIntComponent0(x, y)) % 255;
    resultGreen = (resultGreen + imageOut.getIntComponent1(x, y)) % 255;
    resultBlue = (resultBlue + imageOut.getIntComponent2(x, y)) % 255;
    
    // resultRed = Math.min(resultRed, 255);
    // resultGreen = Math.min(resultGreen, 255);
    // resultBlue = Math.min(resultBlue, 255);
    
    // resultRed = Math.max(resultRed, 0);
    // resultGreen = Math.max(resultGreen, 0);
    // resultBlue = Math.max(resultBlue, 0);
    
    // console.log("R: " + Math.floor(resultRed), " G: " + Math.floor(resultGreen), " B: " + Math.floor(resultBlue));
    imageOut.setIntColor(
      x,
      y,
      imageIn.getAlphaComponent(x, y),
      Math.floor(resultRed),
      Math.floor(resultGreen),
      Math.floor(resultBlue)
    );

    return imageOut;
  }
}
