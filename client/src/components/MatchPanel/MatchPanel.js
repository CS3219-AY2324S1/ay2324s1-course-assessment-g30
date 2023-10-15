import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import MatchMeButton from "./MatchMeButton";
import CreateRoomButton from "./CreateRoomButton";
import { Card } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { matchingServiceURL } from "../../api/config";

function MatchPanel() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to common lobby
    const uuid = Cookies.get("uuid");
    const token = Cookies.get("token");
    const socket = io(matchingServiceURL, {
      query: {
        uuid: uuid,
        token: token,
      },
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
      w="25%"
      ml="auto"
      align="center"
      justifyContent="center"
      flexDirection="column"
      gap={3}
    >
      <MatchMeButton socket={socket} />
      <CreateRoomButton socket={socket} />
    </Card>
  );
}

export default MatchPanel;
