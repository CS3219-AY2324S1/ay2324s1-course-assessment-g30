const express = require("express");
const cors = require("cors");
const { createDB } = require("./Config/db.js");
const questionRouter = require("./Routes/questions.routes.js");

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.use("/api", questionRouter);

app.get("/", (req, res) => {
  res.send("You are on the question api service!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  createDB();
});
