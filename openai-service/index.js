require('dotenv').config();

const express = require('express');
const cors = require("cors");
const openAIRouter = require("./Routes/openAI.routes");
const port = 3005;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', async function (req, res) {
    res.send('You are on the openAI service');
});

app.use("/openai", openAIRouter);

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});