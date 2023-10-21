const { QuestionModel } = require("../Models/Question");

const checkDuplicateQuestion = async (req, res, next) => {
  const reqQuestionTitle = req.body.title;
  const reqQuestionLink = req.body.link;

  try {
    let docOne = false;
    if (reqQuestionLink != "") {
      docOne = await QuestionModel.findOne({
        question_title: reqQuestionTitle,
      });
    }
    let docTwo = false;
    if (reqQuestionLink != "") {
      docTwo = await QuestionModel.findOne({ question_link: reqQuestionLink });
    }
    if (docOne || docTwo) {
      res
        .status(409)
        .json({
          message:
            "Question title, link or question description already exists",
        });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkDuplicateQuestion,
};
