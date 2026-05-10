import type { BubbleActionType } from "@/types/types";

export const COLORS = {
  stress: "text-rose-600 bg-rose-50/50 border-rose-200/50",
  calm: "text-emerald-600 bg-emerald-50/50 border-emerald-200/50",
  gloomy: "text-indigo-600 bg-indigo-50/50 border-indigo-200/50",
  anxious: "text-amber-600 bg-amber-50/50 border-amber-200/50",
  thought: "text-slate-800 bg-white/40 border-white/60",
  suggestion: "text-slate-400 bg-white/20 border-white/40 border-dashed",
};

export const BADGE_COLORS = {
  PRACTICE: "text-indigo-600 border-indigo-200 bg-white/80",
  JOY: "text-rose-600 border-rose-200 bg-rose-50/80",
  CLARITY: "text-violet-600 border-violet-200 bg-violet-50/80",
};

export type EmotionFamily =
  | "Joy"
  | "Trust"
  | "Fear"
  | "Surprise"
  | "Sadness"
  | "Disgust"
  | "Anger"
  | "Anticipation";

type EmotionOption = {
  label: string;
  family: EmotionFamily;
  color: string;
  accent: string;
};

const EMOTION_FAMILY_STYLES: Record<EmotionFamily, { color: string; accent: string }> = {
  Joy: {
    color: "linear-gradient(145deg, rgba(254, 240, 138, 0.85), rgba(251, 191, 36, 0.35))",
    accent: "border-amber-200/70 bg-amber-50/70 text-amber-700",
  },
  Trust: {
    color: "linear-gradient(145deg, rgba(187, 247, 208, 0.85), rgba(34, 197, 94, 0.28))",
    accent: "border-emerald-200/70 bg-emerald-50/70 text-emerald-700",
  },
  Fear: {
    color: "linear-gradient(145deg, rgba(221, 214, 254, 0.9), rgba(139, 92, 246, 0.28))",
    accent: "border-violet-200/70 bg-violet-50/70 text-violet-700",
  },
  Surprise: {
    color: "linear-gradient(145deg, rgba(191, 219, 254, 0.85), rgba(59, 130, 246, 0.28))",
    accent: "border-sky-200/70 bg-sky-50/70 text-sky-700",
  },
  Sadness: {
    color: "linear-gradient(145deg, rgba(199, 210, 254, 0.85), rgba(79, 70, 229, 0.24))",
    accent: "border-indigo-200/70 bg-indigo-50/70 text-indigo-700",
  },
  Disgust: {
    color: "linear-gradient(145deg, rgba(216, 180, 254, 0.8), rgba(74, 222, 128, 0.2))",
    accent: "border-fuchsia-200/70 bg-fuchsia-50/70 text-fuchsia-700",
  },
  Anger: {
    color: "linear-gradient(145deg, rgba(254, 202, 202, 0.9), rgba(244, 63, 94, 0.3))",
    accent: "border-rose-200/70 bg-rose-50/70 text-rose-700",
  },
  Anticipation: {
    color: "linear-gradient(145deg, rgba(254, 215, 170, 0.9), rgba(249, 115, 22, 0.3))",
    accent: "border-orange-200/70 bg-orange-50/70 text-orange-700",
  },
};

const option = (label: string, family: EmotionFamily): EmotionOption => ({
  label,
  family,
  ...EMOTION_FAMILY_STYLES[family],
});

// (Andy) These groups power the emotion snapshot selector without changing the map schema.
export const EMOTION_GROUPS = [
  { family: "Joy", emotions: [option("Joy", "Joy"), option("Hopeful", "Joy")] },
  { family: "Trust", emotions: [option("Trust", "Trust"), option("Calm", "Trust")] },
  { family: "Fear", emotions: [option("Fear", "Fear"), option("Anxious", "Fear"), option("Stressed", "Fear")] },
  { family: "Surprise", emotions: [option("Surprise", "Surprise")] },
  { family: "Sadness", emotions: [option("Sadness", "Sadness"), option("Tired", "Sadness"), option("Gloomy", "Sadness")] },
  { family: "Disgust", emotions: [option("Disgust", "Disgust")] },
  { family: "Anger", emotions: [option("Anger", "Anger"), option("Frustrated", "Anger"), option("Annoyed", "Anger")] },
  { family: "Anticipation", emotions: [option("Anticipation", "Anticipation")] },
] satisfies Array<{ family: EmotionFamily; emotions: EmotionOption[] }>;

export const EMOTION_OPTIONS = EMOTION_GROUPS.flatMap((group) => group.emotions);

export const CHECK_IN_BUBBLE_COLOR =
  "linear-gradient(145deg, rgba(255, 255, 255, 0.78), rgba(237, 233, 254, 0.42))";

export const THOUGHT_BUBBLE_COLOR =
  "linear-gradient(145deg, rgba(255, 255, 255, 0.72), rgba(226, 232, 240, 0.3))";

export const FOLLOW_UP_BUBBLE_COLORS: Record<BubbleActionType, string> = {
  why: "linear-gradient(145deg, rgba(254, 249, 195, 0.72), rgba(251, 191, 36, 0.2))",
  thought: THOUGHT_BUBBLE_COLOR,
  need: "linear-gradient(145deg, rgba(220, 252, 231, 0.72), rgba(16, 185, 129, 0.2))",
  "next-step": "linear-gradient(145deg, rgba(219, 234, 254, 0.72), rgba(59, 130, 246, 0.2))",
};

export const FOLLOW_UP_ACTIONS: Array<{
  id: BubbleActionType;
  label: string;
  bubblePrefix: string;
  placeholder: string;
}> = [
  {
    id: "why",
    label: "Add why",
    bubblePrefix: "Cause",
    placeholder: "What might be contributing to this feeling?",
  },
  {
    id: "thought",
    label: "Add thought",
    bubblePrefix: "Thought",
    placeholder: "What thought is connected to this?",
  },
  {
    id: "need",
    label: "Add need",
    bubblePrefix: "Need",
    placeholder: "What do you need right now?",
  },
  {
    id: "next-step",
    label: "Add next step",
    bubblePrefix: "Next Step",
    placeholder: "What is one gentle next step?",
  },
];

export const getEmotionOptionByLabel = (label: string) =>
  EMOTION_OPTIONS.find((emotion) => emotion.label.toLowerCase() === label.toLowerCase());

export const getFollowUpAction = (id: BubbleActionType | null) =>
  FOLLOW_UP_ACTIONS.find((action) => action.id === id) ?? FOLLOW_UP_ACTIONS[1];
