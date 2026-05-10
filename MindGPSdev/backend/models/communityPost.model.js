import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    authorDisplayName: {
      type: String,
      default: "You",
    },

    feeling: {
      type: String,
      enum: [
        "Hopeful",
        "Anxious",
        "Calm",
        "Overwhelmed",
        "Grateful",
        "Low",
        "Excited",
        "Reflective",
      ],
      default: "Reflective",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    supportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const CommunityPost = mongoose.model(
  "CommunityPost",
  communityPostSchema
);

export default CommunityPost;