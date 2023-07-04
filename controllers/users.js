import User from "../models/user.js";
import Http from "http-status-codes";
export function getAllUsers(req,res) {
  User.find({})
    .then((users) => {
      if (!users)
        return res.status(Http.NOT_FOUND).json({ message: "No users found" });
      return res.status(Http.OK).json(users); // return all users
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: "Error while fetching users", // return an error message
        error: err._message, // return the error
      });
    });
}
export function getUser(req, res) {
  const userId = req.params.id; // get the user Id from the request
  User.findById(userId) // find the user by Id
    .populate("following.followedUser")
    .populate("followers.followerUser")
    .populate("posts")
    .populate("chatList.receiverId")
    .populate("chatList.messageId")
    .populate("notifications.senderId")
    .then((user) => {
      if (!user)
        return res.status(Http.NOT_FOUND).json({ message: "No user found" }); // return error message
      return res.status(Http.OK).json(user); // return the user
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: "Error while fetching user", // return an error message
        error: err._message, // return the error
      });
    });  
}
