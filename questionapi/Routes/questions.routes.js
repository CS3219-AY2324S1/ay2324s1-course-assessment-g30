const express = require("express");
const questionController = require("../Controllers/questions.controller");
const questionRouter = express.Router();

questionRouter.post(
  "/readQuestionDescription",
  questionController.readQuestionDescriptionController,
);
questionRouter.get(
  "/readQuestions",
  questionController.readQuestionsController,
);
questionRouter.post("/addQuestion", questionController.addQuestionController);
questionRouter.post(
  "/deleteQuestion",
  questionController.deleteQuestionController,
);
questionRouter.post(
  "/updateQuestion",
  questionController.updateQuestionController,
);

module.exports = questionRouter;
