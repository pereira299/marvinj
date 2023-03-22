import MarvinImage from "./src/image/MarvinImage";
import Marvin from "./src/MarvinFramework";
import * as fs from "fs";
import marvinJSUtils from "./src/MarvinJSUtils";

const url =
  "https://cursinhoparamedicina.com.br/wp-content/uploads/2022/10/Paisagem-1.jpg";
const url2 = "https://marvinproject.net/images/pluginsOut/noiseReductionIn.jpg";
const url3 =
  "https://www.psicologo.com.br/wp-content/uploads/sou-uma-pessoa-boa-ou-nao.jpg";
const url4 = "https://marvinj.org/images/cheetah.jpg";

const main = async () => {
  // const image = await new MarvinImage(635, 424).load(url);
  // const image2 = await new MarvinImage(240, 320).load(url2);
  console.time("load");
  const image3 = await new MarvinImage(240, 320).load(url4);
  console.timeEnd("load");
  // averageColor
  // console.log(new Marvin(image).averageColor())
  // blackAndWhite
  // new Marvin(image).blackAndWhite(25).save("output/blackAndWhite.png");
  // brightnessAndContrast
  // new Marvin(image).brightnessAndContrast(50, 50).save("output/brightnessAndContrast.png");
  // colorChannel
  // new Marvin(image).colorChannel(50, 50, 150).save("output/colorChannel.png");
  // combineByAlpha
  // new Marvin(image).combineByAlpha(image, 200, 200).save("output/combineByAlpha.png");
  // crop
  // new Marvin(image).crop(50, 50,200,200).save("output/crop.png");
  // morphologicalDilation
  // new Marvin(image).morphologicalDilation([[0, 0, 0], [0, 0, 0]]).save("output/morphologicalDilation.png");
  // emboss
  // new Marvin(image3).emboss().save("output/emboss.png");
  // morphologicalErosion
  // new Marvin(image).morphologicalErosion([[0, 0, 0], [0, 0, 0]]).save("output/morphologicalErosion.png");
  // findTextRegions
  // console.log(new Marvin(image).findTextRegions(10, 20,1,1));
  // floodfillSegmentation
  // console.log(new Marvin(image).floodfillSegmentation());
  // gaussianBlur
  // new Marvin(image).gaussianBlur(10).save("output/gaussianBlur.png");
  // grayScale
  // new Marvin(image3).grayScale().save("output/grayScale.png");
  // invertColors
  // new Marvin(image).invertColors().save("output/invertColors.png");
  // mergePhotos
  // new Marvin(image).mergePhotos([image], 0.5).save("output/mergePhotos.png");
  // moravec
  // new Marvin(image).blackAndWhite(15).emboss().save("output/emboss2.png");
  // x: 156 y: 491
  // console.log(new Marvin(image3).moravec(3, 15000, true));
  // prewitt
  // new Marvin(image3).prewitt(1).save("output/prewitt.png");
  // scale
  // new Marvin(image).scale(50,20).save("output/scale.png");
  // sepia
  // new Marvin(image).sepia(20).save("output/sepia.png");
  // thresholding
  // new Marvin(image3).thresholding(100, true).save("output/thresholding.png");
  // halftoneErrorDiffusion
  // new Marvin(image).halftoneErrorDiffusion().save("output/halftoneErrorDiffusion.png");
  // Flip horizontal
  // new Marvin(image).flipHorizontal().save("output/flipHorizontal.png");
  // Flip vertical
  // new Marvin(image).flipVertical().save("output/flipVertical.png");
  // Flip both
  // new Marvin(image).flipBoth().save("output/flipDiagonal.png");
  // Rotate 90
  // new Marvin(image).rotate(-90).save("output/rotate-90.png");
  // Rotate 45
  // new Marvin(image).rotate(45).save("output/rotate45.png");
  // Noise Reduction
  // new Marvin(image2).noiseReduction().save("output/noiseReduction.png");
  // Remove Background
  // new Marvin(image3).emboss().blackAndWhite(100).noiseReduction(5, 0.8).save("output/emboss3.png");
  // new Marvin(image3).emboss().blackAndWhite(100).blackAndWhite(25).save("output/edge.png");
  // new Marvin(image3).grayScale().gaussianBlur(5).sobel(5).thresholding(1).invertColors().save("output/edge.png");
  // new Marvin(image3).grayScale().gaussianBlur(5).sobel(5).thresholding(10).blackAndWhite(10).invertColors().heatMap(5).save("output/heatMap.png");
  // new Marvin(image3).emboss().invertColors().gaussianBlur(5).blackAndWhite(20).save("output/canny.png");
  // new Marvin(image3).posterize(10).gaussianBlur(5).emboss().save("output/posterize.png");
  // new Marvin(image3).drawRect(20, 20, 120, 50, "#ff0000", 20).save("output/drawLine.png");
  // new Marvin(image3)
  //   .drawCubicCurve(100, 100, 300, 100, 110, 400, 150, 50, {
  //     color: "#ff0000",
  //     weight: 2,
  //   })
  //   .save("output/drawCubicCurve.png");
};

main();
