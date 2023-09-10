import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";

function RoomPage() {
  const { roomId } = useParams();
  const [isRoomBeingSetUp, setIsRoomBeingSetUp] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRoomBeingSetUp(false); // After 5 seconds, set isLoading to false
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box textAlign="center">
      {isRoomBeingSetUp ? (
        <Box>
          <Heading as="h2" size="xl">
            Setting up the room...
          </Heading>
          <Spinner size="xl" mt={4} />
        </Box>
      ) : (
        <Box>
          {/* Room content */}
          <Heading as="h1" size="2xl">
            Welcome to Room: {roomId}
            <Text>Share the id with your friends to join the room!</Text>
          </Heading>
        </Box>
      )}
    </Box>
  );
}

export default RoomPage;
