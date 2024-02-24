const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware");
const userRouter = express.Router();

// user signup
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

//user signin
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

// retrieve all users
userRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
});

// retrieve a user
userRouter.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(411).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
});

// update a user
userRouter.put("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, firstName, lastName, githubLink } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { username, firstName, lastName, githubLink },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    await user.save();
    res.json({
      message: "Updated user successfully",
      user: user,
    });
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
});

// delete a user
userRouter.delete("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json({
      message: "Deleted user successfully",
      user: user,
    });
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
});

// update user points
userRouter.post("/points/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.points += 1;
    const saveUser = await user.save();
    if (saveUser) {
      res.json({
        message: "Updated points successfully",
      });
    } else {
      res.status(400).json({
        message: "Failed to update the points",
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
});

// retrieve user points by order (ascending/descending)
userRouter.get("/points", authMiddleware, async (req, res) => {
  try {
    const { order } = req.query;
    if (order == "descending") {
      const users = await User.find({}).sort({ points: -1 });
      res.json({
        message: "Sorted users by descending order based on points",
        users: users,
      });
    } else {
      const users = await User.find({}).sort({ points: 1 });
      res.json({
        message: "Sorted users by ascending order based on points",
        users: users,
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
});

module.exports = userRouter;
