import Post from "../models/post.js";
import Http from "http-status-codes";
import User from "../models/user.js";
export function addPost(req, res) {
  // addPost function
  const newPost = new Post({
    // create a new post object
    post: req.body.post, // get the post from the request body
    userId: req.user.userId, // get the userId from the request user object
    username: req.user.username, // get the username from the request user object
  });
  Post.create(newPost)
    .then(async (post) => {
      // save the post
      const userUpdated = await User.updateOne(
        {
          _id: req.user._id, // get the userId from the request user object
        },
        {
          $push: {
            posts: post._id, // push the post id to the user posts array
          },
        }
      ); // update the user
      if (!userUpdated) {
        // if the user update fails
        return res.status(Http.INTERNAL_SERVER_ERROR).json({
          message: "Error while updating user", // return an error message
        });
      }
      return res.status(Http.CREATED).json({
        message: "Post created successfully", // return a success message
        post: post,
      });
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: "Error while creating post", // return an error message
        error: err._message,
      });
    });
}
export function getPosts(req, res) {
  Post.find({}) // get all posts
    .populate("userId") // populate the userId field with the username
    .sort({ createdAt: -1 }) // sort the posts by createdAt descending
    .then((posts) => {
      return res.status(Http.OK).json(posts);
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: "Error while fetching posts", // return an error message
        error: err._message,
      });
    });
} // getPosts function
