import React from 'react';
import { useViewerStore } from '../../../../../stores/viewerStore';

interface CanvasContainerProps {
  children: React.ReactNode;
  width: number;
  height: number;
}

export function CanvasContainer({ children, width, height }: CanvasContainerProps) {
  const { scale } = useViewerStore();

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={{
        width: width * scale,
        height: height * scale,
        transform: `scale(${scale})`,
        transformOrigin: '0 0',
        touchAction: 'none',
        pointerEvents: 'none'
      }}
    >
      {children}
    </div>
  );
}