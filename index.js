const express = require("express");
const cors = require("cors");
const versionRouter = require("./routes/index");
require("./db");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", versionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Server Working");
});
