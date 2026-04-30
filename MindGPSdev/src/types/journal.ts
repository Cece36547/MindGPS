
export type JournalEntry = { // Represents a journal entry
  _id: string;
  user: string;
  mapId: string | null;
  title: string;
  content: string;
  feelings: string[];
  influences: string[];
  createdAt: string;
  updatedAt: string;
};
 // journal.ts is needed because our front end is written in typescript
 // so journal.ts is the TypeScript definition file for journal entries from the backend
 // this basically tells the frontend what the structure of a journal entry should be
export type CreateJournalPayload = { // The payload for creating a new journal entry
  title?: string;
  content: string;
  feelings: string[];
  influences: string[];
  mapId?: string | null;
};

export type UpdateJournalPayload = { // The payload for updating an existing journal entry
  title?: string;
  content?: string;
  feelings?: string[];
  influences?: string[];
  mapId?: string | null;
};