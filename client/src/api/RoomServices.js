import axios from "axios";
import { matchingServiceURL, collaborationServiceURL } from "./config";
import Cookies from "js-cookie";

export const getJoinedRooms = async () => {
  const url = matchingServiceURL + "/joinedRooms";

  try {
    const config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        token: Cookies.get("token"),
        uuid: Cookies.get("uuid"),
      }),
    };
    const res = await axios(config);
    const data = res.data;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getRoomDetails = async (roomId) => {
  const url = collaborationServiceURL + "/roomDetails";

  try {
    const config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        token: Cookies.get("token"),
        uuid: Cookies.get("uuid"),
        roomId: roomId,
      }),
    };
    const res = await axios(config);
    const data = res.data;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getPastAttempts = async (questionId, uuid) => {
  const url = collaborationServiceURL + "/getPastAttempts";

  try {
    const config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        token: Cookies.get("token"),
        uuid: Cookies.get("uuid"),
        questionId: questionId,
      }),
    };
    const res = await axios(config);
    const data = res.data;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
