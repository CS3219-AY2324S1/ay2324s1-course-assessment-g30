const mongoose = require('mongoose');

const questionDescriptionSchema = new mongoose.Schema({
  question_id: Number,
  question_description: String
});

const QuestionDescriptionModel = mongoose.model('QuestionDescriptionModel', questionDescriptionSchema, 'Table2');

module.exports = {QuestionDescriptionModel}