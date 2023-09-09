import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Button,
  Spinner,
} from "@chakra-ui/react";

function MatchModal({
  showModal,
  onClose,
  matchingFailed,
  matchFound,
  remainingTime,
  handleRetryClick,
}) {
  return (
    <Modal isOpen={showModal} onClose={onClose} closeOnOverlayClick={false}>
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
                  We couldn't find a match for you. Would you like to try again?
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
                <Text fontSize="lg">Your match has been found. Have fun!</Text>
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
  );
}

export default MatchModal;
