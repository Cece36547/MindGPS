// (andy) These are the only feelings the community backend accepts.
export type CommunityFeeling =
  | "Hopeful"
  | "Anxious"
  | "Calm"
  | "Overwhelmed"
  | "Grateful"
  | "Low"
  | "Excited"
  | "Reflective";

// (andy) This matches the post shape returned by /api/community/posts.
export type CommunityPost = {
  _id: string;
  authorDisplayName: string;
  feeling: CommunityFeeling;
  message: string;
  supportCount: number;
  isOwner: boolean;
  supportedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string;
};

// (andy) This is the payload used when creating a community post.
export type CreateCommunityPostPayload = {
  authorDisplayName?: string;
  feeling?: CommunityFeeling;
  message: string;
};

// (andy) This is the payload used when editing an owned community post.
export type UpdateCommunityPostPayload = {
  authorDisplayName?: string;
  feeling?: CommunityFeeling;
  message: string;
};
