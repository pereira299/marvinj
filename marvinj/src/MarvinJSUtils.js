export default class Utils {
	constructor() {}

	createMatrix2D(rows, cols, value){
		var arr = new Array(rows);
		for(var i=0; i<arr.length; i++){
			arr[i] = new Array(cols);
			arr[i].fill(value)
		}
		return arr;
	};

	createMatrix3D(rows, cols, depth, value){
		var arr = new Array(rows);
		for(var i=0; i<arr.length; i++){
			arr[i] = new Array(cols);
			for(var j=0; j<arr[i].length; j++){
				arr[i][j] = new Array(depth);
				arr[i][j].fill(value)
			}
		}
		return arr;
	};

	createMatrix4D(rows, cols, depth, another, value){
		var arr = new Array(rows);
		for(var i=0; i<arr.length; i++){
			arr[i] = new Array(cols);
			for(var j=0; j<arr[i].length; j++){
				arr[i][j] = new Array(depth);
				for(var w=0; w<arr[i][j].length; w++){
					arr[i][j][w] = new Array(another);
					arr[i][j][w].fill(value);
				}
			}
		}
		return arr;
	};
}