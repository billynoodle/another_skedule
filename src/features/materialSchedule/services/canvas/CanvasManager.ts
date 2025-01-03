import { fabric } from 'fabric';
import { log } from '../../../../utils/logger';

export interface CanvasConfig {
  width: number;
  height: number;
  mode: 'select' | 'draw';
  scale: number;
}

export class CanvasManager {
  private canvas: fabric.Canvas | null = null;
  private config: CanvasConfig;

  constructor(config: CanvasConfig) {
    this.config = config;
  }

  initialize(element: HTMLCanvasElement): fabric.Canvas {
    if (this.canvas) {
      this.dispose();
    }

    this.canvas = new fabric.Canvas(element, {
      width: this.config.width * this.config.scale,
      height: this.config.height * this.config.scale,
      selection: this.config.mode === 'select',
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true,
      stopContextMenu: true,
      fireRightClick: true,
      allowTouchScrolling: false
    });

    log('CanvasManager', 'Canvas initialized', { 
      width: this.config.width, 
      height: this.config.height,
      mode: this.config.mode
    });

    return this.canvas;
  }

  dispose(): void {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
      log('CanvasManager', 'Canvas disposed');
    }
  }

  getCanvas(): fabric.Canvas | null {
    return this.canvas;
  }

  updateConfig(config: Partial<CanvasConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.canvas) {
      if (config.width || config.height || config.scale) {
        this.canvas.setDimensions({
          width: this.config.width * this.config.scale,
          height: this.config.height * this.config.scale
        });
      }

      if (config.mode !== undefined) {
        this.canvas.selection = config.mode === 'select';
        this.canvas.defaultCursor = config.mode === 'draw' ? 'crosshair' : 'default';
        
        this.canvas.getObjects().forEach(obj => {
          obj.set({
            selectable: config.mode === 'select',
            evented: config.mode === 'select',
            hasControls: config.mode === 'select',
            hasBorders: config.mode === 'select'
          });
        });
      }

      this.canvas.requestRenderAll();
      log('CanvasManager', 'Canvas config updated', config);
    }
  }
}