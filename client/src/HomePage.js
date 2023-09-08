import React, { useState, useEffect } from "react";
import { Box, Button, Spinner } from "@chakra-ui/react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        // Handle the pairing, navigate to a room, or perform other actions
        console.log(`You are paired in room ${roomId}`);
        navigate(`/room/${roomId}`);
      });
    }
  }, [socket]);

  const handleMatchClick = () => {
    setIsLoading(true);

    if (socket) {
      socket.emit("lets-rumble");
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 30000);
  };

  return (
    <div className="App">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh" // Adjust as needed to center vertically within the viewport
      >
        {isLoading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <Button
            colorScheme="teal"
            variant="solid"
            onClick={handleMatchClick}
            disabled={isLoading} // Disable the button when loading
          >
            Match Me!
          </Button>
        )}
      </Box>
    </div>
  );
}

export default HomePage;
