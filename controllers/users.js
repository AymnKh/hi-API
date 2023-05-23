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
