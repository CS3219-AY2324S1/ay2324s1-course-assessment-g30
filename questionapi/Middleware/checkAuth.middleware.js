const axios = require("axios");

const { QuestionModel } = require("../Models/Question");

const USER_SERVICE_BASE_URL = "http://localhost:3000/v1";

const checkAuth = async (req, res, next) => {
  const URL = USER_SERVICE_BASE_URL + "/user/role";
  const config = {
    method: "post",
    url: URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      token: req.body.token,
    }),
  };
  try {
    const res = await axios(config);
    const data = res.data;
    const userRole = data.role;
    if (userRole === "USER" || userRole === "MAINTAINER") {
      // Attach userRole to the req object
      req.userRole = userRole;
      return next();
    } else {
      throw new Error("User is not authorized to perform this action");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

const checkUpdateResourceAuth = async (req, res, next) => {
  const userRole = req.userRole;
  const uuid = req.body.uuid;
  if (userRole === "ADMIN") {
    return next();
  }

  try {
    const reqQuestionid = req.body.question_id;
    const doc = await QuestionModel.findOne({
      question_id: reqQuestionid,
    });
    if (doc == null) {
      throw new Error("Question not found" + reqQuestionid);
    } else {
      const questionUuid = doc.uuid;
      if (questionUuid === uuid) {
        return next();
      } else {
        throw new Error("User is not authorized to amend this question");
      }
    }
  } catch (error) {
    console.error("Error fetching uuid for question:", error);
    throw error;
  }
};

module.exports = {
  checkAuth,
  checkUpdateResourceAuth,
};
