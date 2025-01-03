import { log } from '../../utils/logger';

export class ViewportTransform {
  private scale: number;
  private rotation: number;
  private width: number;
  private height: number;

  constructor(width: number, height: number, scale: number = 1, rotation: number = 0) {
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.rotation = rotation;
    log('ViewportTransform', 'Initialized', { width, height, scale, rotation });
  }

  getTransformMatrix(): number[] {
    // Convert rotation to radians
    const rad = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Calculate center point
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Create transform matrix that:
    // 1. Translates to center
    // 2. Rotates
    // 3. Scales
    // 4. Translates back
    return [
      cos * this.scale, sin * this.scale,
      -sin * this.scale, cos * this.scale,
      centerX - (centerX * cos - centerY * sin) * this.scale,
      centerY - (centerX * sin + centerY * cos) * this.scale
    ];
  }

  transformPoint(x: number, y: number): { x: number; y: number } {
    const matrix = this.getTransformMatrix();
    return {
      x: x * matrix[0] + y * matrix[2] + matrix[4],
      y: x * matrix[1] + y * matrix[3] + matrix[5]
    };
  }

  inverseTransformPoint(x: number, y: number): { x: number; y: number } {
    const matrix = this.getTransformMatrix();
    const det = matrix[0] * matrix[3] - matrix[1] * matrix[2];
    return {
      x: ((x - matrix[4]) * matrix[3] - (y - matrix[5]) * matrix[2]) / det,
      y: ((y - matrix[5]) * matrix[0] - (x - matrix[4]) * matrix[1]) / det
    };
  }

  update(scale?: number, rotation?: number) {
    if (scale !== undefined) this.scale = scale;
    if (rotation !== undefined) this.rotation = rotation;
    log('ViewportTransform', 'Updated', { scale: this.scale, rotation: this.rotation });
  }
}