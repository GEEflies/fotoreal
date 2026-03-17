import { useState, useRef, useCallback } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  eager?: boolean;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Pred",
  afterLabel = "Po",
  className = "",
  eager = false,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const loadingAttr = eager ? "eager" : "lazy";

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl select-none cursor-col-resize ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* After (full) */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="w-full h-full object-cover block"
        draggable={false}
        loading={loadingAttr}
        decoding="async"
        width={1200}
        height={750}
      />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="w-full h-full object-cover"
          draggable={false}
          loading={loadingAttr}
          decoding="async"
          width={1200}
          height={750}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-background z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground">
            <path d="M5 3L2 8L5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 3L14 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 text-xs font-semibold bg-foreground/70 text-background px-2 py-1 rounded z-20">{beforeLabel}</span>
      <span className="absolute top-3 right-3 text-xs font-semibold bg-primary/90 text-primary-foreground px-2 py-1 rounded z-20">{afterLabel}</span>
    </div>
  );
}
