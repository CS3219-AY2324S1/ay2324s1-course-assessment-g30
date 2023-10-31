const express = require("express");

const OpenAIController = require('../Controllers/openAI.controller');

const openAIRouter = express.Router();

openAIRouter.post("/explainQuestion", OpenAIController.explainQuestionController);

openAIRouter.post("/suggestOptimalAns", OpenAIController.suggestOptimalAnsController);

openAIRouter.post("/debugUserCode", OpenAIController.debugUserCodeController);

openAIRouter.post("/generatePseudocode", OpenAIController.generatePseudocodeController);


module.exports = openAIRouter;

