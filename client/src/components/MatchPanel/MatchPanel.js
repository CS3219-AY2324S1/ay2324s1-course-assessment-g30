import { Card } from "@chakra-ui/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useWindowDimensions from "../../utils/WindowDimensions";
import CreateRoomButton from "./CreateRoomButton";
import MatchMeButton from "./MatchMeButton";

function MatchPanel() {
  const [socket, setSocket] = useState(null);
  const { width } = useWindowDimensions(); //1000

  useEffect(() => {
    // Connect to common lobby
    const uuid = Cookies.get("uuid");
    const token = Cookies.get("token");
    const socket = io(process.env.REACT_APP_MATCHING_SERVICE_URL, {
      query: {
        uuid: uuid,
        token: token,
      },
      // path: "/matching-service/socket.io/"
    });
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Card
      p={5}
      m={100}
      minW="300px"
      ml="auto"
      align="center"
      justifyContent="center"
      flexDirection="column"
      gap={3}
      minH={width < 1000 ? "100px" : "300px"}
    >
      <MatchMeButton socket={socket} />
      <CreateRoomButton socket={socket} />
    </Card>
  );
}

export default MatchPanel;
