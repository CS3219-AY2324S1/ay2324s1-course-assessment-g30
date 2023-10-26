const request = require("supertest");
const { initializeApp } = require("../question-service/index.js");

const TEST_PORT = 2001;

describe("Test the root path of question-service", () => {
  let app;

  beforeAll(async () => {
    app = await initializeApp(TEST_PORT);
  });

  test("It should respond to the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {});
});
