const express = require('express');
const questionController = require('../Controllers/questions.controller');
const questionRouter = express.Router(); 

questionRouter.get('/readQuestionDescription',questionController.readQuestionDescriptionController);
questionRouter.get('/readQuestions',questionController.readQuestionsController);
questionRouter.get('/addQuestion',questionController.addQuestionController);
questionRouter.get('/deleteQuestion',questionController.deleteQuestionController);
questionRouter.get('/updateQuestion',questionController.updateQuestionController);

module.exports = questionRouter;