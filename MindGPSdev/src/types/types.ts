export type BubbleType = 'root' | 'emotion' | 'thought' | 'suggestion';
export type AuthMode = 'signin' | 'signup';

// (Andy) This is the frontend shape for one visible concept map bubble.
export interface Bubble {
  id: string;
  text: string;
  x: number;
  y: number;
  parentId: string | null;
  type: BubbleType;
  color: string;
  badge?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  text: string;
}

export interface SessionReflection {
  message: string;
  visible: boolean;
}

export interface AuthPageProps {
  onAuthenticate: () => void;
}

export interface HeaderProps {
  onShowInfo: () => void;
}

export interface NavigationProps {
  activeTab: string;
   onTabChange: (tab: string) => void;
}

// (Andy) These callbacks let the canvas control bubble actions from one parent state.
export interface DraggableBubbleProps {
  bubble: Bubble;
  isSelected: boolean;
  onDelete: () => void;
  onDrag: (x: number, y: number) => void;
  // (Andy) This fires once after dragging stops, so we do not save on every mousemove.
  onDragEnd: () => void;
  onSelect: () => void;
  onAddChild: () => void;
}

export interface InfoOverlayProps {
  onClose: () => void;
}
