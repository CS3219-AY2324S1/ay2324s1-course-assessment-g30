import Room from "../model/room-model.js";

export const getJoinedRooms = async (req, res) => {
  try {
    const { uuid } = req.body;
    console.log(`Fetching joined rooms for user ${uuid}`);

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const rooms = await Room.find({
      users: uuid,
      date_created: { $gte: twoHoursAgo },
    })
      .sort({ date_created: -1 })
      .limit(10);

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
