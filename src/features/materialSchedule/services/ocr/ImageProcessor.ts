import { ProcessingOptions } from './types';
import { log } from '../../../../utils/logger';

const DEFAULT_OPTIONS: ProcessingOptions = {
  contrast: 1.2,
  threshold: 128,
  denoise: true,
  scale: 1
};

export function processImage(imageData: ImageData, options: ProcessingOptions = DEFAULT_OPTIONS): ImageData {
  let processed = imageData;

  if (options.scale !== 1) {
    processed = scaleImage(processed, options.scale);
  }

  if (options.contrast !== 1) {
    processed = enhanceContrast(processed, options.contrast);
  }

  if (options.denoise) {
    processed = denoiseImage(processed);
  }

  processed = binarize(processed, options.threshold);

  log('ImageProcessor', 'Image processed', {
    originalSize: `${imageData.width}x${imageData.height}`,
    processedSize: `${processed.width}x${processed.height}`,
    options
  });

  return processed;
}

function scaleImage(imageData: ImageData, scale: number): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = imageData.width * scale;
  canvas.height = imageData.height * scale;

  ctx.putImageData(imageData, 0, 0);
  ctx.scale(scale, scale);
  
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function enhanceContrast(imageData: ImageData, contrast: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const newValue = factor * (avg - 128) + 128;
    
    data[i] = newValue;     // R
    data[i + 1] = newValue; // G
    data[i + 2] = newValue; // B
  }

  return new ImageData(data, imageData.width, imageData.height);
}

function denoiseImage(imageData: ImageData): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const neighbors = [];

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nidx = ((y + dy) * width + (x + dx)) * 4;
          neighbors.push(data[nidx]);
        }
      }

      neighbors.sort((a, b) => a - b);
      const median = neighbors[4];

      data[idx] = median;     // R
      data[idx + 1] = median; // G
      data[idx + 2] = median; // B
    }
  }

  return new ImageData(data, width, height);
}

function binarize(imageData: ImageData, threshold: number): ImageData {
  const data = new Uint8ClampedArray(imageData.data);

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const value = avg > threshold ? 255 : 0;
    
    data[i] = value;     // R
    data[i + 1] = value; // G
    data[i + 2] = value; // B
  }

  return new ImageData(data, imageData.width, imageData.height);
}