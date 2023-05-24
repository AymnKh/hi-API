import User from "../models/user.js";
import Http from "http-status-codes";
export function followUser(req, res) {
  const followingUserId = req.body.followId; // get the followed user Id from the request
  User.updateOne(
    {
      _id: followingUserId,
      "followers.followerUser": { $ne: req.user._id }, // check if the logged in user Id is not in the followers array
    }, // find the user by Id
    {
      $push: {
        // add the logged in user Id to the followers array
        followers: {
          followerUser: req.user._id, // add the logged in user Id to the followers array
        },
      },
    }
  ) // find the user by Id
    .then(async (user) => {
      // add the followed user Id to the following array
      if (!user)
        return res.status(Http.NOT_FOUND).json({ message: "No user found" }); // return error message
      await User.updateOne(
        {
          _id: req.user._id,
          "following.followedUser": { $ne: followingUserId }, // check if the followed user Id is not in the following array
        },
        {
          $push: {
            following: {
              followedUser: followingUserId,
            },
          },
        }
      );
      res.status(Http.OK).json({ message: "User followed successfully" }); // return success message
    })
    .catch((err) => {
      res.status(Http.INTERNAL_SERVER_ERROR).json({ message: err.message }); // return error message
    });
}
export function unfollowUser(req, res) {
  const followingUserId = req.body.followId; // get the followed user Id from the request
  User.updateOne(
    {
      _id: followingUserId,
      "followers.followerUser": req.user._id, // check if the logged in user Id is in the followers array
    }, // find the user by Id
    {
      $pull: {
        // remove the logged in user Id from the followers array
        followers: {
          followerUser: req.user._id, // remove the logged in user Id from the followers array
        }
      },
    }
  )
    .then(async (user) => {
      // remove the followed user Id from the following array
      if (!user)
        return res.status(Http.NOT_FOUND).json({ message: "No user found" }); // return error message
      await User.updateOne(
        {
          _id: req.user._id,
          "following.followedUser": followingUserId, // check if the followed user Id is in the following array
        },
        {
          $pull: {
            following: {
              followedUser: followingUserId,
            },
          },
        }
      );
      res.status(Http.OK).json({ message: "User unfollowed successfully" }); // return success message
    }
  )
    .catch((err) => {
      res.status(Http.INTERNAL_SERVER_ERROR).json({ message: err.message }); // return error message
    }
  );
}
