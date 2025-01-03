import { TagPattern, TagPatternMatch } from '../../types/patterns';
import { log } from '../../../../utils/logger';

export function matchPattern(text: string, patterns: TagPattern[]): TagPatternMatch | null {
  const cleanText = text.trim().toUpperCase();
  
  for (const pattern of patterns) {
    const prefix = pattern.prefix.toUpperCase();
    if (cleanText.startsWith(prefix)) {
      const confidence = calculateConfidence(cleanText, prefix);
      
      log('PatternMatcher', 'Pattern matched', { 
        pattern: pattern.prefix,
        text: cleanText,
        confidence 
      });
      
      return {
        pattern,
        confidence,
        text: cleanText
      };
    }
  }
  return null;
}

function calculateConfidence(text: string, prefix: string): number {
  // Weighted scoring system
  const scores = {
    prefixMatch: 0,
    textQuality: 0,
    lengthRatio: 0
  };

  // Perfect prefix match
  if (text.startsWith(prefix)) {
    scores.prefixMatch = 50;
  }

  // Text quality score based on length and character validity
  scores.textQuality = Math.min(30, text.length * 3);

  // Length ratio score - penalize if text is too long compared to prefix
  const ratio = prefix.length / text.length;
  scores.lengthRatio = Math.min(20, ratio * 20);

  const totalScore = scores.prefixMatch + scores.textQuality + scores.lengthRatio;

  log('PatternMatcher', 'Confidence calculation', { scores, totalScore });

  return totalScore;
}