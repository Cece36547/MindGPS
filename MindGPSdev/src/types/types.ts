export type BubbleType = 'root' | 'emotion' | 'thought' | 'suggestion';
export type AuthMode = 'signin' | 'signup';

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

export interface DraggableBubbleProps {
  bubble: Bubble;
  isSelected: boolean;
  onDelete: () => void;
  onDrag: (x: number, y: number) => void;
  onSelect: () => void;
  onAddChild: () => void;
}

export interface InfoOverlayProps {
  onClose: () => void;
}
