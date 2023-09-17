import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  room_id: {
    type: String,
    required: true,
    unique: true,
  },
  question_id: {
    type: Number,
  },
  question_difficulty: {
    type: String,
    required: true,
  },
  users: [
    {
      type: String,
    },
  ],
  date_created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
