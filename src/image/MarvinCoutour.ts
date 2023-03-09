import { Point } from "../math/Point";

export class MarvinContour {

	private points: Point[];
	
	constructor(){
		this.points = new Array<Point>();
	}
	
	addPoint(x:number, y:number){
		this.points.push(new Point(x, y));
	}
	
	getPoint(index:number): Point{
		return this.points[index];
	}
	
	getPoints(): Point[]{
		return this.points;
	}
	
	length(): number{
		return this.points.length;
	}
}