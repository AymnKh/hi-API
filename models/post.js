import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      default: "",
    },
    post: {
      type: String,
      default: "",
    },
    photoVersion: {
      type: String,
      default: "",
    },
    photoId: { type: String, default: "" },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        username: {
          type: String,
          default: "",
        },
        comment: {
          type: String,
          default: "",
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    totalLikes: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        username: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
