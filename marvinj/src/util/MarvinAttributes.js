export default class MarvinAttributes {
	constructor() {
		this.hashAttributes = new Object();
	}

	set(name, value) {
		this.hashAttributes[name] = value;
	}

	get(name, defaultValue) {
		var ret = this.hashAttributes[name];

		if (ret != null) {
			return ret;
		}
		return defaultValue;
	}

	clone() {
		var attrs = new MarvinAttributes();

		for (var key in this.hashAttributes) {
			attrs.set(key, this.hashAttributes[key]);
		}
		return attrs;
	}
}