export default class MarvinColor {
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
