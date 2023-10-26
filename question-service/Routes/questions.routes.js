const express = require("express");
const questionController = require("../Controllers/questions.controller");
const {
  checkAuth,
  checkUpdateResourceAuth,
} = require("../Middleware/checkAuth.middleware.js");
const {
  checkDuplicateQuestion,
} = require("../Middleware/checkDuplicateQuestion.middleware.js");

const questionRouter = express.Router();

questionRouter.post(
  "/readQuestionDescription",
  checkAuth,
  questionController.readQuestionDescriptionController,
);
questionRouter.post(
  "/readQuestions",
  checkAuth,
  questionController.readQuestionsController,
);
questionRouter.post(
  "/addQuestion",
  checkAuth,
  checkDuplicateQuestion,
  questionController.addQuestionController,
);
questionRouter.post(
  "/readRandomQuestion",
  checkAuth,
  questionController.readRandomQuestionController,
);
questionRouter.delete(
  "/deleteQuestion",
  checkAuth,
  checkUpdateResourceAuth,
  questionController.deleteQuestionController,
);
questionRouter.put(
  "/updateQuestion",
  checkAuth,
  checkUpdateResourceAuth,
  questionController.updateQuestionController,
);
questionRouter.post(
  "/testUpdateQuestion",
  checkAuth,
  checkUpdateResourceAuth,
  questionController.testUpdateQuestionController,
);

module.exports = questionRouter;
