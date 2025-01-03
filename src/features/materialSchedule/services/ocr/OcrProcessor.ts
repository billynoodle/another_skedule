import { createWorker } from 'tesseract.js';
import { OcrConfig, OcrResult } from './types';
import { log } from '../../../../utils/logger';

const DEFAULT_CONFIG: OcrConfig = {
  language: 'eng',
  mode: 'single-line',
  confidence: 60,
  whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-'
};

let worker: Tesseract.Worker | null = null;

async function initializeWorker(config: OcrConfig = DEFAULT_CONFIG) {
  if (!worker) {
    worker = await createWorker({
      logger: process.env.NODE_ENV === 'development',
      errorHandler: (err: any) => {
        log('OCR', 'Worker error', err);
      }
    });
    
    await worker.loadLanguage(config.language);
    await worker.initialize(config.language);
    await worker.setParameters({
      tessedit_char_whitelist: config.whitelist,
      tessedit_pageseg_mode: config.mode === 'single-line' ? '7' : '3'
    });

    log('OCR', 'Worker initialized', { config });
  }
  return worker;
}

export async function processText(imageData: ImageData, config: OcrConfig = DEFAULT_CONFIG): Promise<OcrResult> {
  const ocrWorker = await initializeWorker(config);
  const base64Image = imageDataToBase64(imageData);
  
  const result = await ocrWorker.recognize(base64Image);
  
  log('OCR', 'Text processed', { confidence: result.data.confidence });
  
  return {
    text: result.data.text.trim(),
    confidence: result.data.confidence,
    bbox: result.data.words[0]?.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 }
  };
}

export async function cleanup() {
  if (worker) {
    await worker.terminate();
    worker = null;
    log('OCR', 'Worker terminated');
  }
}

function imageDataToBase64(imageData: ImageData): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
  
  return canvas.toDataURL('image/png');
}