export interface CanvasConfig {
  width: number;
  height: number;
  mode: 'select' | 'draw';
  scale: number;
  rotation: number;
}

export interface CanvasState {
  isInitialized: boolean;
  isRendering: boolean;
  error: Error | null;
}

export interface CanvasEventHandler {
  eventName: string;
  handler: Function;
}

export interface RenderOperation {
  id: string;
  operation: () => void;
  priority?: number;
}