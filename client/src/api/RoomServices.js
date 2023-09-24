import axios from "axios";
import { matchingServiceURL } from "./config";

const BASE_URL = matchingServiceURL;

export const getJoinedRooms = async (uuid) => {
  const url = BASE_URL + "/joinedRooms";

  try {
    const res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        uuid: uuid,
      },
    });
    const data = res.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
