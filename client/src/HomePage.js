import React, { useState, useEffect } from "react";
import { Box, Button, Spinner, HStack, BeatLoader } from "@chakra-ui/react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);
  const navigate = useNavigate();

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
        navigate(`/room/${roomId}`);
      });
    }
  }, [socket]);

  const handleMatchClick = (difficulty) => {
    setIsLoading(true);
    setClickedButton(difficulty);

    if (socket) {
      socket.emit("lets-rumble", difficulty);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 30000);
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
    </div>
  );
}

export default HomePage;
