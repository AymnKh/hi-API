import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
  members: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});
const conversation = mongoose.model("Conversation", conversationSchema);
export default conversation;
