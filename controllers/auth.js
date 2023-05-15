import User from "../models/user.js";
import Http from "http-status-codes";
import Bcrypt from "bcryptjs";
export async function register(req, res) {
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(Http.BAD_REQUEST).json({
      //
      message: "Password and Confirm Password do not match",
    }); // if passowrd and confirm password do not match
  }

  const userExists = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });
  if (userExists) {
    return res.status(Http.BAD_REQUEST).json({
      // if user already exists
      message: "User with same email or username already exists",
    });
  }

  return Bcrypt.hashSync(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(Http.BAD_REQUEST).json({
        // if error while hashing
        message: "Error while hashing password",
      });
    }

    const newUser = new User({
      // create new user
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    const user = await newUser.save(); // save new user
    if (!user) {
      return res.status(Http.BAD_REQUEST).json({
        // if user is not saved
        message: "Error while registering user",
      });
    }
    return res.status(Http.CREATED).json({
      // if user is saved
      message: "User registered successfully",
      data: user,
    });
  });
}
