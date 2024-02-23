const express = require("express");
const versionRouter = require("./routes/index");
require("./db");

const app = express();
app.use("/api/v1", versionRouter);


