import { COLORS } from "@/components/explore/constants";
import type { Bubble, BubbleType } from "@/types/types";

// (Andy) This file translates between the canvas bubbles and the backend map shape.

// (Andy) This is the node shape MongoDB stores for one concept map bubble.
export interface BackendConceptMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string | null;
  feelings: string[];
}

// (Andy) Edges store the parent-child lines between backend nodes.
export interface BackendConceptMapEdge {
  id: string;
  source: string;
  target: string;
  label: string | null;
}

// (Andy) This is the full weekly concept map document returned by Express.
export interface WeeklyConceptMap {
  _id: string;
  user: string;
  weekKey: string;
  title: string;
  nodes: BackendConceptMapNode[];
  edges: BackendConceptMapEdge[];
  createdAt?: string;
  updatedAt?: string;
}

// (Andy) This is the payload we send when saving the current canvas.
export interface SaveWeeklyConceptMapPayload {
  title: string;
  nodes: BackendConceptMapNode[];
  edges: BackendConceptMapEdge[];
}

export const DEFAULT_WEEKLY_CONCEPT_MAP_TITLE = "My Weekly Mind Map";

// (Andy) Emotion bubbles become backend feelings so they can reload with badges.
const getNodeFeelings = (bubble: Bubble) => {
  if (bubble.type !== "emotion") {
    return [];
  }

  return [bubble.badge ?? bubble.text.toUpperCase()];
};

// (Andy) The backend does not store Bubble.type, so we rebuild it from feelings and parents.
const getBubbleType = (
  node: BackendConceptMapNode,
  parentId: string | null
): BubbleType => {
  if (node.feelings.length > 0) {
    return "emotion";
  }

  return parentId ? "thought" : "root";
};

// (Andy) Convert frontend bubbles into backend nodes and edges before saving.
export function bubblesToWeeklyConceptMapPayload(
  bubbles: Bubble[],
  title = DEFAULT_WEEKLY_CONCEPT_MAP_TITLE
): SaveWeeklyConceptMapPayload {
  return {
    title,
    nodes: bubbles.map((bubble) => ({
      id: bubble.id,
      label: bubble.text,
      x: bubble.x,
      y: bubble.y,
      color: bubble.color,
      feelings: getNodeFeelings(bubble),
    })),
    edges: bubbles.reduce<BackendConceptMapEdge[]>((edges, bubble) => {
      // (Andy) A bubble without a parent does not need a backend edge.
      if (!bubble.parentId) {
        return edges;
      }

      edges.push({
        id: `${bubble.parentId}->${bubble.id}`,
        source: bubble.parentId,
        target: bubble.id,
        label: null,
      });

      return edges;
    }, []),
  };
}

// (Andy) Convert the saved backend map back into bubbles the canvas can render.
export function weeklyConceptMapToBubbles(map: WeeklyConceptMap): Bubble[] {
  const nodeIds = new Set(map.nodes.map((node) => node.id));
  const parentByNodeId = new Map<string, string>();

  // (Andy) Edges tell us which node should become each bubble's parentId.
  map.edges.forEach((edge) => {
    if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
      parentByNodeId.set(edge.target, edge.source);
    }
  });

  return map.nodes.map((node) => {
    const parentId = parentByNodeId.get(node.id) ?? null;
    const type = getBubbleType(node, parentId);
    const badge = type === "emotion" ? node.feelings[0] ?? node.label.toUpperCase() : undefined;

    // (Andy) Backend label becomes the visible bubble text.
    return {
      id: node.id,
      text: node.label,
      x: node.x,
      y: node.y,
      parentId,
      type,
      color: node.color ?? COLORS.thought,
      badge,
    };
  });
}
