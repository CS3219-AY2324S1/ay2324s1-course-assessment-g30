const { QuestionDescriptionModel } = require("../Models/QuestionDescription");
const { QuestionModel } = require("../Models/Question");

const {
  webScrapperQuestionDescription,
} = require("../Utils/webScrapperQuestionDescription.js");

const readQuestionDescriptionController = async (req, res, next) => {
  // Arguments: question_id (int)
  const reqQuestionid = req.body.question_id;
  try {
    const doc = await QuestionDescriptionModel.findOne({
      question_id: reqQuestionid,
    });
    if (doc == null) {
      res
        .status(404)
        .json({ error: "Question description not found" + reqQuestionid });
    } else {
      res.send(doc);
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const readQuestionsController = async (req, res, next) => {
  try {
    const documents = await QuestionModel.find({}).sort({ question_id: 1 });
    if (documents == null) {
      res.status(404).json({ error: "Questions not found" });
    } else {
      res.send(documents);
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const addQuestionController = async (req, res, next) => {
  // Arguments: title (String), category ([String]), complexity (String), link (String)
  const title = req.body.title;
  const category = req.body.category;
  const complexity = req.body.complexity;
  const link = req.body.link;
  const description = req.body.description;

  // const title = "maximal-network-rank";
  // const category = "[]";
  // const complexity = "hard";
  // const link = "https://leetcode.com/problems/maximal-network-rank/";

  try {
    let newQuestionDescription = null;
    if (description == undefined) {
      newQuestionDescription = await webScrapperQuestionDescription(link);
    }
    const documentWithHighestIndex = await QuestionModel.find()
      .sort({ question_id: -1 })
      .limit(1);
    const newIndex = documentWithHighestIndex[0].question_id + 1;
    const newQuestionDocument = new QuestionModel({
      question_id: newIndex,
      question_title: title,
      question_categories: category,
      question_complexity: complexity,
      question_link: link,
    });
    const newQuestionDescriptionDocument = new QuestionDescriptionModel({
      question_id: newIndex,
      question_description: newQuestionDescription,
      description: description,
    });
    await newQuestionDocument.save();
    await newQuestionDescriptionDocument.save();
    res.status(200).json({ message: "Question added successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const updateQuestionController = async (req, res, next) => {
  try {
    const question_id = req.body.question_id;
    const original_document = await QuestionModel.findOne({
      question_id: question_id,
    });
    const original_title = original_document.question_title;
    const original_category = original_document.question_categories;
    const original_complexity = original_document.question_complexity;
    const original_link = original_document.question_link;

    const new_title =
      req.body.title !== undefined ? req.body.title : original_title;
    const new_category =
      req.body.category !== undefined ? req.body.category : original_category;
    const new_complexity =
      req.body.complexity !== undefined
        ? req.body.complexity
        : original_complexity;
    const new_link =
      req.body.link !== undefined ? req.body.link : original_link;
    console.log(req.body.description);
    const new_description =
      req.body.description !== undefined ? req.body.description : null;

    let newQuestionDescription = null;
    if ((new_description == null) & (new_link != null)) {
      newQuestionDescription = await webScrapperQuestionDescription(new_link);
    }
    await QuestionModel.updateOne(
      { question_id: question_id },
      {
        question_title: new_title,
        question_categories: new_category,
        question_complexity: new_complexity,
        question_link: new_link,
      },
    );
    if (new_description != null || newQuestionDescription != null) {
      await QuestionDescriptionModel.updateOne(
        { question_id: question_id },
        {
          question_description: newQuestionDescription,
          description: new_description,
        },
      );
    }

    res.status(200).json({ message: "Question updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const deleteQuestionController = async (req, res, next) => {
  const question_id = req.body.question_id;
  try {
    await QuestionModel.deleteOne({ question_id: question_id });
    await QuestionDescriptionModel.deleteOne({ question_id: question_id });
    // The query to find documents with question id greater than question_id
    const query = { question_id: { $gt: question_id } };
    const decrement = { $inc: { question_id: -1 } };
    await QuestionModel.updateMany(query, decrement);
    await QuestionDescriptionModel.updateMany(query, decrement);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: err });
  }
};

module.exports = {
  readQuestionDescriptionController,
  readQuestionsController,
  addQuestionController,
  deleteQuestionController,
  updateQuestionController,
};
