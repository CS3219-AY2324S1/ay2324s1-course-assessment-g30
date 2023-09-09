import React from "react";
import { Button, HStack } from "@chakra-ui/react";

function MatchButtons({ isLoading, clickedButton, handleMatchClick }) {
  return (
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
  );
}

export default MatchButtons;
