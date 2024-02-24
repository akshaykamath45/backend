const express = require("express");
const userRouter = require("./user");
const jobRouter = require("./job");
const versionRouter = express.Router();

versionRouter.use("/user", userRouter);
versionRouter.use("/job", jobRouter);

module.exports = versionRouter;
