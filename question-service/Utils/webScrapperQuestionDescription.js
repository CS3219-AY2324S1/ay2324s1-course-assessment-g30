const axios = require("axios");

const webScrapperQuestionDescription = async (link) => {
  try {
    const URL =
      "https://frcq4o4z91.execute-api.ap-southeast-2.amazonaws.com/leetcode-web-scrapper";
    const APIKEY = "ePnMyK2A88152BJWsOSO38LI3T9rLVBx9vuHSrpY";
    const queryParams = {
      link: link,
    };
    const config = {
      method: "post",
      params: queryParams,
      url: URL,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": APIKEY,
      },
    };
    const res = await axios(config);
    if (res.data == "Error") {
      throw new Error(error.message);
    } else {
      return res.data;
    }
  } catch (error) {
    console.error("Error fetching question description:", error);
    throw new Error(error.message);
  }
};

module.exports = { webScrapperQuestionDescription };
