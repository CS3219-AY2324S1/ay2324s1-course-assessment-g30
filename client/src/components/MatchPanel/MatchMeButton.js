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
  const [remainingTime, setRemainingTime] = useState(FINDING_MATCH_TIMEOUT);

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
    if (showMatchModal && remainingTime === FINDING_MATCH_TIMEOUT) {
      const timerInterval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      const matchingTimeout = setTimeout(() => {
        cancelMatching(difficulty);
      }, FINDING_MATCH_TIMEOUT * 1000);

      return () => {
        clearInterval(timerInterval);
        clearTimeout(matchingTimeout);
      };
    }
  }, [showMatchModal]);

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
        colorScheme="blue"
        variant="solid"
        onClick={() => setShowModal(true)}
        size="lg"
      >
        Match Me!
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setDifficulty("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Match Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              size="sm"
              placeholder="Select difficulty"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
            <Button onClick={handleMatchClick}>Find Match</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <MatchModal
        showModal={showMatchModal}
        onClose={() => {
          cancelMatching(difficulty);
          setShowMatchModal(false);
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
