import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import MatchMeButton from "./MatchMeButton";
import CreateRoomButton from "./CreateRoomButton";
import { Flex, useColorModeValue } from "@chakra-ui/react";

function MatchPanel() {
  const [socket, setSocket] = useState(null);

  // Connect to common lobby
  useEffect(() => {
    const socket = io("http://localhost:3003");
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Flex
      rounded="lg"
      bg={useColorModeValue("white", "gray.700")}
      boxShadow="lg"
      p={5}
      ml="auto"
      w="20%"
      h="15%"
      align="center"
      justifyContent="center"
      flexDirection="column"
      gap={3}
    >
      <MatchMeButton socket={socket} />
      <CreateRoomButton socket={socket} />
    </Flex>
  );
}

export default MatchPanel;
