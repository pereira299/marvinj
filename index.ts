import MarvinImage from "./src/image/MarvinImage";
import Marvin from "./src/MarvinFramework";
import * as fs from "fs";

const url = "https://cursinhoparamedicina.com.br/wp-content/uploads/2022/10/Paisagem-1.jpg";

const main = async () => {
  const image = await new MarvinImage(635,424).load(url);
  // alphaBoundary 
  // new Marvin(image).alphaBoundary(0.5).save("output/alphaBoundary.png");
  // averageColor 
  // console.log(new Marvin(image).averageColor())
  // blackAndWhite 
  // new Marvin(image).blackAndWhite(0.5).save("output/blackAndWhite.png");
  // boundaryFill 
  // new Marvin(image).boundaryFill(0, 0, "0xd3d570", 0.2).save("output/boundaryFill.png");
  // brightnessAndContrast 
  // new Marvin(image).brightnessAndContrast(0.5, 0.5).save("output/brightnessAndContrast.png");
  // colorChannel 
  // new Marvin(image).colorChannel(230, 230, 150).save("output/colorChannel.png");
  // combineByAlpha 
  // new Marvin(image).combineByAlpha(image, 0, 0).save("output/combineByAlpha.png");
  // morphologicalClosing 
  // new Marvin(image).morphologicalClosing([[0, 0, 0], [0, 0, 0]]).save("output/morphologicalClosing.png");
  // crop 
  // new Marvin(image).crop(50, 50,200,200).save("output/crop.png");
  // morphologicalDilation 
  // new Marvin(image).morphologicalDilation([[0, 0, 0], [0, 0, 0]]).save("output/morphologicalDilation.png");
  // emboss 
  // new Marvin(image).emboss().save("output/emboss.png");
  // morphologicalErosion 
  // new Marvin(image).morphologicalErosion([[0, 0, 0], [0, 0, 0]]).save("output/morphologicalErosion.png");
  // findTextRegions 
  // console.log(new Marvin(image).findTextRegions(10, 20,1,1));
  // floodfillSegmentation 
  // console.log(new Marvin(image).floodfillSegmentation());
  // gaussianBlur 
  // new Marvin(image).gaussianBlur(1).save("output/gaussianBlur.png");
  // grayScale 
  // new Marvin(image).grayScale().save("output/grayScale.png");
  // invertColors 
  // new Marvin(image).invertColors().save("output/invertColors.png");
  // iteratedFunctionSystem 
  // new Marvin(image).iteratedFunctionSystem(null, 200).save("output/iteratedFunctionSystem.png");
  // mergePhotos 
  // new Marvin(image).mergePhotos([image], 0.5).save("output/mergePhotos.png");
  // moravec 
  // console.log(new Marvin(image).moravec([[0, 0, 0], [0, 0, 0]], 0.5));
  // prewitt 
  // new Marvin(image).prewitt(1).save("output/prewitt.png");
  // scale 
  // new Marvin(image).scale(700,500).save("output/scale.png");
  // sepia 
  // new Marvin(image).sepia(1).save("output/sepia.png");
  // thresholding 
  // new Marvin(image).thresholding(1, true).save("output/thresholding.png");
  // thresholdingNeighborhood 
  // new Marvin(image).thresholdingNeighborhood(50,null, 2).save("output/thresholdingNeighborhood.png");
  // halftoneErrorDiffusion 
  // new Marvin(image).halftoneErrorDiffusion().save("output/halftoneErrorDiffusion.png");
};

main();