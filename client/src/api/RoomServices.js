import axios from "axios";
import { matchingServiceURL } from "./config";
import Cookies from "js-cookie";

const BASE_URL = matchingServiceURL;

export const getJoinedRooms = async () => {
  const url = BASE_URL + "/joinedRooms";

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
