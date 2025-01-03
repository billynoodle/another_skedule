import { useCallback, useRef } from 'react';
import { fabric } from 'fabric';
import { ViewportTransform } from './ViewportTransform';
import { log } from '../../../../../utils/logger';

interface DrawingManagerProps {
  canvas: fabric.Canvas;
  transform: ViewportTransform;
  onAnnotationCreate: (annotation: any) => void;
}

export function DrawingManager({ canvas, transform, onAnnotationCreate }: DrawingManagerProps) {
  const drawingRef = useRef({
    isDrawing: false,
    startPoint: null as fabric.Point | null,
    activeRect: null as fabric.Rect | null
  });

  const handleMouseDown = useCallback((e: fabric.IEvent) => {
    if (!e.pointer) return;

    const point = transform.toCanvasPoint(e.pointer.x, e.pointer.y);
    drawingRef.current = {
      isDrawing: true,
      startPoint: new fabric.Point(point.x, point.y),
      activeRect: null
    };

    const rect = new fabric.Rect({
      left: point.x,
      top: point.y,
      width: 0,
      height: 0,
      fill: 'rgba(37, 99, 235, 0.1)',
      stroke: '#2563eb',
      strokeWidth: 2,
      selectable: false,
      evented: false
    });

    canvas.add(rect);
    drawingRef.current.activeRect = rect;
    canvas.renderAll();
    
    log('DrawingManager', 'Started drawing', { point });
  }, [canvas, transform]);

  const handleMouseMove = useCallback((e: fabric.IEvent) => {
    const { isDrawing, startPoint, activeRect } = drawingRef.current;
    if (!isDrawing || !startPoint || !activeRect || !e.pointer) return;

    const point = transform.toCanvasPoint(e.pointer.x, e.pointer.y);
    const width = Math.abs(point.x - startPoint.x);
    const height = Math.abs(point.y - startPoint.y);
    const left = Math.min(startPoint.x, point.x);
    const top = Math.min(startPoint.y, point.y);

    activeRect.set({ left, top, width, height });
    canvas.renderAll();
  }, [canvas, transform]);

  const handleMouseUp = useCallback(() => {
    const { isDrawing, activeRect } = drawingRef.current;
    if (!isDrawing || !activeRect) return;

    if (activeRect.width! > 5 && activeRect.height! > 5) {
      onAnnotationCreate({
        type: 'box',
        position: {
          left: activeRect.left,
          top: activeRect.top,
          width: activeRect.width,
          height: activeRect.height,
          angle: activeRect.angle || 0
        }
      });
    } else {
      canvas.remove(activeRect);
    }

    drawingRef.current = {
      isDrawing: false,
      startPoint: null,
      activeRect: null
    };
    
    canvas.renderAll();
  }, [canvas, onAnnotationCreate]);

  // Attach event handlers
  canvas.on({
    'mouse:down': handleMouseDown,
    'mouse:move': handleMouseMove,
    'mouse:up': handleMouseUp
  });

  return null;
}