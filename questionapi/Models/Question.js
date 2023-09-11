const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question_id: Number,
  question_title: String,
  question_categories: [String],
  question_complexity: String,
  question_link: String,
});

const QuestionModel = mongoose.model("QuestionModel", questionSchema, "Table1");
module.exports = { QuestionModel };
