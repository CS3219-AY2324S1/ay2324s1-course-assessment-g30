const mongoose = require("mongoose");

const admin = "cs3219-grp30-admin";
const password = "QEFotfpoapHMLoUs";
const cluster = "questioncluster.1tzld4l";
const database = "Questions";

const createDB = async () => {
  await mongoose
    .connect(
      `mongodb+srv://${admin}:${password}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority`,
    )
    .then(() => {
      console.log("Database connection successful");
    })
    .catch((err) => {
      console.error("Database connection failed");
    });
};

module.exports = { createDB };
