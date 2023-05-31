import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import asyncHandler from "express-async-handler";
const client = new OAuth2Client({
  clientId:
    "665128314143-79l5vkl5gnbt30tvh1bin19f00h44d52.apps.googleusercontent.com",
});

export const googleLogin = asyncHandler(async (req, res) => {
  // get token
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  const verifiedToken = await client.verifyIdToken({
    idToken: token,
    audience:
      "755428588274-5nl45or7hrlck14neughadquor3bjaph.apps.googleusercontent.com",
  });

  const { name, email, email_verified } = verifiedToken.payload;

  // check invalid token
  if (!verifiedToken) {
    res.status(403);
    throw new Error("Not authorized! token invalid");
  }

  if (!email_verified) {
    res.status(400);
    throw new Error("Email not verified");
  }

  // find user in db
  const user = await User.findOne({ email }).select("-password");
  // if user already exists
  if (user) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, successMsg: "Logged in successfully", user });
  }

  if (!user) {
    // if user doesnot exist create new user
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const data = {
      username: name,
      email,
      password: `${email}.${token}`,
    };

    const user = new User(data);
    await user.save();

    if (user) {
      res.json({ token, successMsg: "Logged in successfully", user });
    }
  }
});

export const signup = asyncHandler(async (req, res) => {
  const { username, phone, email, password } = req.body;

  if (!username || !phone || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  const emailExist = await User.findOne({ email });

  if (emailExist) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const newUser = new User({
    username,
    phone,
    email,
    password,
    role: 0, // set default role to 0
  });

  await newUser.save();

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, successMsg: "Logged in successfully", user: newUser });
});

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, {
      httpOnly: true,
    });

    res
      .status(200)
      .json({
        token,
        details: { ...newUser._doc },
        message: "User has been created.",
      });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or email!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    const { password, ...otherDetails } = user._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
    });

    const userDetails = { ...otherDetails, isAdmin: user.isAdmin };

    res
      .status(200)
      .json({ token, details: userDetails, message: "Login successful" });
  } catch (err) {
    next(err);
  }
};
