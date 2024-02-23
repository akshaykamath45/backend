const express = require("express");
const userRouter = require("./user");

const versionRouter = express.Router();

versionRouter.use("/user", userRouter);

module.exports = versionRouter;
