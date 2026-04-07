import React from 'react';
import { Plus, X } from 'lucide-react';
import type { DraggableBubbleProps } from '@/types/types';

interface ExtendedDraggableBubbleProps extends DraggableBubbleProps {
  canvasScale: number;
}

export const DraggableBubble: React.FC<ExtendedDraggableBubbleProps> = ({
  bubble,
  isSelected,
  canvasScale,
  onDelete,
  onDrag,
  onSelect,
  onAddChild,
}) => {
  const size = bubble.parentId ? 130 : 160;
  const labelOpacity = Math.max(0, Math.min(1, (canvasScale - 0.3) * 2));

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();

    let lastX = event.clientX;
    let lastY = event.clientY;

    const handleMove = (moveEvent: PointerEvent) => {
      onDrag(moveEvent.clientX - lastX, moveEvent.clientY - lastY);
      lastX = moveEvent.clientX;
      lastY = moveEvent.clientY;
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  return (
    <div
      className="absolute z-30 cursor-grab pointer-events-auto active:cursor-grabbing"
      style={{
        left: bubble.x,
        top: bubble.y,
        transform: 'translate(-50%, -50%)',
      }}
      onPointerDown={handlePointerDown}
    >
      <div className="relative group">
        {bubble.badge && (
          <div
            style={{
              opacity: labelOpacity,
              transform: `translateX(-50%) scale(${labelOpacity * 0.2 + 0.8})`,
            }}
            className="absolute -bottom-11 left-1/2 z-10 whitespace-nowrap rounded-full border border-white/60 bg-white/70 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 shadow-sm backdrop-blur-md"
          >
            {bubble.badge}
          </div>
        )}

        <div
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          style={{ width: `${size}px`, height: `${size}px` }}
          className={`glass-sphere p-6 text-center transition-all duration-500 ${isSelected ? 'ring-4 ring-indigo-400/20' : ''}`}
        >
          <span
            style={{ opacity: labelOpacity }}
            className="select-none text-[15px] font-bold leading-tight text-slate-800 drop-shadow-sm"
          >
            {bubble.text}
          </span>

          <div className="bubble-dot" />
        </div>
      </div>

      {isSelected && (
        <div
          className="absolute -top-12 left-1/2 z-50 flex -translate-x-1/2 gap-3 pointer-events-auto"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAddChild();
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/95 text-indigo-500 shadow-2xl backdrop-blur-xl transition-colors hover:text-indigo-600 squishy-btn"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/95 text-rose-400 shadow-2xl backdrop-blur-xl transition-colors hover:text-rose-500 squishy-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};
