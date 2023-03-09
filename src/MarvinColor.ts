export default class MarvinColor {

  red: number;
  green: number;
  blue: number;
  id: number;
  name: string;
  
  constructor(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    return this;
  }

  setId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}
