import axios from "axios";

const USER_SERVICE_BASE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3000/v1";

export const auth = async (req, res, next) => {
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
      res.status(401).json({ error: "User not authorised to Peerprep" });
    }
  } catch (error) {
    console.error("Error fetching user data:");
    res.status(500).json({ error: error.toString() });
  }
};

/**
 * Check if user is authenticated.
 */
export const attemptToAuthenticate = async (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  const req = {
    body: {
      token: token,
    },
  };

  await auth(req, res, async (error) => {
    if (error) {
      return next(new Error("Authentication error: " + error.message));
    }
  });

  next();
};
