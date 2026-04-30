// src/lib/api.ts
// (Andy) 4/30/26 this file will handle all API requests to the backend
import { auth } from "@/lib/firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) { // If the API base URL is not defined, throw an error
  throw new Error("Missing VITE_API_BASE_URL in .env.local");
}

type ApiOptions = RequestInit;

export async function apiFetch<T>( // A generic function for making API requests
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User must be logged in to make this request.");
  }

  // andy: Firebase gives us the token that proves which user is logged in.
  const token = await currentUser.getIdToken();

  const headers = new Headers(options.headers); // Create a new Headers object with the options headers 

  headers.set("Authorization", `Bearer ${token}`);

  if (options.body && !(options.body instanceof FormData)) { // If the request body is not a FormData instance, set the content type to JSON
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { // Make the API request
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type"); // Get the content type of the response
  const isJson = contentType?.includes("application/json"); // Check if the response is JSON

  const data = isJson ? await response.json() : null; // Parse the response as JSON if it is JSON

  if (!response.ok) { // If the response is not ok, throw an error
    const message =
      data?.error || data?.message || `Request failed with ${response.status}`;

    throw new Error(message);
  }

  return data as T; // Return the parsed data as the expected type
}