import { registerFont } from "canvas";
import axios from "axios";
import MarvinImage from "../../image/MarvinImage";
import * as fs from "fs";
import { Fonts } from "../../types/Fonts";
import * as path from "path";
export default class Write {
  private robotoFont = "Roboto";
  private isLoadFont = false;
    

  async load() {
    await this.registerGoogleFont(this.robotoFont);
  }

  async downloadFont(fontName: string) {
    const fontPath = "tmp/"+fontName.replace(" ", "+")+".ttf"
    const hasFont = fs.existsSync(fontPath);
    if (hasFont) {
      return fontPath;
    }
    if(!fs.existsSync("tmp/")) {
      fs.mkdirSync("tmp/");
    }
    const fontLink = "https://fonts.googleapis.com/css?family=" + fontName.replace(" ", "+") + "&display=swap";
    const response = await axios.get(fontLink);
    const text = await response.data;
    const url = text.match(/url\((.*?)\)/)[1].replace(/['"]/g, "");
    const fontBuffer = await axios.get(url).then(
      (res) => res.data
    );
    fs.writeFileSync(fontPath, fontBuffer);
    return fontPath;
  }

  // Registra a fonte Roboto do Google Fonts
  async registerGoogleFont(fontName: string) {

    const fontPath = await this.downloadFont(fontName);
    const nodePath = path.resolve(fontPath);
    registerFont(nodePath, { family: fontName, weight: "normal", style: "normal" });
    
  }

  async process(image: MarvinImage, text:string, x: number, y: number, options: OptionsWrite) {
    await this.load();
    options = options || {};
    let { fontSize, color, fontWeight, maxWidth } = options;
    const { font } = options;
    
    if (font) {
      await this.registerGoogleFont(font);
    }
    fontSize = fontSize || 20;
    color = color || "#000000";
    fontWeight = fontWeight || "normal";
    maxWidth = maxWidth || image.getWidth();

    const image_out = new MarvinImage(image.getWidth(), image.getHeight());
    image_out.loadFromImage(image);

    const fontName = font ? font : "Roboto";
    
    image_out.ctx.font = `${fontWeight} ${fontSize}px ${fontName}`;
    image_out.ctx.fillStyle = color;
    image_out.ctx.textAlign = "center";
    image_out.ctx.textBaseline = "middle";
    image_out.ctx.fillText(text, x, y, maxWidth);
    image_out.imageData = image_out.ctx.getImageData(0, 0, image_out.getWidth(), image_out.getHeight());
    return image_out;
  }
}


type OptionsWrite = {
  font?: Fonts["google"];
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  maxWidth?: number;
  textAling?: 'center' | 'end' | 'left' | 'right' | 'start';
  textBaseline?: 'alphabetic' | 'bottom' | 'hanging' | 'ideographic' | 'middle' | 'top';
}