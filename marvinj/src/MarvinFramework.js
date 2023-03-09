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

export default class Marvin {
  constructor(callback) {
    this.plugins = {};
  }
  // Alpha Boundary
  alphaBoundary(imageIn, imageOut, radius) {
    this.plugins.alphaBoundary = new AlphaBoundary();
    this.plugins.alphaBoundary.setAttribute("radius", radius);
    this.plugins.alphaBoundary.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Average Color
  averageColor(imageIn) {
    this.plugins.averageColor = new AverageColor();
    let attrOut = new MarvinAttributes();
    this.plugins.averageColor.process(
      imageIn,
      null,
      attrOut,
      MarvinImageMask.NULL_MASK,
      false
    );
    return attrOut.get("averageColor");
  }

  // Black And White
  blackAndWhite(imageIn, imageOut, level) {
    this.plugins.blackAndWhite = new BlackAndWhite();
    this.plugins.blackAndWhite.setAttribute("level", level);
    this.plugins.blackAndWhite.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // BoundaryFill
  boundaryFill(imageIn, imageOut, x, y, color, threshold) {
    this.plugins.boundaryFill = new BoundaryFill();
    this.plugins.boundaryFill.setAttribute("x", x);
    this.plugins.boundaryFill.setAttribute("y", y);
    this.plugins.boundaryFill.setAttribute("color", color);
    if (threshold != null) {
      this.plugins.boundaryFill.setAttribute("threshold", threshold);
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
  brightnessAndContrast(imageIn, imageOut, brightness, contrast) {
    this.plugins.brightnessAndContrast = new BrightnessAndContrast();
    this.plugins.brightnessAndContrast.setAttribute("brightness", brightness);
    this.plugins.brightnessAndContrast.setAttribute("contrast", contrast);
    this.plugins.brightnessAndContrast.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Color Channel
  colorChannel(imageIn, imageOut, red, green, blue) {
    this.plugins.colorChannel = new ColorChannel();
    this.plugins.colorChannel.setAttribute("red", red);
    this.plugins.colorChannel.setAttribute("green", green);
    this.plugins.colorChannel.setAttribute("blue", blue);
    this.plugins.colorChannel.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Color Channel
  crop(imageIn, imageOut, x, y, width, height) {
    this.plugins.crop = new Crop();
    this.plugins.crop.setAttribute("x", x);
    this.plugins.crop.setAttribute("y", y);
    this.plugins.crop.setAttribute("width", width);
    this.plugins.crop.setAttribute("height", height);
    this.plugins.crop.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Combine by Alpha
  combineByAlpha(imageIn, imageOther, imageOut, x, y) {
    this.plugins.combineByAlpha = new CombineByAlpha();
    this.plugins.combineByAlpha.setAttribute("imageOther", imageOther);
    this.plugins.combineByAlpha.setAttribute("x", x);
    this.plugins.combineByAlpha.setAttribute("y", y);
    this.plugins.combineByAlpha.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Emboss
  emboss(imageIn, imageOut) {
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
  halftoneErrorDiffusion(imageIn, imageOut) {
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
  findTextRegions(
    imageIn,
    maxWhiteSpace,
    maxFontLineWidth,
    minTextWidth,
    grayScaleThreshold
  ) {
    this.plugins.findTextRegions = new FindTextRegions();
    let attrOut = new MarvinAttributes();
    this.plugins.findTextRegions.setAttribute(
      "maxWhiteSpace",
      getValue(maxWhiteSpace, 10)
    );
    this.plugins.findTextRegions.setAttribute(
      "maxFontLineWidth",
      getValue(maxFontLineWidth, 10)
    );
    this.plugins.findTextRegions.setAttribute(
      "minTextWidth",
      getValue(minTextWidth, 30)
    );
    this.plugins.findTextRegions.setAttribute(
      "grayScaleThreshold",
      getValue(grayScaleThreshold, 127)
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
  floodfillSegmentation(imageIn) {
    this.plugins.floodfillSegmentation = new FloodfillSegmentation();
    let attrOut = new MarvinAttributes();
    this.plugins.floodfillSegmentation.setAttribute(
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
  gaussianBlur(imageIn, imageOut, radius) {
    this.plugins.gaussianBlur = new GaussianBlur();
    this.plugins.gaussianBlur.setAttribute("radius", getValue(radius, 3.0));
    this.plugins.gaussianBlur.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Invert
  invertColors(imageIn, imageOut) {
    this.plugins.invertColors = new Invert();
    this.plugins.invertColors.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  iteratedFunctionSystem(imageIn, imageOut, rules, iterations) {
    this.plugins.iteratedFunctionSystem = new IteratedFunctionSystem();
    this.plugins.iteratedFunctionSystem.setAttribute("rules", rules);
    this.plugins.iteratedFunctionSystem.setAttribute("iterations", iterations);
    this.plugins.iteratedFunctionSystem.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // GrayScale
  grayScale(imageIn, imageOut) {
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
  mergePhotos(images, imageOut, threshold) {
    this.plugins.mergePhotos = new MergePhotos();
    this.plugins.mergePhotos.setAttribute("threshold", threshold);
    this.plugins.mergePhotos.process(images, imageOut);
  }

  // Moravec
  moravec(imageIn, imageOut, matrixSize, threshold) {
    this.plugins.moravec = new Moravec();
    let attrOut = new MarvinAttributes();
    this.plugins.moravec.setAttribute("matrixSize", matrixSize);
    this.plugins.moravec.setAttribute("threshold", threshold);
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
  morphologicalDilation(imageIn, imageOut, matrix) {
    this.plugins.morphologicalDilation = new Dilation();
    this.plugins.morphologicalDilation.setAttribute("matrix", matrix);
    this.plugins.morphologicalDilation.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Morphological Erosion
  morphologicalErosion(imageIn, imageOut, matrix) {
    this.plugins.morphologicalErosion = new Erosion();
    this.plugins.morphologicalErosion.setAttribute("matrix", matrix);
    this.plugins.morphologicalErosion.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Morphological Closing
  morphologicalClosing(imageIn, imageOut, matrix) {
    this.plugins.morphologicalClosing = new Closing();
    this.plugins.morphologicalClosing.setAttribute("matrix", matrix);
    this.plugins.morphologicalClosing.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Prewitt
  prewitt(imageIn, imageOut, intensity) {
    this.plugins.prewitt = new Prewitt();
    this.plugins.prewitt.setAttribute("intensity", getValue(intensity, 1.0));
    this.plugins.prewitt.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Scale
  scale(imageIn, imageOut, newWidth, newHeight) {
    this.plugins.scale = new Scale();
    if (newHeight == null) {
      let factor = imageIn.getHeight() / imageIn.getWidth();
      newHeight = Math.floor(factor * newWidth);
    }

    this.plugins.scale.setAttribute("newWidth", newWidth);
    this.plugins.scale.setAttribute("newHeight", newHeight);
    this.plugins.scale.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Sepia
  sepia(imageIn, imageOut, intensity) {
    this.plugins.sepia = new Sepia();
    this.plugins.sepia.setAttribute("intensity", intensity);
    this.plugins.sepia.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // Thresholding
  thresholding(imageIn, imageOut, threshold, thresholdRange) {
    this.plugins.thresholding = new Thresholding();
    this.plugins.thresholding.setAttribute("threshold", threshold);
    this.plugins.thresholding.setAttribute("thresholdRange", thresholdRange);
    this.plugins.thresholding.process(
      imageIn,
      imageOut,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
  }

  // ThresholdingNeighborhood
  thresholdingNeighborhood(
    imageIn,
    imageOut,
    thresholdPercentageOfAverage,
    neighborhoodSide,
    samplingPixelDistance
  ) {
    this.plugins.thresholdingNeighborhood = new ThresholdingNeighborhood();
    this.plugins.thresholdingNeighborhood.setAttribute(
      "thresholdPercentageOfAverage",
      thresholdPercentageOfAverage
    );
    this.plugins.thresholdingNeighborhood.setAttribute(
      "neighborhoodSide",
      neighborhoodSide
    );
    this.plugins.thresholdingNeighborhood.setAttribute(
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
