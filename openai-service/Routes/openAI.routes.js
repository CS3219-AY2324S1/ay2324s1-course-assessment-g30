const express = require("express");

const OpenAIController = require('../Controllers/openAI.controller');

const openAIRouter = express.Router();

openAIRouter.post("/classifyQuery", OpenAIController.classifyQueryController);

openAIRouter.post("/explainQuestion", OpenAIController.explainQuestionController);

openAIRouter.post("/suggestOptimalAns", OpenAIController.suggestOptimalAnsController);

openAIRouter.post("/debugUserCode", OpenAIController.debugUserCodeController);

openAIRouter.post("/generatePseudocode", OpenAIController.generatePseudocodeController);

openAIRouter.post("/generateResponse", OpenAIController.generateResponseController);


module.exports = openAIRouter;

