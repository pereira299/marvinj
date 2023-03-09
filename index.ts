import MarvinImage from "./src/image/MarvinImage";
import Marvin from "./src/MarvinFramework";

const url = "https://cursinhoparamedicina.com.br/wp-content/uploads/2022/10/Paisagem-1.jpg";
const image = new MarvinImage(635,424);
image.load(url, () => {
  Marvin.grayScale(image, image);
});