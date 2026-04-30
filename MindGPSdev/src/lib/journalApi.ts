// src/lib/journalApi.ts
// (Andy) 4/30/26 This file will handle all API requests related to journal entries.

import { apiFetch } from "@/lib/api";
import type {
  JournalEntry,
  CreateJournalPayload,
  UpdateJournalPayload,
} from "@/types/journal";

const JOURNALS_API_PATH = "/api/journals";

export async function getJournals(): Promise<JournalEntry[]> { // Get all journal entries
  return apiFetch<JournalEntry[]>(JOURNALS_API_PATH, {
    method: "GET",
  });
}

export async function getJournalById(id: string): Promise<JournalEntry> { // Get a journal entry by its ID
  return apiFetch<JournalEntry>(`${JOURNALS_API_PATH}/${id}`, {
    method: "GET",
  });
}

export async function createJournal( // Create a new journal entry
  payload: CreateJournalPayload
): Promise<JournalEntry> {
  // andy: This sends a new journal entry to our Express/MongoDB backend.
  return apiFetch<JournalEntry>(JOURNALS_API_PATH, { // Send the new journal entry to the backend
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateJournal( // Update a journal entry
  id: string,
  payload: UpdateJournalPayload
): Promise<JournalEntry> {
  return apiFetch<JournalEntry>(`${JOURNALS_API_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteJournal(id: string): Promise<{ message: string }> { // Delete a journal entry
  return apiFetch<{ message: string }>(`${JOURNALS_API_PATH}/${id}`, {
    method: "DELETE",
  });
}
