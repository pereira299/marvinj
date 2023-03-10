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

export default class Marvin {
  plugins = {
    alphaBoundary: new AlphaBoundary(),
    averageColor: new AverageColor(),
    blackAndWhite: new BlackAndWhite(),
    boundaryFill: new BoundaryFill(),
    brightnessAndContrast: new BrightnessAndContrast(),
    colorChannel: new ColorChannel(),
    combineByAlpha: new CombineByAlpha(),
    morphologicalClosing: new Closing(),
    crop: new Crop(),
    morphologicalDilation: new Dilation(),
    emboss: new Emboss(),
    morphologicalErosion: new Erosion(),
    findTextRegions: new FindTextRegions(),
    floodfillSegmentation: new FloodfillSegmentation(),
    gaussianBlur: new GaussianBlur(),
    grayScale: new GrayScale(),
    invertColors: new Invert(),
    iteratedFunctionSystem: new IteratedFunctionSystem(),
    mergePhotos: new MergePhotos(),
    moravec: new Moravec(),
    prewitt: new Prewitt(),
    scale: new Scale(),
    sepia: new Sepia(),
    thresholding: new Thresholding(),
    thresholdingNeighborhood: new ThresholdingNeighborhood(),
    halftoneErrorDiffusion: new ErrorDiffusion(),
  };
  private image: MarvinImage;
  constructor(image: MarvinImage) {
    this.image = image;
  }
  // Alpha Boundary
  alphaBoundary(radius) {
    this.plugins.alphaBoundary = new AlphaBoundary();
    AlphaBoundary.setAttribute("radius", radius);
    this.image = this.plugins.alphaBoundary.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Average Color
  averageColor() {
    this.plugins.averageColor = new AverageColor();
    const attrOut = new MarvinAttributes();
    this.plugins.averageColor.process(
      this.image,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("averageColor", null);
  }

  // Black And White
  blackAndWhite(level) {
    this.plugins.blackAndWhite = new BlackAndWhite();
    BlackAndWhite.setAttribute("level", level);
    this.image = this.plugins.blackAndWhite.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // BoundaryFill
  boundaryFill(x, y, color, threshold) {
    this.plugins.boundaryFill = new BoundaryFill();
    BoundaryFill.setAttribute("x", x);
    BoundaryFill.setAttribute("y", y);
    BoundaryFill.setAttribute("color", color);
    if (threshold != null) {
      BoundaryFill.setAttribute("threshold", threshold);
    }

    this.image = this.plugins.boundaryFill.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Brightness and Contrast
  brightnessAndContrast(brightness, contrast) {
    this.plugins.brightnessAndContrast = new BrightnessAndContrast();
    BrightnessAndContrast.setAttribute("brightness", brightness);
    BrightnessAndContrast.setAttribute("contrast", contrast);
    this.image = this.plugins.brightnessAndContrast.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Color Channel
  colorChannel(red, green, blue) {
    this.plugins.colorChannel = new ColorChannel();
    ColorChannel.setAttribute("red", red);
    ColorChannel.setAttribute("green", green);
    ColorChannel.setAttribute("blue", blue);
    this.image = this.plugins.colorChannel.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Color Channel
  crop(x: number, y: number, width: number, height: number) {
    this.plugins.crop = new Crop();
    Crop.setAttribute("x", x);
    Crop.setAttribute("y", y);
    Crop.setAttribute("width", width);
    Crop.setAttribute("height", height);
    this.image = this.plugins.crop.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Combine by Alpha
  combineByAlpha(imageOther: MarvinImage, x: number, y: number) {
    this.plugins.combineByAlpha = new CombineByAlpha();
    CombineByAlpha.setAttribute("imageOther", imageOther);
    CombineByAlpha.setAttribute("x", x);
    CombineByAlpha.setAttribute("y", y);
    this.image = this.plugins.combineByAlpha.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Emboss
  emboss() {
    this.plugins.emboss = new Emboss();
    this.image = this.plugins.emboss.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Emboss
  halftoneErrorDiffusion() {
    this.plugins.halftoneErrorDiffusion = new ErrorDiffusion();
    this.image = this.plugins.halftoneErrorDiffusion.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // FindTextRegions
  findTextRegions(
    maxWhiteSpace,
    maxFontLineWidth,
    minTextWidth,
    grayScaleThreshold
  ) {
    this.plugins.findTextRegions = new FindTextRegions();
    const attrOut = new MarvinAttributes();
    const tempBlob = new MarvinBlob(this.image.width, this.image.height);
    FindTextRegions.setAttribute(
      "maxWhiteSpace",
      tempBlob.getValue(maxWhiteSpace, 10)
    );
    FindTextRegions.setAttribute(
      "maxFontLineWidth",
      tempBlob.getValue(maxFontLineWidth, 10)
    );
    FindTextRegions.setAttribute(
      "minTextWidth",
      tempBlob.getValue(minTextWidth, 30)
    );
    FindTextRegions.setAttribute(
      "grayScaleThreshold",
      tempBlob.getValue(grayScaleThreshold, 127)
    );
    this.plugins.findTextRegions.process(
      this.image,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("matches");
  }

  // Floodfill Segmentation
  floodfillSegmentation() {
    this.plugins.floodfillSegmentation = new FloodfillSegmentation();
    const attrOut = new MarvinAttributes();
    FloodfillSegmentation.setAttribute("returnType", "MarvinSegment");
    this.plugins.floodfillSegmentation.process(
      this.image,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("segments");
  }

  // Gaussian Blur
  gaussianBlur(radius) {
    this.plugins.gaussianBlur = new GaussianBlur();
    const tempBlob = new MarvinBlob(this.image.width, this.image.height);
    GaussianBlur.setAttribute("radius", tempBlob.getValue(radius, 3.0));
    this.image = this.plugins.gaussianBlur.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Invert
  invertColors() {
    this.plugins.invertColors = new Invert();
    this.image = this.plugins.invertColors.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  iteratedFunctionSystem(rules: string, iterations: number) {
    this.plugins.iteratedFunctionSystem = new IteratedFunctionSystem();
    IteratedFunctionSystem.setAttribute("rules", rules);
    IteratedFunctionSystem.setAttribute("iterations", iterations);
    this.image = this.plugins.iteratedFunctionSystem.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // GrayScale
  grayScale() {
    this.plugins.grayScale = new GrayScale();
    this.image = this.plugins.grayScale.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  //Merge Photos
  mergePhotos(images: MarvinImage[], threshold: number) {
    this.plugins.mergePhotos = new MergePhotos();
    MergePhotos.setAttribute("threshold", threshold);
    this.image = this.plugins.mergePhotos.process(images, this.image);
    return this;
  }

  // Moravec
  moravec(matrixSize, threshold) {
    this.plugins.moravec = new Moravec();
    const attrOut = new MarvinAttributes();
    Moravec.setAttribute("matrixSize", matrixSize);
    Moravec.setAttribute("threshold", threshold);
    this.plugins.moravec.process(
      this.image,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("cornernessMap");
  }

  // Morphological Dilation
  morphologicalDilation(matrix) {
    this.plugins.morphologicalDilation = new Dilation();
    Dilation.setAttribute("matrix", matrix);
    this.image = this.plugins.morphologicalDilation.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Morphological Erosion
  morphologicalErosion(matrix) {
    this.plugins.morphologicalErosion = new Erosion();
    Erosion.setAttribute("matrix", matrix);
    this.image = this.plugins.morphologicalErosion.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Morphological Closing
  morphologicalClosing(matrix) {
    this.plugins.morphologicalClosing = new Closing();
    Closing.setAttribute("matrix", matrix);
    this.image = this.plugins.morphologicalClosing.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Prewitt
  prewitt(intensity) {
    this.plugins.prewitt = new Prewitt();
    const tempBlob = new MarvinBlob(this.image.width, this.image.height);
    Prewitt.setAttribute("intensity", tempBlob.getValue(intensity, 1.0));
    this.image = this.plugins.prewitt.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Scale
  scale(newWidth, newHeight) {
    this.plugins.scale = new Scale();
    if (newHeight == null) {
      const factor = this.image.getHeight() / this.image.getWidth();
      newHeight = Math.floor(factor * newWidth);
    }

    Scale.setAttribute("newWidth", newWidth);
    Scale.setAttribute("newHeight", newHeight);
    this.image = this.plugins.scale.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Sepia
  sepia(intensity) {
    this.plugins.sepia = new Sepia();
    Sepia.setAttribute("intensity", intensity);
    this.image = this.plugins.sepia.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Thresholding
  thresholding(threshold:number, thresholdRange: boolean) {
    this.plugins.thresholding = new Thresholding();
    Thresholding.setAttribute("threshold", threshold);
    Thresholding.setAttribute("thresholdRange", thresholdRange);
    this.image = this.plugins.thresholding.process(
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
    this.plugins.thresholdingNeighborhood = new ThresholdingNeighborhood();
    ThresholdingNeighborhood.setAttribute(
      "thresholdPercentageOfAverage",
      thresholdPercentageOfAverage
    );
    ThresholdingNeighborhood.setAttribute("neighborhoodSide", neighborhoodSide);
    ThresholdingNeighborhood.setAttribute(
      "samplingPixelDistance",
      samplingPixelDistance
    );
    this.image = this.plugins.thresholdingNeighborhood.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );

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
