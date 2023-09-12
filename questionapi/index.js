const express = require("express");
const { createDB } = require("./Config/db.js");
const questionRouter = require("./Routes/questions.routes.js");

const app = express();
const port = 3001;

app.use(express.json());

app.use("/api", questionRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  createDB();
});
