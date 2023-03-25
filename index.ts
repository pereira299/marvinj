import Marvin from "./src/MarvinFramework";
import MarvinImage from "./src/image/MarvinImage";
import MarvinColorModelConverter from "./src/color/MarvinColorModelConverter";
import MarvinColor from "./src/MarvinColor";
import MarvinMath from "./src/math/MarvinMath";
import MarvinJSUtils from "./src/MarvinJSUtils";

export default Marvin;
export {
  MarvinImage,
  MarvinColorModelConverter as MarvinColorConverter,
  MarvinColor,
  MarvinMath,
  MarvinJSUtils as MarvinUtils,
};

async function main() {

const url = "https://images.ecycle.com.br/wp-content/uploads/2021/05/20195924/o-que-e-paisagem.jpg"
const image = await new MarvinImage().load(url);
(await new Marvin(image).write("Exemplo", 10,10)).save("output/write.png");

}

main();