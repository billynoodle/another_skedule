import { fabric } from 'fabric';
import { log } from '../../../../../utils/logger';

export class CanvasManager {
  private canvas: fabric.Canvas | null = null;
  private initialized = false;

  initialize(element: HTMLCanvasElement, width: number, height: number, scale: number): fabric.Canvas {
    if (this.canvas) {
      this.dispose();
    }

    this.canvas = new fabric.Canvas(element, {
      width: width * scale,
      height: height * scale,
      selection: true,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true
    });

    this.initialized = true;
    log('CanvasManager', 'Canvas initialized', { width, height, scale });
    
    return this.canvas;
  }

  dispose(): void {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
      this.initialized = false;
      log('CanvasManager', 'Canvas disposed');
    }
  }

  isInitialized(): boolean {
    return this.initialized && !!this.canvas;
  }

  getCanvas(): fabric.Canvas | null {
    return this.canvas;
  }
}