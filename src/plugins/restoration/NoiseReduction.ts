import MarvinImage from "../../image/MarvinImage";
import MarvinImageMask from "../../image/MarvinImageMask";
import MarvinAttributes from "../../util/MarvinAttributes";
import MarvinAbstractImagePlugin from "../MarvinAbstractImagePlugin";
import MarvinJSUtils from "../../MarvinJSUtils";

export default class NoiseReduction extends MarvinAbstractImagePlugin {
  mat1: number[][];
  mat2: number[][];
  mat3: number[][];
  mat4: number[][];
  mata: number[][];
  img_x: number[][];
  img_y: number[][];
  img_xx: number[][];
  img_yy: number[][];
  img_xy: number[][];
  matr: number[][];
  matg: number[][];
  matb: number[][];
  img_org: number[][];
  imgR: number[][];
  imgG: number[][];
  imgB: number[][];
  width: number;
  height: number;

  process(
    a_imageIn: MarvinImage,
    iter = 20,
    threshold = 0.4,
  ) {
    this.width = a_imageIn.getWidth();
    this.height = a_imageIn.getHeight();
    const a_imageOut = a_imageIn.clone();

    this.mat1 = Array.from({ length: this.width }, (_, i) =>
      Array(this.height).fill(0)
    );
    this.mat2 = [...this.mat1];
    this.mat4 = [...this.mat1];
    this.mata = [...this.mat1];

    this.img_x = [...this.mat1];
    this.img_y = [...this.mat1];
    this.img_xx = [...this.mat1];
    this.img_yy = [...this.mat1];
    this.img_xy = [...this.mat1];

    this.matr = [...this.mat1];
    this.matg = [...this.mat1];
    this.matb = [...this.mat1];

    // Put the color values in let array
    const matR = Array.from({ length: this.width }, (_, i) =>
        Array.from({ length: this.height }, (_, j) =>
            a_imageIn.getIntComponent0(i, j)
        )
    );
    const matG = Array.from({ length: this.width }, (_, i) =>
        Array.from({ length: this.height }, (_, j) =>
            a_imageIn.getIntComponent1(i, j)
        )
    );
    const matB = Array.from({ length: this.width }, (_, i) =>
        Array.from({ length: this.height }, (_, j) =>
            a_imageIn.getIntComponent2(i, j)
        )
    );
    this.matr = MarvinJSUtils.deepCopy(matR);
    this.matg = MarvinJSUtils.deepCopy(matG);
    this.matb = MarvinJSUtils.deepCopy(matB);

    // Call denoise function
    this.matr = this.denoise(this.matr, iter, threshold);
    this.matg = this.denoise(this.matg, iter, threshold);
    this.matb = this.denoise(this.matb, iter, threshold);

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        a_imageOut.setIntColor(
          x,
          y,
          this.truncate(this.matr[x][y]),
          this.truncate(this.matg[x][y]),
          this.truncate(this.matb[x][y])
        );
      }
    }

    return a_imageOut;
  }

  //Function : denoise - Restores noisy images, input- let array containing color data
  denoise(mat: number[][], iter, threshold) {
    const img_res = Array.from({ length: this.width }, (_, i) =>
      Array(this.height).fill(0)
    );
    let l_currentNum;
    let l_currentDen;
    const val = 1;
    const lam = 0;
    const dt = 0.4;

    const img_org = Array.from({ length: this.width }, (_, i) =>
      Array.from({ length: this.height }, (_, j) => mat[i][j])
    );

    //Perform iterations
    const hist = [MarvinJSUtils.deepCopy(img_org)];
    //deep copy img_org
    for (let it = 0; it < iter; it++) {
      hist.push(MarvinJSUtils.deepCopy(mat));
      //compute derivatives
      this.img_x = this.diff_x(mat);
      this.img_y = this.diff_y(mat);
      this.img_xx = this.diff_xx(mat);
      this.img_yy = this.diff_yy(mat);
      this.img_xy = this.diff_xy(mat);

      mat = hist[hist.length - 1];
      for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
          const a = this.img_xx[i][j] * (val + Math.pow(this.img_y[i][j], 2));
          const b = 2 * this.img_x[i][j] * this.img_y[i][j] * this.img_xy[i][j];
          const c = this.img_yy[i][j] * (val + Math.pow(this.img_x[i][j], 2));
          l_currentNum = a - b + c;
          l_currentDen = Math.pow(
            val + Math.pow(this.img_x[i][j], 2) + Math.pow(this.img_y[i][j], 2),
            1.5
          );
          img_res[i][j] =
            l_currentNum / l_currentDen + lam * (img_org[i][j] - mat[i][j]);
          //   console.log("org:" + img_org[i][j], " | res:" + img_res[i][j]);
          mat[i][j] = mat[i][j] + threshold * img_res[i][j]; //evolve image by dt.
        }
      }
    } // end of iterations.
    return mat;
  }

  // Function : diff_x - To compute differntiation along x axis.
  diff_x(matx: number[][]) {
    this.mat3 = Array.from({ length: this.width }, (_, i) =>
      Array(this.height).fill(0)
    );
    let mat1, mat2;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (j == 0) {
          mat1 = matx[i][j];
          mat2 = matx[i][j + 1];
        } else if (j == this.height - 1) {
          mat1 = matx[i][j - 1];
          mat2 = matx[i][j];
        } else {
          mat1 = matx[i][j - 1];
          mat2 = matx[i][j + 1];
        }
        this.mat3[i][j] = (mat2 - mat1) / 2;
      }
    }
    return this.mat3;
  }

  // Function : diff_y -To compute differntiation along y axis.
  diff_y(maty: number[][]) {
    this.mat3 = Array.from({ length: this.width }, (_, i) =>
      Array(this.height).fill(0)
    );
    let mat1, mat2;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (i == 0) {
          mat1 = maty[i][j];
          mat2 = maty[i + 1][j];
        } else if (i == this.width - 1) {
          mat1 = maty[i - 1][j];
          mat2 = maty[i][j];
        } else {
          mat1 = maty[i - 1][j];
          mat2 = maty[i + 1][j];
        }
        this.mat3[i][j] = (mat2 - mat1) / 2;
      }
    }
    // maty= subMatrix(mat2,mat1,this.width,this.height);

    return this.mat3;
  }

  //Function : diff_xx -To compute second order differentiation along x axis.
  diff_xx(matxx: number[][]) {
    this.mat3 = Array.from({ length: this.width }, (_, i) =>
      Array(this.height).fill(0)
    );
    let mat1, mat2;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (j == 0) {
          mat1 = matxx[i][j];
          mat2 = matxx[i][j + 1];
        } else if (j == this.height - 1) {
          mat1 = matxx[i][j - 1];
          mat2 = matxx[i][j];
        } else {
          mat1 = matxx[i][j - 1];
          mat2 = matxx[i][j + 1];
        }

        this.mat3[i][j] = mat1 + mat2 - 2 * matxx[i][j];
      }
    }
    return this.mat3;
  }

  //Function : diff_yy - To compute second order differentiation along y axis.
  diff_yy(matyy: number[][]) {
    this.mat3 = Array.from({ length: this.width }, (_, i) =>
      Array(this.height).fill(0)
    );
    let mat1, mat2;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (i == 0) {
          mat1 = matyy[i][j];
          mat2 = matyy[i + 1][j];
        } else if (i == this.width - 1) {
          mat1 = matyy[i - 1][j];
          mat2 = matyy[i][j];
        } else {
          mat1 = matyy[i - 1][j];
          mat2 = matyy[i + 1][j];
        }
        this.mat3[i][j] = mat1 + mat2 - 2 * matyy[i][j];
      }
    }
    return this.mat3;
  }

  //Function: diff_xy  -To compute differentiation along xy direction
  diff_xy(matxy: number[][]) {
    this.mat3 = Array.from({ length: this.width }, (_, i) =>
      Array(this.height).fill(0)
    );
    let Dp;
    let Dm;

    for (let i = 0; i < this.width - 1; i++) {
      for (let j = 0; j < this.height - 1; j++) {
        this.mat1[i][j] = matxy[i + 1][j + 1];
        this.mat2[i + 1][j + 1] = matxy[i][j];
        this.mat3[i + 1][j] = matxy[i][j + 1];
        this.mat4[i][j + 1] = matxy[i + 1][j];
      }
    }

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (j == this.height - 1 && i < this.width - 1)
          this.mat1[i][j] = this.mat1[i][j - 1];
        else if (i == this.width - 1) this.mat1[i][j] = this.mat1[i - 1][j];

        if (i == 0 && j > 0) this.mat2[i][j] = this.mat2[1][j];
        else if (j == 0) this.mat2[i][0] = this.mat2[i][1];

        if (i == 0 && j < this.height - 1) this.mat3[i][j] = this.mat3[1][j];
        else if (j == this.height - 1) this.mat3[i][j] = this.mat3[i][j - 1];

        if (j == 0 && i < this.width - 1) this.mat4[i][j] = this.mat4[i][1];
        else if (i == this.width - 1) this.mat4[i][j] = this.mat4[i - 1][j];
      }
      this.mat2[0][0] = this.mat2[0][1];
    }

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        Dp = this.mat1[i][j] + this.mat2[i][j];
        Dm = this.mat3[i][j] + this.mat4[i][j];
        this.mata[i][j] = (Dp - Dm) / 4;
      }
    }

    return this.mata;
  }

  truncate(a) {
    if (a < 0) return 0;
    else if (a > 255) return 255;
    else return a;
  }
}
