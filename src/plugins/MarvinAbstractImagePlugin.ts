import MarvinAttributes from "../util/MarvinAttributes";

export default class MarvinAbstractImagePlugin {
	static attributes = {};
	constructor() {}

	static setAttribute(label, value){
		this.attributes[label] = value;
	}
	
	static getAttribute(label){
		return this.attributes[label];
	}

	static getAttributes(){
		return new MarvinAttributes(this.attributes);
	}

}