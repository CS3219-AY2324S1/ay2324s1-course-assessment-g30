const mongoose = require("mongoose");

const questionDescriptionSchema = new mongoose.Schema({
  question_id: {
    type: Number,
    required: true,
  },
  // webscrapped leetcode question description
  question_description: {
    type: String,
  },
  // user’s inputted question description
  description: {
    type: String,
  },
});

const QuestionDescriptionModel = mongoose.model(
  "QuestionDescriptionModel",
  questionDescriptionSchema,
  "Table2",
);

module.exports = { QuestionDescriptionModel };
