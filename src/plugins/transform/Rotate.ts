import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinMath from "../../math/MarvinMath";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";

export default class Rotate extends MarvinAbstractImagePlugin {
  attributes: MarvinAttributes;

  load() {
    this.attributes = Rotate.getAttributes();
    this.attributes.set("rotate", "angle");
  }

  /**
   * Initiate the rotate process and determine the angle of rotation
   * @param MarvinImage - the image to be rotated
   * @param boolean - to display a preview
   */
  process(
    a_imageIn: MarvinImage,
    l_rotateAngle: number,
    a_attributesOut: MarvinAttributes,
    a_mask: MarvinImageMask,
    a_previewMode: boolean
  ) {
    const a_imageOut = a_imageIn.clone();

    const l_aImageHeight = a_imageIn.getHeight();
    const l_aImageWidth = a_imageIn.getWidth();
    let l_rotateAngleRadians = 0;
    //a local copy of the image to enable the modification of a_image
    //MarvinImage l_image = (MarvinImage)a_image.clone();

    //for speed, check if the user wants a simple rotate by 90 degrees

    if (l_rotateAngle == 90) {
      const l_newHeight = l_aImageWidth;
      const l_newWidth = l_aImageHeight;
      a_imageOut.setDimension(l_newWidth, l_newHeight);
      for (let xx = 0; xx < l_aImageWidth; xx++) {
        for (let yy = l_aImageHeight - 1; yy >= 0; yy--) {
          a_imageOut.setIntColor(
            l_aImageHeight - 1 - yy,
            xx,
            a_imageIn.getIntColor(xx, yy)
          );
        }
      }
      return a_imageOut;
    } else if (l_rotateAngle == -90) {
      const l_newHeight = l_aImageWidth;
      const l_newWidth = l_aImageHeight;
      a_imageOut.setDimension(l_newWidth, l_newHeight);
      for (let xx = l_aImageWidth - 1; xx >= 0; xx--) {
        for (let yy = 0; yy < l_aImageHeight; yy++) {
          a_imageOut.setIntColor(
            yy,
            l_aImageWidth - 1 - xx,
            a_imageIn.getIntColor(xx, yy)
          );
        }
      }
      return a_imageOut;
    }

    l_rotateAngleRadians = MarvinMath.degToRad(l_rotateAngle);
    return this.rotateImage(a_imageOut, l_rotateAngleRadians);
  }

  /**
   * Use the information from the original image to interpolate and fill in
   * gaps in the rotated image
   * @param MarvinImage a_image - the image to be modified
   * @param MarvinImage a_originalImage - the image to be used as the source of the interpolation
   * @param double a_rotateAngle - the angle of rotation
   */
  private interpolateImage(
    a_image: MarvinImage,
    a_LookUpArray: number[][][],
    a_rotateAngle: number,
    a_initialisationValue: number
  ) {
    //get image dimensions
    const l_rotatedImageWidth = a_image.getWidth();
    const l_rotatedImageHeight = a_image.getHeight();

    for (let xx = 1; xx < l_rotatedImageWidth - 1; xx++) {
      for (let yy = 1; yy < l_rotatedImageHeight - 1; yy++) {
        //if the pixel value has NOT been assigned, in future change this to check for null
        if (a_LookUpArray[xx][yy][0] == a_initialisationValue) {
          const l_leftValue = a_LookUpArray[xx - 1][yy][2];
          const l_rightValue = a_LookUpArray[xx - 1][yy][2];
          const l_difference = l_rightValue - l_leftValue;
          a_image.setIntColor(xx, yy, l_leftValue + (l_difference + 2));
        }
      }
    }
    return a_image;
  }

  /**
   * Create a LookUpArray to see if pixels have been assigned a value
   * @param a_LookUpArray - the values to be filled in
   * @param dimensions - the size of the array
   * @param a_InitialisationValue - what value to assign.
   */
  initialiseLookUpArray(
    a_LookUpArray: number[][][],
    dimensions: number[],
    a_InitialisationValue: number
  ) {
    for (let xx = 0; xx < dimensions[0]; xx++) {
      for (let yy = 0; yy < dimensions[1]; yy++) {
        a_LookUpArray[xx][yy][0] = a_InitialisationValue;
        a_LookUpArray[xx][yy][1] = 0;
        a_LookUpArray[xx][yy][2] = 0;
      }
    }
	return a_LookUpArray;
  }

  /**
   * Rotate an image by a specified angle.
   * @param a_image - the image to be rotated
   * @param a_rotateAngle - the angle (in Radians) to rotate
   */
  private rotateImage(a_imageIn: MarvinImage, a_rotateAngleRads: number) {
    const a_imageOut = a_imageIn.clone();
    //Get the image dimensions
    const l_aimageHeight = a_imageIn.getHeight();
    const l_aimageWidth = a_imageIn.getWidth();

    //Calculate the size of the rotated image
    const l_absRotateAngle = Math.abs(a_rotateAngleRads);
    const l_newHeight = Math.ceil(
      l_aimageWidth * Math.sin(l_absRotateAngle) +
        Math.ceil(l_aimageHeight * Math.cos(l_absRotateAngle))
    );
    const l_newWidth = Math.ceil(
      l_aimageHeight * Math.sin(l_absRotateAngle) +
        Math.ceil(l_aimageWidth * Math.cos(l_absRotateAngle))
    );

    //The look up array used to interpolate later.
    //Each location in the array will contain
    // the x and y coordinates of the original pixel, and its RGB value
    let l_LookUpArray = Array.from({ length: l_newWidth }, () => {
      return Array.from({ length: l_newHeight }, () => {
        return Array.from({ length: 3 }, () => {
          return 0;
        });
      });
    });
    const l_initialisationValue = 654321;
    const l_dimensions = [l_newWidth, l_newHeight, 3];
    l_LookUpArray = this.initialiseLookUpArray(
      l_LookUpArray,
      l_dimensions,
      l_initialisationValue
    );
		// console.log(l_LookUpArray);
		
    //Create a local copy of the image
    //MarvinImage l_image = (MarvinImage)a_image.clone();
    //erase the contents of a_image so it can be filled with new data and resize it

    a_imageOut.setDimension(Math.abs(l_newWidth), Math.abs(l_newHeight));

    //Calculate the new coordinate for each pixel and fill in the lookuparray
    for (let xx = 0; xx < l_aimageWidth - 0; xx++) {
      for (let yy = 0; yy < l_aimageHeight - 0; yy++) {
        const l_newXCoordinate =
          Math.cos(a_rotateAngleRads) * (xx - l_aimageWidth / 2) -
          Math.sin(a_rotateAngleRads) * (yy - l_aimageHeight / 2) +
          l_newWidth / 2;
        const l_newYCoordinate =
          Math.sin(a_rotateAngleRads) * (xx - l_aimageWidth / 2) +
          Math.cos(a_rotateAngleRads) * (yy - l_aimageHeight / 2) +
          l_newHeight / 2;
        try {
          a_imageOut.setIntColor(
            Math.abs(Math.ceil(l_newXCoordinate)),
            Math.abs(Math.ceil(l_newYCoordinate)),
            a_imageIn.getAlphaComponent(xx, yy),
            a_imageIn.getIntColor(xx, yy)
          );
          l_LookUpArray[Math.abs(Math.ceil(l_newXCoordinate))][Math.abs(Math.ceil(l_newYCoordinate))][0] = xx;
          l_LookUpArray[Math.abs(Math.ceil(l_newXCoordinate))][Math.abs(Math.ceil(l_newYCoordinate))][1] = yy;
          l_LookUpArray[Math.abs(Math.ceil(l_newXCoordinate))][Math.abs(Math.ceil(l_newYCoordinate))][2] =
            a_imageIn.getIntColor(xx, yy);
        } catch (e) {
        //   console.log(e);
          console.log(l_newXCoordinate + " " + l_newYCoordinate);
        }
      }
    }
    // fill in the holes due to float/integer conversion.
    return this.interpolateImage(
      a_imageOut,
      l_LookUpArray,
      a_rotateAngleRads,
      l_initialisationValue
    );
  }
}
