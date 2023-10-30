const express = require("express");
const questionController = require("../Controllers/questions.controller");
const {
  checkDuplicateQuestion,
} = require("../Middleware/checkDuplicateQuestion.middleware.js");

const questionRouter = express.Router();

questionRouter.post(
  "/readQuestionDescription",
  questionController.readQuestionDescriptionController,
);
questionRouter.post(
  "/readQuestions",
  questionController.readQuestionsController,
);
questionRouter.post(
  "/addQuestion",
  checkDuplicateQuestion,
  questionController.addQuestionController,
);
questionRouter.post(
  "/readRandomQuestion",
  questionController.readRandomQuestionController,
);
questionRouter.delete(
  "/deleteQuestion",
  questionController.deleteQuestionController,
);
questionRouter.put(
  "/updateQuestion",
  questionController.updateQuestionController,
);
questionRouter.post(
  "/testUpdateQuestion",
  questionController.testUpdateQuestionController,
);

module.exports = questionRouter;
