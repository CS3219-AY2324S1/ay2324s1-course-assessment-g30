import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  Button,
  Progress,
} from "@chakra-ui/react";

function MatchModal({
  showModal,
  handleClose,
  matchingFailed,
  matchFound,
  remainingTime,
  handleRetryClick,
}) {
  return (
    <Modal
      isCentered
      isOpen={showModal}
      onClose={handleClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center">
          {matchingFailed
            ? "Matching Failed"
            : matchFound
            ? "Match Found!"
            : "Finding a match..."}
        </ModalHeader>
        <ModalBody>
          <VStack alignItems="center" justifyContent="center">
            {matchingFailed ? (
              <>
                <Text fontSize="lg">
                  We couldn't find a match for you. Would you like to try again?
                </Text>
              </>
            ) : matchFound ? (
              <>
                <Text fontSize="lg" mb={4}>
                  Your match has been found. Have fun!
                </Text>
              </>
            ) : (
              <>
                <Text fontSize="lg" marginBottom={4}>
                  Please wait while we find a match for you.
                </Text>
                <Progress w="90%" size="xs" isIndeterminate />
                <Text fontSize="md">{remainingTime} seconds remaining</Text>
              </>
            )}
          </VStack>
        </ModalBody>
        {matchingFailed ? (
          <ModalFooter gap={2}>
            <Button onClick={handleClose} variant="outline" colorScheme="red">
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleRetryClick}>
              Try Again
            </Button>
          </ModalFooter>
        ) : matchFound ? null : (
          <Button roundedTop={"none"} colorScheme="red" onClick={handleClose}>
            Cancel Match
          </Button>
        )}
      </ModalContent>
    </Modal>
  );
}

export default MatchModal;
