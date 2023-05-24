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
        }
    ],
    following: [
        {
            followedUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        }
    ],
    followers: [
        {
            followerUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        }
    ],
});

const User = mongoose.model("User", userSchema);

export default User;
