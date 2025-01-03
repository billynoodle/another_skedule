export interface Annotation {
  id: string;
  type: 'box';
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
    angle: number;
  };
  tagPatternId?: string;
  extractedText?: string;
  confidence?: number;
}