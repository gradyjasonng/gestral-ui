import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@lib/cn';

export interface CanvasProps {
  children?: ReactNode;
  className?: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
// Trackpad pinch gestures report small deltaY values per event; this keeps zoom feeling gradual.
const ZOOM_SENSITIVITY = 0.01;

/** Stubbed artboard area — the content region a Shell lays out alongside its rails */
export function Canvas({ children, className }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Trackpad pinch-zoom is reported as a wheel event with ctrlKey set (Chrome/Firefox/Safari
    // convention). preventDefault stops the browser from zooming the whole page instead.
    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      setScale((prev) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev - event.deltaY * ZOOM_SENSITIVITY)));
    };

    node.addEventListener('wheel', handleWheel, { passive: false });
    return () => node.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('min-w-0 h-full overflow-y-auto bg-canvas-surface', className)}
    >
      <div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
