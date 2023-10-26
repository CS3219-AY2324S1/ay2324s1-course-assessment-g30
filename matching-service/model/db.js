const mongoose = require("mongoose");

const admin = "cs3219-grp30-admin";
const password = "vNOO0irf6zd7Qjie";
const cluster = "roomcluster.8cjzpah";
const database = "Rooms";

const mongoDBUrl =
  process.env.MONGODB_URI ||
  `mongodb+srv://${admin}:${password}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority`;

const connectToDB = async () => {
  mongoose.connect(mongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  db.once("open", async () => {
    console.log("MongoDB connection is open");

    // Creates the collection if it doesn't exist and sets up a TTL index of 2 hours
    // db.collection("rooms")
    //   .createIndex({ date_created: 1 }, { expireAfterSeconds: 7200 })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  });
};

module.exports = { connectToDB };
