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

export default class Marvin {
  static plugins = {
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
  constructor() {}
  // Alpha Boundary
  static alphaBoundary(imageIn, imageOut, radius) {
    this.plugins.alphaBoundary = new AlphaBoundary();
    AlphaBoundary.setAttribute("radius", radius);
    this.plugins.alphaBoundary.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Average Color
  static averageColor(imageIn) {
    this.plugins.averageColor = new AverageColor();
    const attrOut = new MarvinAttributes();
    this.plugins.averageColor.process(
      imageIn,
      null,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("averageColor", null);
  }

  // Black And White
  static blackAndWhite(imageIn, imageOut, level) {
    this.plugins.blackAndWhite = new BlackAndWhite();
    BlackAndWhite.setAttribute("level", level);
    this.plugins.blackAndWhite.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // BoundaryFill
  static boundaryFill(imageIn, imageOut, x, y, color, threshold) {
    this.plugins.boundaryFill = new BoundaryFill();
    BoundaryFill.setAttribute("x", x);
    BoundaryFill.setAttribute("y", y);
    BoundaryFill.setAttribute("color", color);
    if (threshold != null) {
      BoundaryFill.setAttribute("threshold", threshold);
    }

    this.plugins.boundaryFill.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Brightness and Contrast
  static brightnessAndContrast(imageIn, imageOut, brightness, contrast) {
    this.plugins.brightnessAndContrast = new BrightnessAndContrast();
    BrightnessAndContrast.setAttribute("brightness", brightness);
    BrightnessAndContrast.setAttribute("contrast", contrast);
    this.plugins.brightnessAndContrast.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Color Channel
  static colorChannel(imageIn, imageOut, red, green, blue) {
    this.plugins.colorChannel = new ColorChannel();
    ColorChannel.setAttribute("red", red);
    ColorChannel.setAttribute("green", green);
    ColorChannel.setAttribute("blue", blue);
    this.plugins.colorChannel.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Color Channel
  static crop(imageIn, imageOut, x, y, width, height) {
    this.plugins.crop = new Crop();
    Crop.setAttribute("x", x);
    Crop.setAttribute("y", y);
    Crop.setAttribute("width", width);
    Crop.setAttribute("height", height);
    this.plugins.crop.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Combine by Alpha
  static combineByAlpha(imageIn, imageOther, imageOut, x, y) {
    this.plugins.combineByAlpha = new CombineByAlpha();
    CombineByAlpha.setAttribute("imageOther", imageOther);
    CombineByAlpha.setAttribute("x", x);
    CombineByAlpha.setAttribute("y", y);
    this.plugins.combineByAlpha.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Emboss
  static emboss(imageIn, imageOut) {
    this.plugins.emboss = new Emboss();
    this.plugins.emboss.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Emboss
  static halftoneErrorDiffusion(imageIn, imageOut) {
    this.plugins.halftoneErrorDiffusion = new ErrorDiffusion();
    this.plugins.halftoneErrorDiffusion.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // FindTextRegions
  static findTextRegions(
    imageIn,
    maxWhiteSpace,
    maxFontLineWidth,
    minTextWidth,
    grayScaleThreshold
  ) {
    this.plugins.findTextRegions = new FindTextRegions();
    const attrOut = new MarvinAttributes();
    FindTextRegions.setAttribute(
      "maxWhiteSpace",
      MarvinBlob.getValue(maxWhiteSpace, 10)
    );
    FindTextRegions.setAttribute(
      "maxFontLineWidth",
      MarvinBlob.getValue(maxFontLineWidth, 10)
    );
    FindTextRegions.setAttribute(
      "minTextWidth",
      MarvinBlob.getValue(minTextWidth, 30)
    );
    FindTextRegions.setAttribute(
      "grayScaleThreshold",
      MarvinBlob.getValue(grayScaleThreshold, 127)
    );
    this.plugins.findTextRegions.process(
      imageIn,
      null,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("matches");
  }

  // Floodfill Segmentation
  static floodfillSegmentation(imageIn) {
    this.plugins.floodfillSegmentation = new FloodfillSegmentation();
    const attrOut = new MarvinAttributes();
    FloodfillSegmentation.setAttribute(
      "returnType",
      "MarvinSegment"
    );
    this.plugins.floodfillSegmentation.process(
      imageIn,
      null,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("segments");
  }

  // Gaussian Blur
  static gaussianBlur(imageIn, imageOut, radius) {
    this.plugins.gaussianBlur = new GaussianBlur();
    GaussianBlur.setAttribute("radius", MarvinBlob.getValue(radius, 3.0));
    this.plugins.gaussianBlur.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Invert
  static invertColors(imageIn, imageOut) {
    this.plugins.invertColors = new Invert();
    this.plugins.invertColors.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  static iteratedFunctionSystem(imageIn, imageOut, rules, iterations) {
    this.plugins.iteratedFunctionSystem = new IteratedFunctionSystem();
    IteratedFunctionSystem.setAttribute("rules", rules);
    IteratedFunctionSystem.setAttribute("iterations", iterations);
    this.plugins.iteratedFunctionSystem.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // GrayScale
  static grayScale(imageIn, imageOut) {
    this.plugins.grayScale = new GrayScale();
    this.plugins.grayScale.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  //Merge Photos
  static mergePhotos(images, imageOut, threshold) {
    this.plugins.mergePhotos = new MergePhotos();
    MergePhotos.setAttribute("threshold", threshold);
    this.plugins.mergePhotos.process(images, imageOut);
  }

  // Moravec
  static moravec(imageIn, imageOut, matrixSize, threshold) {
    this.plugins.moravec = new Moravec();
    const attrOut = new MarvinAttributes();
    Moravec.setAttribute("matrixSize", matrixSize);
    Moravec.setAttribute("threshold", threshold);
    this.plugins.moravec.process(
      imageIn,
      imageOut,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("cornernessMap");
  }

  // Morphological Dilation
  static morphologicalDilation(imageIn, imageOut, matrix) {
    this.plugins.morphologicalDilation = new Dilation();
    Dilation.setAttribute("matrix", matrix);
    this.plugins.morphologicalDilation.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Morphological Erosion
  static morphologicalErosion(imageIn, imageOut, matrix) {
    this.plugins.morphologicalErosion = new Erosion();
    Erosion.setAttribute("matrix", matrix);
    this.plugins.morphologicalErosion.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Morphological Closing
  static morphologicalClosing(imageIn, imageOut, matrix) {
    this.plugins.morphologicalClosing = new Closing();
    Closing.setAttribute("matrix", matrix);
    this.plugins.morphologicalClosing.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Prewitt
  static prewitt(imageIn, imageOut, intensity) {
    this.plugins.prewitt = new Prewitt();
    Prewitt.setAttribute("intensity", MarvinBlob.getValue(intensity, 1.0));
    this.plugins.prewitt.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Scale
  static scale(imageIn, imageOut, newWidth, newHeight) {
    this.plugins.scale = new Scale();
    if (newHeight == null) {
      const factor = imageIn.getHeight() / imageIn.getWidth();
      newHeight = Math.floor(factor * newWidth);
    }

    Scale.setAttribute("newWidth", newWidth);
    Scale.setAttribute("newHeight", newHeight);
    this.plugins.scale.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Sepia
  static sepia(imageIn, imageOut, intensity) {
    this.plugins.sepia = new Sepia();
    Sepia.setAttribute("intensity", intensity);
    this.plugins.sepia.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Thresholding
  static thresholding(imageIn, imageOut, threshold, thresholdRange) {
    this.plugins.thresholding = new Thresholding();
     Thresholding.setAttribute("threshold", threshold);
     Thresholding.setAttribute("thresholdRange", thresholdRange);
    this.plugins.thresholding.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // ThresholdingNeighborhood
  static thresholdingNeighborhood(
    imageIn,
    imageOut,
    thresholdPercentageOfAverage,
    neighborhoodSide,
    samplingPixelDistance
  ) {
    this.plugins.thresholdingNeighborhood = new ThresholdingNeighborhood();
    ThresholdingNeighborhood.setAttribute(
      "thresholdPercentageOfAverage",
      thresholdPercentageOfAverage
    );
    ThresholdingNeighborhood.setAttribute(
      "neighborhoodSide",
      neighborhoodSide
    );
    ThresholdingNeighborhood.setAttribute(
      "samplingPixelDistance",
      samplingPixelDistance
    );
    this.plugins.thresholdingNeighborhood.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }
}
