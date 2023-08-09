import Post from "../models/post.js";
import Http from "http-status-codes";
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: "des1acmba",
  api_key: "641759972817119",
  api_secret: "md1SggQFFuhj9za6Hbsue0JAkKo",
});
export function addPost(req, res) {
  // addPost function
  if (req.body.post.post && !req.body.post.photo) {
    const newPost = new Post({
      // create a new post object
      post: req.body.post.post, // get the post from the request body
      userId: req.user._id, // get the userId from the request user object
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
  if (req.body.post.post && req.body.post.photo) {
    const photo = req.body.post.photo;
    cloudinary.uploader.upload(
      photo,
      {
        transformation: {
          width: 500,
          height: 500,
        },
      },
      async (err, result) => {
        const newPost = new Post({
          // create a new post object
          post: req.body.post.post, // get the post from the request body
          userId: req.user._id, // get the userId from the request user object
          username: req.user.username, // get the username from the request user object
          photoVersion: result.version, // get photo verison
          photoId: result.public_id, //photo id
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
    );
  }
} // addPost function
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

export function likePost(req, res) {
  const postId = req.params.postId; // get the postId from the request params
  Post.updateOne(
    {
      _id: postId,
      "likes.username": {
        $ne: req.user.username, // check if the username is not in the likes array
      },
    },
    {
      $push: {
        likes: {
          username: req.user.username, // push the username to the likes array
        },
      },
      $inc: {
        totalLikes: 1, // increment the totalLikes by 1
      },
    },
    {
      new: true,
    }
  )
    .then((post) => {
      return res.status(Http.OK).json({
        message: "Post liked successfully", // return a success message
        post: post,
      });
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: "Error while liking post", // return an error message
        error: err._message,
      });
    });
} // like post function

export function addComment(req, res) {
  const postId = req.params.postId; // get the postId from the request params
  Post.updateOne(
    { _id: postId },
    {
      $push: {
        comments: {
          userId: req.user._id, // push the userId to the comments array
          username: req.user.username, // push the username to the comments array
          comment: req.body.comment, // push the comment to the comments array
        },
      },
    },
    {
      new: true,
    }
  )
    .then((post) => {
      // update the post
      return res.status(Http.OK).json({
        message: "Comment added successfully", // return a success message
        post: post,
      });
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: "Error while adding comment", // return an error message
        error: err._message,
      });
    });
} // add comment function

export function getPost(req, res) {
  const postId = req.params.postId; // get the postId from the request params
  Post.findOne({ _id: postId }) // get the post
    .populate("userId") // populate the userId field with the username
    .populate("comments.userId") // populate the comments userId field with the username
    .then((post) => {
      return res.status(Http.OK).json(post);
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: "Error while fetching post", // return an error message
        error: err._message,
      });
    });
}

export function editPost(req, res) {
  const { id, post } = req.body; // get the postId from the request and post
  console.log(id);
  Post.findByIdAndUpdate(id, { post: post }, { new: true }) // update
    .then((newPost) => {
      return res.status(Http.OK).json({
        message: "Post edited successfully", // return a success message
        updatedPost: newPost,
      });
    })
    .catch((err) => {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: "Error while editing post", // return an error message
        error: err._message,
      });
    });
}

export async function deletePost(req, res) {
  const postId = req.params.postId; // get the postId from the request params
  const deletePost = await Post.findByIdAndDelete(postId);
  if (!deletePost) {
    return res.status(Http.INTERNAL_SERVER_ERROR).json({
      message: "Error while deleting post", // return an error message
    });
  } else {
    const updateUser = await User.updateOne( 
      { _id: req.user._id },
      {
        $pull: { // pull the ppost from posts array in user
          posts: postId,
        },
      }
    );
    if (!updateUser) {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        message: "Error while deleting post", // return an error message
      });
    } else {
      return res.status(Http.OK).json({
        message: "Post deleted successfully", // return a success message
      });
    }
  }
}
