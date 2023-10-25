const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  room_id: {
    type: String,
    required: true,
    unique: true,
  },
  question_id: {
    type: Number,
    required: true,
  },
  question_difficulty: {
    type: String,
  },
  programming_language: {
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

module.exports = Room;
