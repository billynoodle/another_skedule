export interface CanvasConfig {
  width: number;
  height: number;
  mode: 'select' | 'draw';
  scale: number;
}

export interface CanvasState {
  isInitialized: boolean;
  isRendering: boolean;
  error: Error | null;
}