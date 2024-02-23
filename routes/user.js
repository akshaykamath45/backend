const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../config");
const userRouter = express.Router();

const signupBody = zod.object({
  username: zod.string().min(3).max(30),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(5),
  points: zod.number().optional(),
  githubLink: zod.string(),
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { success, data, error } = signupBody.safeParse(req.body);
    if (!success) {
      res.status(411).json({
        message: "Invalid Inputs",
        error: error.errors[0].message,
      });
    }
    const existingUser = await User.findOne({
      username: data.username,
    });
    if (existingUser) {
      res.status(411).json({
        message: "Username already exists,please choose another username",
      });
    }
    const user = new User({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      points: data.points,
      githubLink: data.githubLink,
    });
    const hashedPassword = await user.createHash(data.password);
    user.password = hashedPassword;
    const savedUser = await user.save();
    const userId = savedUser._id;
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );
    res.json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message || "Internal Server Error",
    });
  }
});

const signinBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});
userRouter.post("/signin", async (req, res) => {
  try {
    const { success, data } = signinBody.safeParse(req.body);
    if (!success) {
      res
        .status(411)
        .json({ message: "Incorrect Inputs", error: error.errors[0].message });
    }
    const existingUser = await User.findOne({
      username: data.username,
    });
    if (!existingUser) {
      res.status(411).json({ message: "User not found,please signup first" });
    } else {
      const validUser = await existingUser.validatePassword(data.password);
      if (validUser) {
        const token = jwt.sign(
          {
            userId: validUser._id,
          },
          JWT_SECRET
        );
        res.json({
          message: "User logged in",
          token: token,
        });
      } else {
        res.status(411).json({
          message: "Incorrect password,please try again",
        });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message || "Internal Server Error" });
  }
});
module.exports = userRouter;
