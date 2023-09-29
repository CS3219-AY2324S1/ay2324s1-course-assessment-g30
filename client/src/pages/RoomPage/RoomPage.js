import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Heading,
  Spinner,
  Grid,
  GridItem,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { io } from "socket.io-client";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import EditorContainer from "../../components/EditorContainer/EditorContainer";
import RoomPanel from "../../components/RoomPanel/RoomPanel";
import Cookies from "js-cookie";
import { collaborationServiceURL } from "../../api/config";
import { getUserProfile } from "../../api/Auth";

function RoomPage() {
  const { roomId } = useParams();
  const [isRoomBeingSetUp, setIsRoomBeingSetUp] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isInvalidRoom, setIsInvalidRoom] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    getUserProfile().then((data) => {
      const uuid = Cookies.get("uuid");
      const token = Cookies.get("token");

      const socket = io(collaborationServiceURL, {
        query: {
          uuid: uuid,
          token: token,
          username: data.username,
        },
      });
      setSocket(socket);

      socket.emit("set-up-room", roomId);

      // To handle chat history
      socket.on("chat-history", (messages) => {
        console.log("Let's see the chat history");
        setChatHistory(messages);
      });

      socket.on("room-is-ready", () => {
        setTimeout(() => {
          setIsRoomBeingSetUp(false);
          socket.emit("join-room", roomId);
        }, 3000);
      });

      socket.on("invalid-room", () => {
        setIsRoomBeingSetUp(false);
        setIsInvalidRoom(true);
      });
    });
  }, []);

  if (isInvalidRoom) {
    return (
      <Flex
        bg="gray.50"
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        p={4}
      >
        <Flex
          rounded="lg"
          bg="white"
          boxShadow="lg"
          p={10}
          textAlign="center"
          flexDirection="column"
        >
          <Heading
            as="h1"
            fontWeight="hairline"
            fontSize="150px"
            letterSpacing="wide"
            color="#E27d60"
            mb="3"
          >
            404
          </Heading>
          <Text fontWeight="thin" letterSpacing="widest" fontSize="2xl" mb="4">
            OOPS! ROOM NOT FOUND OR HAS EXPIRED.
          </Text>
          <Link to="/dashboard">
            <Text
              _hover={{
                color: "#ab5e48",
              }}
              borderBottom="1px dotted #E27d60"
              as="span"
              fontSize="md"
              color="#E27d60"
            >
              Return to Homepage
            </Text>
          </Link>
        </Flex>
      </Flex>
    );
  }

  return (
    <Box textAlign="center" display="flex" justifyContent="center">
      {isRoomBeingSetUp ? (
        <Box
          height="100vh"
          width="100vw"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection={"column"}
        >
          <Spinner w="100px" h="100px" color="#E27d60" m={6} />
          <Heading as="h2" size="xl">
            Setting up the room...
          </Heading>
        </Box>
      ) : (
        <Grid
          templateAreas={`"question editor"
							"chat editor"`}
          gridTemplateRows={"60vh 40vh"}
          gridTemplateColumns={"48vw 48vw"}
          bg="gray.50"
          gap={5}
        >
          <GridItem
            pl="2"
            bg="white"
            p={3}
            ml={3}
            mt={3}
            rounded="lg"
            boxShadow="lg"
            area={"question"}
          >
            <Heading as="h1" size="2xl">
              Question
            </Heading>
          </GridItem>
          <GridItem
            pl="2"
            bg="white"
            p={3}
            ml={3}
            mb={3}
            rounded="lg"
            boxShadow="lg"
            area={"chat"}
          >
            <ChatContainer
              socket={socket}
              roomId={roomId}
              chatHistory={chatHistory}
            />
          </GridItem>
          <GridItem
            pl="2"
            bg="white"
            mt={3}
            mb={3}
            mr={3}
            p={3}
            rounded="lg"
            boxShadow="lg"
            area={"editor"}
          >
            <RoomPanel roomId={roomId} socket={socket} />
            <Divider borderWidth="1px" borderColor="gray.100" mt={2} mb={2} />
            <EditorContainer />
          </GridItem>
        </Grid>
      )}
    </Box>
  );
}

export default RoomPage;
