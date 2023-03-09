export default class MarvinAbstractImagePlugin {
	attributes = {};
	constructor() {}

	setAttribute = function(label, value){
		this.attributes[label] = value;
	};
	
	getAttribute = function(label, value){
		return this.attributes[label];
	};

}