import mongoose from "mongoose";

const admin = "cs3219-grp30-admin";
const password = "vNOO0irf6zd7Qjie";
const cluster = "roomcluster.8cjzpah";
const database = "Rooms";

const mongoDBUrl = `mongodb+srv://${admin}:${password}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority`;

export const createDB = () => {
  mongoose.connect(mongoDBUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  db.once("open", () => {
    console.log("MongoDB connection is open");
  });
};
