const request = require("supertest");
const app = require("../user-service/build/app");

describe("Test the root path", () => {
  test("It should respond to the GET method", async () => {
    const response = await request(app).get("/v1/test");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test the auth/register path", () => {
  test("It should respond to the POST method", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    });
    expect(response.statusCode).toBe(200);
  });
});

describe("Test the auth/login path", () => {
  test("It should respond to the POST method", async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "johndoe@example.com",
      password: "password",
    });
    expect(response.statusCode).toBe(200);
  });
});

describe("Test the user/role path", () => {
  test("It should respond to the POST method", async () => {
    const response = await request(app).post("/v1/user/role").send({
      email: "johndoe@example.com",
    });
    expect(response.statusCode).toBe(200);
  });
});

describe("Test the protected routes", () => {
  let token;

  beforeAll(async () => {
    const response = await request(app).post("/v1/auth/login").send({
      email: "johndoe@example.com",
      password: "password",
    });
    token = response.body.token;
  });

  test("It should respond to the POST method", async () => {
    const response = await request(app)
      .post("/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "johndoe@example.com",
      });
    expect(response.statusCode).toBe(200);
  });

  test("It should respond to the PUT method", async () => {
    const response = await request(app)
      .put("/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Jane Doe",
      });
    expect(response.statusCode).toBe(200);
  });

  test("It should respond to the DELETE method", async () => {
    const response = await request(app)
      .delete("/v1/user")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});
