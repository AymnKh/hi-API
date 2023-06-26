import User from "../models/user.js";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";
import Http from "http-status-codes";
export async function sendMessage(req, res) {
  const senderId = req.user._id;
  const receiverId = req.body.receiverId;
  const findConversation = await Conversation.find({
    $or: [
      {
        members: {
          $elemMatch: {
            senderId: senderId,
            receiverId: receiverId,
          },
        },
      },
      {
        members: {
          $elemMatch: {
            senderId: receiverId,
            receiverId: senderId,
          },
        },
      },
    ],
  });
  if (findConversation.length >= 1) {
    await Message.updateOne(
      {
        conversationId: findConversation[0]._id,
      },
      {
        $push: {
          messages: {
            senderId: req.user._id,
            receiverId: req.body.receiverId,
            senderName: req.user.username,
            receiverName: req.body.receiverName,
            body: req.body.message,
          },
        },
      }
    )
      .then(() =>
        res.status(Http.OK).json({ message: "Message sent successfully" })
      )
      .catch((err) =>
        res
          .status(Http.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occured" })
      );
  } else {
    const newConversation = new Conversation();
    newConversation.members.push({
      senderId: req.user._id,
      receiverId: req.body.receiverId,
    });
    const saveConversation = await newConversation.save();
    const newMessage = new Message();
    newMessage.conversationId = saveConversation._id;
    newMessage.sender = req.user.username;
    newMessage.receiver = req.body.receiverName;
    newMessage.messages.push({
      senderId: req.user._id,
      receiverId: req.params.receiverId,
      senderName: req.user.username,
      receiverName: req.body.receiverName,
      body: req.body.message,
    });

    await User.updateOne(
      {
        _id: req.user._id,
      },
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.body.receiverId,
                messageId: newMessage._id,
              },
            ],
            $position: 0,
          },
        },
      }
    );

    await User.updateOne(
      {
        _id: req.body.receiverId,
      },
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.user._id,
                messageId: newMessage._id,
              },
            ],
            $position: 0,
          },
        },
      }
    );
    await newMessage
      .save()
      .then(() => {
        res.status(Http.OK).json({ message: "Message sent" });
      })
      .catch((err) =>
        res
          .status(Http.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occured" })
      );
  }
}

export async function getAllMessages(req, res) {
  const senderId = req.params.senderId;
  const receiverId = req.params.receiverId;
  const conversation = await Conversation.findOne({
    $or: [
      {
        $and: [
          { "members.senderId": senderId },
          { "members.receiverId": receiverId },
        ],
      },
      {
        $and: [
          { "members.receiverId": senderId },
          { "members.senderId": receiverId },
        ],
      },
    ],
  }).select("_id");
  if (conversation) {
    const message = await Message.findOne({
      conversationId: conversation._id,
    });
    return res.status(Http.OK).json(message);
  }
}

export async function markAllAsRead(req, res) {
  const senderId = req.params.senderId;
  const receiverId = req.params.receiverId;
  const conversation = await Conversation.findOne({
    $or: [
      {
        $and: [
          { "members.senderId": senderId },
          { "members.receiverId": receiverId },
        ],
      },
      {
        $and: [
          { "members.receiverId": senderId },
          { "members.senderId": receiverId },
        ],
      },
    ],
  }).select("_id");
  if (conversation) {
    const message = await Message.findOne({
      conversationId: conversation._id,
    });

    try {
      message.messages.forEach(async (element) => {
        await Message.updateOne(
          {
            "messages._id": element._id,
          },
          { $set: { "messages.$.isRead": true } } //  $ first index match the query condition
        );
      });
      return res.status(Http.OK).json({ message: "Messages marked as read" });
    } catch (err) {
      return res
        .status(Http.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  }
}
