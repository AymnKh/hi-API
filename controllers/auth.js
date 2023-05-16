import User from "../models/user.js";
import Http from "http-status-codes";
import Bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { capitalize } from "../helpers/helper.js";
export async function register(req, res) {
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(Http.BAD_REQUEST).json({
      //
      message: "Password and Confirm Password do not match",
    }); // if passowrd and confirm password do not match
  }
  const newUsername = capitalize(req.body.username); // capitalize username

  const userExists = await User.findOne({
    $or: [{ email: req.body.email.toLowerCase() }, { username: newUsername }],
  });
  if (userExists) {
    return res.status(Http.BAD_REQUEST).json({
      // if user already exists
      message: "User with same email or username already exists",
    });
  }

  return Bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(Http.BAD_REQUEST).json({
        // if error while hashing
        message: "Error while hashing password",
      });
    }

    const newUser = new User({
      // create new user
      username: capitalize(req.body.username),
      email: req.body.email.toLowerCase(),
      password: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    try {
      const user = await newUser.save(); // save user
      const token = Jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(Http.CREATED).json({
        // if user created successfully
        message: "User created successfully",
        user: user,
        token: token,
      });
    } catch (err) {
      return res.status(Http.INTERNAL_SERVER_ERROR).json({
        // if error while saving user
        message: "Error while saving user",
        error: err._message,
      });
    }
  });
}
