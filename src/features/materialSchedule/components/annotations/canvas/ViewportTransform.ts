export class ViewportTransform {
  private scale: number;
  private width: number;
  private height: number;

  constructor(width: number, height: number, scale: number) {
    this.width = width;
    this.height = height;
    this.scale = scale;
  }

  toCanvasPoint(x: number, y: number) {
    return {
      x: x / this.scale,
      y: y / this.scale
    };
  }

  toViewportPoint(x: number, y: number) {
    return {
      x: x * this.scale,
      y: y * this.scale
    };
  }

  getDimensions() {
    return {
      width: this.width * this.scale,
      height: this.height * this.scale
    };
  }
}