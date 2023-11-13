const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question_id: {
    type: Number,
    required: true,
    unique: true,
  },
  question_title: {
    type: String,
    required: true,
  },
  question_categories: {
    type: [String],
    required: true,
  },
  question_complexity: {
    type: String,
  },
  question_link: {
    type: String,
  },
  uuid: {
    type: String,
    required: true,
  },
});

const QuestionModel = mongoose.model("QuestionModel", questionSchema, "Table1");
module.exports = { QuestionModel };
