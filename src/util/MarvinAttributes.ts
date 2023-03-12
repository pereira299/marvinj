export default class MarvinAttributes {
  hashAttributes: object;

  constructor(attributes: object | null = null) {
    if (attributes != null) {
      this.hashAttributes = attributes;
    } else this.hashAttributes = new Object();
  }

  set(name: string, value: any) {
    this.hashAttributes[name] = value;
  }

  get(name: string, defaultValue: any = null) {
    const ret = this.hashAttributes[name];

    if (ret != null) {
      return ret;
    }
    return defaultValue;
  }

  clone() {
    const attrs = new MarvinAttributes();

    for (const key in this.hashAttributes) {
      attrs.set(key, this.hashAttributes[key]);
    }
    return attrs;
  }
}
