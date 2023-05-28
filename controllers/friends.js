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
        notifications: {
          senderId: req.user._id,
          action: `${req.user.username} is now following you`,
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
        },
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
    })
    .catch((err) => {
      res.status(Http.INTERNAL_SERVER_ERROR).json({ message: err.message }); // return error message
    });
}
export async function markAsReadOrDelete(req, res) {
  const notificationId = req.params.id; // get the notification Id from the request
  if (!req.body.deleteIt) {
    // check if the notification should be marked as read
    await User.updateOne(
      // find the user by Id and the notification Id
      {
        _id: req.user._id,
        "notifications._id": notificationId,
      },
      {
        $set: {
          "notifications.$.read": true, // mark the notification as read
        },
      }
    )
      .then(() => {
        res.status(Http.OK).json({ message: "Notification marked as read" }); // return success message
      })
      .catch((err) => {
        res.status(Http.INTERNAL_SERVER_ERROR).json({ message: err.message }); // return error message
      });
  } else {
    // if the notification should be deleted
    await User.updateOne(
      // find the user by Id and the notification Id
      {
        _id: req.user._id,
        "notifications._id": notificationId,
      },
      {
        $pull: {
          notifications: {
            // remove the notification from the notifications array
            _id: notificationId,
          },
        },
      }
    )
      .then(() => {
        res.status(Http.OK).json({ message: "Notification deleted" }); // return success message
      })
      .catch((err) => {
        res.status(Http.INTERNAL_SERVER_ERROR).json({ message: err.message }); // return error message
      });
  }
}
export function markAllAsRead(req, res) {
  User.updateMany(
    // find the user by Id
    {
      _id: req.user._id,
    },
    {
      $set: {
        "notifications.$[elem].read": true, // mark all notifications as read
      },
    },
    {
      arrayFilters: [{ "elem.read": false }], // filter the notifications array
      multi: true,
    }
  )
    .then(() => {
      res.status(Http.OK).json({ message: "All notifications marked as read" }); // return success message
    })
    .catch((err) => {
      res.status(Http.INTERNAL_SERVER_ERROR).json({ message: err.message }); // return error message
    });
}
