const express = require("express");
const questionController = require("../Controllers/questions.controller");
const {
  checkAuth,
  checkUpdateResourceAuth,
} = require("../Middleware/checkAuth.middleware.js");
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
  questionController.addQuestionController,
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

module.exports = questionRouter;
