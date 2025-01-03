import React, { useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useViewerStore } from '../../../../../stores/viewerStore';
import { useAnnotationStore } from '../../../../../stores/annotationStore';
import { log } from '../../../../../utils/logger';

interface AnnotationCanvasProps {
  width: number;
  height: number;
  jobId: string;
  documentId: string;
  onAnnotationComplete?: () => void;
}

export function AnnotationCanvas({
  width,
  height,
  jobId,
  documentId,
  onAnnotationComplete
}: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { mode } = useViewerStore();
  const {
    getDocumentState,
    addAnnotation,
    updateAnnotation,
    selectAnnotation,
    setHoveredAnnotation,
    selectedId
  } = useAnnotationStore();

  const { annotations = [], scale } = getDocumentState(jobId, documentId);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: width * scale,
      height: height * scale,
      selection: mode === 'select',
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      enableRetinaScaling: true
    });

    fabricRef.current = canvas;
    log('AnnotationCanvas', 'Canvas initialized');

    return () => {
      canvas.dispose();
      fabricRef.current = null;
      log('AnnotationCanvas', 'Canvas disposed');
    };
  }, [width, height, scale, mode]);

  // Sync annotations
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Clear existing objects
    canvas.clear();

    // Restore annotations
    annotations.forEach(annotation => {
      const rect = new fabric.Rect({
        left: annotation.position.left * scale,
        top: annotation.position.top * scale,
        width: annotation.position.width * scale,
        height: annotation.position.height * scale,
        angle: annotation.position.angle,
        fill: 'rgba(37, 99, 235, 0.1)',
        stroke: '#2563eb',
        strokeWidth: 2 / scale,
        cornerStyle: 'circle',
        cornerSize: 8 / scale,
        transparentCorners: false,
        cornerColor: '#2563eb',
        borderColor: '#2563eb',
        borderScaleFactor: 2,
        padding: 0,
        hasRotatingPoint: false,
        id: annotation.id,
        selectable: mode === 'select',
        evented: mode === 'select',
        hasControls: mode === 'select',
        hasBorders: mode === 'select'
      });

      canvas.add(rect);

      // Restore selection if needed
      if (selectedId === annotation.id) {
        canvas.setActiveObject(rect);
      }
    });

    canvas.renderAll();
    log('AnnotationCanvas', 'Annotations synced', { count: annotations.length });
  }, [annotations, scale, mode, selectedId]);

  // Handle drawing mode
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    let isDrawing = false;
    let startPoint: fabric.Point | null = null;
    let rect: fabric.Rect | null = null;

    const handleMouseDown = (e: fabric.IEvent) => {
      if (mode !== 'draw' || !e.pointer) return;
      
      isDrawing = true;
      startPoint = canvas.getPointer(e.e);
      
      rect = new fabric.Rect({
        left: startPoint.x,
        top: startPoint.y,
        width: 0,
        height: 0,
        fill: 'rgba(37, 99, 235, 0.1)',
        stroke: '#2563eb',
        strokeWidth: 2 / scale,
        selectable: false,
        evented: false,
        id: crypto.randomUUID()
      });

      canvas.add(rect);
      canvas.renderAll();
      
      log('AnnotationCanvas', 'Started drawing', { point: startPoint });
    };

    const handleMouseMove = (e: fabric.IEvent) => {
      if (!isDrawing || !startPoint || !rect || !e.pointer) return;

      const pointer = canvas.getPointer(e.e);
      const width = Math.abs(pointer.x - startPoint.x);
      const height = Math.abs(pointer.y - startPoint.y);
      const left = Math.min(startPoint.x, pointer.x);
      const top = Math.min(startPoint.y, pointer.y);

      rect.set({ left, top, width, height });
      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawing || !rect) return;

      if (rect.width! > 5 && rect.height! > 5) {
        const annotation = {
          type: 'box' as const,
          position: {
            left: rect.left! / scale,
            top: rect.top! / scale,
            width: rect.width! / scale,
            height: rect.height! / scale,
            angle: rect.angle || 0
          }
        };

        addAnnotation(jobId, documentId, annotation);
        onAnnotationComplete?.();
        log('AnnotationCanvas', 'Created annotation');
      } else {
        canvas.remove(rect);
        log('AnnotationCanvas', 'Cancelled drawing - too small');
      }

      isDrawing = false;
      startPoint = null;
      rect = null;
      canvas.renderAll();
    };

    canvas.on({
      'mouse:down': handleMouseDown,
      'mouse:move': handleMouseMove,
      'mouse:up': handleMouseUp,
      'selection:created': (e) => selectAnnotation(e.selected?.[0]?.id as string),
      'selection:updated': (e) => selectAnnotation(e.selected?.[0]?.id as string),
      'selection:cleared': () => selectAnnotation(null),
      'mouse:over': (e) => e.target && setHoveredAnnotation(e.target.id as string),
      'mouse:out': () => setHoveredAnnotation(null),
      'object:modified': (e) => {
        if (!e.target) return;
        const obj = e.target;
        updateAnnotation(jobId, documentId, {
          id: obj.id as string,
          type: 'box',
          position: {
            left: obj.left! / scale,
            top: obj.top! / scale,
            width: obj.width! / scale,
            height: obj.height! / scale,
            angle: obj.angle || 0
          }
        });
      }
    });

    return () => {
      canvas.off();
    };
  }, [mode, scale, jobId, documentId, addAnnotation, updateAnnotation, selectAnnotation, setHoveredAnnotation, onAnnotationComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0"
      style={{
        pointerEvents: 'auto',
        touchAction: 'none',
        cursor: mode === 'draw' ? 'crosshair' : 'default'
      }}
    />
  );
}