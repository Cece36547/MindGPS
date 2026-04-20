import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Maximize2, Minimize2, Plus } from '@/lib/lucide-icons';
import type { Bubble, BubbleType } from '@/types/types';
import { COLORS, SUGGESTIONS } from '@/components/explore/constants';
import { DraggableBubble } from '@/components/explore/DraggableBubble';

export const MindMapCanvas = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEnteringCustom, setIsEnteringCustom] = useState(false);
  const [customText, setCustomText] = useState('');
  const [pendingParentId, setPendingParentId] = useState<string | null>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mindgps_stitch_map');
    if (saved) {
      setBubbles(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mindgps_stitch_map', JSON.stringify(bubbles));
  }, [bubbles]);

  useEffect(() => {
    if (isEnteringCustom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEnteringCustom]);

  const clampScale = (scale: number) => Math.min(Math.max(scale, 0.2), 3);

  const getCanvasRect = () => containerRef.current?.getBoundingClientRect();

  const getCanvasPoint = (clientX: number, clientY: number) => {
    const rect = getCanvasRect();

    if (!rect) {
      return { x: 0, y: 0 };
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const getCanvasCenter = () => {
    const rect = getCanvasRect();

    if (!rect) {
      return { x: 0, y: 0 };
    }

    return {
      x: rect.width / 2,
      y: rect.height / 2,
    };
  };

  const getWorldPoint = (
    screenX: number,
    screenY: number,
    currentCamera = camera
  ) => ({
    x: (screenX - currentCamera.x) / currentCamera.scale,
    y: (screenY - currentCamera.y) / currentCamera.scale,
  });

  const getCenteredCamera = (worldX: number, worldY: number, targetScale = camera.scale) => {
    const center = getCanvasCenter();
    const nextScale = clampScale(targetScale);

    return {
      x: center.x - worldX * nextScale,
      y: center.y - worldY * nextScale,
      scale: nextScale,
    };
  };

  const focusOnBubble = (worldX: number, worldY: number, targetScale = 1) => {
    setCamera(getCenteredCamera(worldX, worldY, targetScale));
  };

  const zoomAtPoint = (
    screenX: number,
    screenY: number,
    targetScale: number | ((currentScale: number) => number)
  ) => {
    setCamera((prev) => {
      const nextScale = clampScale(
        typeof targetScale === 'function' ? targetScale(prev.scale) : targetScale
      );

      if (nextScale === prev.scale) {
        return prev;
      }

      // Keep the same world-space point under the same panel-space cursor position.
      const worldPoint = getWorldPoint(screenX, screenY, prev);

      return {
        x: screenX - worldPoint.x * nextScale,
        y: screenY - worldPoint.y * nextScale,
        scale: nextScale,
      };
    });
  };

  const zoomAroundCenter = (targetScale: number | ((currentScale: number) => number)) => {
    const center = getCanvasCenter();
    zoomAtPoint(center.x, center.y, targetScale);
  };

  const addBubble = (text: string, type: BubbleType, parentId: string | null = null) => {
    if (!text.trim()) {
      return;
    }

    const id = Math.random().toString(36).slice(2, 11);
    const parent = bubbles.find((bubble) => bubble.id === parentId);
    let x: number;
    let y: number;

    if (parent) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 200;
      x = parent.x + Math.cos(angle) * distance;
      y = parent.y + Math.sin(angle) * distance;
    } else {
      const center = getCanvasCenter();
      const worldCenter = getWorldPoint(center.x, center.y);
      x = worldCenter.x;
      y = worldCenter.y;
    }

    const newBubble: Bubble = {
      id,
      text,
      x,
      y,
      parentId,
      type,
      color: COLORS.thought,
      badge: type === 'emotion' ? text.toUpperCase() : undefined,
    };

    setBubbles((prev) => [...prev, newBubble]);
    setIsAdding(false);
    setIsEnteringCustom(false);
    setCustomText('');
    setPendingParentId(null);
    setSelectedId(id);
    focusOnBubble(x, y, 1.2);
  };

  const handleBackgroundPan = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isAdding) {
      return;
    }

    if (e.target !== containerRef.current && !(e.target as HTMLElement).classList.contains('canvas-bg')) {
      return;
    }

    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialCamX = camera.x;
    const initialCamY = camera.y;

    const onMove = (moveEvent: PointerEvent) => {
      setCamera((prev) => ({
        ...prev,
        x: initialCamX + (moveEvent.clientX - startX),
        y: initialCamY + (moveEvent.clientY - startY),
      }));
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isAdding) {
      return;
    }

    e.preventDefault();

    const factor = Math.pow(1.1, -e.deltaY / 100);
    const pointer = getCanvasPoint(e.clientX, e.clientY);
    zoomAtPoint(pointer.x, pointer.y, (currentScale) => currentScale * factor);
  };

  const removeBubble = (id: string) => {
    const toRemove = new Set([id]);
    let count = 0;

    while (count !== toRemove.size) {
      count = toRemove.size;
      bubbles.forEach((bubble) => {
        if (bubble.parentId && toRemove.has(bubble.parentId)) {
          toRemove.add(bubble.id);
        }
      });
    }

    setBubbles((prev) => prev.filter((bubble) => !toRemove.has(bubble.id)));
    if (selectedId && toRemove.has(selectedId)) {
      setSelectedId(null);
    }
  };

  const updatePosition = (id: string, dx: number, dy: number) => {
    const worldDx = dx / camera.scale;
    const worldDy = dy / camera.scale;

    setBubbles((prev) =>
      prev.map((bubble) =>
        bubble.id === id ? { ...bubble, x: bubble.x + worldDx, y: bubble.y + worldDy } : bubble
      )
    );
  };

  const renderConnections = useMemo(() => {
    return bubbles.map((bubble) => {
      if (!bubble.parentId) {
        return null;
      }

      const parent = bubbles.find((candidate) => candidate.id === bubble.parentId);
      if (!parent) {
        return null;
      }

      const midX = (parent.x + bubble.x) / 2;
      const pathData = `M ${parent.x} ${parent.y} C ${midX} ${parent.y}, ${midX} ${bubble.y}, ${bubble.x} ${bubble.y}`;

      return (
        <path
          key={`line-${bubble.id}`}
          d={pathData}
          fill="none"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth={2 / camera.scale}
          strokeDasharray={camera.scale < 0.5 ? '4 4' : 'none'}
        />
      );
    });
  }, [bubbles, camera.scale]);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-0 w-full overflow-hidden canvas-bg touch-none"
      onPointerDown={handleBackgroundPan}
      onWheel={handleWheel}
      onClick={(e) => {
        if (e.target === containerRef.current) {
          setSelectedId(null);
        }
      }}
    >
      <div className="absolute top-20 right-6 z-[60] flex flex-col gap-2">
        <div className="rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 shadow-sm backdrop-blur-md">
          {Math.round(camera.scale * 100)}% Focus
        </div>
      </div>

      {bubbles.length === 0 && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
          <div className="space-y-4">
            <p className="text-lg font-medium text-slate-400">Your mind is an open space.</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">Tap + to start mapping</p>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
          transformOrigin: '0 0',
        }}
      >
        <svg className="absolute inset-0 h-full w-full overflow-visible">{renderConnections}</svg>

        <div className="absolute inset-0">
          {bubbles.map((bubble) => (
            <DraggableBubble
              key={bubble.id}
              bubble={bubble}
              isSelected={selectedId === bubble.id}
              canvasScale={camera.scale}
              onDelete={() => removeBubble(bubble.id)}
              onDrag={(dx, dy) => updatePosition(bubble.id, dx, dy)}
              onSelect={() => {
                setSelectedId(bubble.id);
                focusOnBubble(bubble.x, bubble.y, Math.max(camera.scale, 0.8));
              }}
              onAddChild={() => {
                setPendingParentId(bubble.id);
                setIsAdding(true);
              }}
            />
          ))}
        </div>
      </div>

      {!isAdding && (
        <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4">
          <button
            type="button"
            onClick={() => zoomAroundCenter((currentScale) => currentScale - 0.2)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/40 text-slate-400 shadow-lg backdrop-blur-md squishy-btn"
          >
            <Minimize2 className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setPendingParentId(null);
              setIsAdding(true);
            }}
            className="glass-sphere flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-slate-400 shadow-2xl ring-4 ring-white/10 transition-all hover:bg-white/40"
          >
            <Plus className="h-10 w-10" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={() => zoomAroundCenter((currentScale) => currentScale + 0.2)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/40 text-slate-400 shadow-lg backdrop-blur-md squishy-btn"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      )}

      {isAdding && (
        <div
          className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-900/10 p-6 backdrop-blur-md"
          onClick={() => setIsAdding(false)}
        >
          <div
            className="w-full max-w-sm rounded-[40px] border border-white/80 bg-white/90 p-8 shadow-2xl backdrop-blur-3xl"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {!isEnteringCustom ? (
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Capture Feeling</p>
                  <h3 className="text-xl font-bold text-slate-800">What's rising up?</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => addBubble(
                        suggestion.charAt(0).toUpperCase() + suggestion.slice(1),
                        'emotion',
                        pendingParentId
                      )}
                      className="rounded-[24px] border border-slate-100 bg-white/50 p-5 text-[11px] font-bold capitalize text-slate-600 transition-all hover:border-indigo-100 hover:bg-indigo-50/50 squishy-btn"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIsEnteringCustom(true)}
                  className="flex w-full items-center justify-between rounded-[24px] border border-slate-100 bg-slate-50 p-5 text-[11px] font-bold text-slate-400 transition-colors hover:bg-white"
                >
                  Add a Detail
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setIsEnteringCustom(false)} className="p-2 text-slate-400">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Connect Thought</p>
                </div>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addBubble(customText, 'thought', pendingParentId);
                      }
                    }}
                    placeholder="Type something..."
                    className="w-full rounded-[24px] border border-slate-100 bg-slate-50 p-5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    type="button"
                    onClick={() => addBubble(customText, 'thought', pendingParentId)}
                    disabled={!customText.trim()}
                    className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all disabled:bg-slate-200"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
