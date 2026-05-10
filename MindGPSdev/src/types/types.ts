export type BubbleType = 'root' | 'emotion' | 'thought' | 'suggestion';
export type BubbleActionType = 'why' | 'thought' | 'need' | 'next-step';
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

export interface SessionReflection { // (Andy) A reflection of the user's session.
  message: string;
  visible: boolean;
}

export interface AuthPageProps { // (Andy) Props for the authentication page.
  onAuthenticate: () => void;
}

export interface HeaderProps { // (Andy) Props for the header component.
  onShowInfo: () => void;
}
// (Andy) These props are the input parameters that are passed to a component.
export interface NavigationProps { // (Andy) Props for the navigation component.
  activeTab: string;
   onTabChange: (tab: string) => void;
}

// (Andy) These callbacks let the canvas control bubble actions from one parent state.
export interface DraggableBubbleProps { // (Andy) Props for the draggable bubble component.
  bubble: Bubble;
  isSelected: boolean;
  onDelete: () => void;
  onDrag: (x: number, y: number) => void;
  // (Andy) This fires once after dragging stops, so we do not save on every mousemove.
  onDragEnd: () => void;
  onSelect: () => void;
  onAddChild: (actionType?: BubbleActionType) => void;
}

export interface InfoOverlayProps { // (Andy) Props for the info overlay component.
  onClose: () => void;
}
