import GaussianBlur from "./plugins/blur/GaussianBlur";
import AverageColor from "./plugins/color/AverageColor";
import BlackAndWhite from "./plugins/color/BlackAndWhite";
import BrightnessAndContrast from "./plugins/color/BrightnessAndContrast";
import ColorChannel from "./plugins/color/ColorChannel";
import Emboss from "./plugins/color/Emboss";
import GrayScale from "./plugins/color/GrayScale";
import Invert from "./plugins/color/Invert";
import Sepia from "./plugins/color/Sepia";
import Thresholding from "./plugins/color/Thresholding";
import ThresholdingNeighborhood from "./plugins/color/ThresholdingNeighborhood";
import CombineByAlpha from "./plugins/combine/CombineByAlpha";
import MergePhotos from "./plugins/combine/MergePhotos";
import Moravec from "./plugins/corner/Moravec";
import Prewitt from "./plugins/edge/Prewitt";
import BoundaryFill from "./plugins/fill/BoundaryFill";
import ErrorDiffusion from "./plugins/halftone/ErrorDiffusion";
import Closing from "./plugins/morphological/Closing";
import Dilation from "./plugins/morphological/Dilation";
import Erosion from "./plugins/morphological/Erosion";
import FindTextRegions from "./plugins/pattern/FindTextRegions";
import IteratedFunctionSystem from "./plugins/render/IteratedFunctionSystem";
import Crop from "./plugins/segmentation/Crop";
import FloodfillSegmentation from "./plugins/segmentation/FloodfillSegmentation";
import Scale from "./plugins/transform/Scale";
import AlphaBoundary from "./plugins/color/AlphaBoundary";
import MarvinAttributes from "./util/MarvinAttributes";
import MarvinImageMask from "./image/MarvinImageMask";
import MarvinBlob from "./image/MarvinBlob";
import MarvinImage from "./image/MarvinImage";
import * as fs from "fs";
import MarvinJSUtils from "./MarvinJSUtils";
import Flip from "./plugins/transform/Flip";
import Rotate from "./plugins/transform/Rotate";
import NoiseReduction from "./plugins/restoration/NoiseReduction";

export default class Marvin {
  private image: MarvinImage;
  constructor(image: MarvinImage) {
    this.image = image;
  }
  // Alpha Boundary
  alphaBoundary(radius) {
    const alphaBoundary = new AlphaBoundary();
    AlphaBoundary.setAttribute("radius", radius);
    this.image = alphaBoundary.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Average Color
  averageColor() {
    const averageColor = new AverageColor();
    const attrOut = new MarvinAttributes();
    averageColor.process(this.image, attrOut, MarvinImageMask.NULL_MASK, false);
    return attrOut.get("averageColor", null);
  }

  // Black And White
  blackAndWhite(level: number) {
    //check if level is a number between -100 and 100
    if (level < -100 || level > 100) {
      throw new Error("Level must be a number between -100 and 100");
    }
    const blackAndWhite = new BlackAndWhite();
    BlackAndWhite.setAttribute("level", level);
    this.image = blackAndWhite.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // BoundaryFill
  boundaryFill(x, y, color, threshold) {
    const boundaryFill = new BoundaryFill();
    BoundaryFill.setAttribute("x", x);
    BoundaryFill.setAttribute("y", y);
    BoundaryFill.setAttribute("color", color);
    if (threshold != null) {
      BoundaryFill.setAttribute("threshold", threshold);
    }

    this.image = boundaryFill.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Brightness and Contrast
  brightnessAndContrast(brightness, contrast) {
    const brightnessAndContrast = new BrightnessAndContrast();
    BrightnessAndContrast.setAttribute("brightness", brightness);
    BrightnessAndContrast.setAttribute("contrast", contrast);
    this.image = brightnessAndContrast.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Color Channel
  colorChannel(red, green, blue) {
    const colorChannel = new ColorChannel();
    ColorChannel.setAttribute("red", red);
    ColorChannel.setAttribute("green", green);
    ColorChannel.setAttribute("blue", blue);
    this.image = colorChannel.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Color Channel
  crop(x: number, y: number, width: number, height: number) {
    const crop = new Crop();
    Crop.setAttribute("x", x);
    Crop.setAttribute("y", y);
    Crop.setAttribute("width", width);
    Crop.setAttribute("height", height);
    this.image = crop.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Combine by Alpha
  combineByAlpha(imageOther: MarvinImage, x: number, y: number) {
    const combineByAlpha = new CombineByAlpha();
    CombineByAlpha.setAttribute("imageOther", imageOther);
    CombineByAlpha.setAttribute("x", x);
    CombineByAlpha.setAttribute("y", y);
    this.image = combineByAlpha.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Emboss
  emboss() {
    const emboss = new Emboss();
    this.image = emboss.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Emboss
  halftoneErrorDiffusion() {
    const halftoneErrorDiffusion = new ErrorDiffusion();
    this.image = halftoneErrorDiffusion.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // FindTextRegions
  findTextRegions(
    maxWhiteSpace = 10,
    maxFontLineWidth = 10,
    minTextWidth = 30,
    grayScaleThreshold = 127
  ) {
    const findTextRegions = new FindTextRegions();
    const attrOut = new MarvinAttributes();
    FindTextRegions.setAttribute("maxWhiteSpace", maxWhiteSpace);
    FindTextRegions.setAttribute("maxFontLineWidth", maxFontLineWidth);
    FindTextRegions.setAttribute("minTextWidth", minTextWidth);
    FindTextRegions.setAttribute("grayScaleThreshold", grayScaleThreshold);
    findTextRegions.process(
      this.image,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("matches");
  }

  // Floodfill Segmentation
  floodfillSegmentation() {
    const floodfillSegmentation = new FloodfillSegmentation();
    const attrOut = new MarvinAttributes();
    FloodfillSegmentation.setAttribute("returnType", "MarvinSegment");
    floodfillSegmentation.process(
      this.image,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("segments");
  }

  // Gaussian Blur
  gaussianBlur(radius) {
    const gaussianBlur = new GaussianBlur();
    GaussianBlur.setAttribute("radius", radius);
    this.image = gaussianBlur.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Invert
  invertColors() {
    const invertColors = new Invert();
    this.image = invertColors.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  iteratedFunctionSystem(rules: string, iterations: number) {
    const iteratedFunctionSystem = new IteratedFunctionSystem();
    IteratedFunctionSystem.setAttribute("rules", rules);
    IteratedFunctionSystem.setAttribute("iterations", iterations);
    this.image = iteratedFunctionSystem.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // GrayScale
  grayScale() {
    const grayScale = new GrayScale();
    this.image = grayScale.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  //Merge Photos
  mergePhotos(images: MarvinImage[], threshold: number) {
    const mergePhotos = new MergePhotos();
    if (!threshold) threshold = 0.5;
    MergePhotos.setAttribute("threshold", threshold);
    this.image = mergePhotos.process(images, this.image);
    return this;
  }

  // Moravec
  moravec(matrixSize, threshold) {
    const moravec = new Moravec();
    const attrOut = new MarvinAttributes();
    Moravec.setAttribute("matrixSize", matrixSize);
    Moravec.setAttribute("threshold", threshold);
    moravec.process(this.image, attrOut, MarvinImageMask.NULL_MASK, false);
    const res: number[][] = attrOut.get("cornernessMap");
    const coords = [];
    res.forEach((_, i) => {
      _.forEach((_, j) => {
        if (res[i][j] > 0) {
          coords.push({ x: i, y: j });
        }
      });
    });
    return coords;
  }

  // Morphological Dilation
  morphologicalDilation(matrix?: number[][]) {
    const morphologicalDilation = new Dilation();
    if (!matrix) {
      matrix = MarvinJSUtils.createMatrix2D(
        this.image.width,
        this.image.height,
        1
      );
    }
    Dilation.setAttribute("matrix", matrix);
    this.image = morphologicalDilation.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Morphological Erosion
  morphologicalErosion(matrix?: number[][]) {
    const morphologicalErosion = new Erosion();
    if (!matrix) {
      matrix = MarvinJSUtils.createMatrix2D(
        this.image.width,
        this.image.height,
        1
      );
    }
    Erosion.setAttribute("matrix", matrix);
    this.image = morphologicalErosion.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Morphological Closing
  morphologicalClosing(matrix?: number[][]) {
    const morphologicalClosing = new Closing();
    if (!matrix) {
      matrix = MarvinJSUtils.createMatrix2D(
        this.image.width,
        this.image.height,
        1
      );
    }
    Closing.setAttribute("matrix", matrix);
    this.image = morphologicalClosing.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Prewitt
  prewitt(intensity) {
    const prewitt = new Prewitt();
    Prewitt.setAttribute("intensity", intensity);
    this.image = prewitt.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Scale
  scale(newWidth, newHeight) {
    const scale = new Scale();
    if (newHeight == null) {
      const factor = this.image.getHeight() / this.image.getWidth();
      newHeight = Math.floor(factor * newWidth);
    }

    Scale.setAttribute("newWidth", newWidth);
    Scale.setAttribute("newHeight", newHeight);
    this.image = scale.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Sepia
  sepia(intensity) {
    const sepia = new Sepia();
    Sepia.setAttribute("intensity", intensity);
    this.image = sepia.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Thresholding
  thresholding(threshold: number, thresholdRange: boolean) {
    const thresholding = new Thresholding();
    Thresholding.setAttribute("threshold", threshold);
    Thresholding.setAttribute("thresholdRange", thresholdRange);
    this.image = thresholding.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // ThresholdingNeighborhood
  thresholdingNeighborhood(
    thresholdPercentageOfAverage,
    neighborhoodSide,
    samplingPixelDistance
  ) {
    const thresholdingNeighborhood = new ThresholdingNeighborhood();
    ThresholdingNeighborhood.setAttribute(
      "thresholdPercentageOfAverage",
      thresholdPercentageOfAverage
    );
    ThresholdingNeighborhood.setAttribute("neighborhoodSide", neighborhoodSide);
    ThresholdingNeighborhood.setAttribute(
      "samplingPixelDistance",
      samplingPixelDistance
    );
    this.image = thresholdingNeighborhood.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );

    return this;
  }

  // Flip Horizontal
  flipHorizontal() {
    const flip = new Flip();
    Flip.setAttribute("flip", "horizontal");
    this.image = flip.process(this.image, null, MarvinImageMask.NULL_MASK);
    return this;
  }

  // Flip Vertical
  flipVertical() {
    const flip = new Flip();
    Flip.setAttribute("flip", "vertical");
    this.image = flip.process(this.image, null, MarvinImageMask.NULL_MASK);
    return this;
  }

  // Flip Both
  flipBoth() {
    const flip = new Flip();
    Flip.setAttribute("flip", "both");
    this.image = flip.process(this.image, null, MarvinImageMask.NULL_MASK);
    return this;
  }

  rotate(angle: number) {
    const rotate = new Rotate();
    this.image = rotate.process(
      this.image,
      angle,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  //Reduce Noise
  /**
   * @param iter number of iterations to reduce noise. Default is 20
   * @param threshold threshold to reduce noise. Default is 0.4
   * @returns an instance of Marvin
   */
  noiseReduction(iter = 20, threshold = 0.4) {
    const reduceNoise = new NoiseReduction();
    this.image = reduceNoise.process(this.image, iter, threshold);
    return this;
  }
  //Output
  output() {
    return this.image;
  }

  // Save
  save(path) {
    fs.writeFileSync(path, this.image.getBuffer());
  }
}
