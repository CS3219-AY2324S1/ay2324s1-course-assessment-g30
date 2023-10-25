// const app = require("../server");
// const supertest = require("supertest");
// const request = supertest(app);
const Room = require("../model/room-model");
const { getJoinedRooms } = require("../controllers/room-controller.js");

describe("getJoinedRooms", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Testing succcessful fetching of rooms for a user", async () => {
    const testUserUUID = "123";
    const mockRoom = {
      room_id: "sample_room_id",
      question_difficulty: "easy",
      programming_language: "JavaScript",
      users: [testUserUUID],
      date_created: new Date(),
    };

    jest.spyOn(Room, "find").mockImplementation(() => {
      return {
        sort: () => ({
          limit: () => [mockRoom],
        }),
      };
    });

    const req = {
      body: { uuid: testUserUUID },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    await getJoinedRooms(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([mockRoom]);

    expect(Room.find).toHaveBeenCalledWith({
      users: testUserUUID,
      date_created: {
        $gte: expect.any(Date),
      },
    });
  });

  test("Testing handling of failure for fetching of rooms", async () => {
    const testUserUUID = "123";

    // Mocking a failure scenario for Room.find
    jest.spyOn(Room, "find").mockImplementation(() => {
      throw new Error("Failed to fetch rooms");
    });

    const req = {
      body: { uuid: testUserUUID },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    await getJoinedRooms(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch rooms" });

    expect(Room.find).toHaveBeenCalledWith({
      users: testUserUUID,
      date_created: {
        $gte: expect.any(Date),
      },
    });
  });
});
