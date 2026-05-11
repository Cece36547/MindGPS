// src/lib/communityApi.ts
// (andy) This file handles API requests related to community posts.

import { apiFetch } from "@/lib/api";
import type {
  CommunityPost,
  CreateCommunityPostPayload,
  UpdateCommunityPostPayload,
} from "@/types/community";

// (andy) Keep the full community prefix so requests hit /api/community/posts.
const COMMUNITY_API_PATH = "/api/community/posts";

// (andy) Load every community post visible to the signed-in user.
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  return apiFetch<CommunityPost[]>(COMMUNITY_API_PATH, {
    method: "GET",
  });
}

// (andy) Load only posts owned by the signed-in user when needed.
export async function getMyCommunityPosts(): Promise<CommunityPost[]> {
  return apiFetch<CommunityPost[]>(`${COMMUNITY_API_PATH}/mine`, {
    method: "GET",
  });
}

// (andy) Create a new community post through the backend.
export async function createCommunityPost(
  payload: CreateCommunityPostPayload
): Promise<CommunityPost> {
  return apiFetch<CommunityPost>(COMMUNITY_API_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// (andy) Edit an owned community post through the backend.
export async function updateCommunityPost(
  id: string,
  payload: UpdateCommunityPostPayload
): Promise<CommunityPost> {
  return apiFetch<CommunityPost>(`${COMMUNITY_API_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// (andy) Delete an owned community post through the backend.
export async function deleteCommunityPost(
  id: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`${COMMUNITY_API_PATH}/${id}`, {
    method: "DELETE",
  });
}

// (andy) Toggle support and use the returned post as the source of truth.
export async function toggleCommunityPostSupport(
  id: string
): Promise<CommunityPost> {
  return apiFetch<CommunityPost>(`${COMMUNITY_API_PATH}/${id}/support`, {
    method: "PATCH",
  });
}
