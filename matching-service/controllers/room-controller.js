const Room = require("../model/room-model.js");

const getJoinedRooms = async (req, res) => {
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

    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const checkRoomsContainQuestionId = async (req, res) => {
  try {
    const questionId = req.body.question_id;
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const rooms = await Room.find({
      date_created: { $gte: twoHoursAgo },
      question_id: questionId,
    });

    if (rooms.length > 0) {
      res.status(200).json({
        exists: true,
      });
    } else {
      res.status(200).json({
        exists: false,
      });
    }
  } catch (err) {
    res.status(500).json({ exists: false });
  }
};

module.exports = { getJoinedRooms, checkRoomsContainQuestionId };
