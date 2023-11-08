import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ChatIcon } from "@chakra-ui/icons";
import { io } from "socket.io-client";
import { getUserProfile } from "../../api/Auth";
import { getRoomDetails } from "../../api/RoomServices";
import ChatContainer from "../../components/ChatContainer/ChatContainer";
import EditorContainer from "../../components/EditorContainer/EditorContainer";
import OpenaiChat from "../../components/OpenaiChatContainer/OpenaiChatContainer";
import QuestionContainer from "../../components/QuestionContainer/QuestionContainer";
import RoomPanel from "../../components/RoomPanel/RoomPanel";
import useWindowDimensions from "../../utils/WindowDimensions";

function RoomPage() {
  const { roomId } = useParams();
  const [isRoomBeingSetUp, setIsRoomBeingSetUp] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isInvalidRoom, setIsInvalidRoom] = useState(false);
  const [programmingLanguage, setProgrammingLanguage] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [timer, setTimer] = useState("00:00:00");
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const { isOpen, onToggle } = useDisclosure();
  const { width, height } = useWindowDimensions(); //764

  useEffect(() => {
    let autoRedirectTimeout;

    getRoomDetails(roomId).then((data) => {
      setProgrammingLanguage(data.programming_language);
      setQuestionId(data.question_id);

      // Calculate remainingTime
      const currentTime = new Date().getTime();
      const roomCreationTime = new Date(data.date_created).getTime();
      const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
      //   const twoHoursInMilliseconds = 30 * 1000;

      const endTime = roomCreationTime + twoHoursInMilliseconds;
      const remainingTime = Math.max(0, endTime - currentTime);
      setRemainingTime(remainingTime);

      if (remainingTime > 10000) {
        startTimer();
        autoRedirectTimeout = setTimeout(() => {
          setModalOpen(true);
          setTimeout(() => {
            navigate(`/dashboard`);
          }, 5000);
        }, remainingTime);
      } else {
        setIsInvalidRoom(true);
      }
    });

    getUserProfile().then((data) => {
      const uuid = Cookies.get("uuid");
      const token = Cookies.get("token");

      const socket = io(process.env.REACT_APP_COLLABORATION_SERVICE_URL, {
        query: {
          uuid: uuid,
          token: token,
          username: data.username,
        },
        // path: "/collaboration-service/socket.io/",
      });
      setSocket(socket);

      socket.emit("set-up-room", roomId);

      socket.on("sync-editor-state", (code) => {
        setEditorCode(JSON.parse(code)["code"]);
      });

      socket.on("room-is-ready", () => {
        setTimeout(() => {
          setIsRoomBeingSetUp(false);
          socket.emit("join-room", roomId);
        }, 0);
      });

      socket.on("invalid-room", () => {
        setIsRoomBeingSetUp(false);
        setIsInvalidRoom(true);
      });
    });

    return () => {
      if (autoRedirectTimeout) {
        clearTimeout(autoRedirectTimeout);
      }
    };
  }, []);

  // Countdown timer
  function startTimer() {
    const timerInterval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => {
        if (prevRemainingTime <= 0) {
          clearInterval(timerInterval);
          return 0;
        }
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(prevRemainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((prevRemainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((prevRemainingTime / 1000) % 60);

        // Format the time as "hh:mm:ss"
        const formattedTime = `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        // Update the state with the formatted time
        setTimer(formattedTime);

        return prevRemainingTime - 1000;
      });
    }, 1000);
  }

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
          gridTemplateRows={" 100vh"}
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
            <QuestionContainer questionId={questionId} />
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
            <RoomPanel roomId={roomId} socket={socket} timer={timer} />
            <Divider borderWidth="1px" borderColor="gray.100" mt={2} mb={2} />
            <EditorContainer
              socket={socket}
              programmingLanguage={programmingLanguage}
              roomId={roomId}
              editorCode={editorCode}
            />
          </GridItem>
          <Modal closeOnOverlayClick={false} isOpen={isModalOpen} isCentered>
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent>
              <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
                Room has expired
              </ModalHeader>
              <ModalBody mb={5}>
                <Text>
                  Sorry, time's up! You will be redirected to the dashboard.
                </Text>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* handles chat and hints */}
          {
            <>
              <Popover
                variant={"responsive"}
                isOpen={height < 504 ? false : isOpen}
                placement={"top"}
              >
                <PopoverTrigger>
                  <IconButton
                    aria-label="Call Segun"
                    width={"60px"}
                    height={"60px"}
                    pos={"fixed"}
                    bottom={{ base: "20", lg: "20" }}
                    right={{ base: "30", lg: "120" }}
                    icon={<ChatIcon color={"white"} />}
                    backgroundColor={"#E27d60"}
                    isRound={true}
                    isDisabled={height < 504 ? true : false}
                    onClick={onToggle}
                  />
                </PopoverTrigger>

                <Portal>
                  <PopoverContent w={"500px"} mr={"25px"}>
                    <PopoverArrow />
                    <PopoverHeader h="40px"></PopoverHeader>
                    <PopoverCloseButton onClick={onToggle} />
                    <PopoverBody h={height > 690 ? "500px" : "300px"}>
                      <Tabs>
                        <TabList>
                          <Tab>Chat</Tab>
                          <Tab>Hint</Tab>
                        </TabList>

                        <TabPanels>
                          <TabPanel>
                            <ChatContainer
                              socket={socket}
                              roomId={roomId}
                              height={height > 690 ? "420px" : "210px"}
                              //   chatHistory={chatHistory}
                            />
                          </TabPanel>
                          <TabPanel>
                            <OpenaiChat
                              height={height > 690 ? "420px" : "210px"}
                              programmingLanguage={programmingLanguage}
                              questionId={questionId}
                              userCode={editorCode}
                            />
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>
            </>
          }
        </Grid>
      )}
    </Box>
  );
}

export default RoomPage;
