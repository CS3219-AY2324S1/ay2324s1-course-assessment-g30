import Room from "../model/room-model.js";

export const getJoinedRooms = async (req, res) => {
  try {
    const { uuid } = req.query;
    console.log(`Fetching joined rooms for user ${uuid}`);

    const rooms = await Room.find({ users: uuid })
      .sort({ date_created: -1 })
      .limit(10);

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
