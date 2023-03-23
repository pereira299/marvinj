# Marvin-TS
Marvin-TS is Typescript version of Marvin Image Processing Framework with some more features and updates.

## Tutorial

### Install

You can install from npm or yarn

**NPM**
```
npm i marvin-ts
```

**Yarn**
```
yarn add marvin-ts
```
### Image Loading
The first step to use Marvin-TS is load a image.
```
   import { MarvinImage } from "marvin-ts"

   // load from remote image
   let url = "http://ww.exemple.com/image.jpg";
   const image = await new MarvinImage().load(url);

   // or load from local image
   let url2 = fs.readSyncFile("image.png");
   const image2 = await new MarvinImage().loadFromBase64(url2);
```
### Marvin instance
Before load image you need create a new Marvin instance

```
   import Marvin, { MarvinImage } from "marvin-ts"
   ...
   ...
   // image is the MarvinImage instance the you create before
   const marvin = new Marvin(image);

   // Now you can use all features of Marvin-TS
```

## Features
### Blur
```
   // gaussian blur
   marvin.gaussianBlur(10)
```
### Color
```
   // Average color
   marvin.averageColor()

   // Black and white
   marvin.blackAndWhite(50)

   // Brightness and Contrast
   marvin.brightnessAndContrast(50, 50)

   // Emboss
   marvin.emboss()

   // Gray scale
   marvin.grayScale()

   // Heat map
   marvin.heatMap(10)

   // invert colors
   marvin.invertColors()

   // Posterization
   marvin.posterize(10);

   // Thresholding
   marvin.thresholding(10);

   // Serpia
    marvin.sepia(5);

   // Color channels
   marvin.colorChannel("#fefc58", 20);
```
### Combine
```
   // Combine by alpha
   marvin.combineByAlpha(image3, 10, 20)

   // Merge photos
   marvin.mergePhotos([image3], 10);
```
### Corner
```
   // Moravec corner detector
   marvin.moravec(5, 500);
```
### Draw
```
   // Circle
   marvin.drawCircle(10, 10, 20);

   // Regular curve
   marvin.drawCurve(10, 10, 20, 20, 30);

   // Quadratic curve
   marvin.drawQuadraticCurve(10, 10, 20, 20, 30, 30);

   // Cubic curve
   marvin.drawCubicCurve(10, 10, 20,20, 25,35, 30,30);

   // Ellipse
   marvin.drawEllipse(10, 10, 20, 20);

   // Line
   marvin.drawLine(10, 10, 20, 20);

   // Rectangle
   marvin.drawRect(10, 10, 20, 20);

   // Star
   marvin.drawStar(10, 10, 20, 20);

   // Start path
   marvin.pathStart(10, 10);

   // Line to
   marvin.lineTo(10, 10);

   // Quadratic curve to
   marvin.quadraticCurveTo(10, 10, 20, 20);

   // Cubic curve to
   marvin.cubicCurveTo(10, 10, 20, 20, 30, 30);

   // Regular curve to
   marvin.curveTo(10, 10, 20, 20);
```
### Edge
```
   // Prewitt edge detector
   marvin.prewitt(1);

   // Sobel edge detector
   marvin.sobel(1);

   // Canny edge detector
   marvin.canny(100, 500);
```
### Text
```
   // Find text
   marvin.findTextRegions(10, 20, 5, 40);

   // Write text on image
   marvin.write("Exemple", 10, 20);
```
### Restoration
```
   // Noise reduction
   marvin.noiseReduction(10);
```
### Segment
```
   // Crop image
   marvin.crop(10, 20, 30, 40); 
```
### Transform
```
   // Flip horizontal
   marvin.flipHorizontal();

   // Flip vertical
   marvin.flipVertical();

   // Flip horizontal and vertical
   marvin.flipBoth();

   // Rotate
   marvin.rotate(90);

   // Scale
   marvin.scale(2, 2);
```
### Get or save
```
   // Get back Marvin image after process
   marvin.flipVertical().output();

   // Save image as JPEG or PNG
   marvin.save("output/image.png");   
```

### Chains
```
   // Easily run as many functions as you want with function chains
   marvin.flipBoth()
   .scale(2, 2)
   .noiseReduction(10)
   .drawRect(10, 10, 20, 20)
   .save("out")
```
**IMPORTANT!** Chains run only in functions that return a marvin instance

This project is a fork of [MarvinJ](http://marvinj.org/)

