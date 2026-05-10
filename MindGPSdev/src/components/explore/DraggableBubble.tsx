import React from 'react';
import { Plus, X } from '@/lib/lucide-icons';
import { FOLLOW_UP_ACTIONS } from '@/components/explore/constants';
import type { BubbleActionType, DraggableBubbleProps } from '@/types/types';

// (Andy) This component only renders and drags one bubble; the canvas owns the data.
interface ExtendedDraggableBubbleProps extends DraggableBubbleProps {
  canvasScale: number;
} 

export const DraggableBubble: React.FC<ExtendedDraggableBubbleProps> = ({
  bubble,
  isSelected,
  canvasScale,
  onDelete,
  onDrag,
  onDragEnd,
  onSelect,
  onAddChild,
}) => {
  // (Andy) Child bubbles are smaller so parent bubbles feel more important.
  const size = bubble.parentId ? 130 : 160;
  const labelOpacity = Math.max(0, Math.min(1, (canvasScale - 0.3) * 2));
  const hasCustomColor =
    bubble.color.includes('gradient') ||
    bubble.color.startsWith('#') ||
    bubble.color.startsWith('rgb') ||
    bubble.color.startsWith('oklch');

  const bubbleStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    ...(hasCustomColor ? { background: bubble.color } : {}),
  };

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    actionType?: BubbleActionType
  ) => {
    event.stopPropagation();
    onAddChild(actionType);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();

    // (Andy) Track movement by pointer deltas so zoom math can live in the canvas.
    let lastX = event.clientX;
    let lastY = event.clientY;
    let didMove = false;

    const handleMove = (moveEvent: PointerEvent) => {
      didMove = true;
      onDrag(moveEvent.clientX - lastX, moveEvent.clientY - lastY);
      lastX = moveEvent.clientX;
      lastY = moveEvent.clientY;
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);

      // (Andy) Save after the drag ends, not during every pointer movement.
      if (didMove) {
        onDragEnd();
      }
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
          style={bubbleStyle}
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
          className={`absolute left-1/2 z-50 flex -translate-x-1/2 pointer-events-auto ${
            bubble.type === 'emotion' ? '-top-20 w-[360px] max-w-[80vw] flex-wrap justify-center gap-2' : '-top-12 gap-3'
          }`} // Show action buttons when the bubble is selected
          onPointerDown={(event) => event.stopPropagation()} // Prevent the event from bubbling up to the parent
        >
          {bubble.type === 'emotion' ? (
            FOLLOW_UP_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={(event) => handleActionClick(event, action.id)}
                className="rounded-full border border-white/60 bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 shadow-xl backdrop-blur-xl transition-colors hover:text-indigo-600 squishy-btn"
              >
                {action.label}
              </button>
            ))
          ) : (
            <button
              type="button"
              onClick={(event) => handleActionClick(event)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/95 text-indigo-500 shadow-2xl backdrop-blur-xl transition-colors hover:text-indigo-600 squishy-btn"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className={
              bubble.type === 'emotion'
                ? 'rounded-full border border-white/60 bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-rose-400 shadow-xl backdrop-blur-xl transition-colors hover:text-rose-500 squishy-btn'
                : 'flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/95 text-rose-400 shadow-2xl backdrop-blur-xl transition-colors hover:text-rose-500 squishy-btn'
            } // Delete button
          >
            {bubble.type === 'emotion' ? 'Delete' : <X className="h-5 w-5" />}
          </button>
        </div>
      )} 
    </div>
  );
};
