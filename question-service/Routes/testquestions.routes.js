const express = require("express");
const questionController = require("../Controllers/questions.controller");
const testQuestionRouter = express.Router();

testQuestionRouter.post(
  "/readQuestionDescription",
  questionController.readQuestionDescriptionController,
);
testQuestionRouter.post(
  "/readQuestions",
  questionController.readQuestionsController,
);
testQuestionRouter.post(
  "/addQuestion",
  questionController.testAddQuestionController,
);
testQuestionRouter.post(
  "/readRandomQuestion",
  questionController.readRandomQuestionController,
);
testQuestionRouter.delete(
  "/deleteQuestion",
  questionController.testDeleteQuestionController,
);
testQuestionRouter.put(
  "/updateQuestion",
  questionController.updateQuestionController,
);
testQuestionRouter.post(
  "/testUpdateQuestion",
  questionController.testUpdateQuestionController,
);

module.exports = testQuestionRouter;
