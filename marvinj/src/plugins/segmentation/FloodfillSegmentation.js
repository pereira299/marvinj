import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class FloodfillSegmentation extends MarvinAbstractImagePlugin {
	constructor(){
		super();
		this.load();
	}

	load = function(){
		this.setAttribute("returnType", "MarvinSegment");
	};
	
	process = function
	(
		imageIn, 
		imageOut,
		attributesOut,
		mask, 
		previewMode
	)
	{
		if(attributesOut != null){
			let returnType = this.getAttribute("returnType");
			let fillBuffer = imageIn.clone();
			let segments = this.floodfillSegmentation(imageIn, fillBuffer);
			
			switch(returnType){
				case "MarvinSegment":
					attributesOut.set("segments", segments);
					break;
				case "MarvinBlobSegment":
					attributesOut.set("blobSegments", blobSegments(fillBuffer, segments));
					break;
			}
		}
	};
	
	floodfillSegmentation = function(image, fillBuffer){
		fillBuffer.clear(0xFF000000);
		
		let currentColor=1;
		for(let y=0; y<image.getHeight(); y++){
			for(let x=0; x<image.getWidth(); x++){
				
				let color = fillBuffer.getIntColor(x, y);
				
				if((color & 0x00FFFFFF) == 0 && image.getAlphaComponent(x, y) > 0){
					let c = 0xFF000000 | (currentColor++);
					Marvin.boundaryFill(image, fillBuffer, x, y, c);
				}
			}
		}
		
		let segments = new Array(currentColor-1);
		let seg;
		for(let y=0; y<fillBuffer.getHeight(); y++){
			for(let x=0; x<fillBuffer.getWidth(); x++){
				let color = (fillBuffer.getIntColor(x, y) & 0x00FFFFFF);
				
				if(color != 0x00FFFFFF && color > 0){
					
					seg = segments[color-1];
					
					if(seg == null){
						seg = new MarvinSegment();
						segments[color-1] = seg;
					}
					
					// x and width
					if(seg.x1 == -1 || x < seg.x1)	{		seg.x1 = x;		}
					if(seg.x2 == -1 || x > seg.x2)	{		seg.x2 = x;		}
					seg.width = (seg.x2-seg.x1)+1;
					
					// y and height;
					if(seg.y1 == -1 || y < seg.y1)	{		seg.y1 = y;		}
					if(seg.y2 == -1 || y > seg.y2)	{		seg.y2 = y;		}
					seg.height = (seg.y2-seg.y1)+1;
					
					seg.area++;
				}
			}
		}
		
		return segments;
	}
	
	blobSegments = function(image, segments){
		
		let blobSegments = new Array(segments.length);
		
		let colorSegment;
		let seg;
		for(let i=0; i<segments.length; i++){
			seg = segments[i];
			colorSegment = 0xFF000000 + (i+1);
			
			blobSegments[i] = new MarvinBlobSegment(seg.x1, seg.y1);
			let tempBlob = new MarvinBlob(seg.width, seg.height);
			blobSegments[i].setBlob(tempBlob);
			
			for(let y=seg.y1; y<=seg.y2; y++){
				for(let x=seg.x1; x<=seg.x2; x++){
					if(image.getIntColor(x,y) == colorSegment){
						tempBlob.setValue(x-seg.x1, y-seg.y1, true);
					}
				}
			}
			
		}
		return blobSegments;
	}
}
