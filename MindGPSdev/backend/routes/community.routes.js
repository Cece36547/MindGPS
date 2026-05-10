import express from "express";
import CommunityPost from "../models/communityPost.model.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

function formatPost(post, currentUserId) {
  const userId = currentUserId.toString();

  return {
    _id: post._id,
    authorDisplayName: post.authorDisplayName,
    feeling: post.feeling,
    message: post.message,
    supportCount: post.supportedBy.length,
    isOwner: post.user.toString() === userId,
    supportedByCurrentUser: post.supportedBy.some(
      (id) => id.toString() === userId
    ),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

router.get("/posts", verifyToken, async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({
      createdAt: -1,
    });

    res.json(
      posts.map((post) =>
        formatPost(post, req.user.id)
      )
    );
  } catch (error) {
    res.status(500).json({
      error: "Failed to get community posts",
    });
  }
});

router.get("/posts/mine", verifyToken, async (req, res) => {
  try {
    const posts = await CommunityPost.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(
      posts.map((post) =>
        formatPost(post, req.user.id)
      )
    );
  } catch (error) {
    res.status(500).json({
      error: "Failed to get your posts",
    });
  }
});

router.post("/posts", verifyToken, async (req, res) => {
  try {
    const {
      authorDisplayName,
      feeling,
      message,
    } = req.body;

    const post = await CommunityPost.create({
      user: req.user.id,
      authorDisplayName:
        authorDisplayName || "You",
      feeling: feeling || "Reflective",
      message,
    });

    res
      .status(201)
      .json(formatPost(post, req.user.id));
  } catch (error) {
    res.status(400).json({
      error: "Failed to create community post",
    });
  }
});

router.put("/posts/:id", verifyToken, async (req, res) => {
  try {
    const {
      authorDisplayName,
      feeling,
      message,
    } = req.body;

    const post = await CommunityPost.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (
      post.user.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        error:
          "You can only edit your own post",
      });
    }

    post.authorDisplayName =
      authorDisplayName ||
      post.authorDisplayName;

    post.feeling =
      feeling || post.feeling;

    post.message =
      message || post.message;

    await post.save();

    res.json(formatPost(post, req.user.id));
  } catch (error) {
    res.status(400).json({
      error: "Failed to update community post",
    });
  }
});

router.delete("/posts/:id", verifyToken, async (req, res) => {
  try {
    const post = await CommunityPost.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (
      post.user.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        error:
          "You can only delete your own post",
      });
    }

    await post.deleteOne();

    res.json({
      message:
        "Post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to delete community post",
    });
  }
});

router.patch(
  "/posts/:id/support",
  verifyToken,
  async (req, res) => {
    try {
      const post =
        await CommunityPost.findById(
          req.params.id
        );

      if (!post) {
        return res.status(404).json({
          error: "Post not found",
        });
      }

      const userId =
        req.user.id.toString();

      const alreadySupported =
        post.supportedBy.some(
          (id) =>
            id.toString() === userId
        );

      if (alreadySupported) {
        post.supportedBy =
          post.supportedBy.filter(
            (id) =>
              id.toString() !== userId
          );
      } else {
        post.supportedBy.push(
          req.user.id
        );
      }

      await post.save();

      res.json(
        formatPost(post, req.user.id)
      );
    } catch (error) {
      res.status(400).json({
        error: "Failed to support post",
      });
    }
  }
);

export default router;