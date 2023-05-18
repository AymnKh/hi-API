import Post from "../models/post.js";
import Http from "http-status-codes";
export function addPost(req, res) { // addPost function
  const newPost = new Post({ // create a new post object
    post: req.body.post, // get the post from the request body
    userId: req.user.userId, // get the userId from the request user object
    username: req.user.username, // get the username from the request user object
  });
  Post.create(newPost)
    .then((post) => { // save the post
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
