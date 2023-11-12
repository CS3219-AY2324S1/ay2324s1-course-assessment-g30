const request = require("supertest");
const { initializeApp } = require("../index.js");

const TEST_PORT = 4001;
let question_app;
beforeAll(async () => {
  question_app = await initializeApp(TEST_PORT);
});

describe("Test the root path of question-service", () => {
  test("It should respond to the GET method", async () => {
    const response = await request(question_app).get("/");
    expect(response.statusCode).toBe(200);
    const responseBody = response.text;
    expect(responseBody).toBe("You are on the question api service!");
  });
});

describe("Test readQuestions", () => {
  test("It should respond to the POST method", async () => {
    const response = await request(question_app).post("/test/readQuestions");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test readQuestionDescription", () => {
  test("It should respond to the POST method", async () => {
    const response = await request(question_app)
      .post("/test/readQuestionDescription")
      .send({
        question_id: 1,
      });
    expect(response.statusCode).toBe(200);
  });
});

describe("Test addQuestion without link", () => {
  test("It should respond to the POST method", async () => {
    const response = await request(question_app)
      .post("/test/addQuestion")
      .send({
        question_id: -1,
        title: "Test 1",
        category: ["test"],
        complexity: "easy",
        description: "Test description",
        link: "",
        uuid: "MAINTAINER",
      });
    expect(response.statusCode).toBe(200);
  });
});

describe("Test addQuestion with link", () => {
  test("It should respond to the POST method", async () => {
    const response = await request(question_app)
      .post("/test/addQuestion")
      .send({
        question_id: -2,
        title: "Test 2",
        category: ["test"],
        complexity: "easy",
        description: "",
        link: "https://leetcode.com/problems/zigzag-conversion/",
        uuid: "MAINTAINER",
      });
    expect(response.statusCode).toBe(200);
  }, 30000);
});

describe("Test updateQuestion for Question 1", () => {
  test("It should respond to the PUT method", async () => {
    const response = await request(question_app)
      .put("/test/updateQuestion")
      .send({
        question_id: -1,
        title: "Test 1",
        category: ["update"],
        complexity: "hard",
        description: "",
        link: "https://leetcode.com/problems/container-with-most-water/",
      });
    expect(response.statusCode).toBe(200);
  }, 30000);
});

describe("Test updateQuestion for Question 2", () => {
  test("It should respond to the PUT method", async () => {
    const response = await request(question_app)
      .put("/test/updateQuestion")
      .send({
        question_id: -2,
        title: "Test 2",
        category: ["update"],
        complexity: "hard",
        description: "Testing",
        link: "",
      });
    expect(response.statusCode).toBe(200);
  });
});

describe("Delete Question 1", () => {
  test("It should respond to the DELETE method", async () => {
    const response = await request(question_app)
      .delete("/test/deleteQuestion")
      .send({
        question_id: -1,
      });
    expect(response.statusCode).toBe(200);
  });
});

describe("Delete Question 2", () => {
  test("It should respond to the DELETE method", async () => {
    const response = await request(question_app)
      .delete("/test/deleteQuestion")
      .send({
        question_id: -2,
      });
    expect(response.statusCode).toBe(200);
  });
});

describe("Test readRandomQuestion", () => {
  test("It should respond to the POST method", async () => {
    const response = await request(question_app).post(
      "/test/readRandomQuestion",
    );
    expect(response.statusCode).toBe(200);
  });
});

describe("Testing with no authentication token", () => {
  test("It should not respond to the POST method", async () => {
    const response = await request(question_app).post("/api/readQuestions");
    expect(response.statusCode).toBe(500);
  });
});
