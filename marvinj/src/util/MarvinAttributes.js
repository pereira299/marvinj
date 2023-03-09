export default class MarvinAttributes {
	constructor() {
		this.hashAttributes = new Object();
	}

	set(name, value) {
		this.hashAttributes[name] = value;
	}

	get(name, defaultValue) {
		let ret = this.hashAttributes[name];

		if (ret != null) {
			return ret;
		}
		return defaultValue;
	}

	clone() {
		let attrs = new MarvinAttributes();

		for (let key in this.hashAttributes) {
			attrs.set(key, this.hashAttributes[key]);
		}
		return attrs;
	}
}