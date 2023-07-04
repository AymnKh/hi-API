import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: ["true", "Email is required"],
  },
  username: {
    type: String,
    required: ["true", "Username is required"],
  },
  password: {
    type: String,
    required: ["true", "Password is required"],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  following: [
    {
      followedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  followers: [
    {
      followerUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  notifications: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      action: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      read: {
        type: Boolean,
        default: false,
      },
      viewProfile: {
        type: Boolean,
        default: false,
      },
    },
  ],
  chatList: [
    {
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    },
  ],
  photoVersion: {
    type: String,
    default: "1687878287",
  },
  photoId: { type: String, default: "default_yaqurq.jpg" },
  photos: [
    {
      photoVersion: {
        type: String,
        default: "",
      },
      photoId: { type: String, default: "" },
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
