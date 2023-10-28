const axios = require("axios");

const USER_SERVICE_BASE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3000/v1";

const auth = async (req, res, next) => {
  const URL = USER_SERVICE_BASE_URL + "/user/role";
  const config = {
    method: "post",
    url: URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      token: req.body.token,
    }),
  };

  try {
    const res = await axios(config);
    const data = res.data;
    const userRole = data.res.role;

    if (userRole == "USER" || userRole == "MAINTAINER") {
      // Attach userRole to the req object
      req.userRole = userRole;
      return next();
    } else {
      throw new Error("User is not authorized to perform this action");
    }
  } catch (error) {
    console.error("Error fetching user data:");
    res.status(500).json({ error: error.toString() });
  }
};

const socketIOAuth = async (token, next) => {
  const URL = USER_SERVICE_BASE_URL + "/user/role";
  const config = {
    method: "post",
    url: URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      token: token,
    }),
  };

  try {
    const res = await axios(config);
    const data = res.data;

    const userRole = data.res.role;

    if (userRole == "USER" || userRole == "MAINTAINER") {
      return next();
    } else {
      console.error("User not authorised to Peerprep");
    }
  } catch (error) {
    console.error("Error fetching user data:");
  }
};

/**
 * Check if user is authenticated.
 */
const attemptToAuthenticate = async (socket, next) => {
  const token = socket.handshake.query.token;
  socket.token = token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  await socketIOAuth(token, async (error) => {
    if (error) {
      return next(new Error("Authentication error: " + error.message));
    }

    next();
  });
};

module.exports = { auth, socketIOAuth, attemptToAuthenticate };
