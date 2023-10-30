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
        .json({ message: "Question description not found" + reqQuestionid });
    } else {
      res.send(doc);
    }
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

const readQuestionsController = async (req, res, next) => {
  try {
    const documents = await QuestionModel.find({}).sort({ question_id: 1 });
    if (documents == null) {
      res.status(404).json({ message: "Questions not found" });
    } else {
      res.send(documents);
    }
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

const addQuestionController = async (req, res, next) => {
  // Arguments: title (String), category ([String]), complexity (String), link (String)
  const title = req.body.title;
  const category = req.body.category;
  const complexity = req.body.complexity;
  const link = req.body.link;
  let description = req.body.description;
  const uuid = req.body.uuid;
  if (description != "") {
    description = "<p>" + description + "</p>";
    description = "<div>" + description + "</div>";
  }
  // const title = "maximal-network-rank";
  // const category = "[]";
  // const complexity = "hard";
  // const link = "https://leetcode.com/problems/maximal-network-rank/";
  let newQuestionDescription = "";
  try {
    if (link !== "") {
      newQuestionDescription = await webScrapperQuestionDescription(link);
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: "URL is invalid! Please use the URL as specified." });
    return;
  }
  try {
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
      uuid: uuid,
    });
    const newQuestionDescriptionDocument = new QuestionDescriptionModel({
      question_id: newIndex,
      question_description: description == "" ? newQuestionDescription : "",
      description: description,
    });
    console.log("Before question save");
    await newQuestionDocument.save();
    console.log("Before description save");
    await newQuestionDescriptionDocument.save();
    console.log("after description save");
    res.status(200).json({ message: "Question added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.toString() });
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

    const new_title = req.body.title !== "" ? req.body.title : original_title;
    const new_category =
      req.body.category !== "" ? req.body.category : original_category;
    const new_complexity =
      req.body.complexity !== "" ? req.body.complexity : original_complexity;
    const new_link = req.body.link;
    let new_description =
      req.body.description !== "" ? req.body.description : null;
    if (new_description != null) {
      new_description = "<p>" + new_description + "</p>";
      new_description = "<div>" + new_description + "</div>";
    }
    if (new_title !== original_title) {
      const docOne = await QuestionModel.findOne({
        question_title: {
          $regex: `^${new_title}$`,
          $options: "i",
        },
      });
      if (docOne) {
        res.status(409).json({
          message: "Question title already exists",
        });
        return;
      }
    }

    if (new_link !== original_link && new_link !== "") {
      let docTwo = false;
      docTwo = await QuestionModel.findOne({
        question_link: {
          $regex: `^${new_link}$`,
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

    let newQuestionDescription = "";
    try {
      if (new_link !== "") {
        newQuestionDescription = await webScrapperQuestionDescription(new_link);
      }
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ message: "URL is invalid! Please use the URL as specified." });
      return;
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
    if (new_description == null) {
      await QuestionDescriptionModel.updateOne(
        { question_id: question_id },
        {
          question_description: newQuestionDescription,
          description: "",
        },
      );
    } else {
      await QuestionDescriptionModel.updateOne(
        { question_id: question_id },
        {
          question_description: "",
          description: new_description,
        },
      );
    }

    res.status(200).json({ message: "Question updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.toString() });
  }
};

const testUpdateQuestionController = async (req, res, next) => {
  try {
    res.status(200).json({ message: "true" });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
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
    res.status(500).json({ message: err.toString() });
  }
};

const readRandomQuestionController = async (req, res, next) => {
  const question_complexity = req.body.question_complexity;
  try {
    const documents = await QuestionModel.find({
      question_complexity: question_complexity,
    });
    console.log("Selected docuemnts", documents);
    const randomIndex = Math.floor(Math.random() * documents.length);
    const doc = documents[randomIndex];
    console.log(doc);
    res.status(200).json({
      question: doc,
      message: "Random Question selected successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

module.exports = {
  readQuestionDescriptionController,
  readQuestionsController,
  addQuestionController,
  deleteQuestionController,
  updateQuestionController,
  testUpdateQuestionController,
  readRandomQuestionController,
};
