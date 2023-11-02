const openApi = require('openai');

const openai = new openApi.OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const OPENAI_API_MODEL = 'gpt-3.5-turbo-instruct'; 
const OPENAI_UPGRADED_API_MODEL = "gpt-4"
const OPENAI_API_TEMPERATURE = 0.6;
const OPENAI_API_MAX_TOKENS = 1000;
const generatePrompt = require("../Utils/promptGeneration");

const classifyQueryController = async (req, res) => {
    const query = req.body.query;
    const prompt = generatePrompt.classifyQueryPrompt(query);
    try {
        const response = await openai.completions.create({
            model: OPENAI_API_MODEL,
            prompt: prompt,
            temperature: OPENAI_API_TEMPERATURE,
            max_tokens: OPENAI_API_MAX_TOKENS
        });
        res.send(response.choices[0].text);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const explainQuestionController = async (req, res) => {
    const question = req.body.question;
    const prompt = generatePrompt.explainQuestionPrompt(question);
    console.log(prompt);
    try {
        const response = await openai.completions.create({
            model: OPENAI_API_MODEL,
            prompt: prompt,
            temperature: OPENAI_API_TEMPERATURE,
            max_tokens: OPENAI_API_MAX_TOKENS
        });
        res.send(response.choices[0].text);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const suggestOptimalAnsController = async (req, res) => {
    const question = req.body.question;
    const prompt = generatePrompt.suggestOptimalAnsPrompt(question);
    console.log(prompt);
    try {
        const response = await openai.completions.create({
            model: OPENAI_API_MODEL,
            prompt: prompt,
            temperature: OPENAI_API_TEMPERATURE,
            max_tokens: OPENAI_API_MAX_TOKENS
        });
        res.send(response.choices[0].text);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const debugUserCodeController = async (req, res) => {
    const language = req.body.language;
    const question = req.body.question; 
    const userCode = req.body.userCode;
    const prompt = generatePrompt.debugUserCodePrompt(language, question, userCode);
    console.log(prompt);
    try {
        const response = await openai.completions.create({
            model: OPENAI_API_MODEL,
            prompt: prompt,
            temperature: OPENAI_API_TEMPERATURE,
            max_tokens: OPENAI_API_MAX_TOKENS
        });
        res.send(response.choices[0].text);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const generatePseudocodeController = async (req, res) => {
    const language = req.body.language;
    const question = req.body.question;
    const prompt = generatePrompt.generatePseudocodePrompt(question, language);
    console.log(prompt);
    try {
        const response = await openai.completions.create({
            model: OPENAI_API_MODEL,
            prompt: prompt,
            temperature: OPENAI_API_TEMPERATURE,
            max_tokens: OPENAI_API_MAX_TOKENS
        });
        res.send(response.choices[0].text);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const generateResponseController = async (req, res) => {
    const language = req.body.language;
    const question = req.body.question; 
    const userCode = req.body.userCode;
    const pastMessages = req.body.pastMessages;
    const prompt = generatePrompt.generateResponsePrompt(language, question, userCode, pastMessages);
    console.log(prompt);
    try {
        const response = await openai.completions.create({
            model: OPENAI_API_MODEL,
            prompt: prompt,
            temperature: OPENAI_API_TEMPERATURE,
            max_tokens: OPENAI_API_MAX_TOKENS
        });
        res.send(response.choices[0].text);
    } catch (error) {
        res.status(500).json({error: error.message});
    }


}

module.exports = {explainQuestionController, suggestOptimalAnsController, generatePseudocodeController, debugUserCodeController, classifyQueryController, generateResponseController};