import axios from "axios";

const USER_SERVICE_BASE_URL = "http://localhost:3000/v1";

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
      throw new Error("User is not authorized to perform this action");
    }
  } catch (error) {
    console.error("Error fetching user data:");
    throw error;
  }
};

/**
 * Check if user is authenticated.
 */
export const attemptToAuthenticate = async (socket, next) => {
  const token = socket.handshake.query.token;
  socket.token = token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  const req = {
    body: {
      token: token,
    },
  };

  await auth(req, null, async (error) => {
    if (error) {
      return next(new Error("Authentication error: " + error.message));
    }
  });

  next();
};
