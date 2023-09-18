import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import MatchMeButton from "./MatchMeButton";
import CreateRoomButton from "./CreateRoomButton";
import {
  Grid,
  GridItem,
  Center,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

function MatchPanel() {
  const [socket, setSocket] = useState(null);

  // Connect to common lobby
  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box
      rounded={"lg"}
      bg={useColorModeValue("white", "gray.700")}
      boxShadow={"lg"}
      p={8}
    >
      <Center h="30vh">
        <Grid h="15vh" w="30vw" templateRows="1fr 1fr">
          <GridItem display="flex" alignItems="center" justifyContent="center">
            <MatchMeButton socket={socket} />
          </GridItem>
          <GridItem display="grid">
            <CreateRoomButton socket={socket} />
          </GridItem>
        </Grid>
      </Center>
    </Box>
  );
}

export default MatchPanel;
