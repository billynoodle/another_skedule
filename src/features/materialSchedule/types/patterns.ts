export interface TagPattern {
  id: string;
  prefix: string;
  description: string;
  scheduleTable: string;
}

export interface TagPatternMatch {
  pattern: TagPattern;
  confidence: number;
  text: string;
}

export interface PatternSearchResult {
  pattern: TagPattern;
  matches: {
    text: string;
    confidence: number;
    location: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }[];
}