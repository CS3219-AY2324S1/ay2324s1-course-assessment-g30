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
    const userRole = data.res.role;
    console.log("userRole", userRole);
    if (userRole == "USER" || userRole == "MAINTAINER") {
      // Attach userRole to the req object
      req.userRole = userRole;
      return next();
    } else {
      res.status(401).json({ error: err });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: err });
  }
};

const checkUpdateResourceAuth = async (req, res, next) => {
  const userRole = req.userRole;
  console.log("tempRole", userRole);
  const uuid = req.body.uuid;
  if (userRole == "MAINTAINER") {
    return next();
  }

  try {
    const reqQuestionid = req.body.question_id;
    const doc = await QuestionModel.findOne({
      question_id: reqQuestionid,
    });
    if (doc == null) {
      res.status(404).json({ error: err });
      console.log("Question not found" + reqQuestionid);
    } else {
      const questionUuid = doc.uuid;
      if (questionUuid === uuid) {
        return next();
      } else {
        res.status(401).json({ error: err });
        console.log("User is not authorized to amend this question");
      }
    }
  } catch (error) {
    res.status(500).json({ error: err });
    console.error("Error fetching uuid for question:", error);
  }
};

module.exports = {
  checkAuth,
  checkUpdateResourceAuth,
};
