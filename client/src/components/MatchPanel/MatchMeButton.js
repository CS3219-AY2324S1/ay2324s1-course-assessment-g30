import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
  useToast,
  FormControl,
  FormLabel,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import MatchModal from "./MatchModal";
import useWindowDimensions from "../../utils/WindowDimensions";

function MatchMeButton({ socket }) {
  const FINDING_MATCH_TIMEOUT = 30;
  const navigate = useNavigate();
  const toast = useToast();
  const { width } = useWindowDimensions(); //764

  const [difficulty, setDifficulty] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState("");
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [matchingFailed, setMatchingFailed] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (socket) {
      // Waiting to be matched
      socket.on("found-room", (roomId) => {
        console.log(`You are joining room ${roomId}`);
        setMatchFound(true);
        setTimeout(() => {
          navigate(`/room/${roomId}`);
        }, 2000);
      });

      // If user joins same queue twice (Buggy AF)
      socket.on("you-joined-queue-twice", () => {
        setShowMatchModal(false);
        clearState();
        toast({
          title: "Matching Error",
          description: "Sorry, you can't join the same queue twice",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      });
    }
  }, [socket]);

  // Countdown timer
  useEffect(() => {
    if (remainingTime > 0) {
      const timerInterval = setInterval(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    } else {
      // Timeout after FINDING_MATCH_TIMEOUT
      cancelMatching(difficulty, programmingLanguage);
    }
  }, [remainingTime]);

  const handleMatchClick = () => {
    if (difficulty !== "" && programmingLanguage !== "") {
      setMatchingFailed(false);
      setMatchFound(false);

      setRemainingTime(FINDING_MATCH_TIMEOUT);
      setShowMatchModal(true);
      setShowModal(false);

      setTimeout(() => {
        if (socket) {
          socket.emit(
            "match-me-with-a-stranger",
            difficulty,
            programmingLanguage
          );
        }
      }, 1000);
    } else {
      const errorMessages = [];

      if (difficulty === "") {
        errorMessages.push("Please select a difficulty");
      }

      if (programmingLanguage === "") {
        errorMessages.push("Please select a programming language");
      }

      toast({
        title: "Please fill in all required fields.",
        description: (
          <>
            {errorMessages.map((msg) => (
              <Text>• {msg}</Text>
            ))}
          </>
        ),

        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const cancelMatching = (difficulty, programmingLanguage) => {
    console.log("Cancelling matching");
    setMatchingFailed(true);
    if (socket) {
      socket.emit("cancel-matching", difficulty, programmingLanguage);
    }
  };

  const handleRetryClick = () => {
    setMatchingFailed(false);
    handleMatchClick(difficulty);
  };

  const clearState = () => {
    setDifficulty("");
    setProgrammingLanguage("");
  };

  return (
    <>
      <Button
        colorScheme="whatsapp"
        variant="solid"
        onClick={() => setShowModal(true)}
        w="100%"
        h={"50%"}
        p={width < 1000 ? "5" : null}
      >
        Match With Stranger!
      </Button>
      <Modal
        isCentered
        size="lg"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          clearState();
        }}
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center">
            Match Settings
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Difficulty</FormLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="Select difficulty"
                marginBottom={4}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>
              <FormLabel>Programming Language</FormLabel>
              <Select
                value={programmingLanguage}
                onChange={(e) => setProgrammingLanguage(e.target.value)}
                placeholder="Select programming language"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleMatchClick}>
              Find Match
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <MatchModal
        showModal={showMatchModal}
        handleClose={() => {
          setShowMatchModal(false);
          cancelMatching(difficulty, programmingLanguage);
          clearState();
        }}
        matchingFailed={matchingFailed}
        matchFound={matchFound}
        remainingTime={remainingTime}
        handleRetryClick={handleRetryClick}
      />
    </>
  );
}

export default MatchMeButton;
