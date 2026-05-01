import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Maximize2, Minimize2, Plus } from '@/lib/lucide-icons';
import type { Bubble, BubbleType } from '@/types/types';
import { COLORS, SUGGESTIONS } from '@/components/explore/constants';
import { DraggableBubble } from '@/components/explore/DraggableBubble';
import { useAuth } from '@/context/AuthContext';
import {
  DEFAULT_WEEKLY_CONCEPT_MAP_TITLE,
  bubblesToWeeklyConceptMapPayload,
  weeklyConceptMapToBubbles,
} from '@/lib/conceptMapAdapters';
import {
  getCurrentWeeklyConceptMap,
  saveCurrentWeeklyConceptMap,
} from '@/services/conceptMapApi';

// (Andy) This delay keeps typing and quick edits from spamming the backend.
const MAP_SAVE_DEBOUNCE_MS = 500;

// (Andy) Local cache is scoped by Firebase UID so users do not share fallback maps.
const getMapStorageKey = (userId: string) => `mindgps_stitch_map:${userId}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

// (Andy) These guards keep old or broken localStorage data from crashing the canvas.
const isBubbleType = (value: unknown): value is BubbleType =>
  value === 'root' || value === 'emotion' || value === 'thought' || value === 'suggestion';

const isCachedBubble = (value: unknown): value is Bubble => {
  if (!isRecord(value)) {
    return false;
  }

  const badge = value.badge;

  return (
    typeof value.id === 'string' &&
    typeof value.text === 'string' &&
    typeof value.x === 'number' &&
    typeof value.y === 'number' &&
    (typeof value.parentId === 'string' || value.parentId === null) &&
    isBubbleType(value.type) &&
    typeof value.color === 'string' &&
    (badge === undefined || typeof badge === 'string')
  );
};

// (Andy) Read the local fallback copy if the backend cannot load.
const readCachedBubbles = (userId: string): Bubble[] => {
  try {
    const saved = localStorage.getItem(getMapStorageKey(userId));
    const parsed: unknown = saved ? JSON.parse(saved) : null;

    return Array.isArray(parsed) && parsed.every(isCachedBubble) ? parsed : [];
  } catch (error) {
    console.error('Failed to read cached concept map:', error);
    return [];
  }
};

// (Andy) Keep a local copy so the map still works through temporary backend failures.
const writeCachedBubbles = (userId: string, bubbles: Bubble[]) => {
  try {
    localStorage.setItem(getMapStorageKey(userId), JSON.stringify(bubbles));
  } catch (error) {
    console.error('Failed to cache concept map:', error);
  }
};

export const MindMapCanvas = () => {
  // (Andy) The current Firebase user decides which weekly map we load and save.
  const { currentUser } = useAuth();
  const userId = currentUser?.uid ?? null;
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEnteringCustom, setIsEnteringCustom] = useState(false);
  const [customText, setCustomText] = useState('');
  const [pendingParentId, setPendingParentId] = useState<string | null>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const [mapTitle, setMapTitle] = useState(DEFAULT_WEEKLY_CONCEPT_MAP_TITLE);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // (Andy) Refs let drag handlers read the latest state without waiting on React renders.
  const bubblesRef = useRef<Bubble[]>([]);
  const hasLoadedMapRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);
  const inFlightSaveRef = useRef(false);
  const queuedSaveRef = useRef<Bubble[] | null>(null);

  const setBubbleSnapshot = useCallback((nextBubbles: Bubble[]) => {
    // (Andy) Update the visible state and the drag-safe ref together.
    bubblesRef.current = nextBubbles;
    setBubbles(nextBubbles);
  }, []);

  const flushSave = useCallback(
    async (initialBubbles: Bubble[]) => {
      // (Andy) Do not save until Firebase auth and the first map load are ready.
      if (!userId || !hasLoadedMapRef.current) {
        return;
      }

      // (Andy) If a save is already running, remember the newest map and save it next.
      if (inFlightSaveRef.current) {
        queuedSaveRef.current = initialBubbles;
        return;
      }

      inFlightSaveRef.current = true;
      setIsSaving(true);

      let nextSnapshot: Bubble[] | null = initialBubbles;

      // (Andy) This loop saves the latest queued version after any in-flight save finishes.
      while (nextSnapshot) {
        const snapshot = nextSnapshot;
        nextSnapshot = null;

        try {
          await saveCurrentWeeklyConceptMap(
            bubblesToWeeklyConceptMapPayload(snapshot, mapTitle)
          );
          setSaveError(null);
        } catch (error) {
          console.error('Failed to save concept map:', error);
          setSaveError('Map changes are saved here, but not synced yet.');
        }

        nextSnapshot = queuedSaveRef.current;
        queuedSaveRef.current = null;
      }

      inFlightSaveRef.current = false;
      setIsSaving(false);
    },
    [mapTitle, userId]
  );

  const schedulePersistence = useCallback(
    (nextBubbles: Bubble[], delay = MAP_SAVE_DEBOUNCE_MS) => {
      // (Andy) Local state can change before backend sync is allowed.
      if (!userId || !hasLoadedMapRef.current) {
        return;
      }

      writeCachedBubbles(userId, nextBubbles);

      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = window.setTimeout(() => {
        saveTimerRef.current = null;
        void flushSave(nextBubbles);
      }, delay);
    },
    [flushSave, userId]
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    // (Andy) Clear the canvas when there is no signed-in user.
    if (!userId) {
      hasLoadedMapRef.current = false;
      setBubbleSnapshot([]);
      return;
    }

    const loadWeeklyMap = async () => {
      hasLoadedMapRef.current = false;
      setIsMapLoading(true);
      setMapError(null);
      setSaveError(null);

      try {
        // (Andy) Load the current week's saved map when the concept map opens.
        const map = await getCurrentWeeklyConceptMap();

        if (!isActive) {
          return;
        }

        const nextBubbles = weeklyConceptMapToBubbles(map);
        setMapTitle(map.title || DEFAULT_WEEKLY_CONCEPT_MAP_TITLE);
        setBubbleSnapshot(nextBubbles);
        writeCachedBubbles(userId, nextBubbles);
      } catch (error) {
        console.error('Failed to load concept map:', error);

        if (!isActive) {
          return;
        }

        // (Andy) If the backend is down, keep the canvas usable with this user's last local copy.
        setBubbleSnapshot(readCachedBubbles(userId));
        setMapError('Could not sync your saved map. You can still keep working.');
      } finally {
        if (isActive) {
          hasLoadedMapRef.current = true;
          setIsMapLoading(false);
        }
      }
    };

    void loadWeeklyMap();

    return () => {
      isActive = false;
    };
  }, [setBubbleSnapshot, userId]);

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
    const currentBubbles = bubblesRef.current;
    const parent = currentBubbles.find((bubble) => bubble.id === parentId);
    let x: number;
    let y: number;

    // (Andy) Child bubbles start near their parent; new root bubbles start at screen center.
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
    const nextBubbles = [...currentBubbles, newBubble];

    setBubbleSnapshot(nextBubbles);
    schedulePersistence(nextBubbles);
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
    const currentBubbles = bubblesRef.current;
    let count = 0;

    // (Andy) Deleting a parent also deletes all of its child bubbles.
    while (count !== toRemove.size) {
      count = toRemove.size;
      currentBubbles.forEach((bubble) => {
        if (bubble.parentId && toRemove.has(bubble.parentId)) {
          toRemove.add(bubble.id);
        }
      });
    }

    const nextBubbles = currentBubbles.filter((bubble) => !toRemove.has(bubble.id));

    setBubbleSnapshot(nextBubbles);
    schedulePersistence(nextBubbles);
    if (selectedId && toRemove.has(selectedId)) {
      setSelectedId(null);
    }
  };

  const updatePosition = (id: string, dx: number, dy: number) => {
    // (Andy) Convert screen movement into canvas movement so dragging works while zoomed.
    const worldDx = dx / camera.scale;
    const worldDy = dy / camera.scale;
    const nextBubbles = bubblesRef.current.map((bubble) =>
      bubble.id === id ? { ...bubble, x: bubble.x + worldDx, y: bubble.y + worldDy } : bubble
    );

    setBubbleSnapshot(nextBubbles);
  };

  const renderConnections = useMemo(() => {
    // (Andy) Connections are drawn from each child bubble back to its parent.
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

  const syncStatus = isMapLoading
    ? 'Loading saved map...'
    : isSaving
      ? 'Saving map...'
      : saveError ?? mapError;

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
        {syncStatus && (
          <div className="max-w-[240px] rounded-2xl border border-white/60 bg-white/60 px-3 py-2 text-right text-[11px] font-semibold text-slate-500 shadow-sm backdrop-blur-md">
            {syncStatus}
          </div>
        )}
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
              onDragEnd={() => schedulePersistence(bubblesRef.current)}
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
