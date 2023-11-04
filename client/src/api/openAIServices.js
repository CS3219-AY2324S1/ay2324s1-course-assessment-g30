import axios from "axios";

const BASE_URL = process.env.REACT_APP_OPENAI_SERVICE_URL;

export const classifyQuery = async (query) => {
    const url = BASE_URL + "/classifyQuery/";
    try {
      const config = {
        method: "post",
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          query: query,
        }),
      };
      const res = await axios(config);
      const data = res.data;
      return data;
    } catch (error) {
      console.error("Error: please ensure that openai backend is connected");
    }
};

export const explainQuestion = async (question) => {
    const url = BASE_URL + "/explainQuestion/";
    try {
        const config = {
          method: "post",
          url: url,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            question: question,
          }),
        };
        const res = await axios(config);
        const data = res.data;
        return data;
      } catch (error) {
        console.error("Error: please ensure that openai backend is connected");
      }
}

export const suggestOptimalAns = async (question) => {
    const url = BASE_URL + "/suggestOptimalAns/";
    try {
        const config = {
          method: "post",
          url: url,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            question: question,
          }),
        };
        const res = await axios(config);
        const data = res.data;
        return data;
      } catch (error) {
        console.error("Error: please ensure that openai backend is connected");
      }
}

export const debugUserCode = async (language, question, userCode) => {
    const url = BASE_URL + "/debugUserCode/";
    try {
        const config = {
          method: "post",
          url: url,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            language: language,
            question: question,
            userCode: userCode,
          }),
        };
        const res = await axios(config);
        const data = res.data;
        return data;
      } catch (error) {
        console.error("Error: please ensure that openai backend is connected");
      }
}

export const generatePseudocode = async (language, question) => {
    const url = BASE_URL + "/generatePseudocode/";
    try {
        const config = {
          method: "post",
          url: url,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            language: language,
            question: question,
          }),
        };
        const res = await axios(config);
        const data = res.data;
        return data;
      } catch (error) {
        console.error("Error: please ensure that openai backend is connected");
      }
}

export const generateResponse = async (language, question, userCode, pastMessages) => {
    const url = BASE_URL + "/generateResponse/";
    try {
        const config = {
          method: "post",
          url: url,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            language: language,
            question: question,
            userCode: userCode,
            pastMessages: pastMessages,
          }),
        };
        const res = await axios(config);
        const data = res.data;
        return data;
      } catch (error) {
        console.error("Error: please ensure that openai backend is connected");
      }

}

export const callOpenAI = async (query,language, question, userCode, pastMessages) => {
    // explaining a question (1), suggesting optimal answers (2), debugging user code (3), generating pseudocode (4), or any (5) 
    const type = await classifyQuery(query);
    if (type === 1) {
        return await explainQuestion(question);
    } else if (type === 2) {
        return await suggestOptimalAns(question);
    } else if (type === 3) {
        return await debugUserCode(language, question, userCode);
    } else if (type === 4) {
        return await generatePseudocode(language, question);
    } else {
        return await generateResponse(language, question, userCode, pastMessages);
    }
}
