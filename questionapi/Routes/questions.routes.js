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
questionRouter.delete(
  "/deleteQuestion",
  questionController.deleteQuestionController,
);
questionRouter.put(
  "/updateQuestion",
  questionController.updateQuestionController,
);

module.exports = questionRouter;
