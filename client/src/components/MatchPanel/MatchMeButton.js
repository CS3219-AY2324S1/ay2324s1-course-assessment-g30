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
} from "@chakra-ui/react";
import MatchModal from "./MatchModal";

function MatchMeButton({ socket }) {
  const FINDING_MATCH_TIMEOUT = 30;
  const navigate = useNavigate();
  const toast = useToast();

  const [difficulty, setDifficulty] = useState("");
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [matchingFailed, setMatchingFailed] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Waiting to be matched
  useEffect(() => {
    if (socket) {
      socket.on("found-room", (roomId) => {
        console.log(`You are joining room ${roomId}`);
        setMatchFound(true);
        setTimeout(() => {
          navigate(`/room/${roomId}`);
        }, 2000);
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
    }
  }, [remainingTime]);

  // Timeout after FINDING_MATCH_TIMEOUT
  useEffect(() => {
    if (!matchingFailed && remainingTime === FINDING_MATCH_TIMEOUT) {
      const matchingTimeout = setTimeout(() => {
        cancelMatching(difficulty);
      }, FINDING_MATCH_TIMEOUT * 1000);

      return () => {
        clearTimeout(matchingTimeout);
      };
    }
  }, [matchingFailed]);

  const handleMatchClick = () => {
    if (difficulty !== "") {
      setMatchingFailed(false);
      setMatchFound(false);

      setRemainingTime(FINDING_MATCH_TIMEOUT);
      setShowMatchModal(true);
      setShowModal(false);

      setTimeout(() => {
        if (socket) {
          socket.emit("match-me-with-a-stranger", difficulty);
        }
      }, 1000);
    } else {
      toast({
        title: "Please select a difficulty",
        description: "We need to know how hard you want to play!",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const cancelMatching = (difficulty) => {
    setMatchingFailed(true);
    if (socket) {
      socket.emit("cancel-matching", difficulty);
    }
  };

  const handleRetryClick = () => {
    setMatchingFailed(false);
    handleMatchClick(difficulty);
  };

  return (
    <>
      <Button
        colorScheme="whatsapp"
        variant="solid"
        onClick={() => setShowModal(true)}
        w="100%"
        h="50%"
      >
        Match With Stranger!
      </Button>
      <Modal
        isCentered
        size="lg"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setDifficulty("");
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
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
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
        onClose={() => {
          cancelMatching(difficulty);
          setShowMatchModal(false);
          setDifficulty("");
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
