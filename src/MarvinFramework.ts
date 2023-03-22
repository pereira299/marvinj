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
import MarvinImage from "./image/MarvinImage";
import * as fs from "fs";
import MarvinJSUtils from "./MarvinJSUtils";
import Flip from "./plugins/transform/Flip";
import Rotate from "./plugins/transform/Rotate";
import NoiseReduction from "./plugins/restoration/NoiseReduction";
import RemoveBackground from "./plugins/background/RemoveBackground";
import DrawLine from "./plugins/draw/Line";
import MarvinColorModelConverter from "./color/MarvinColorModelConverter";
import HeatMap from "./plugins/color/HeatMap";
import Sobel from "./plugins/edge/Sobel";
import Canny from "./plugins/edge/Canny";
import Posterization from "./plugins/color/posterization";
import Rect from "./plugins/draw/Rect";
import Curve from "./plugins/draw/Curve";
import Circle from "./plugins/draw/Circle";
import Ellipse from "./plugins/draw/Ellipse";
import Star from "./plugins/draw/Star";

export default class Marvin {
  private image: MarvinImage;
  private x: number;
  private y: number;

  constructor(image: MarvinImage) {
    this.image = image;
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
  /**
   * Applies a color channel to the image
   * @param color - string of hex color
   * @param intensity - number between 0 and 1
   * @returns Marvin instance
   * @example
   * new Marvin(image).colorChannel("#ff0000", 0.5)
   **/
  colorChannel(color, intensity = 0.2) {
    const [red, green, blue] = MarvinColorModelConverter.hexToRgb(color);

    const colorChannel = new ColorChannel();
    ColorChannel.setAttribute("red", red);
    ColorChannel.setAttribute("green", green);
    ColorChannel.setAttribute("blue", blue);
    this.image = colorChannel.process(this.image, intensity);
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
  moravec(matrixSize, threshold, preview = false) {
    const moravec = new Moravec();
    const attrOut = new MarvinAttributes();
    Moravec.setAttribute("matrixSize", matrixSize);
    Moravec.setAttribute("threshold", threshold);
    moravec.process(this.image, attrOut, MarvinImageMask.NULL_MASK, preview);
    const res = attrOut.get("cornernessMap");

    return res;
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

  // Sobel
  sobel(intensity) {
    const sobel = new Sobel();
    Sobel.setAttribute("intensity", intensity);
    this.image = sobel.process(
      this.image,
      null,
      MarvinImageMask.NULL_MASK,
      false
    );
    return this;
  }

  // Canny
  canny(lowThreshold: number, highThreshold: number) {
    const canny = new Canny();
    this.image = canny.process(this.image, lowThreshold, highThreshold);
    return this;
  }

  cannyMatrix(lowThreshold: number, highThreshold: number) {
    const canny = new Canny();
    this.image = canny.process(this.image, lowThreshold, highThreshold);
    return canny.getMatrix(this.image);
  }

  // Posterize
  posterize(levels) {
    const posterize = new Posterization();
    this.image = posterize.process(this.image, levels);
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
  thresholding(threshold: number) {
    const thresholding = new Thresholding();
    const mask = new MarvinImageMask(
      this.image.getWidth(),
      this.image.getHeight()
    );
    Thresholding.setAttribute("threshold", threshold);
    this.image = thresholding.process(this.image, null, mask, false);
    return this;
  }

  // Flip Horizontal
  /**
   * flip image horizontally
   * @returns Marvin instance
   * @example
   * new Marvin(MarvinImageExemple).flipHorizontal()
   */
  flipHorizontal() {
    const flip = new Flip();
    Flip.setAttribute("flip", "horizontal");
    this.image = flip.process(this.image, null, MarvinImageMask.NULL_MASK);
    return this;
  }

  // Flip Vertical
  /**
   * flip image vertically
   * @returns Marvin instance
   * @example
   * new Marvin(MarvinImageExemple).flipVertical()
   */
  flipVertical() {
    const flip = new Flip();
    Flip.setAttribute("flip", "vertical");
    this.image = flip.process(this.image, null, MarvinImageMask.NULL_MASK);
    return this;
  }

  // Flip Both
  /**
   * flip image horizontally and vertically
   * @returns Marvin instance
   * @example
   * new Marvin(MarvinImageExemple).flipBoth()
   */
  flipBoth() {
    const flip = new Flip();
    Flip.setAttribute("flip", "both");
    this.image = flip.process(this.image, null, MarvinImageMask.NULL_MASK);
    return this;
  }

  /**
   * rotate image by angle
   * @param angle angle to rotate image
   * @returns Marvin instance
   * @example
   * new Marvin(MarvinImageExemple).rotate(90)
   * new Marvin(MarvinImageExemple).rotate(-90)
   */
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

  //Draw Line
  /**
   * @param x1 x coordinate of the first point
   * @param y1 y coordinate of the first point
   * @param x2 x coordinate of the second point
   * @param y2 y coordinate of the second point
   * @param options.color color of the line. default is #000000
   * @param options.weight weight of the line. default is 1
   * @returns an instance of Marvin
   * @author Lucas Pereira Machado <github.com/pereira299>
   * @example
   * const marvin = new Marvin('image.jpg');
   * marvin.drawLine(0, 0, 100, 100, '#000000', 1).save('image.jpg');
   */
  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options = {
      color: "#000000",
      weight: 1,
    }
  ) {
    const drawLine = new DrawLine();
    DrawLine.setAttribute("x1", x1);
    DrawLine.setAttribute("y1", y1);
    DrawLine.setAttribute("x2", x2);
    DrawLine.setAttribute("y2", y2);
    DrawLine.setAttribute("color", options.color);
    DrawLine.setAttribute("weight", options.weight);
    this.image = drawLine.process(this.image);
    return this;
  }

  //Draw Rectangle
  /**
   *  Draw a rectangle in the image
   * @param x x coordinate of the rectangle
   * @param y y coordinate of the rectangle
   * @param width width of the rectangle
   * @param height height of the rectangle
   * @param options.color color of the rectangle. default is #000000
   * @param options.weight weight of the rectangle. default is 1
   * @returns an instance of Marvin
   * @example
   * const marvin = new Marvin(marvinImageExample);
   * marvin.drawRect(0, 0, 100, 100, '#000000', 1).save('image.jpg');
   * @author Lucas Pereira Machado <github.com/pereira299>
   **/
  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    options = {
      color: "#000000",
      weight: 1,
    }
  ) {
    const drawRect = new Rect();
    Rect.setAttribute("x", x);
    Rect.setAttribute("y", y);
    Rect.setAttribute("width", width);
    Rect.setAttribute("height", height);
    Rect.setAttribute("color", options.color);
    Rect.setAttribute("weight", options.weight);
    this.image = drawRect.process(this.image);
    return this;
  }

  //Draw Circle
  /**
   * Draw a circle in the image
   * @param x x coordinate of the circle
   * @param y y coordinate of the circle
   * @param radius radius of the circle
   * @param options.color color of the circle. default is #000000
   * @param options.weight weight of the circle. default is 1
   * @returns an instance of Marvin
   * @example
   * const marvin = new Marvin(marvinImageExample);
   * marvin.drawCircle(0, 0, 100, '#000000', 1).save('image.jpg');
   * @author Lucas Pereira Machado <github.com/pereira299>
   * */
  drawCircle(
    x: number,
    y: number,
    radius: number,
    options = {
      color: "#000000",
      weight: 1,
    }
  ) {
    const drawCircle = new Circle();
    this.image = drawCircle.process(
      this.image,
      x,
      y,
      radius,
      options.color,
      options.weight
    );
    return this;
  }

  //Draw Ellipse
  /**
   * Draw a ellipse in the image
   * @param x x coordinate of the ellipse
   * @param y y coordinate of the ellipse
   * @param width width of the ellipse
   * @param height height of the ellipse
   * @param options.color color of the ellipse. default is #000000
   * @param options.weight weight of the ellipse. default is 1
   * @returns an instance of Marvin
   * @example
   * const marvin = new Marvin(marvinImageExample);
   * marvin.drawEllipse(0, 0, 100, 100, '#000000', 1).save('image.jpg');
   * @author Lucas Pereira Machado <github.com/pereira299>
   * */
  drawEllipse(
    x: number,
    y: number,
    width: number,
    height: number,
    options = {
      color: "#000000",
      weight: 1,
    }
  ) {
    const drawEllipse = new Ellipse();
    this.image = drawEllipse.process(
      this.image,
      x,
      y,
      width,
      height,
      options.color,
      options.weight
    );
    return this;
  }

  //Draw Star
  /**
   * Draw a star in the image
   * @param x x coordinate of the star
   * @param y y coordinate of the star
   * @param count qtd of corners of the star
   * @param radius radius of the star
   * @param options.color color of the star. default is #000000
   * @param options.weight weight of the star. default is 1
   * @returns an instance of Marvin
   * @example
   * const marvin = new Marvin(marvinImageExample);
   * marvin.drawStar(0, 0, 5, 100, '#000000', 1).save('image.jpg');
   * @author Lucas Pereira Machado <github.com/pereira299>
   * */
  drawStar(
    x: number,
    y: number,
    count: number,
    radius: number,
    options = {
      color: "#000000",
      weight: 1,
    }
  ) {
    const drawStar = new Star();
    this.image = drawStar.process(
      this.image,
      x,
      y,
      count,
      radius,
      options.color,
      options.weight
    );
    return this;
  }

  //Draw Curve
  /**
   * Draw a regular curve in the image
   * @param x1 x coordinate of the first point
   * @param y1 y coordinate of the first point
   * @param x2 x coordinate of the second point
   * @param y2 y coordinate of the second point
   * @param radius radius of the curve
   * @param options.color color of the curve. default is #000000
   * @param options.weight weight of the curve. default is 1
   * @returns an instance of Marvin
   * @example
   * const marvin = new Marvin(marvinImageExample);
   * marvin.drawCurve(0, 0, 100, 100, 50, '#000000', 1).save('image.jpg');
   * @author Lucas Pereira Machado <github.com/pereira299>
   * */
  drawCurve(
    x1: number,
    y1: number,
    degStart: number,
    degEnd: number,
    radius: number,
    options = {
      color: "#000000",
      weight: 1,
    }
  ) {
    const drawCurve = new Curve();
    Curve.setAttribute("x1", x1);
    Curve.setAttribute("y1", y1);
    Curve.setAttribute("degStart", degStart);
    Curve.setAttribute("degEnd", degEnd);
    Curve.setAttribute("radius", radius);
    Curve.setAttribute("color", options.color);
    Curve.setAttribute("weight", options.weight);
    Curve.setAttribute("type", "regular");
    this.image = drawCurve.process(this.image);
    return this;
  }

  //Draw Quadratic Curve
  /**
   * Draw a quadratic curve in the image
   * @param x1 x coordinate of the first point
   * @param y1 y coordinate of the first point
   * @param x2 x coordinate of the second point
   * @param y2 y coordinate of the second point
   * @param dotX x coordinate of the point control
   * @param dotY y coordinate of the point control
   * @param options options of the quadratic curve
   * @param options.color color of the quadratic curve. default is #000000
   * @param options.weight weight of the quadratic curve. default is 1
   * @returns an instance of Marvin
   * @example
   * const marvin = new Marvin(marvinImageExample);
   * marvin.drawQuadraticCurve(120, 90, 100, 100, 50, 10,).save('image.jpg');
   * @author Lucas Pereira Machado <github.com/pereira299>
   * */
  drawQuadraticCurve(
    x1 = this.image.getWidth() - 10,
    y1 = this.image.getHeight() - 10,
    x2 = this.image.getWidth() + 10,
    y2 = this.image.getHeight() + 10,
    dotX = this.image.getWidth(),
    dotY = this.image.getHeight(),
    { color = "#000000", weight = 1 }
  ) {
    const drawQuadraticCurve = new Curve();
    Curve.setAttribute("x1", x1);
    Curve.setAttribute("y1", y1);
    Curve.setAttribute("x2", x2);
    Curve.setAttribute("y2", y2);
    Curve.setAttribute("dot1", { x: dotX, y: dotY });
    Curve.setAttribute("color", color);
    Curve.setAttribute("weight", weight);
    Curve.setAttribute("type", "quadratic");
    this.image = drawQuadraticCurve.process(this.image);
    return this;
  }

  //Draw Cubic Curve
  /**
   * Draw a cubic curve in the image
   * @param x1 x coordinate of the first point
   * @param y1 y coordinate of the first point
   * @param x2 x coordinate of the second point
   * @param y2 y coordinate of the second point
   * @param dot1X x coordinate of the first point control
   * @param dot1Y y coordinate of the first point control
   * @param dot2X x coordinate of the second point control
   * @param dot2Y y coordinate of the second point control
   * @param options options of the cubic curve
   * @param options.color color of the cubic curve. default is #000000
   * @param options.weight weight of the cubic curve. default is 1
   * @returns an instance of Marvin
   * @example
   * const marvin = new Marvin(marvinImageExample);
   * marvin.drawCubicCurve(120, 90, 100, 100, 50, 10, 50, 10).save('image.jpg');
   * @author Lucas Pereira Machado <github.com/pereira299>
   * */
  drawCubicCurve(
    x1 = this.image.getWidth() - 10,
    y1 = this.image.getHeight() - 10,
    x2 = this.image.getWidth() + 10,
    y2 = this.image.getHeight() + 10,
    dot1X = this.image.getWidth(),
    dot1Y = this.image.getHeight(),
    dot2X = this.image.getWidth(),
    dot2Y = this.image.getHeight(),
    { color = "#000000", weight = 1 }
  ) {
    const drawCubicCurve = new Curve();
    Curve.setAttribute("x1", x1);
    Curve.setAttribute("y1", y1);
    Curve.setAttribute("x2", x2);
    Curve.setAttribute("y2", y2);
    Curve.setAttribute("dot1", { x: dot1X, y: dot1Y });
    Curve.setAttribute("dot2", { x: dot2X, y: dot2Y });
    Curve.setAttribute("color", color);
    Curve.setAttribute("weight", weight);
    Curve.setAttribute("type", "cubic");
    this.image = drawCubicCurve.process(this.image);
    return this;
  }

  pathStart(x, y) {
    this.x = x;
    this.y = y;
  }

  pathMove(x, y) {
    this.x = x;
    this.y = y;
  }

  pathEnd() {
    this.x = null;
    this.y = null;
  }

  /**
   * @param x x coordinate of the line end point
   * @param y y coordinate of the line end point
   * @param options options of the line
   * @param options.color color of the line. default is #000000
   * @param options.weight weight of the line. default is 1
   * @param options.startX x coordinate of the line start point. default is the last x coordinate
   * @param options.startY y coordinate of the line start point. default is the last y coordinate
   * @returns 
   */
  lineTo(
    x,
    y,
    options = {
      color: "#000000",
      weight: 1,
      startX: this.x,
      startY: this.y,
    }
  ) {
    const drawLine = new DrawLine();
    DrawLine.setAttribute("x1", options.startX);
    DrawLine.setAttribute("y1", options.startY);
    DrawLine.setAttribute("x2", x);
    DrawLine.setAttribute("y2", y);
    DrawLine.setAttribute("color", options.color);
    DrawLine.setAttribute("weight", options.weight);
    this.image = drawLine.process(this.image);
    this.x = x;
    this.y = y;
    return this;
  }

  curveTo(
    x,
    y,
    dotX,
    dotY,
    options = {
      color: "#000000",
      weight: 1,
      startX: this.x,
      startY: this.y,
    }
  ) {
    const drawRegularCurve = new Curve();
    Curve.setAttribute("x1", options.startX);
    Curve.setAttribute("y1", options.startY);
    Curve.setAttribute("x2", x);
    Curve.setAttribute("y2", y);
    Curve.setAttribute("dot1", { x: dotX, y: dotY });
    Curve.setAttribute("color", options.color);
    Curve.setAttribute("weight", options.weight);
    Curve.setAttribute("type", "regular");
    this.image = drawRegularCurve.process(this.image);
    this.x = x;
    this.y = y;
    return this;
  }

  quadraticCurveTo(
    x,
    y,
    dotX,
    dotY,
    options = {
      color: "#000000",
      weight: 1,
      startX: this.x,
      startY: this.y,
    }
  ) {
    const drawQuadraticCurve = new Curve();
    Curve.setAttribute("x1", options.startX);
    Curve.setAttribute("y1", options.startY);
    Curve.setAttribute("x2", x);
    Curve.setAttribute("y2", y);
    Curve.setAttribute("dot1", { x: dotX, y: dotY });
    Curve.setAttribute("color", options.color);
    Curve.setAttribute("weight", options.weight);
    Curve.setAttribute("type", "quadratic");
    this.image = drawQuadraticCurve.process(this.image);
    this.x = x;
    this.y = y;
    return this;
  }

  cubicCurveTo(
    x,
    y,
    dot1X,
    dot1Y,
    dot2X,
    dot2Y,
    options = {
      color: "#000000",
      weight: 1,
      startX: this.x, 
      startY: this.y,
    }
  ) {
    const drawCubicCurve = new Curve();
    Curve.setAttribute("x1", options.startX);
    Curve.setAttribute("y1", options.startY);
    Curve.setAttribute("x2", x);
    Curve.setAttribute("y2", y);
    Curve.setAttribute("dot1", { x: dot1X, y: dot1Y });
    Curve.setAttribute("dot2", { x: dot2X, y: dot2Y });
    Curve.setAttribute("color", options.color);
    Curve.setAttribute("weight", options.weight);
    Curve.setAttribute("type", "cubic");
    this.image = drawCubicCurve.process(this.image);
    this.x = x;
    this.y = y;
    return this;
  }

  //heatmap
  /**
   * @description Creates a heatmap from the image between cold color (coldIn) and hot color (hotIn) and outputs it between coldOut and hotOut
   * @param propagation propagation of the heat. default is 0
   * @param coldIn color of the cold input. default is #ffffff
   * @param hotIn color of the hot input. default is #000000
   * @param coldOut color of the cold output. default is #0000ff
   * @param hotOut color of the hot output. default is #ff0000
   * @param viaOut color of the average output, if is a empty string it will be calculated. default is #ffff00
   * @returns an instance of Marvin
   * @example
   * const marvin = new Marvin(marvinImageExemple);
   * marvin.heatMap().save('image.jpg');
   *
   **/
  heatMap(
    propagation = 0,
    coldIn = "#ffffff",
    hotIn = "#000000",
    coldOut = "#0000ff",
    hotOut = "#ff0000",
    viaOut = "#ffff00"
  ): Marvin {
    const heatMap = new HeatMap();
    const colorIn = {
      cold: MarvinColorModelConverter.hexToRgb(coldIn),
      hot: MarvinColorModelConverter.hexToRgb(hotIn),
    };
    const colorOut = {
      cold: MarvinColorModelConverter.hexToRgb(coldOut),
      hot: MarvinColorModelConverter.hexToRgb(hotOut),
      via: [],
    };
    colorOut.via = viaOut
      ? MarvinColorModelConverter.hexToRgb(viaOut)
      : MarvinColorModelConverter.averageColor(colorOut.cold, colorOut.hot);
    this.image = heatMap.process(this.image, colorIn, colorOut, propagation);
    return this;
  }

  //Output
  /**
   * get the output image
   * @returns the MarvinImage instance
   */
  output() {
    return this.image;
  }

  // Save
  /**
   * @description save the image to a file
   * @param path path of the file
   * @returns
   * @example
   * const marvin = new Marvin(marvinImageExemple).save('image.jpg');
   **/
  save(path) {
    fs.writeFileSync(path, this.image.getBuffer());
  }
}
