import MarvinImage from "../../image/MarvinImage";

export default class Canny {
  process(
    imageData: MarvinImage,
    lowThreshold: number,
    highThreshold: number
  ): MarvinImage {
    // Converter a imagem para escala de cinza
    const grayData = this.grayscale(imageData);

    // Aplicar filtro Gaussiano para suavizar a imagem
    const blurredData = this.gaussianBlur(grayData);

    // Calcular gradiente da imagem
    const { magnitude, direction } = this.sobelFilter(blurredData);

    // Aplicar supressão de não-máximos para afinar as bordas
    const suppressedData = this.nonMaxSuppression(magnitude, direction);

    // Aplicar limiarização com histerese para finalizar a detecção de bordas
    const thresholdedData = this.hysteresisThresholding(
      suppressedData,
      lowThreshold,
      highThreshold
    );

    return thresholdedData;
  }

  getMatrix(image: MarvinImage) {
    // return array of light pixels coordinates
    const matrix = [];
    for (let x = 0; x < image.getWidth(); x++) {
      const row = [];
      for (let y = 0; y < image.getHeight(); y++) {
        
        if (image.getIntComponent0(x, y) > 0) {
          row.push({x, y});
        }
      }
      matrix.push(row);
    }
    return matrix;
  }
  grayscale(imageData: MarvinImage): MarvinImage {
    const width = imageData.getWidth();
    const height = imageData.getHeight();

    const grayData = new MarvinImage(width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const red = imageData.getIntComponent0(x, y);
        const green = imageData.getIntComponent1(x, y);
        const blue = imageData.getIntComponent2(x, y);

        const gray = 0.299 * red + 0.587 * green + 0.114 * blue;

        grayData.setIntColor(x, y, gray, gray, gray);
      }
    }

    return grayData;
  }

  gaussianBlur(imageData: MarvinImage): MarvinImage {
    const width = imageData.getWidth();
    const height = imageData.getHeight();

    const blurredData = new MarvinImage(width, height);

    const kernelSize = 5;
    const halfKernelSize = Math.floor(kernelSize / 2);
    const kernel = this.createGaussianKernel(kernelSize);

    const grayMatrix = [];
    for (let x = 0; x < width; x++) {
      const grayRow = [];
      for (let y = 0; y < height; y++) {
        grayRow.push(imageData.getIntComponent0(x, y));
      }
      grayMatrix.push(grayRow);
    }

    const precalculatedKernel = [];
    let sumWeights = 0;
    for (let i = 0; i < kernelSize; i++) {
      const row = [];
      for (let j = 0; j <= i; j++) {
        const weight = kernel[i][j];
        row.push(weight);
        sumWeights += weight * (i == j ? 1 : 2);
      }
      precalculatedKernel.push(row);
    }

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let sum = 0;

        for (let i = 0; i < kernelSize; i++) {
          const row = precalculatedKernel[i];
          for (let j = 0; j < row.length; j++) {
            const x1 = x + j - halfKernelSize;
            const x2 = x - j + halfKernelSize;
            const y1 = y + i - halfKernelSize;
            const y2 = y - i + halfKernelSize;

            if (x1 >= 0 && x1 < width && y1 >= 0 && y1 < height) {
              sum += grayMatrix[x1][y1] * row[j];
            }
            if (x2 >= 0 && x2 < width && y2 >= 0 && y2 < height && j != 0) {
              sum += grayMatrix[x2][y2] * row[j];
            }
          }
        }

        const gray = Math.round(sum / sumWeights);
        blurredData.setIntColor(x, y, gray, gray, gray);
      }
    }

    return blurredData;
  }

  sobelFilter(imageData: MarvinImage): {
    magnitude: MarvinImage;
    direction: MarvinImage;
  } {
    const width = imageData.getWidth();
    const height = imageData.getHeight();

    const magnitude = new MarvinImage(width, height);
    const direction = new MarvinImage(width, height);

    const kernel = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];

    for (let x = 1; x < width - 1; x++) {
      for (let y = 1; y < height - 1; y++) {
        let sumX = 0;
        let sumY = 0;

        for (let i = 0; i < 3; i++) {
          const xKernel = x + i - 1;

          for (let j = 0; j < 3; j++) {
            const yKernel = y + j - 1;
            const gray = imageData.getIntComponent0(xKernel, yKernel);
            const weight = kernel[i][j];

            sumX += gray * weight;
            sumY += (gray * weight) << 1; // Bitwise shift for faster calculation
          }
        }

        const magnitudeValue = Math.sqrt(sumX ** 2 + sumY ** 2);
        const directionValue = Math.atan2(sumY, sumX);

        magnitude.setIntColor(
          x,
          y,
          magnitudeValue,
          magnitudeValue,
          magnitudeValue
        );
        direction.setIntColor(
          x,
          y,
          directionValue,
          directionValue,
          directionValue
        );
      }
    }

    return { magnitude, direction };
  }

  nonMaxSuppression(
    magnitude: MarvinImage,
    direction: MarvinImage
  ): MarvinImage {
    const width = magnitude.getWidth();
    const height = magnitude.getHeight();

    const suppressedData = new MarvinImage(width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const magnitudeValue = magnitude.getIntComponent0(x, y);
        const directionValue = direction.getIntComponent0(x, y);

        let magnitude1 = 0;
        let magnitude2 = 0;

        if (directionValue >= -Math.PI / 8 && directionValue <= Math.PI / 8) {
          magnitude1 = magnitude.getIntComponent0(x - 1, y);
          magnitude2 = magnitude.getIntComponent0(x + 1, y);
        } else if (
          directionValue > Math.PI / 8 &&
          directionValue <= (3 * Math.PI) / 8
        ) {
          magnitude1 = magnitude.getIntComponent0(x - 1, y - 1);
          magnitude2 = magnitude.getIntComponent0(x + 1, y + 1);
        } else if (
          directionValue > (3 * Math.PI) / 8 &&
          directionValue <= (5 * Math.PI) / 8
        ) {
          magnitude1 = magnitude.getIntComponent0(x, y - 1);
          magnitude2 = magnitude.getIntComponent0(x, y + 1);
        } else if (
          directionValue > (5 * Math.PI) / 8 &&
          directionValue <= (7 * Math.PI) / 8
        ) {
          magnitude1 = magnitude.getIntComponent0(x - 1, y + 1);
          magnitude2 = magnitude.getIntComponent0(x + 1, y - 1);
        } else {
          magnitude1 = magnitude.getIntComponent0(x - 1, y);
          magnitude2 = magnitude.getIntComponent0(x + 1, y);
        }

        let suppressedValue = magnitudeValue;

        if (magnitudeValue < magnitude1 || magnitudeValue < magnitude2) {
          suppressedValue = 0;
        }

        suppressedData.setIntColor(
          x,
          y,
          suppressedValue,
          suppressedValue,
          suppressedValue
        );
      }
    }

    return suppressedData;
  }

  hysteresisThresholding(
    imageData: MarvinImage,
    lowThreshold: number,
    highThreshold: number
  ): MarvinImage {
    const width = imageData.getWidth();
    const height = imageData.getHeight();

    const thresholdedData = new MarvinImage(width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const gray = imageData.getIntComponent0(x, y);

        let thresholdedValue = 0;

        if (gray >= highThreshold) {
          thresholdedValue = 255;
        } else if (gray >= lowThreshold) {
          thresholdedValue = 128;
        }

        thresholdedData.setIntColor(
          x,
          y,
          thresholdedValue,
          thresholdedValue,
          thresholdedValue
        );
      }
    }

    return thresholdedData;
  }

  private createGaussianKernel(kernelSize: number): number[][] {
    const kernel = [];

    for (let i = 0; i < kernelSize; i++) {
      kernel[i] = [];

      for (let j = 0; j < kernelSize; j++) {
        const x = i - Math.floor(kernelSize / 2);
        const y = j - Math.floor(kernelSize / 2);

        kernel[i][j] = this.gaussian(x, y);
      }
    }

    return kernel;
  }

  private gaussian(x: number, y: number): number {
    const sigma = 1;
    const sigma2 = sigma * sigma;
    const sigma2Pi = sigma2 * Math.PI;

    return Math.exp(-(x ** 2 + y ** 2) / (2 * sigma2)) / sigma2Pi;
  }
}
