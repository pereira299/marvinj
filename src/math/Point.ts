export class Point {

	x: number;
	y: number;
	
	constructor(x: number, y: number){
		this.x = x;
		this.y = y;
	}
	
	setX(x: number): void{
		this.x = x;
	}
	getX():number{
		return this.x;
	}
	setY(y:number): void{
		this.y = y;
	}
	getY():number{
		return this.y;
	}
}