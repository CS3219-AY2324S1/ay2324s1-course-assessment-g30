import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  VStack,
  Button,
  Progress,
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
    <Modal
      isCentered
      isOpen={showModal}
      onClose={onClose}
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
        <ModalCloseButton />
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
                <Text fontSize="lg">Your match has been found. Have fun!</Text>
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
          <ModalFooter>
            {" "}
            <Button
              colorScheme="teal"
              variant="solid"
              onClick={handleRetryClick}
              size="lg"
            >
              Retry
            </Button>
          </ModalFooter>
        ) : null}
      </ModalContent>
    </Modal>
  );
}

export default MatchModal;
