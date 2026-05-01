import { apiFetch } from "@/lib/api";
import type {
  SaveWeeklyConceptMapPayload,
  WeeklyConceptMap,
} from "@/lib/conceptMapAdapters";
// (Andy) conceptMapApi.ts is the service layer for concept map related backend calls.
// (Andy) This service keeps concept map backend calls in one place.
const CONCEPT_MAPS_API_PATH = "/api/maps";

// (Andy) apiFetch adds the Firebase token, so the backend knows which user is loading.
export async function getCurrentWeeklyConceptMap(): Promise<WeeklyConceptMap> {
  return apiFetch<WeeklyConceptMap>(`${CONCEPT_MAPS_API_PATH}/current/week`, {
    method: "GET",
  });
}

// (Andy) Save the current week's nodes and edges for the signed-in user.
export async function saveCurrentWeeklyConceptMap(
  payload: SaveWeeklyConceptMapPayload
): Promise<WeeklyConceptMap> {
  return apiFetch<WeeklyConceptMap>(`${CONCEPT_MAPS_API_PATH}/current/week`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
