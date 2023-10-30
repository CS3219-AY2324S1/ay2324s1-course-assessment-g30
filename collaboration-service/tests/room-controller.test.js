// const app = require("../server");
// const supertest = require("supertest");
const Room = require("../model/room-model");
const { getRoomDetails } = require("../controllers/room-controller.js");

describe("getRoomDetails", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Testing successful fetching of room details", async () => {
    const testRoomId = "123";
    const mockRoom = {
      room_id: testRoomId,
      question_difficulty: "easy",
      programming_language: "JavaScript",
      date_created: new Date(),
    };

    jest.spyOn(Room, "findOne").mockImplementation(() => mockRoom);

    const req = {
      body: { roomId: testRoomId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    await getRoomDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRoom);

    expect(Room.findOne).toHaveBeenCalledWith({ room_id: testRoomId });
  });

  test("Testing handling of failure for fetching room details", async () => {
    const testRoomId = "123";

    jest.spyOn(Room, "findOne").mockImplementation(() => {
      throw new Error("Failed to fetch room details");
    });

    const req = {
      body: { roomId: testRoomId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    await getRoomDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to fetch room details",
    });

    expect(Room.findOne).toHaveBeenCalledWith({ room_id: testRoomId });
  });

  test("Testing handling of room not found", async () => {
    const testRoomId = "123";

    jest.spyOn(Room, "findOne").mockImplementation(() => null);

    const req = {
      body: { roomId: testRoomId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    await getRoomDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Room Details not found for " + testRoomId,
    });

    expect(Room.findOne).toHaveBeenCalledWith({ room_id: testRoomId });
  });
});
