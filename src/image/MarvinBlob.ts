import { MarvinContour } from "./MarvinCoutour";

export default class MarvinBlob {

    int: number;	
    width:number;					
    height:number;
    static area:number;
    static pixels: boolean[][];
	
	constructor(width:number, height:number){
		this.width = width;
		this.height = height;
		MarvinBlob.area = 0;
		MarvinBlob.pixels = new Boolean[width][height];
	}
	
	getWidth():number{
		return this.width;
	}
	
	getHeight():number{
		return this.height;
	}
	
	static setValue(x:number, y:number, value:boolean):void{
		if(!MarvinBlob.pixels[x][y] && value){
			MarvinBlob.area++;
		} else if(MarvinBlob.pixels[x][y] && !value){
			MarvinBlob.area--;
		}
		
		MarvinBlob.pixels[x][y] = value;
	}
	
	public static getArea():number{
		return MarvinBlob.area;
	}
	
	public static getValue(x:number,y:number):boolean{
		return MarvinBlob.pixels[x][y];
	}
	
	public toContour(): MarvinContour {
		
		const contour:MarvinContour = new MarvinContour();
		for(let y=0; y< this.height; y++){
			for(let x=0; x<this.width; x++){
				
				if(MarvinBlob.getValue(x, y)){
					if
					(
						(x-1 < 0 || x+1 == this.width || y-1 < 0 || y+1 == this.height) ||
						!MarvinBlob.getValue(x-1, y-1) ||
						!MarvinBlob.getValue(x-1, y) ||
						!MarvinBlob.getValue(x-1, y+1) ||
						!MarvinBlob.getValue(x, y-1) ||
						!MarvinBlob.getValue(x, y+1) ||
						!MarvinBlob.getValue(x+1, y-1) ||
						!MarvinBlob.getValue(x+1, y) ||
						!MarvinBlob.getValue(x+1, y+1)
					){
						contour.addPoint(x, y);
					}
				}
			}
		}
		return contour;
	}
}