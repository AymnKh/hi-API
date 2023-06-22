import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  sender: {
    type: String,
  },
  receiver: {
    type: String,
  },
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      senderName: {
        type: String,
      },
      receiverName: {
        type: String,
      },
      body: {
        type: String,
      },
      isRead: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const message = mongoose.model("Message", messageSchema);
export default message;
