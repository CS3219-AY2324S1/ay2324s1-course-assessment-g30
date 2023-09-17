import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Grid,
  GridItem,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { io } from "socket.io-client";
import ChatContainer from "../components/ChatContainer/ChatContainer";

function RoomPage() {
  const { roomId } = useParams();
  const [isRoomBeingSetUp, setIsRoomBeingSetUp] = useState(true);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Connect to collab lobby
  useEffect(() => {
    const socket = io("http://localhost:3002");
    setSocket(socket);

    socket.emit("set-up-room", roomId);

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (socket) {
      socket.on("room-is-ready", () => {
        setTimeout(() => {
          setIsRoomBeingSetUp(false);
          socket.emit("join-room", roomId);
        }, 3000);
      });
    }
  }, [socket, roomId]);

  const handleLeaveRoom = () => {
    socket.emit("leave-room", roomId);
    navigate(`/home`);
  };

  return (
    <Box
      textAlign="center"
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {isRoomBeingSetUp ? (
        <Box>
          <Heading as="h2" size="xl">
            Setting up the room...
          </Heading>
          <Spinner size="xl" mt={4} />
        </Box>
      ) : (
        <Grid
          templateAreas={`"question editor"
							"chat editor"`}
          gridTemplateRows={"60vh 40vh"}
          gridTemplateColumns={"50vw 50vw"}
        >
          <GridItem pl="2" bg="green.300" area={"question"}>
            <Heading as="h1" size="2xl">
              Question
            </Heading>
          </GridItem>
          <GridItem pl="2" area={"chat"}>
            <ChatContainer socket={socket} roomId={roomId} />
          </GridItem>
          <GridItem pl="2" bg="grey" area={"editor"}>
            <Popover>
              <PopoverTrigger>
                <Button size="sm" colorScheme="teal">
                  Info
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Room Info</PopoverHeader>
                <PopoverBody>
                  <Text>
                    RoomID: {roomId}
                    <Text>
                      Share the id with your friends to join the room!
                    </Text>
                  </Text>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Button
              colorScheme="red"
              variant="solid"
              onClick={() => handleLeaveRoom()}
              size="sm"
            >
              Leave Room
            </Button>
            <Heading as="h1" size="2xl">
              Editor
            </Heading>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
}

export default RoomPage;
