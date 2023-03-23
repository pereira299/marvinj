import { registerFont } from "canvas";
import fetch from "node-fetch";

export default class Write {
  async downloadFont(fontLink: string) {
    const response = await fetch(fontLink);
    const text = await response.text();
    const url = text.match(/url\((.*?)\)/)[1].replace(/['"]/g, "");
    const fontBuffer = await fetch(url).then((res) => 
      res.arrayBuffer()
    );
    return fontBuffer;
  }

  // Registra a fonte Roboto do Google Fonts
  async registerGoogleFont(url: string) {
    const fontBuffer = await this.downloadFont(url);
    const font = Buffer.from(fontBuffer).toString("base64");
    const fontName = url.match(/family=(.*?)&/)[1];
    registerFont(fontName, { family: fontName, style: "normal", font: font });
  }
}
