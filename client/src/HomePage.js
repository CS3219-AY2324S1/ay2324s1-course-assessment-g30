import React, { useState, useEffect } from "react";
import {
  Flex,
  Button,
  Spinner,
  HStack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const countdownDuration = 30;
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [matchingFailed, setMatchingFailed] = useState(false);
  const [remainingTime, setRemainingTime] = useState(countdownDuration);
  const [matchFound, setMatchFound] = useState(false);

  // Connect to common lobby
  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Waiting to be matched
  useEffect(() => {
    if (socket) {
      socket.on("paired", (roomId) => {
        console.log(`You are paired in room ${roomId}`);
        setMatchFound(true);
        setTimeout(() => {
          navigate(`/room/${roomId}`);
        }, 2000);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (showModal && remainingTime === countdownDuration) {
      const timerInterval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      const matchingTimeout = setTimeout(() => {
        cancelMatching(clickedButton);
      }, countdownDuration * 1000);

      return () => {
        clearInterval(timerInterval);
        clearTimeout(matchingTimeout);
      };
    }
  }, [showModal]);

  const handleMatchClick = (difficulty) => {
    setMatchingFailed(false);
    setIsLoading(true);
    setClickedButton(difficulty);
    setRemainingTime(countdownDuration);
    setMatchFound(false);
    setShowModal(true);

    setTimeout(() => {
      if (socket) {
        socket.emit("lets-rumble", difficulty);
      }
    }, 1000);
  };

  const cancelMatching = (difficulty) => {
    setMatchingFailed(true);
    setIsLoading(false);
    if (socket) {
      socket.emit("remove-me-from-queue", difficulty);
    }
  };

  const handleRetryClick = () => {
    setMatchingFailed(false);
    handleMatchClick(clickedButton);
  };

  return (
    <div>
      <HStack
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Button
          isLoading={isLoading && clickedButton === "easy"}
          colorScheme="green"
          variant="solid"
          onClick={() => handleMatchClick("easy")}
          isDisabled={isLoading}
          size="lg"
        >
          Easy
        </Button>
        <Button
          isLoading={isLoading && clickedButton === "medium"}
          colorScheme="yellow"
          variant="solid"
          onClick={() => handleMatchClick("medium")}
          isDisabled={isLoading}
          size="lg"
        >
          Medium
        </Button>
        <Button
          isLoading={isLoading && clickedButton === "hard"}
          colorScheme="red"
          variant="solid"
          onClick={() => handleMatchClick("hard")}
          isDisabled={isLoading}
          size="lg"
        >
          Hard
        </Button>
      </HStack>

      <Modal
        isOpen={showModal}
        onClose={() => {
          cancelMatching(clickedButton);
          setShowModal(false);
        }}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {matchingFailed
              ? "Matching Failed"
              : matchFound
              ? "Match Found!"
              : "Finding a match..."}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              {matchingFailed ? (
                <>
                  <Text fontSize="lg">
                    We couldn't find a match for you. Would you like try again?
                  </Text>
                  <Button
                    colorScheme="teal"
                    variant="solid"
                    onClick={handleRetryClick}
                    size="lg"
                  >
                    Retry
                  </Button>
                </>
              ) : matchFound ? (
                <>
                  <Text fontSize="lg">
                    Your match has been found. Have fun!
                  </Text>
                </>
              ) : (
                <>
                  <Text fontSize="lg">
                    Please wait while we find a match for you.
                  </Text>
                  <Text fontSize="1xl">{remainingTime} seconds remaining</Text>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default HomePage;
