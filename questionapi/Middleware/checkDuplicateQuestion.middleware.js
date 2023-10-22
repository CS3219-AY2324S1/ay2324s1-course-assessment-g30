const { QuestionModel } = require("../Models/Question");

const checkDuplicateQuestion = async (req, res, next) => {
  const reqQuestionTitle = req.body.title;
  const reqQuestionLink = req.body.link;

  try {
    let docOne = false;
    docOne = await QuestionModel.findOne({
      question_title: {
        $regex: `^${reqQuestionTitle}$`,
        $options: "i",
      },
    });

    if (docOne) {
      res.status(409).json({
        message: "Question title already exists",
      });
      return;
    }

    if (reqQuestionLink !== "") {
      let docTwo = false;
      docTwo = await QuestionModel.findOne({
        question_link: {
          $regex: `^${reqQuestionLink}$`,
          $options: "i",
        },
      });
      if (docTwo) {
        res.status(409).json({
          message: "Question link already exists",
        });
        return;
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkDuplicateQuestion,
};
